import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // Manejo de la petición OPTIONS para los navegadores (CORS Preflight)
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

    const bcraUrl = `https://api.bcra.gob.ar/centraldedeudores/v1.0/Deudas/${cuil}`;
    const bcraResponse = await fetch(bcraUrl);

    // El BCRA devuelve 404 cuando la persona NO tiene deudas registradas
    if (bcraResponse.status === 404) {
      return new Response(
        JSON.stringify({ status: 404, message: "Sin deudas activas" }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    if (!bcraResponse.ok) {
      throw new Error(`Error del BCRA: ${bcraResponse.status}`);
    }

    const data = await bcraResponse.json();

    return new Response(JSON.stringify({ status: 200, data }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
