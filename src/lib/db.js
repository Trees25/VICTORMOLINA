// src/lib/db.js
import { supabase } from "@/lib/supabase";
import { numeroALetras } from "@/lib/numeros";
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
export async function guardarPagareEnBD(datos) {
  try {
    // 1. Crear o Actualizar Cliente (Deudor)
    let clienteId = null;
    if (datos.clienteDni) {
      const { data: cliente, error: errCliente } = await supabase
        .from("clientes")
        .upsert(
          {
            dni: datos.clienteDni,
            nombre_completo: datos.clienteNombre,
            domicilio: datos.clienteDomicilio,
            localidad: datos.clienteLocalidad,
            telefono: datos.clienteTel,
          },
          { onConflict: "dni" },
        )
        .select("id")
        .single();

      if (errCliente) throw errCliente;
      clienteId = cliente.id;
    } else {
      throw new Error(
        "El DNI del cliente es obligatorio para registrar la deuda.",
      );
    }

    // 2. Limpiar variables numéricas
    const montoLimpio = parseFloat(String(datos.monto).replace(/\D/g, "") || 0);
    const nroCuota = parseInt(datos.numeroCuotaPaga || 1);
    const totalCuotas = parseInt(datos.numeroCuotas || 1);
    if (nroCuota > totalCuotas) {
      alert("no coincide el nro de cuota con la cantidad");
      return false;
    }
    // 1. Evaluás la lógica antes
    let estadoDefinitivo = "pendiente";

    if (datos.numeroCuotaPaga === datos.numeroCuotas) {
      estadoDefinitivo = "pagado";
    } else if (datos.numeroCuotas > datos.numeroCuotaPaga) {
      estadoDefinitivo = "pendiente";
    }

    // 3. Insertar Pagaré
    const { error: errPagare } = await supabase.from("pagares").insert({
      cliente_id: clienteId,
      nro_cuota: nroCuota,
      total_cuotas: totalCuotas,
      monto: montoLimpio,
      monto_letras: numeroALetras(montoLimpio),
      fecha_emision: new Date().toISOString().split("T")[0], // Fecha actual (YYYY-MM-DD)
      fecha_vencimiento: `${datos.añoVencimiento || "2026"}-${String(datos.mesVencimiento).padStart(2, "0")}-${String(datos.diaVencimiento).padStart(2, "0")}`,
      beneficiario: datos.recibeNombreCompleto || "Victor Molina",
      concepto_valor: "Vehículo",
      lugar_pago: "San Juan",
      estado: estadoDefinitivo,
    });

    if (errPagare) throw errPagare;

    console.log("Pagaré guardado con éxito en Supabase");
  } catch (error) {
    console.error("Error guardando pagaré:", error);
    throw error;
  }
}
