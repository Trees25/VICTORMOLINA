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
{
  /*FUNCION VIEJA
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
          observaciones: data.observacionesAuto,
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
    const partes = [];
    let otras_obs = "";

    if (tipoOperacion === "compra") {
      if (data.obs2) partes.push(` ${data.obsExterior}`);
      if (data.obs3) partes.push(` ${data.obsInterior}`);
      if (data.obs4) partes.push(` ${data.obsMecanica}`);

      // Sobrescribimos el campo general con los datos unidos
      otras_obs =
        partes.length > 0
          ? partes.join(" | ")
          : "Sin observaciones particulares.";
    } else {
      otras_obs = "Sin observaciones particulares";
    }

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
      otras_observaciones: otras_obs,
    });

    if (errOperacion) throw errOperacion;

    console.log("Operación guardada con éxito en Supabase");
  } catch (error) {
    console.error("Error en la base de datos:", error);
    throw error;
  }
}*/
}

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
          anio: data.vehiculoAnio ? parseInt(data.vehiculoAnio) : null,
          motor: data.vehiculoMotor,
          chasis: data.vehiculoChasis,
          inscripcion_inicial: data.vehiculoInsc || null,
          observaciones: data.observacionesAuto || data.vehiculoDetalles || "",
        },
        { onConflict: "dominio" },
      )
      .select("id")
      .single();

    if (errVehiculo) throw errVehiculo;

    let vendedorId = null;
    let compradorId = null;

    // 2. Mapeo de Clientes según Tipo de Operación
    if (tipoOperacion === "consignacion") {
      const cuilLimpio = data.clienteCuil?.replace(/\D/g, "") || "";
      // Extrae los 8 dígitos centrales del DNI si es un CUIL válido de 11 números
      const dniCalculado =
        cuilLimpio.length === 11 ? cuilLimpio.substring(2, 10) : cuilLimpio;

      if (dniCalculado) {
        const { data: cliente, error: errCliente } = await supabase
          .from("clientes")
          .upsert(
            {
              dni: dniCalculado,
              nombre_completo: data.clienteNombre,
              cuil: data.clienteCuil,
            },
            { onConflict: "dni" },
          )
          .select("id")
          .single();

        if (errCliente) throw errCliente;
        vendedorId = cliente.id;
      }
    } else {
      // Flujo tradicional para Compra o Venta
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
              fecha_nacimiento: formatearFechaSQL(data.fechaNac) || null,
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
    }

    // 3. Determinación de Montos y Observaciones Dinámicas
    let otras_obs = "";
    let montoFinal = 0;

    if (tipoOperacion === "compra") {
      const partes = [];
      if (data.obs2) partes.push(data.obs2);
      if (data.obs3) partes.push(data.obs3);
      if (data.obs4) partes.push(data.obs4);
      otras_obs =
        partes.length > 0
          ? partes.join(" | ")
          : "Sin observaciones particulares.";
      montoFinal = parseFloat(data.precio?.toString().replace(/\D/g, "") || 0);
    } else if (tipoOperacion === "consignacion") {
      otras_obs = data.vehiculoDetalles || "Sin detalles particulares.";
      montoFinal = parseFloat(
        data.clienteAbonar?.toString().replace(/\D/g, "") || 0,
      );
    } else {
      otras_obs = "Sin observaciones particulares";
      montoFinal = parseFloat(data.precio?.toString().replace(/\D/g, "") || 0);
    }

    // 4. Formatear Fecha SQL (YYYY-MM-DD)
    const anioFirma = data.firmaAnio || "2026";
    const mesFirma = data.firmaMes
      ? String(data.firmaMes).padStart(2, "0")
      : "01";
    const diaFirma = data.firmaDia
      ? String(data.firmaDia).padStart(2, "0")
      : "01";

    // 5. Insertar Registro en la base de datos
    const { error: errOperacion } = await supabase.from("operaciones").insert({
      tipo: tipoOperacion, // Asegurá que 'consignacion' esté mapeado en tu enum de la BD
      vehiculo_id: vehiculo.id,
      vendedor_id: vendedorId,
      comprador_id: compradorId,
      monto: montoFinal,
      forma_pago:
        data.formaPago ||
        (tipoOperacion === "consignacion" ? "Contrato de Consignación" : null),
      gastos_transferencia: parseFloat(
        data.gastoTransferencia?.toString().replace(/\D/g, "") || 0,
      ),
      fecha_firma: `${anioFirma}-${mesFirma}-${diaFirma}`,
      observaciones: data.observaciones || "",
      otras_observaciones: otras_obs,
    });

    if (errOperacion) throw errOperacion;

    console.log(`Operación de tipo [${tipoOperacion}] guardada exitosamente.`);
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

    // 3. Insertar Pagaré
    const { error: errPagare } = await supabase.from("pagares").insert({
      cliente_id: clienteId,
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
