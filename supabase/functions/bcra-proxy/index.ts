import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // Manejo del preflight de CORS para el navegador
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { cuil } = await req.json();

    if (!cuil) {
      return new Response(JSON.stringify({ error: "CUIL requerido" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // URLs de las 3 fuentes de datos
    const bcraDeudasUrl = `https://api.bcra.gob.ar/centraldedeudores/v1.0/Deudas/${cuil}`;
    const bcraChequesUrl = `https://api.bcra.gob.ar/centraldedeudores/v1.0/Deudas/ChequesRechazados/${cuil}`;
    const afipUrl = `https://afip.tangofactura.com/Rest/GetContribuyenteFull?cuit=${cuil}`;

    // Ejecutamos las 3 peticiones en paralelo para que la respuesta sea instantánea
    const [resDeudas, resCheques, resAfip] = await Promise.all([
      fetch(bcraDeudasUrl),
      fetch(bcraChequesUrl),
      fetch(afipUrl, {
        headers: {
          // Camuflaje: Le decimos a la API que somos Google Chrome, no un servidor
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept: "application/json, text/plain, */*",
        },
      }),
    ]);

    // Parseamos las respuestas (si es 404, res.ok es false y queda en null)
    const dataDeudas = resDeudas.ok ? await resDeudas.json() : null;
    const dataCheques = resCheques.ok ? await resCheques.json() : null;

    let dataAfip = null;
    if (resAfip.ok) {
      try {
        const afipJson = await resAfip.json();
        // Verificamos que la API no haya devuelto un error interno en formato JSON
        if (!afipJson.errorContribuyente) {
          dataAfip = afipJson;
        }
      } catch (e) {
        console.error("Error leyendo JSON de AFIP:", e);
      }
    }

    // PLAN B: Respaldo infalible para el nombre desde la base del BCRA
    let nombreRespaldo = null;
    if (dataDeudas?.results?.denominacion) {
      nombreRespaldo = dataDeudas.results.denominacion;
    } else if (dataCheques?.results?.denominacion) {
      nombreRespaldo = dataCheques.results.denominacion;
    }

    // Empaquetamos todo y lo mandamos al frontend
    return new Response(
      JSON.stringify({
        status: 200,
        deudas: dataDeudas,
        cheques: dataCheques,
        afip: dataAfip,
        nombreRespaldo: nombreRespaldo,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
