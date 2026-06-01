import { useState, useEffect } from "react";
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
import { ArrowDownRight, ArrowUpRight, Car, DollarSign } from "lucide-react";

export default function Dashboard() {
  const [operaciones, setOperaciones] = useState([]);
  const [filtro, setFiltro] = useState("todo"); // 'todo', 'mes', 'semana'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOperaciones();
  }, [filtro]);

  const fetchOperaciones = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("operaciones")
        .select(
          `
          id, tipo, monto, fecha_firma, estado,
          vehiculos (dominio, marca, modelo)
        `,
        )
        .order("fecha_firma", { ascending: false });

      // Lógica de filtrado de fechas
      if (filtro !== "todo") {
        const fechaLimite = new Date();
        if (filtro === "mes") fechaLimite.setMonth(fechaLimite.getMonth() - 1);
        if (filtro === "semana") fechaLimite.setDate(fechaLimite.getDate() - 7);

        query = query.gte(
          "fecha_firma",
          fechaLimite.toISOString().split("T")[0],
        );
      }

      const { data, error } = await query;
      if (error) throw error;
      setOperaciones(data);
    } catch (error) {
      console.error("Error obteniendo datos:", error);
    } finally {
      setLoading(false);
    }
  };

  // Cálculos
  const totalVentas = operaciones
    .filter((op) => op.tipo === "venta")
    .reduce((acc, op) => acc + op.monto, 0);
  const totalCompras = operaciones
    .filter((op) => op.tipo === "compra")
    .reduce((acc, op) => acc + op.monto, 0);
  const totalConsignaciones = operaciones.filter(
    (op) => op.tipo === "consignacion",
  ).length;
  const balance = totalVentas - totalCompras;

  const formatearMoneda = (monto) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(monto);

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">Dashboard General</h2>
        <div className="w-48">
          <Select value={filtro} onValueChange={setFiltro}>
            <SelectTrigger className="bg-white border-gray-300">
              <SelectValue placeholder="Filtrar por fecha" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todo">Todo el tiempo</SelectItem>
              <SelectItem value="mes">Últimos 30 días</SelectItem>
              <SelectItem value="semana">Últimos 7 días</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tarjetas de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-sm border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Ingresos (Ventas)
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
              Egresos (Compras)
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
            <DollarSign className="h-4 w-4 text-blue-600" />
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
              Consignaciones Activas
            </CardTitle>
            <Car className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {totalConsignaciones}{" "}
              <span className="text-sm font-normal text-gray-500">
                unidades
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de Últimas Operaciones */}
      <Card className="shadow-sm border-gray-200 bg-white">
        <CardHeader>
          <CardTitle>Últimas Operaciones</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4 text-gray-500">
              Cargando datos...
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Vehículo</TableHead>
                  <TableHead className="text-right">Monto</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {operaciones.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center text-gray-500"
                    >
                      No hay operaciones registradas.
                    </TableCell>
                  </TableRow>
                ) : (
                  operaciones.slice(0, 10).map((op) => (
                    <TableRow key={op.id}>
                      <TableCell>
                        {new Date(op.fecha_firma).toLocaleDateString("es-AR")}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold uppercase ${
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
                      <TableCell className="font-medium">
                        {op.vehiculos?.marca} {op.vehiculos?.modelo} -{" "}
                        {op.vehiculos?.dominio}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {op.tipo === "consignacion"
                          ? "-"
                          : formatearMoneda(op.monto)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
