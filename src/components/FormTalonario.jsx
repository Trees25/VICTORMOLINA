import { useState, useEffect } from "react";
import { pdf } from "@react-pdf/renderer";
import { TalonarioPDF } from "./TalonarioPDF.jsx"; // Asegurate que el nombre coincida con tu archivo
import { guardarPagareEnBD } from "../lib/db.js";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "../lib/supabase.js";

export default function FormTalonario() {
  const [loading, setLoading] = useState(false);
  const [clientes, setClientes] = useState([]);

  // Nuevo estado para guardar los talonarios sin terminar del cliente seleccionado
  const [planesAbiertos, setPlanesAbiertos] = useState([]);

  useEffect(() => {
    fetchClientes();
  }, []);

  const [data, setData] = useState({
    clienteNombre: "",
    clienteDni: "",
    clienteDomicilio: "",
    clienteLocalidad: "",
    clienteTel: "",
    empresaNombre: "Victor Molina",
    recibeNombreCompleto: "",
    monto: "",
    numeroCuotas: "",
    numeroCuotaPaga: "",
    diaVencimiento: "",
    mesVencimiento: "",
    añoVencimiento: "",
    valorRecibidoen: "",
    pagaderoEn: "",
  });

  const llenarDatosDePrueba = () => {
    setData({
      clienteNombre: "Carlos López (Prueba)",
      clienteDni: "23456789",
      clienteDomicilio: "Mendoza Sur 456",
      clienteLocalidad: "San Juan Capital",
      clienteTel: "2644123456",
      empresaNombre: "Victor Molina",
      recibeNombreCompleto: "Victor Molina",
      monto: "500000",
      diaVencimiento: "02",
      mesVencimiento: "06",
      añoVencimiento: "2026",
      numeroCuotas: "3",
      numeroCuotaPaga: "1",
      valorRecibidoen: "efectivo",
      pagaderoEn: "San Juan",
    });
  };

  async function fetchClientes() {
    try {
      const { data, error } = await supabase.from("clientes").select("*");
      if (error) throw error;
      setClientes(data || []);
    } catch (error) {
      console.error("Error cargando clientes:", error.message);
    }
  }

  // Busca los pagarés del cliente y arma los planes pendientes
  const fetchPlanesCliente = async (clienteId) => {
    try {
      const { data: pagares, error } = await supabase
        .from("pagares")
        .select("*")
        .eq("cliente_id", clienteId)
        .order("nro_cuota", { ascending: true });

      if (error) throw error;

      // Agrupar los pagarés por características para identificar el "Talonario"
      const planesMap = new Map();

      pagares.forEach((p) => {
        // Creamos una clave única basada en el total de cuotas y el monto
        const key = `${p.total_cuotas}-${p.monto}-${p.fecha_emision}`;
        const [año, mes, dia] = p.fecha_vencimiento
          ? p.fecha_vencimiento.split("-")
          : ["", "", ""];
        if (!planesMap.has(key)) {
          planesMap.set(key, {
            key: key,
            monto: p.monto,
            totalCuotas: p.total_cuotas,
            fechaEmision: p.fecha_emision,
            cuotasGeneradas: [p.nro_cuota],
            diaVencimiento: dia,
            mesVencimiento: mes,
            añoVencimiento: año,
          });
        } else {
          planesMap.get(key).cuotasGeneradas.push(p.nro_cuota);
        }
      });

      // Filtrar solo los planes donde la cuota máxima generada es menor al total de cuotas
      const activos = Array.from(planesMap.values()).filter(
        (plan) => Math.max(...plan.cuotasGeneradas) < plan.totalCuotas,
      );

      setPlanesAbiertos(activos);
    } catch (error) {
      console.error("Error buscando planes del cliente:", error);
    }
  };

  const handleSeleccionarCliente = (clienteId) => {
    const cliente = clientes.find((c) => c.id === clienteId);
    if (cliente) {
      setData((prevData) => ({
        ...prevData,
        clienteNombre: cliente.nombre_completo || "",
        clienteDni: cliente.dni || "",
        clienteDomicilio: cliente.domicilio || "",
        clienteLocalidad: cliente.localidad || "",
        clienteTel: cliente.telefono || "",
      }));

      // Al seleccionar el cliente, buscamos si tiene talonarios a medio completar
      fetchPlanesCliente(clienteId);
    }
  };

  // Función para autocompletar cuando se elige un talonario abierto
  const handleSeleccionarPlan = (planKey) => {
    const plan = planesAbiertos.find((p) => p.key === planKey);
    if (plan) {
      const cuotaSiguiente = Math.max(...plan.cuotasGeneradas) + 1;
      let mesSiguiente = parseInt(plan.mesVencimiento) + 1;
      let añoSiguiente = parseInt(plan.añoVencimiento);

      if (mesSiguiente > 12) {
        mesSiguiente = 1;
        añoSiguiente += 1;
      }
      setData((prev) => ({
        ...prev,
        monto: plan.monto.toString(),
        numeroCuotas: plan.totalCuotas.toString(),
        numeroCuotaPaga: cuotaSiguiente.toString(),
        // Opcional: Podés autocompletar otros campos si son siempre iguales
        recibeNombreCompleto: "Victor Molina",
        valorRecibidoen: "Vehículo",
        pagaderoEn: "San Juan",
        diaVencimiento: plan.diaVencimiento,
        mesVencimiento: mesSiguiente.toString().padStart(2, "0"),
        añoVencimiento: añoSiguiente.toString(),
      }));
    }
  };

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleDescargar = async () => {
    setLoading(true);
    try {
      if (data.clienteDni) {
        // Ojo: Asegurate de que guardarPagareEnBD retorne un error si falla,
        // o maneje el try/catch correctamente para que no corte el flujo.
        await guardarPagareEnBD(data);
      } else {
        console.log("Modo borrador: PDF generado sin guardar en BD.");
      }
      const blobBoleto = await pdf(<TalonarioPDF data={data} />).toBlob();
      const urlBoleto = URL.createObjectURL(blobBoleto);
      const aBoleto = document.createElement("a");
      aBoleto.href = urlBoleto;
      aBoleto.download = `Pagare_${data.numeroCuotaPaga}_de_${data.numeroCuotas}_${data.clienteNombre}.pdf`;
      aBoleto.click();
      URL.revokeObjectURL(urlBoleto);

      // Actualizamos los planes por si quiere generar el siguiente inmediatamente
      const clienteActual = clientes.find((c) => c.dni === data.clienteDni);
      if (clienteActual) fetchPlanesCliente(clienteActual.id);
    } catch (error) {
      console.error("Error generando PDFs:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 p-4 sm:p-8 bg-white text-black border border-gray-200 rounded-xl shadow-lg">
      <h2 className="text-xl sm:text-2xl font-bold border-b-2 border-black pb-3">
        Generador de Pagarés (Talonario)
      </h2>

      <div className="space-y-4 bg-blue-50 p-4 sm:p-5 rounded-lg border border-blue-200 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="font-bold text-blue-700">
              1. Seleccionar Cliente
            </Label>
            <Select onValueChange={handleSeleccionarCliente}>
              <SelectTrigger className="bg-white border-blue-300 focus:ring-blue-600">
                <SelectValue placeholder="Buscar cliente..." />
              </SelectTrigger>
              <SelectContent>
                {clientes.length === 0 ? (
                  <SelectItem value="null" disabled>
                    Cargando...
                  </SelectItem>
                ) : (
                  clientes.map((cliente) => (
                    <SelectItem key={cliente.id} value={cliente.id}>
                      {cliente.nombre_completo} (DNI: {cliente.dni})
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* ESTE SELECT SOLO APARECE SI EL CLIENTE TIENE TALONARIOS SIN TERMINAR */}
          {planesAbiertos.length > 0 && (
            <div className="space-y-2">
              <Label className="font-bold text-green-700">
                2. Continuar Talonario Abierto
              </Label>
              <Select onValueChange={handleSeleccionarPlan}>
                <SelectTrigger className="bg-green-50 border-green-300 focus:ring-green-600">
                  <SelectValue placeholder="Seleccionar plan pendiente..." />
                </SelectTrigger>
                <SelectContent>
                  {planesAbiertos.map((plan) => (
                    <SelectItem key={plan.key} value={plan.key}>
                      Plan {plan.totalCuotas} cuotas de ${plan.monto} (Toca
                      generar: {Math.max(...plan.cuotasGeneradas) + 1})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>

      {/* BLOQUE CLIENTE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        <div className="space-y-4 bg-gray-50 p-4 sm:p-5 rounded-lg border border-gray-200">
          <h3 className="font-bold text-red-600 uppercase tracking-wide">
            Datos del Cliente
          </h3>
          <div className="space-y-2">
            <Label className="font-semibold">Nombre Completo</Label>
            <Input
              name="clienteNombre"
              value={data.clienteNombre || ""}
              onChange={handleChange}
              className="bg-white focus-visible:ring-red-600"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-semibold">Documento N°</Label>
            <Input
              name="clienteDni"
              value={data.clienteDni || ""}
              onChange={handleChange}
              className="bg-white focus-visible:ring-red-600"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-semibold">Domicilio</Label>
            <Input
              name="clienteDomicilio"
              value={data.clienteDomicilio || ""}
              onChange={handleChange}
              className="bg-white focus-visible:ring-red-600"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-semibold">Localidad</Label>
            <Input
              name="clienteLocalidad"
              value={data.clienteLocalidad || ""}
              onChange={handleChange}
              className="bg-white focus-visible:ring-red-600"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-semibold">Teléfono</Label>
            <Input
              name="clienteTel"
              value={data.clienteTel || ""}
              onChange={handleChange}
              className="bg-white focus-visible:ring-red-600"
            />
          </div>
        </div>

        <div className="space-y-4 bg-gray-50 p-4 sm:p-5 rounded-lg border border-gray-200">
          <h3 className="font-bold text-red-600 uppercase tracking-wide">
            Datos del Pagaré
          </h3>
          <div className="space-y-2">
            <Label className="font-semibold">A favor de (Beneficiario)</Label>
            <Input
              name="recibeNombreCompleto"
              value={data.recibeNombreCompleto || ""}
              onChange={handleChange}
              className="bg-white focus-visible:ring-red-600"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-semibold">Monto de la Cuota ($)</Label>
            <Input
              name="monto"
              value={data.monto || ""}
              onChange={handleChange}
              className="bg-white focus-visible:ring-red-600"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="font-semibold">N° Cuota Actual</Label>
              <Input
                name="numeroCuotaPaga"
                value={data.numeroCuotaPaga || ""}
                onChange={handleChange}
                className="bg-white focus-visible:ring-red-600"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-semibold">Total de Cuotas</Label>
              <Input
                name="numeroCuotas"
                value={data.numeroCuotas || ""}
                onChange={handleChange}
                className="bg-white focus-visible:ring-red-600"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="font-semibold">
              Valor recibido en (Concepto)
            </Label>
            <Input
              name="valorRecibidoen"
              value={data.valorRecibidoen || ""}
              onChange={handleChange}
              className="bg-white focus-visible:ring-red-600"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-semibold">Pagadero en (Lugar)</Label>
            <Input
              name="pagaderoEn"
              value={data.pagaderoEn || ""}
              onChange={handleChange}
              className="bg-white focus-visible:ring-red-600"
            />
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 sm:p-5 rounded-lg border border-gray-200">
        <h3 className="font-bold text-red-600 uppercase tracking-wide mb-4">
          Fecha de Vencimiento
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="font-semibold">Día</Label>
            <Input
              name="diaVencimiento"
              value={data.diaVencimiento || ""}
              onChange={handleChange}
              className="bg-white focus-visible:ring-red-600"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-semibold">Mes</Label>
            <Input
              name="mesVencimiento"
              value={data.mesVencimiento || ""}
              onChange={handleChange}
              className="bg-white focus-visible:ring-red-600"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-semibold">Año</Label>
            <Input
              name="añoVencimiento"
              value={data.añoVencimiento || ""}
              onChange={handleChange}
              className="bg-white focus-visible:ring-red-600"
            />
          </div>
        </div>
      </div>

      {/* BOTONES DE ACCIÓN */}
      <div className="pt-6 flex flex-col sm:flex-row justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={llenarDatosDePrueba}
          className="border-gray-400 text-gray-600 hover:bg-gray-100"
        >
          Llenar datos de prueba
        </Button>

        <Button
          disabled={loading}
          size="lg"
          onClick={handleDescargar}
          className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-6 text-lg shadow-lg w-full sm:w-auto"
        >
          {loading ? "Generando archivo..." : "Descargar Pagaré PDF"}
        </Button>
      </div>
    </div>
  );
}
