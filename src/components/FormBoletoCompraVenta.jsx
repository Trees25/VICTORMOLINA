import { useState } from "react";
import { pdf } from "@react-pdf/renderer";
import { BoletoCompra } from "./BoletoCompra.jsx";
import { BoletoVenta } from "./BoletoVenta.jsx";
import { BoletoConsignación } from "./BoletoConsignación.jsx";
import { DateroPDF } from "./DateroPDF.jsx";
import { guardarOperacionEnBD } from "../lib/db.js";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import TextareaAutosize from "react-textarea-autosize";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Datos precargados
const MARCAS_AUTOS = [
  "Volkswagen",
  "Ford",
  "Chevrolet",
  "Peugeot",
  "Renault",
  "Fiat",
  "Toyota",
  "Honda",
  "Nissan",
  "Citroën",
  "Jeep",
  "Hyundai",
  "Kia",
  "Audi",
  "BMW",
  "Mercedes-Benz",
].sort();

const ANIOS_AUTOS = Array.from({ length: 2026 - 1990 + 1 }, (_, i) =>
  (2026 - i).toString(),
);

export default function FormBoletoCompraVenta({ tipo }) {
  const [loading, setLoading] = useState(false);
  const tipos_datero = ["venta", "consignacion"];

  const [data, setData] = useState({
    vendedorNombre: "",
    vendedorDni: "",
    vendedorDomicilio: "",
    vendedorLocalidad: "",
    vendedorTel: "",
    compradorNombre: "",
    compradorDni: "",
    compradorDomicilio: "",
    compradorLocalidad: "",
    compradorTel: "",
    vehiculoMarca: "",
    vehiculoModelo: "",
    vehiculoTipo: "",
    vehiculoMotor: "",
    vehiculoChasis: "",
    vehiculoDominio: "",
    vehiculoAnio: "",
    vehiculoInsc: "",
    precio: "",
    formaPago: "",
    observacionesAuto: "",
    obs2: "",
    obs3: "",
    obs4: "",

    // Variables para el PDF
    libreDeudaDia: "",
    libreDeudaMes: "",
    firmaDia: "",
    firmaMes: "",
    firmaAnio: "",
    fechaNac: "",

    // Variables auxiliares para los selectores de fecha
    _fechaFirma: "",
    _fechaNacDate: "",

    gastoTransferencia: "",
    fechaTrans: "",
    observaciones:
      "Se entrega manuales, duplicado de llave, auxilio, criquet y llave de rueda.",
    dominio: "",
    titular: "",
    cuil: "",
    conyuge: "",
    dniConyuge: "",
    telefonosDatero: "",
    correo: "",
    ocupacion: "",
    domicilioDni: "",
  });

  const llenarDatosDePrueba = () => {
    const patenteRandom = "TST" + Math.floor(Math.random() * 1000);

    setData({
      vendedorNombre: "Juan Pérez (Prueba)",
      vendedorDni: "12345678",
      vendedorDomicilio: "Av. Libertador 123",
      vendedorLocalidad: "Rivadavia",
      vendedorTel: "2641234567",
      compradorNombre: "María Gómez (Prueba)",
      compradorDni: "87654321",
      compradorDomicilio: "Calle Ignacio de la Roza 456",
      compradorLocalidad: "Rivadavia",
      compradorTel: "2647654321",
      vehiculoMarca: "Toyota",
      vehiculoModelo: "Corolla",
      vehiculoTipo: "Sedán",
      vehiculoMotor: "1ZZFE123456789",
      vehiculoChasis: "JT1234567890123",
      vehiculoDominio: patenteRandom,
      vehiculoAnio: "2020",
      vehiculoInsc: "01/01/2020",
      precio: "15000000",
      formaPago: "Efectivo",
      observacionesAuto: "4 cubiertas nuevas",

      // Fechas de prueba sincronizadas
      firmaDia: "20",
      firmaMes: "10",
      firmaAnio: "2026", // <--- ACÁ ESTABA EL ERROR: Faltaba el año
      _fechaFirma: "2026-10-20",
      fechaNac: "15/05/1990",
      _fechaNacDate: "1990-05-15",

      gastoTransferencia: "150000",
      observaciones: "Vehículo de prueba para validación de base de datos.",
      dominio: patenteRandom,
      titular: "María Gómez",
      cuil: "27876543214",
      conyuge: "Ninguno",
      dniConyuge: "",
      telefonosDatero: "2647654321",
      correo: "maria.prueba@email.com",
      ocupacion: "Desarrolladora",
      domicilioDni: "Calle Ignacio de la Roza 456",
    });
  };

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name, value) => {
    setData({ ...data, [name]: value });
  };

  const handleDescargaDoble = async () => {
    setLoading(true);
    try {
      if (data.vehiculoDominio) {
        await guardarOperacionEnBD(data, tipo);
      } else {
        console.log("Modo borrador: PDF generado sin guardar en BD.");
      }
      if (tipo === "compra") {
        const blobBoleto = await pdf(<BoletoCompra data={data} />).toBlob();
        const urlBoleto = URL.createObjectURL(blobBoleto);
        const aBoleto = document.createElement("a");
        aBoleto.href = urlBoleto;
        aBoleto.download = `boleto_${data.vehiculoDominio || "borrador"}_compra.pdf`;
        aBoleto.click();
        URL.revokeObjectURL(urlBoleto);
      } else if (tipo === "venta") {
        const blobBoleto = await pdf(<BoletoVenta data={data} />).toBlob();
        const urlBoleto = URL.createObjectURL(blobBoleto);
        const aBoleto = document.createElement("a");
        aBoleto.href = urlBoleto;
        aBoleto.download = `boleto_${data.vehiculoDominio || "borrador"}_venta.pdf`;
        aBoleto.click();
        URL.revokeObjectURL(urlBoleto);

        const blobDatero = await pdf(<DateroPDF data={data} />).toBlob();
        const urlDatero = URL.createObjectURL(blobDatero);
        const aDatero = document.createElement("a");
        aDatero.href = urlDatero;
        aDatero.download = `datero_${data.titular || "borrador"}.pdf`;
        aDatero.click();
        URL.revokeObjectURL(urlDatero);
      } else {
        const blobBoleto = await pdf(
          <BoletoConsignación data={data} />,
        ).toBlob();
        const urlBoleto = URL.createObjectURL(blobBoleto);
        const aBoleto = document.createElement("a");
        aBoleto.href = urlBoleto;
        aBoleto.download = `boleto_${data.vehiculoDominio || "borrador"}_consignación.pdf`;
        aBoleto.click();
        URL.revokeObjectURL(urlBoleto);

        const blobDatero = await pdf(<DateroPDF data={data} />).toBlob();
        const urlDatero = URL.createObjectURL(blobDatero);
        const aDatero = document.createElement("a");
        aDatero.href = urlDatero;
        aDatero.download = `datero_${data.titular || "borrador"}.pdf`;
        aDatero.click();
        URL.revokeObjectURL(urlDatero);
      }
    } catch (error) {
      console.error("Error generando PDFs:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 p-4 sm:p-8 bg-white text-black border border-gray-200 rounded-xl shadow-lg">
      <h2 className="text-xl sm:text-2xl font-bold border-b-2 border-black pb-3">
        {tipo === "compra"
          ? "Boleto de Compra"
          : tipo === "venta"
            ? "Boleto de Venta"
            : tipo === "consignacion"
              ? "Boleto de Consignación"
              : "Boleto de Talonario"}
      </h2>

      {/* BLOQUE VENDEDOR Y COMPRADOR */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        <div className="space-y-4 bg-gray-50 p-4 sm:p-5 rounded-lg border border-gray-200">
          <h3 className="font-bold text-red-600 uppercase tracking-wide">
            Datos del Vendedor
          </h3>
          <div className="space-y-2">
            <Label className="font-semibold">Nombre Completo</Label>
            <Input
              name="vendedorNombre"
              value={data.vendedorNombre || ""}
              onChange={handleChange}
              className="bg-white focus-visible:ring-red-600"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-semibold">Documento N°</Label>
            <Input
              name="vendedorDni"
              value={data.vendedorDni || ""}
              onChange={handleChange}
              className="bg-white focus-visible:ring-red-600"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-semibold">Domicilio</Label>
            <Input
              name="vendedorDomicilio"
              value={data.vendedorDomicilio || ""}
              onChange={handleChange}
              className="bg-white focus-visible:ring-red-600"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-semibold">Localidad</Label>
            <Input
              name="vendedorLocalidad"
              value={data.vendedorLocalidad || ""}
              onChange={handleChange}
              className="bg-white focus-visible:ring-red-600"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-semibold">Teléfono</Label>
            <Input
              name="vendedorTel"
              value={data.vendedorTel || ""}
              onChange={handleChange}
              className="bg-white focus-visible:ring-red-600"
            />
          </div>
        </div>

        <div className="space-y-4 bg-gray-50 p-4 sm:p-5 rounded-lg border border-gray-200">
          <h3 className="font-bold text-red-600 uppercase tracking-wide">
            Datos del Comprador
          </h3>
          <div className="space-y-2">
            <Label className="font-semibold">Nombre Completo</Label>
            <Input
              name="compradorNombre"
              value={data.compradorNombre || ""}
              onChange={handleChange}
              className="bg-white focus-visible:ring-red-600"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-semibold">Documento N°</Label>
            <Input
              name="compradorDni"
              value={data.compradorDni || ""}
              onChange={handleChange}
              className="bg-white focus-visible:ring-red-600"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-semibold">Domicilio</Label>
            <Input
              name="compradorDomicilio"
              value={data.compradorDomicilio || ""}
              onChange={handleChange}
              className="bg-white focus-visible:ring-red-600"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-semibold">Localidad</Label>
            <Input
              name="compradorLocalidad"
              value={data.compradorLocalidad || ""}
              onChange={handleChange}
              className="bg-white focus-visible:ring-red-600"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-semibold">Teléfono</Label>
            <Input
              name="compradorTel"
              value={data.compradorTel || ""}
              onChange={handleChange}
              className="bg-white focus-visible:ring-red-600"
            />
          </div>
        </div>
      </div>

      {/* BLOQUE VEHICULO */}
      <div className="space-y-4 bg-gray-50 p-4 sm:p-5 rounded-lg border border-gray-200">
        <h3 className="font-bold text-red-600 uppercase tracking-wide">
          Datos del Vehículo
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label className="font-semibold">Marca</Label>
            <Select
              value={data.vehiculoMarca}
              onValueChange={(val) => handleSelectChange("vehiculoMarca", val)}
            >
              <SelectTrigger className="bg-white focus:ring-red-600">
                <SelectValue placeholder="Seleccionar..." />
              </SelectTrigger>
              <SelectContent>
                {MARCAS_AUTOS.map((marca) => (
                  <SelectItem key={marca} value={marca}>
                    {marca}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="font-semibold">Modelo</Label>
            <Input
              name="vehiculoModelo"
              value={data.vehiculoModelo || ""}
              onChange={handleChange}
              className="bg-white focus-visible:ring-red-600"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-semibold">Tipo</Label>
            <Input
              name="vehiculoTipo"
              value={data.vehiculoTipo || ""}
              onChange={handleChange}
              className="bg-white focus-visible:ring-red-600"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-semibold">Dominio (Patente)</Label>
            <Input
              name="vehiculoDominio"
              value={data.vehiculoDominio || ""}
              onChange={handleChange}
              className="bg-white border-red-300 focus-visible:ring-red-600 uppercase"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-semibold">Motor N°</Label>
            <Input
              name="vehiculoMotor"
              value={data.vehiculoMotor || ""}
              onChange={handleChange}
              className="bg-white focus-visible:ring-red-600 uppercase"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-semibold">Chasis N°</Label>
            <Input
              name="vehiculoChasis"
              value={data.vehiculoChasis || ""}
              onChange={handleChange}
              className="bg-white focus-visible:ring-red-600 uppercase"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-semibold">Año</Label>
            <Select
              value={data.vehiculoAnio}
              onValueChange={(val) => handleSelectChange("vehiculoAnio", val)}
            >
              <SelectTrigger className="bg-white focus:ring-red-600">
                <SelectValue placeholder="Seleccionar..." />
              </SelectTrigger>
              <SelectContent>
                {ANIOS_AUTOS.map((anio) => (
                  <SelectItem key={anio} value={anio}>
                    {anio}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="font-semibold">Inscripción Inicial</Label>
            <Input
              name="vehiculoInsc"
              value={data.vehiculoInsc || ""}
              onChange={handleChange}
              className="bg-white focus-visible:ring-red-600"
            />
          </div>
        </div>
      </div>

      {/* BLOQUE OPERACIÓN Y FECHAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        <div className="space-y-4 bg-gray-50 p-4 sm:p-5 rounded-lg border border-gray-200">
          <h3 className="font-bold text-red-600 uppercase tracking-wide">
            Operación
          </h3>
          <div className="space-y-2">
            <Label className="font-semibold">Monto Venta</Label>
            <Input
              name="precio"
              value={data.precio || ""}
              onChange={handleChange}
              className="bg-white focus-visible:ring-red-600"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-semibold">Forma de Pago</Label>
            <TextareaAutosize
              name="formaPago"
              value={data.formaPago || ""}
              onChange={handleChange}
              minRows={1}
              className="flex w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 resize-none"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-semibold">Gastos de Transferencia</Label>
            <Input
              name="gastoTransferencia"
              value={data.gastoTransferencia || ""}
              onChange={handleChange}
              className="bg-white focus-visible:ring-red-600"
            />
          </div>
          {tipo === "consignacion" && (
            <div className="space-y-2">
              <Label className="font-semibold">
                Días limite para Transferencia
              </Label>
              <Input
                name="fechaTrans"
                value={data.fechaTrans || ""}
                onChange={handleChange}
                placeholder="Ej: 30"
                className="bg-white focus-visible:ring-red-600"
              />
            </div>
          )}
          <div className="space-y-2">
            <Label className="font-semibold">Observaciones</Label>
            <Input
              name="observaciones"
              value={data.observaciones || ""}
              onChange={handleChange}
              className="bg-white focus-visible:ring-red-600"
            />
          </div>
        </div>

        <div className="space-y-4 bg-gray-50 p-4 sm:p-5 rounded-lg border border-gray-200">
          <h3 className="font-bold text-red-600 uppercase tracking-wide">
            Fechas de la Operación
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Calendario Firma */}
            <div className="space-y-2">
              <Label className="font-semibold">Fecha de Firma</Label>
              <Input
                type="date"
                value={data._fechaFirma || ""}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val) {
                    const [year, month, day] = val.split("-");
                    setData({
                      ...data,
                      firmaDia: day,
                      firmaMes: month,
                      firmaAnio: year,
                      _fechaFirma: val,
                    });
                  } else {
                    setData({
                      ...data,
                      firmaDia: "",
                      firmaMes: "",
                      firmaAnio: "",
                      _fechaFirma: "",
                    });
                  }
                }}
                className="bg-white focus-visible:ring-red-600"
              />
            </div>

            {tipo === "compra" ? (
              <>
                <div className="space-y-2">
                  <TextareaAutosize
                    name="obs2"
                    value={data.obs2 || ""}
                    onChange={handleChange}
                    minRows={1}
                    className="flex w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <TextareaAutosize
                    name="obs3"
                    value={data.obs3 || ""}
                    onChange={handleChange}
                    minRows={1}
                    className="flex w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <TextareaAutosize
                    name="obs4"
                    value={data.obs4 || ""}
                    onChange={handleChange}
                    minRows={1}
                    className="flex w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 resize-none"
                  />
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <Label className="font-semibold">Observaciones</Label>
                <TextareaAutosize
                  name="observacionesAuto"
                  value={data.observacionesAuto || ""}
                  onChange={handleChange}
                  minRows={1}
                  className="flex w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 resize-none"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* BLOQUE DATERO */}
      {tipos_datero.includes(tipo) && (
        <div className="space-y-4 bg-gray-50 p-4 sm:p-5 rounded-lg border border-gray-200 border-t-4 border-t-black">
          <h3 className="font-bold text-red-600 uppercase tracking-wide">
            Datos Adicionales (Datero Agencia)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="font-semibold">Dominio del vehiculo</Label>
              <Input
                name="dominio"
                value={data.dominio || ""}
                onChange={handleChange}
                className="bg-white focus-visible:ring-red-600"
              />
            </div>

            <div className="space-y-2">
              <Label className="font-semibold">Titular</Label>
              <Input
                name="titular"
                value={data.titular || ""}
                onChange={handleChange}
                className="bg-white focus-visible:ring-red-600"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-semibold">CUIL</Label>
              <Input
                name="cuil"
                value={data.cuil || ""}
                onChange={handleChange}
                className="bg-white focus-visible:ring-red-600"
              />
            </div>

            {/* Calendario Nacimiento */}
            <div className="space-y-2">
              <Label className="font-semibold">Fecha Nac.</Label>
              <Input
                type="date"
                value={data._fechaNacDate || ""}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val) {
                    const [year, month, day] = val.split("-");
                    setData({
                      ...data,
                      fechaNac: `${day}/${month}/${year}`,
                      _fechaNacDate: val,
                    });
                  } else {
                    setData({ ...data, fechaNac: "", _fechaNacDate: "" });
                  }
                }}
                className="bg-white focus-visible:ring-red-600"
              />
            </div>

            <div className="space-y-2">
              <Label className="font-semibold">Cónyuge</Label>
              <Input
                name="conyuge"
                value={data.conyuge || ""}
                onChange={handleChange}
                className="bg-white focus-visible:ring-red-600"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-semibold">DNI Cónyuge</Label>
              <Input
                name="dniConyuge"
                value={data.dniConyuge || ""}
                onChange={handleChange}
                className="bg-white focus-visible:ring-red-600"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-semibold">Teléfonos</Label>
              <Input
                name="telefonosDatero"
                value={data.telefonosDatero || ""}
                onChange={handleChange}
                className="bg-white focus-visible:ring-red-600"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-semibold">Correo Electrónico</Label>
              <Input
                name="correo"
                value={data.correo || ""}
                type="email"
                onChange={handleChange}
                className="bg-white focus-visible:ring-red-600"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-semibold">Ocupación</Label>
              <Input
                name="ocupacion"
                value={data.ocupacion || ""}
                onChange={handleChange}
                className="bg-white focus-visible:ring-red-600"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-semibold">Domicilio de DNI</Label>
              <Input
                name="domicilioDni"
                value={data.domicilioDni || ""}
                onChange={handleChange}
                className="bg-white focus-visible:ring-red-600"
              />
            </div>
          </div>
        </div>
      )}

      {/* BOTONES DE ACCIÓN */}
      <div className="pt-6 flex flex-col sm:flex-row justify-end gap-4">
        {/* Botón temporal para pruebas */}
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
          onClick={handleDescargaDoble}
          className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-6 text-lg shadow-lg w-full sm:w-auto"
        >
          {loading ? "Generando archivos..." : "Descargar PDF"}
        </Button>
      </div>
    </div>
  );
}
