import { useState } from "react";
import { Search, ShieldCheck, ShieldAlert, Building } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "../lib/supabase.js";
export default function HistorialCrediticio() {
  const [cuil, setCuil] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState("");

  // Asegurate de tener importado supabase al principio del archivo
  // import { supabase } from "@/lib/supabase";

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
      // Llamada directa a tu propia Edge Function en Supabase
      const { data: response, error: funcError } =
        await supabase.functions.invoke("bcra-proxy", {
          body: { cuil: cuilLimpio },
        });

      if (funcError) throw funcError;

      // Evaluamos la respuesta estructurada desde tu Edge Function
      if (response.status === 404) {
        setResultado({
          estado: "LIMPIO",
          mensaje:
            "Sin deudas activas en el sistema. Apto para financiación propia.",
          aptoAgencia: true,
        });
        return;
      }

      const bcraData = response.data;
      let peorSituacion = 1;
      let totalDeuda = 0;
      let entidades = [];

      if (
        bcraData.results &&
        bcraData.results.periodos &&
        bcraData.results.periodos.length > 0
      ) {
        const ultimoPeriodo = bcraData.results.periodos[0];

        ultimoPeriodo.entidades.forEach((ent) => {
          if (ent.situacion > peorSituacion) peorSituacion = ent.situacion;
          totalDeuda += ent.monto;
          entidades.push(`${ent.entidad} (Sit. ${ent.situacion})`);
        });
      }

      if (peorSituacion === 1) {
        setResultado({
          estado: "SITUACION_1",
          mensaje: "Cliente en Situación 1 (Normal). Paga al día.",
          deuda: totalDeuda,
          entidades: entidades,
          aptoAgencia: true,
        });
      } else {
        setResultado({
          estado: "RIESGO",
          mensaje: `Riesgo detectado: Situación ${peorSituacion}.`,
          deuda: totalDeuda,
          entidades: entidades,
          aptoAgencia: false,
        });
      }
    } catch (err) {
      console.error(err);
      setError("Hubo un error al consultar el BCRA. Intentá nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-lg shadow-lg border-gray-200">
      <CardHeader className="bg-gray-50 border-b">
        <CardTitle className="text-xl flex items-center gap-2 text-gray-800">
          <Building className="text-blue-600" />
          Verificador Crediticio (BCRA)
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
            Ingrese CUIT o CUIL
          </label>

          {/* SOLUCIÓN BOTÓN FANTASMA */}
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
          <div
            className={`p-5 rounded-lg border-2 ${
              resultado.aptoAgencia
                ? "bg-green-50 border-green-200"
                : "bg-red-50 border-red-200"
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              {resultado.aptoAgencia ? (
                <ShieldCheck className="w-8 h-8 text-green-600" />
              ) : (
                <ShieldAlert className="w-8 h-8 text-red-600" />
              )}
              <h3
                className={`text-lg font-bold ${
                  resultado.aptoAgencia ? "text-green-800" : "text-red-800"
                }`}
              >
                {resultado.aptoAgencia
                  ? "APTO FINANCIACIÓN AGENCIA"
                  : "SOLO CRÉDITO PRENDARIO"}
              </h3>
            </div>

            <p className="font-medium text-gray-800 mb-2">
              {resultado.mensaje}
            </p>

            {resultado.entidades && resultado.entidades.length > 0 && (
              <div className="mt-4 text-sm bg-white p-3 rounded border">
                <p className="font-semibold text-gray-500 uppercase text-xs mb-2">
                  Entidades informantes:
                </p>
                <ul className="list-disc pl-5 text-gray-700 space-y-1">
                  {resultado.entidades.map((ent, idx) => (
                    <li key={idx}>{ent}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
