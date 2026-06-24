import { useState, useEffect } from "react";
import { pdf } from "@react-pdf/renderer";
import { ContratoConsignacion } from "./ContratoConsignacion.jsx";
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
import { guardarOperacionEnBD } from "../lib/db.js";
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

export default function FormContratoConsignacion() {
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    clienteNombre: "",
    clienteCuil: "",
    clienteAbonar: "",
    vehiculoMarca: "",
    vehiculoModelo: "",
    vehiculoTipo: "",
    vehiculoMotor: "",
    vehiculoChasis: "",
    vehiculoDominio: "",
    vehiculoAnio: "",
    vehiculoDetalles: "",
    firmaDia: "",
    firmaMes: "",
    firmaAnio: "",
    _fechaDate: "",
  });

  const llenarDatosDePrueba = () => {
    setData({
      clienteNombre: "Juan Pérez",
      clienteCuil: "20-34567890-1",
      clienteAbonar: "2500000",
      vehiculoMarca: "Toyota",
      vehiculoModelo: "Corolla",
      vehiculoTipo: "Sedán",
      vehiculoMotor: "TYT-123456-MOT",
      vehiculoChasis: "9BW-789012-CHAS",
      vehiculoDominio: "AB123CD",
      vehiculoAnio: "2024",
      vehiculoDetalles:
        "Color blanco perlado, tapizado cuero, 15.000km, único dueño.",
      firmaDia: "24",
      firmaMes: "06",
      firmaAnio: "2026",
      _fechaDate: "2026-06-24",
    });
  };

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleDescargar = async () => {
    setLoading(true);
    try {
      if (data.vehiculoDominio) {
        await guardarOperacionEnBD(data, "contrato_consignacion");
      } else {
        console.log("Modo borrador: PDF generado sin guardar en BD.");
      }
      const blobBoleto = await pdf(
        <ContratoConsignacion data={data} />,
      ).toBlob();
      const urlBoleto = URL.createObjectURL(blobBoleto);
      const aBoleto = document.createElement("a");
      aBoleto.href = urlBoleto;
      aBoleto.download = `Contrato_de_Consignacion_de_${data.clienteNombre || "Borrador"}.pdf`;
      aBoleto.click();
      URL.revokeObjectURL(urlBoleto);
    } catch (error) {
      console.error("Error generando PDFs:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 p-4 sm:p-8 bg-white text-black border border-gray-200 rounded-xl shadow-lg">
      <h2 className="text-xl sm:text-2xl font-bold border-b-2 border-black pb-3">
        Contrato de consignación
      </h2>

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
            <Label className="font-semibold">CUIL</Label>
            <Input
              name="clienteCuil"
              value={data.clienteCuil || ""}
              onChange={handleChange}
              className="bg-white focus-visible:ring-red-600"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-semibold">Total a abonar</Label>
            <Input
              name="clienteAbonar"
              value={data.clienteAbonar || ""}
              onChange={handleChange}
              className="bg-white focus-visible:ring-red-600"
            />
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 sm:p-5 rounded-lg border border-gray-200">
        <h3 className="font-bold text-red-600 uppercase tracking-wide mb-4">
          Fecha
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="font-semibold">Fecha de la operacion</Label>
            <Input
              type="date"
              value={data._fechaDate || ""}
              onChange={(e) => {
                const val = e.target.value;
                if (val) {
                  const [year, month, day] = val.split("-");
                  setData({
                    ...data,
                    firmaDia: day,
                    firmaMes: month,
                    firmaAnio: year,
                  });
                } else {
                  setData({
                    ...data,
                    firmaDia: "",
                    firmaMes: "",
                    firmaAnio: "",
                  });
                }
              }}
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
            <Label className="font-semibold">Detalles</Label>
            <Input
              name="vehiculoDetalles"
              value={data.vehiculoDetalles || ""}
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
          {loading ? "Generando archivo..." : "Descargar contrato  PDF"}
        </Button>
      </div>
    </div>
  );
}
