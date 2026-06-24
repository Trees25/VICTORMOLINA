import { useState } from "react";
import {
  Search,
  ShieldCheck,
  ShieldAlert,
  Building,
  Info,
  FileX2,
  User,
  MapPin,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "../lib/supabase.js";

const getDescripcionSituacion = (sit) => {
  switch (Number(sit)) {
    case 1:
      return "Normal (Atraso menor a 31 días)";
    case 2:
      return "Riesgo Bajo (Atraso de 31 a 90 días)";
    case 3:
      return "Riesgo Medio (Atraso de 90 a 180 días)";
    case 4:
      return "Riesgo Alto (Atraso de 180 a 365 días)";
    case 5:
      return "Irrecuperable (Atraso mayor a 365 días)";
    case 6:
      return "Irrecuperable por disposición técnica";
    default:
      return "Desconocida";
  }
};

const formatearMoneda = (monto) => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(monto);
};

export default function HistorialCrediticio() {
  const [cuil, setCuil] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState("");

  const consultarBCRA = async () => {
    const cuilLimpio = cuil.replace(/\D/g, "");

    if (cuilLimpio.length !== 11) {
      setError("El CUIT/CUIL debe tener 11 números exactos.");
      return;
    }

    setLoading(true);
    setError("");
    setResultado(null);

    try {
      const { data: response, error: funcError } =
        await supabase.functions.invoke("bcra-proxy", {
          body: { cuil: cuilLimpio },
        });

      if (funcError) throw funcError;

      const dataDeudas = response.deudas?.results;
      const dataCheques = response.cheques?.results;
      const dataAfip = response.afip;

      // Armamos el perfil AFIP si existe, o usamos el nombre de respaldo del BCRA
      let perfilAfip = null;
      if (dataAfip && dataAfip.nombre) {
        perfilAfip = {
          nombre: dataAfip.nombre,
          domicilio: dataAfip.domicilioFiscal?.direccion || "No informado",
          localidad: dataAfip.domicilioFiscal?.localidad || "",
          provincia: dataAfip.domicilioFiscal?.nombreProvincia || "",
          esMonotributo: dataAfip.EsMonotributo,
          esEmpleador: dataAfip.EsEmpleador,
        };
      } else if (response.nombreRespaldo) {
        // Fallback al nombre extraído del BCRA si AFIP falló
        perfilAfip = {
          nombre: response.nombreRespaldo,
          domicilio: "No informado (Dato AFIP no disponible)",
          localidad: "",
          provincia: "",
          esMonotributo: false,
          esEmpleador: false,
        };
      }

      // Si ambos BCRA son null (404), está impoluto financieramente
      if (!dataDeudas && !dataCheques) {
        setResultado({
          perfil: perfilAfip,
          estado: "LIMPIO",
          mensaje:
            "Sin deudas ni cheques rechazados en el sistema. Apto para financiación propia.",
          aptoAgencia: true,
          detalles: [],
          cheques: [],
        });
        return;
      }

      // Procesar Deudas
      let peorSituacion = 1;
      let totalDeuda = 0;
      let detallesDeuda = [];

      if (dataDeudas && dataDeudas.periodos && dataDeudas.periodos.length > 0) {
        const ultimoPeriodo = dataDeudas.periodos[0];
        ultimoPeriodo.entidades.forEach((ent) => {
          if (ent.situacion > peorSituacion) peorSituacion = ent.situacion;
          const montoReal = ent.monto * 1000;
          totalDeuda += montoReal;

          detallesDeuda.push({
            entidad: ent.entidad,
            situacion: ent.situacion,
            descripcionSituacion: getDescripcionSituacion(ent.situacion),
            monto: montoReal,
            diasAtraso: ent.diasAtraso || 0,
            procesoJudicial: ent.procesoJudicial || false,
          });
        });
      }

      // Procesar Cheques Rechazados
      let chequesRechazados = [];
      let tieneChequesMalaConducta = false;

      if (dataCheques && dataCheques.causales) {
        dataCheques.causales.forEach((causal) => {
          chequesRechazados.push({
            motivo: causal.causal,
            cantidad: causal.cantidad,
            monto: causal.monto,
          });
          tieneChequesMalaConducta = true;
        });
      }

      const esApto = peorSituacion === 1 && !tieneChequesMalaConducta;

      let mensajeFinal = "Cliente en Situación 1 (Normal). Perfil cumplidor.";
      if (!esApto) {
        if (tieneChequesMalaConducta && peorSituacion === 1) {
          mensajeFinal =
            "Riesgo detectado: El cliente no tiene deudas activas, pero registra CHEQUES RECHAZADOS.";
        } else if (tieneChequesMalaConducta) {
          mensajeFinal = `Riesgo muy alto: Atrasos (Sit ${peorSituacion}) y registro de CHEQUES RECHAZADOS.`;
        } else {
          mensajeFinal = `Riesgo detectado: Presenta atrasos o mora (Situación ${peorSituacion}).`;
        }
      }

      setResultado({
        perfil: perfilAfip,
        estado: esApto ? "SITUACION_1" : "RIESGO",
        mensaje: mensajeFinal,
        deudaTotal: totalDeuda,
        detalles: detallesDeuda,
        cheques: chequesRechazados,
        aptoAgencia: esApto,
      });
    } catch (err) {
      console.error(err);
      setError("Hubo un error al consultar el sistema. Intentá nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl shadow-lg border-gray-200">
      <CardHeader className="bg-gray-50 border-b">
        <CardTitle className="text-xl flex items-center gap-2 text-gray-800">
          <Building className="text-blue-600" />
          Escáner Integral (AFIP + BCRA)
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
            Ingrese CUIT o CUIL
          </label>
          <div className="flex gap-3">
            <Input
              placeholder="Ej: 20345678901"
              value={cuil}
              onChange={(e) => setCuil(e.target.value)}
              className="flex-1 font-mono text-lg"
              maxLength={11}
            />
            <Button
              onClick={consultarBCRA}
              disabled={loading}
              variant="default"
              className="shrink-0"
            >
              {loading ? (
                "Buscando..."
              ) : (
                <span className="flex items-center">
                  <Search className="w-4 h-4 mr-2" />
                  Buscar
                </span>
              )}
            </Button>
          </div>
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>

        {/* RESULTADOS */}
        {resultado && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* 1. SECCIÓN AFIP: Datos de Identidad */}
            {resultado.perfil && (
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-slate-800">
                  <User className="w-5 h-5 text-slate-500" />
                  <h3 className="text-lg font-bold uppercase">
                    {resultado.perfil.nombre}
                  </h3>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600 ml-7">
                  <MapPin className="w-4 h-4" />
                  <span>
                    {resultado.perfil.domicilio}
                    {resultado.perfil.localidad
                      ? `, ${resultado.perfil.localidad}`
                      : ""}
                    {resultado.perfil.provincia
                      ? ` (${resultado.perfil.provincia})`
                      : ""}
                  </span>
                </div>
                <div className="ml-7 flex gap-2 mt-1">
                  {resultado.perfil.esMonotributo && (
                    <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded">
                      Monotributista
                    </span>
                  )}
                  {resultado.perfil.esEmpleador && (
                    <span className="bg-purple-100 text-purple-800 text-xs font-bold px-2 py-1 rounded">
                      Empleador
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* 2. Banner de Decisión BCRA */}
            <div
              className={`p-5 rounded-lg border-2 ${resultado.aptoAgencia ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
            >
              <div className="flex items-center gap-3 mb-2">
                {resultado.aptoAgencia ? (
                  <ShieldCheck className="w-8 h-8 text-green-600" />
                ) : (
                  <ShieldAlert className="w-8 h-8 text-red-600" />
                )}
                <h3
                  className={`text-lg font-bold ${resultado.aptoAgencia ? "text-green-800" : "text-red-800"}`}
                >
                  {resultado.aptoAgencia
                    ? "APTO FINANCIACIÓN AGENCIA"
                    : "SOLO CRÉDITO PRENDARIO"}
                </h3>
              </div>
              <p className="font-medium text-gray-800">{resultado.mensaje}</p>
            </div>

            {/* 3. Desglose de Deudas */}
            {resultado.detalles && resultado.detalles.length > 0 && (
              <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                <div className="bg-gray-100 px-4 py-3 flex justify-between items-center border-b border-gray-200">
                  <h4 className="font-bold text-gray-800 flex items-center gap-2">
                    <Info className="w-4 h-4 text-blue-600" />
                    Deudas Activas
                  </h4>
                  <span className="text-sm font-bold text-gray-600">
                    Total: {formatearMoneda(resultado.deudaTotal)}
                  </span>
                </div>
                <div className="divide-y divide-gray-100">
                  {resultado.detalles.map((deuda, idx) => (
                    <div
                      key={idx}
                      className="p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-semibold text-gray-900">
                          {deuda.entidad}
                        </span>
                        <span className="font-bold text-gray-900 text-lg">
                          {formatearMoneda(deuda.monto)}
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-y-1 gap-x-4 mt-2">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-bold rounded-md w-fit ${deuda.situacion === 1 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                        >
                          Situación {deuda.situacion}
                        </span>
                        <span className="text-sm text-gray-600 flex items-center">
                          {deuda.descripcionSituacion}
                        </span>
                      </div>
                      {(deuda.diasAtraso > 0 || deuda.procesoJudicial) && (
                        <div className="mt-3 flex gap-2">
                          {deuda.diasAtraso > 0 && (
                            <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded border border-orange-200">
                              Mora: {deuda.diasAtraso} días
                            </span>
                          )}
                          {deuda.procesoJudicial && (
                            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded border border-red-200 font-bold">
                              En Proceso Judicial
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Desglose de Cheques Rechazados */}
            {resultado.cheques && resultado.cheques.length > 0 && (
              <div className="border border-red-200 rounded-lg overflow-hidden bg-white mt-4">
                <div className="bg-red-50 px-4 py-3 flex items-center gap-2 border-b border-red-200">
                  <FileX2 className="w-5 h-5 text-red-600" />
                  <h4 className="font-bold text-red-800">
                    Historial de Cheques Rechazados
                  </h4>
                </div>
                <div className="divide-y divide-gray-100">
                  {resultado.cheques.map((cheque, idx) => (
                    <div
                      key={idx}
                      className="p-4 hover:bg-red-50 transition-colors"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-gray-900 uppercase text-sm">
                          Motivo: {cheque.motivo}
                        </span>
                        <span className="font-bold text-red-700 text-lg">
                          {formatearMoneda(cheque.monto)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 font-medium mt-1">
                        Cantidad de cheques informados:{" "}
                        <span className="font-bold text-gray-900">
                          {cheque.cantidad}
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
