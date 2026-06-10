import { useState, useEffect } from "react";
import { pdf } from "@react-pdf/renderer";
import { TalonarioPDF } from "./TalonarioPDF.jsx";
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
import { guardarPagareEnBD } from "../lib/db.js";
export default function FormTalonario() {
  const [loading, setLoading] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [busquedaDni, setBusquedaDni] = useState("");

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

    // Variables separadas para el PDF
    diaVencimiento: "",
    mesVencimiento: "",
    añoVencimiento: "",

    // Variable auxiliar para el calendario
    _fechaVencimientoDate: "",

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

      // Fechas sincronizadas
      diaVencimiento: "02",
      mesVencimiento: "06",
      añoVencimiento: "2026",
      _fechaVencimientoDate: "2026-06-02",

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
    }
  };

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleDescargar = async () => {
    setLoading(true);
    try {
      if (data.clienteDni) {
        await guardarPagareEnBD(data);
      } else {
        console.log("Modo borrador: PDF generado sin guardar en BD.");
      }

      const blobBoleto = await pdf(<TalonarioPDF data={data} />).toBlob();
      const urlBoleto = URL.createObjectURL(blobBoleto);
      const aBoleto = document.createElement("a");
      aBoleto.href = urlBoleto;
      aBoleto.download = `Pagare_de_${data.clienteNombre || "Borrador"}.pdf`;
      aBoleto.click();
      URL.revokeObjectURL(urlBoleto);
    } catch (error) {
      console.error("Error generando PDFs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrado de clientes en base al texto ingresado en el buscador de DNI
  const clientesFiltrados = busquedaDni
    ? clientes.filter((c) => c.dni && c.dni.includes(busquedaDni))
    : clientes;

  return (
    <div className="space-y-6 sm:space-y-8 p-4 sm:p-8 bg-white text-black border border-gray-200 rounded-xl shadow-lg">
      <h2 className="text-xl sm:text-2xl font-bold border-b-2 border-black pb-3">
        Generador de Pagarés (Talonario)
      </h2>

      <div className="bg-blue-50 p-4 sm:p-5 rounded-lg border border-blue-200 mb-6">
        <Label className="font-bold text-blue-700 mb-3 block">
          1. Buscar y Seleccionar Cliente
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm text-blue-600">Filtrar por DNI</Label>
            <Input
              placeholder="Ej: 23456789..."
              value={busquedaDni}
              onChange={(e) => setBusquedaDni(e.target.value)}
              className="bg-white border-blue-300 focus-visible:ring-blue-600"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm text-blue-600">Elegir Cliente</Label>
            <Select onValueChange={handleSeleccionarCliente}>
              <SelectTrigger className="bg-white border-blue-300 focus:ring-blue-600">
                <SelectValue placeholder="Resultados de búsqueda..." />
              </SelectTrigger>
              <SelectContent>
                {clientesFiltrados.length === 0 ? (
                  <SelectItem value="null" disabled>
                    {busquedaDni
                      ? "No se encontraron resultados"
                      : "Cargando..."}
                  </SelectItem>
                ) : (
                  clientesFiltrados.map((cliente) => (
                    <SelectItem key={cliente.id} value={cliente.id}>
                      {cliente.nombre_completo} (DNI: {cliente.dni})
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="font-semibold">Seleccionar Fecha</Label>
            <Input
              type="date"
              value={data._fechaVencimientoDate || ""}
              onChange={(e) => {
                const val = e.target.value;
                if (val) {
                  const [year, month, day] = val.split("-");
                  setData({
                    ...data,
                    diaVencimiento: day,
                    mesVencimiento: month,
                    añoVencimiento: year,
                    _fechaVencimientoDate: val,
                  });
                } else {
                  setData({
                    ...data,
                    diaVencimiento: "",
                    mesVencimiento: "",
                    añoVencimiento: "",
                    _fechaVencimientoDate: "",
                  });
                }
              }}
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
