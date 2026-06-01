// src/lib/db.js
import { supabase } from "@/lib/supabase";

// Convierte "DD/MM/YYYY" o "DD-MM-YYYY" a "YYYY-MM-DD"
const formatearFechaSQL = (fechaStr) => {
  if (!fechaStr) return null;
  const partes = fechaStr.split(/[-/]/);
  if (partes.length === 3) {
    return `${partes[2]}-${partes[1]}-${partes[0]}`;
  }
  return null;
};

export async function guardarOperacionEnBD(data, tipoOperacion) {
  try {
    // 1. Crear o Actualizar Vehículo
    const { data: vehiculo, error: errVehiculo } = await supabase
      .from("vehiculos")
      .upsert(
        {
          dominio: data.vehiculoDominio,
          marca: data.vehiculoMarca,
          modelo: data.vehiculoModelo,
          tipo: data.vehiculoTipo,
          anio: parseInt(data.vehiculoAnio),
          motor: data.vehiculoMotor,
          chasis: data.vehiculoChasis,
          inscripcion_inicial: data.vehiculoInsc,
        },
        { onConflict: "dominio" },
      )
      .select("id")
      .single();

    if (errVehiculo) throw errVehiculo;

    // 2. Crear o Actualizar Vendedor
    let vendedorId = null;
    if (data.vendedorDni) {
      const { data: vendedor, error: errVendedor } = await supabase
        .from("clientes")
        .upsert(
          {
            dni: data.vendedorDni,
            nombre_completo: data.vendedorNombre,
            domicilio: data.vendedorDomicilio,
            localidad: data.vendedorLocalidad,
            telefono: data.vendedorTel,
          },
          { onConflict: "dni" },
        )
        .select("id")
        .single();

      if (errVendedor) throw errVendedor;
      vendedorId = vendedor.id;
    }

    // 3. Crear o Actualizar Comprador
    let compradorId = null;
    if (data.compradorDni) {
      const { data: comprador, error: errComprador } = await supabase
        .from("clientes")
        .upsert(
          {
            dni: data.compradorDni,
            nombre_completo: data.compradorNombre,
            domicilio: data.compradorDomicilio,
            localidad: data.compradorLocalidad,
            telefono: data.compradorTel,
            cuil: data.cuil,
            // ACÁ SE APLICA LA CORRECCIÓN:
            fecha_nacimiento: formatearFechaSQL(data.fechaNac),
            ocupacion: data.ocupacion,
            conyuge_nombre: data.conyuge,
            conyuge_dni: data.dniConyuge,
            email: data.correo,
          },
          { onConflict: "dni" },
        )
        .select("id")
        .single();

      if (errComprador) throw errComprador;
      compradorId = comprador.id;
    }

    // 4. Crear la Operación
    const { error: errOperacion } = await supabase.from("operaciones").insert({
      tipo: tipoOperacion,
      vehiculo_id: vehiculo.id,
      vendedor_id: vendedorId,
      comprador_id: compradorId,
      monto: parseFloat(data.precio?.replace(/\D/g, "") || 0),
      forma_pago: data.formaPago,
      gastos_transferencia: parseFloat(
        data.gastoTransferencia?.replace(/\D/g, "") || 0,
      ),
      fecha_firma: `2026-${data.firmaMes.padStart(2, "0")}-${data.firmaDia.padStart(2, "0")}`,
      observaciones: data.observaciones,
    });

    if (errOperacion) throw errOperacion;

    console.log("Operación guardada con éxito en Supabase");
  } catch (error) {
    console.error("Error en la base de datos:", error);
    throw error;
  }
}
