import { useState } from "react";
import { pdf } from "@react-pdf/renderer";
import { BoletoPDF } from "./BoletoCompraVenta.jsx"; // Asegúrate de que el nombre coincide con tu archivo
import { DateroPDF } from "./DateroPDF.jsx";
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

export function FormBoletoCompraVenta() {
  const [loading, setLoading] = useState(false);
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
    libreDeudaDia: "",
    libreDeudaMes: "",
    gastoTransferencia: "",
    firmaDia: "",
    firmaMes: "",
    observaciones:
      "Se entrega manuales, duplicado de llave, auxilio, criquet y llave de rueda.",
    titular: "",
    cuil: "",
    fechaNac: "",
    conyuge: "",
    dniConyuge: "",
    telefonosDatero: "",
    correo: "",
    ocupacion: "",
    domicilioDni: "",
  });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  // Manejador específico para los componentes Select
  const handleSelectChange = (name, value) => {
    setData({ ...data, [name]: value });
  };

  const handleDescargaDoble = async () => {
    setLoading(true);
    try {
      const blobBoleto = await pdf(<BoletoPDF data={data} />).toBlob();
      const urlBoleto = URL.createObjectURL(blobBoleto);
      const aBoleto = document.createElement("a");
      aBoleto.href = urlBoleto;
      aBoleto.download = `boleto_${data.vehiculoDominio || "borrador"}.pdf`;
      aBoleto.click();
      URL.revokeObjectURL(urlBoleto);

      const blobDatero = await pdf(<DateroPDF data={data} />).toBlob();
      const urlDatero = URL.createObjectURL(blobDatero);
      const aDatero = document.createElement("a");
      aDatero.href = urlDatero;
      aDatero.download = `datero_${data.titular || "borrador"}.pdf`;
      aDatero.click();
      URL.revokeObjectURL(urlDatero);
    } catch (error) {
      console.error("Error generando PDFs:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 p-8 bg-white text-black border border-gray-200 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold border-b-2 border-black pb-3">
        Boleto de Compraventa y Datero
      </h2>

      {/* BLOQUE VENDEDOR Y COMPRADOR */}
      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-4 bg-gray-50 p-5 rounded-lg border border-gray-200">
          <h3 className="font-bold text-red-600 uppercase tracking-wide">
            Datos del Vendedor
          </h3>
          <div className="space-y-2">
            <Label className="font-semibold">Nombre Completo</Label>
            <Input
              name="vendedorNombre"
              onChange={handleChange}
              className="bg-white focus-visible:ring-red-600"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-semibold">Documento N°</Label>
            <Input
              name="vendedorDni"
              onChange={handleChange}
              className="bg-white focus-visible:ring-red-600"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-semibold">Domicilio</Label>
            <Input
              name="vendedorDomicilio"
              onChange={handleChange}
              className="bg-white focus-visible:ring-red-600"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-semibold">Localidad</Label>
            <Input
              name="vendedorLocalidad"
              onChange={handleChange}
              className="bg-white focus-visible:ring-red-600"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-semibold">Teléfono</Label>
            <Input
              name="vendedorTel"
              onChange={handleChange}
              className="bg-white focus-visible:ring-red-600"
            />
          </div>
        </div>

        <div className="space-y-4 bg-gray-50 p-5 rounded-lg border border-gray-200">
          <h3 className="font-bold text-red-600 uppercase tracking-wide">
            Datos del Comprador
          </h3>
          <div className="space-y-2">
            <Label className="font-semibold">Nombre Completo</Label>
            <Input
              name="compradorNombre"
              onChange={handleChange}
              className="bg-white focus-visible:ring-red-600"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-semibold">Documento N°</Label>
            <Input
              name="compradorDni"
              onChange={handleChange}
              className="bg-white focus-visible:ring-red-600"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-semibold">Domicilio</Label>
            <Input
              name="compradorDomicilio"
              onChange={handleChange}
              className="bg-white focus-visible:ring-red-600"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-semibold">Localidad</Label>
            <Input
              name="compradorLocalidad"
              onChange={handleChange}
              className="bg-white focus-visible:ring-red-600"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-semibold">Teléfono</Label>
            <Input
              name="compradorTel"
              onChange={handleChange}
              className="bg-white focus-visible:ring-red-600"
            />
          </div>
        </div>
      </div>

      {/* BLOQUE VEHICULO */}
      <div className="space-y-4 bg-gray-50 p-5 rounded-lg border border-gray-200">
        <h3 className="font-bold text-red-600 uppercase tracking-wide">
          Datos del Vehículo
        </h3>
        <div className="grid grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label className="font-semibold">Marca</Label>
            <Select
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
              onChange={handleChange}
              className="bg-white focus-visible:ring-red-600"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-semibold">Tipo</Label>
            <Input
              name="vehiculoTipo"
              onChange={handleChange}
              className="bg-white focus-visible:ring-red-600"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-semibold">Dominio (Patente)</Label>
            <Input
              name="vehiculoDominio"
              onChange={handleChange}
              className="bg-white border-red-300 focus-visible:ring-red-600 uppercase"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-semibold">Motor N°</Label>
            <Input
              name="vehiculoMotor"
              onChange={handleChange}
              className="bg-white focus-visible:ring-red-600 uppercase"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-semibold">Chasis N°</Label>
            <Input
              name="vehiculoChasis"
              onChange={handleChange}
              className="bg-white focus-visible:ring-red-600 uppercase"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-semibold">Año</Label>
            <Select
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
              onChange={handleChange}
              className="bg-white focus-visible:ring-red-600"
            />
          </div>
        </div>
      </div>

      {/* BLOQUE OPERACIÓN Y FECHAS */}
      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-4 bg-gray-50 p-5 rounded-lg border border-gray-200">
          <h3 className="font-bold text-red-600 uppercase tracking-wide">
            Operación
          </h3>
          <div className="space-y-2">
            <Label className="font-semibold">Monto Venta</Label>
            <Input
              name="precio"
              onChange={handleChange}
              className="bg-white focus-visible:ring-red-600"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-semibold">Forma de Pago</Label>
            <Input
              name="formaPago"
              onChange={handleChange}
              className="bg-white focus-visible:ring-red-600"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-semibold">Gastos de Transferencia</Label>
            <Input
              name="gastoTransferencia"
              onChange={handleChange}
              className="bg-white focus-visible:ring-red-600"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-semibold">Observaciones</Label>
            <Input
              name="observaciones"
              value={data.observaciones}
              onChange={handleChange}
              className="bg-white focus-visible:ring-red-600"
            />
          </div>
        </div>

        <div className="space-y-4 bg-gray-50 p-5 rounded-lg border border-gray-200">
          <h3 className="font-bold text-red-600 uppercase tracking-wide">
            Fechas (2026)
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="font-semibold">Día Libre Deuda</Label>
              <Input
                name="libreDeudaDia"
                onChange={handleChange}
                className="bg-white focus-visible:ring-red-600"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-semibold">Mes Libre Deuda</Label>
              <Input
                name="libreDeudaMes"
                onChange={handleChange}
                className="bg-white focus-visible:ring-red-600"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-semibold">Día Firma (San Juan)</Label>
              <Input
                name="firmaDia"
                onChange={handleChange}
                className="bg-white focus-visible:ring-red-600"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-semibold">Mes Firma (San Juan)</Label>
              <Input
                name="firmaMes"
                onChange={handleChange}
                className="bg-white focus-visible:ring-red-600"
              />
            </div>
          </div>
        </div>
      </div>

      {/* BLOQUE DATERO */}
      <div className="space-y-4 bg-gray-50 p-5 rounded-lg border border-gray-200 border-t-4 border-t-black">
        <h3 className="font-bold text-red-600 uppercase tracking-wide">
          Datos Adicionales (Datero Agencia)
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="font-semibold">Titular</Label>
            <Input
              name="titular"
              onChange={handleChange}
              className="bg-white focus-visible:ring-red-600"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-semibold">CUIL</Label>
            <Input
              name="cuil"
              onChange={handleChange}
              className="bg-white focus-visible:ring-red-600"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-semibold">Fecha Nac.</Label>
            <Input
              name="fechaNac"
              onChange={handleChange}
              className="bg-white focus-visible:ring-red-600"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-semibold">Cónyuge</Label>
            <Input
              name="conyuge"
              onChange={handleChange}
              className="bg-white focus-visible:ring-red-600"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-semibold">DNI Cónyuge</Label>
            <Input
              name="dniConyuge"
              onChange={handleChange}
              className="bg-white focus-visible:ring-red-600"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-semibold">Teléfonos</Label>
            <Input
              name="telefonosDatero"
              onChange={handleChange}
              className="bg-white focus-visible:ring-red-600"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-semibold">Correo Electrónico</Label>
            <Input
              name="correo"
              type="email"
              onChange={handleChange}
              className="bg-white focus-visible:ring-red-600"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-semibold">Ocupación</Label>
            <Input
              name="ocupacion"
              onChange={handleChange}
              className="bg-white focus-visible:ring-red-600"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-semibold">Domicilio de DNI</Label>
            <Input
              name="domicilioDni"
              onChange={handleChange}
              className="bg-white focus-visible:ring-red-600"
            />
          </div>
        </div>
      </div>

      {/* BOTÓN DE DESCARGA */}
      <div className="pt-6 flex justify-end">
        <Button
          disabled={loading}
          size="lg"
          onClick={handleDescargaDoble}
          className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-6 text-lg shadow-lg"
        >
          {loading ? "Generando archivos..." : "Descargar Ambos PDFs"}
        </Button>
      </div>
    </div>
  );
}
