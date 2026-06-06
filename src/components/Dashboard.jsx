import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input"; // Importamos Input para las fechas
import {
  ArrowDownRight,
  ArrowUpRight,
  Car,
  DollarSign,
  FilterX,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORES_MARCAS = [
  "#dc2626",
  "#2563eb",
  "#16a34a",
  "#ca8a04",
  "#9333ea",
  "#0891b2",
  "#ea580c",
  "#475569",
];

export default function Dashboard() {
  const [operacionesRaw, setOperacionesRaw] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estado de los filtros actualizado
  const [filtros, setFiltros] = useState({
    fechaDesde: "",
    fechaHasta: "",
    tipo: "todos",
    marca: "todas",
    formaPago: "todas",
  });

  useEffect(() => {
    fetchOperaciones();
  }, []);

  const fetchOperaciones = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("operaciones")
        .select(
          `
          id, tipo, monto, forma_pago, fecha_firma, estado,
          vehiculos (dominio, marca, modelo, tipo)
        `,
        )
        .order("fecha_firma", { ascending: false });

      if (error) throw error;
      setOperacionesRaw(data || []);
    } catch (error) {
      console.error("Error obteniendo datos:", error);
    } finally {
      setLoading(false);
    }
  };

  // Función para eliminar operación
  const handleEliminarOperacion = async (id) => {
    if (
      !window.confirm(
        "¿Estás seguro de que querés eliminar esta operación? Esta acción no se puede deshacer.",
      )
    ) {
      return;
    }

    try {
      const { error } = await supabase
        .from("operaciones")
        .delete()
        .eq("id", id);

      if (error) throw error;

      // Actualizar el estado local removiendo la operación eliminada
      setOperacionesRaw((prev) => prev.filter((op) => op.id !== id));
    } catch (error) {
      console.error("Error eliminando operación:", error);
      alert("No se pudo eliminar la operación. Intente nuevamente.");
    }
  };

  const marcasDisponibles = useMemo(() => {
    const marcas = operacionesRaw
      .map((op) => op.vehiculos?.marca)
      .filter(Boolean);
    return [...new Set(marcas)].sort();
  }, [operacionesRaw]);

  const formasPagoDisponibles = useMemo(() => {
    const formas = operacionesRaw.map((op) => op.forma_pago).filter(Boolean);
    return [...new Set(formas)].sort();
  }, [operacionesRaw]);

  // Aplicación de filtros
  //
  // Aplicación de filtros en memoria (ultrarrápido)
  const operacionesFiltradas = useMemo(() => {
    return operacionesRaw.filter((op) => {
      if (!op.fecha_firma) return false;

      // Supabase devuelve "YYYY-MM-DD" (o "YYYY-MM-DDTHH..."). Nos quedamos con la fecha pura.
      const fechaOpStr = op.fecha_firma.split("T")[0];

      // Ambos filtros vienen del <input type="date"> en formato "YYYY-MM-DD"
      // La comparación de strings directa funciona a la perfección.
      if (filtros.fechaDesde && fechaOpStr < filtros.fechaDesde) return false;
      if (filtros.fechaHasta && fechaOpStr > filtros.fechaHasta) return false;

      // Resto de los filtros
      if (filtros.tipo !== "todos" && op.tipo !== filtros.tipo) return false;
      if (filtros.marca !== "todas" && op.vehiculos?.marca !== filtros.marca)
        return false;
      if (filtros.formaPago !== "todas" && op.forma_pago !== filtros.formaPago)
        return false;

      return true;
    });
  }, [operacionesRaw, filtros]);
  // Cálculos de KPIs
  const totalVentas = operacionesFiltradas
    .filter((op) => op.tipo === "venta")
    .reduce((acc, op) => acc + op.monto, 0);
  const totalCompras = operacionesFiltradas
    .filter((op) => op.tipo === "compra")
    .reduce((acc, op) => acc + op.monto, 0);
  const totalConsignaciones = operacionesFiltradas.filter(
    (op) => op.tipo === "consignacion",
  ).length;
  const balance = totalVentas - totalCompras;

  // Datos para Gráfico de Barras
  const datosGraficoBarras = useMemo(() => {
    const agrupado = operacionesFiltradas.reduce((acc, op) => {
      if (op.tipo === "consignacion") return acc;

      const mesAnio = new Date(op.fecha_firma).toLocaleDateString("es-AR", {
        month: "short",
        year: "numeric",
      });

      if (!acc[mesAnio])
        acc[mesAnio] = { name: mesAnio, Ingresos: 0, Egresos: 0 };

      if (op.tipo === "venta") acc[mesAnio].Ingresos += op.monto;
      if (op.tipo === "compra") acc[mesAnio].Egresos += op.monto;

      return acc;
    }, {});

    return Object.values(agrupado).sort((a, b) => {
      const [mesA, anoA] = a.name.split(" ");
      const [mesB, anoB] = b.name.split(" ");
      return new Date(`${mesA} 1, ${anoA}`) - new Date(`${mesB} 1, ${anoB}`);
    });
  }, [operacionesFiltradas]);

  // Datos para Gráfico de Torta
  const datosGraficoTorta = useMemo(() => {
    const agrupado = operacionesFiltradas.reduce((acc, op) => {
      const marca = op.vehiculos?.marca || "Desconocida";
      acc[marca] = (acc[marca] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(agrupado).map((marca) => ({
      name: marca,
      value: agrupado[marca],
    }));
  }, [operacionesFiltradas]);

  const formatearMoneda = (monto) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(monto);

  const actualizarFiltro = (clave, valor) =>
    setFiltros((prev) => ({ ...prev, [clave]: valor }));

  const limpiarFiltros = () =>
    setFiltros({
      fechaDesde: "",
      fechaHasta: "",
      tipo: "todos",
      marca: "todas",
      formaPago: "todas",
    });

  if (loading)
    return (
      <div className="p-8 text-center font-medium text-gray-500">
        Cargando métricas...
      </div>
    );

  return (
    <div className="p-4 sm:p-8 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Dashboard Analítico
        </h2>
        <Button
          variant="outline"
          onClick={limpiarFiltros}
          className="text-gray-500 hover:text-red-600"
        >
          <FilterX className="w-4 h-4 mr-2" /> Limpiar Filtros
        </Button>
      </div>

      {/* BARRA DE FILTROS - Ahora con 5 columnas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-500 uppercase">
            Desde
          </label>
          <Input
            type="date"
            value={filtros.fechaDesde}
            onChange={(e) => actualizarFiltro("fechaDesde", e.target.value)}
            className="bg-gray-50 text-sm focus-visible:ring-red-600"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-500 uppercase">
            Hasta
          </label>
          <Input
            type="date"
            value={filtros.fechaHasta}
            onChange={(e) => actualizarFiltro("fechaHasta", e.target.value)}
            className="bg-gray-50 text-sm focus-visible:ring-red-600"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-500 uppercase">
            Operación
          </label>
          <Select
            value={filtros.tipo}
            onValueChange={(v) => actualizarFiltro("tipo", v)}
          >
            <SelectTrigger className="bg-gray-50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todas</SelectItem>
              <SelectItem value="compra">Compras</SelectItem>
              <SelectItem value="venta">Ventas</SelectItem>
              <SelectItem value="consignacion">Consignaciones</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-500 uppercase">
            Marca
          </label>
          <Select
            value={filtros.marca}
            onValueChange={(v) => actualizarFiltro("marca", v)}
          >
            <SelectTrigger className="bg-gray-50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas</SelectItem>
              {marcasDisponibles.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-500 uppercase">
            Forma de Pago
          </label>
          <Select
            value={filtros.formaPago}
            onValueChange={(v) => actualizarFiltro("formaPago", v)}
          >
            <SelectTrigger className="bg-gray-50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas</SelectItem>
              {formasPagoDisponibles.map((f) => (
                <SelectItem key={f} value={f}>
                  {f}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* TARJETAS DE MÉTRICAS (KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-sm border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Ventas Totales
            </CardTitle>
            <ArrowUpRight className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {formatearMoneda(totalVentas)}
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Compras (Inversión)
            </CardTitle>
            <ArrowDownRight className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {formatearMoneda(totalCompras)}
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Flujo / Balance
            </CardTitle>
            <DollarSign
              className={`h-4 w-4 ${balance >= 0 ? "text-green-600" : "text-red-600"}`}
            />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${balance >= 0 ? "text-green-600" : "text-red-600"}`}
            >
              {formatearMoneda(balance)}
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Unidades Operadas
            </CardTitle>
            <Car className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {operacionesFiltradas.length}{" "}
              <span className="text-sm font-normal text-gray-500">
                vehículos
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {totalConsignaciones} en consignación
            </p>
          </CardContent>
        </Card>
      </div>

      {/* GRÁFICOS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="shadow-sm border-gray-200 lg:col-span-2">
          <CardHeader>
            <CardTitle>Flujo de Caja Mensual</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            {datosGraficoBarras.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={datosGraficoBarras}
                  margin={{ top: 10, right: 10, left: 20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e5e7eb"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6b7280", fontSize: 12 }}
                  />
                  <YAxis
                    tickFormatter={(val) => `$${val / 1000000}M`}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6b7280", fontSize: 12 }}
                  />
                  <RechartsTooltip
                    formatter={(value) => formatearMoneda(value)}
                    cursor={{ fill: "#f3f4f6" }}
                  />
                  <Legend iconType="circle" />
                  <Bar
                    dataKey="Ingresos"
                    fill="#16a34a"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={50}
                  />
                  <Bar
                    dataKey="Egresos"
                    fill="#dc2626"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={50}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-gray-500">
                No hay datos de flujo para estos filtros.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm border-gray-200">
          <CardHeader>
            <CardTitle>Distribución por Marca</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            {datosGraficoTorta.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={datosGraficoTorta}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {datosGraficoTorta.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORES_MARCAS[index % COLORES_MARCAS.length]}
                      />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-gray-500">
                No hay datos de marcas para estos filtros.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* TABLA DETALLADA */}
      <Card className="shadow-sm border-gray-200 bg-white">
        <CardHeader>
          <CardTitle>
            Detalle de Operaciones ({operacionesFiltradas.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Vehículo</TableHead>
                <TableHead>Forma Pago</TableHead>
                <TableHead className="text-right">Monto</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {operacionesFiltradas.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-gray-500 py-6"
                  >
                    No se encontraron operaciones con los filtros actuales.
                  </TableCell>
                </TableRow>
              ) : (
                operacionesFiltradas.map((op) => (
                  <TableRow key={op.id}>
                    <TableCell className="text-gray-600">
                      {new Date(op.fecha_firma).toLocaleDateString("es-AR")}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                          op.tipo === "venta"
                            ? "bg-green-100 text-green-800"
                            : op.tipo === "compra"
                              ? "bg-red-100 text-red-800"
                              : "bg-orange-100 text-orange-800"
                        }`}
                      >
                        {op.tipo}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium text-gray-900">
                      {op.vehiculos?.marca} {op.vehiculos?.modelo}{" "}
                      <span className="text-gray-400 font-normal">
                        | {op.vehiculos?.dominio}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-600 capitalize">
                      {op.forma_pago || "-"}
                    </TableCell>
                    <TableCell className="text-right font-bold text-gray-900">
                      {op.tipo === "consignacion"
                        ? "-"
                        : formatearMoneda(op.monto)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleEliminarOperacion(op.id)}
                        title="Eliminar operación"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
