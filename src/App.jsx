import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase"; // Asegurate de que esta ruta apunte a tu cliente de Supabase
import FormBoletoCompraVenta from "./components/FormBoletoCompraVenta.jsx";
import Dashboard from "./components/Dashboard.jsx";
import Login from "./components/Login.jsx"; // Importamos el nuevo componente
import { Button } from "@/components/ui/button";
import logoAgencia from "@/assets/logo.jpeg";

function App() {
  const [session, setSession] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [activeTab, setActiveTab] = useState("compra");

  // Escuchar el estado de autenticación
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoadingAuth(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // 1. Pantalla de carga mientras verifica la sesión
  if (loadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500 font-medium">
        Cargando sistema...
      </div>
    );
  }

  // 2. Si no hay sesión, mostramos la pantalla de Login
  if (!session) {
    return <Login />;
  }

  // 3. Si hay sesión, mostramos el sistema principal
  return (
    <div className="min-h-screen bg-gray-50 text-black p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
        {/* HEADER CON LOGO Y BOTÓN DE SALIR */}
        <header className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 sm:gap-6 border-b-4 border-red-600 pb-6 bg-white p-4 sm:p-6 rounded-lg shadow-sm">
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-6">
            {/* Si el logo no carga, se mostrará este cuadro gris temporalmente */}
            <img
              src={logoAgencia}
              alt="Victor Molina Automotores"
              className="h-16 sm:h-20 w-auto object-contain bg-gray-100 rounded"
            />
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-black">
                Generador de Documentos{" "}
                <span className="text-red-600">VICTOR MOLINA</span>
              </h1>
              <p className="text-gray-600 mt-1 font-medium text-sm sm:text-base">
                Seleccione el formulario que desea completar.
              </p>
            </div>
          </div>

          {/* Botón de Cerrar Sesión */}
          <Button
            variant="outline"
            onClick={handleLogout}
            className="border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-red-600"
          >
            Cerrar sesión
          </Button>
        </header>

        {/* NAVEGACIÓN CON COLORES INSTITUCIONALES */}
        <nav className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
          <Button
            className={
              activeTab === "compra"
                ? "bg-red-600 hover:bg-red-700 text-white font-bold shadow-md w-full sm:w-auto"
                : "bg-white text-black border-2 border-gray-300 hover:border-red-600 hover:text-red-600 w-full sm:w-auto"
            }
            onClick={() => setActiveTab("compra")}
          >
            Boleto de Compra
          </Button>
          <Button
            className={
              activeTab === "venta"
                ? "bg-red-600 hover:bg-red-700 text-white font-bold shadow-md w-full sm:w-auto"
                : "bg-white text-black border-2 border-gray-300 hover:border-red-600 hover:text-red-600 w-full sm:w-auto"
            }
            onClick={() => setActiveTab("venta")}
          >
            Boleto de Venta
          </Button>
          <Button
            className={
              activeTab === "consignacion"
                ? "bg-red-600 hover:bg-red-700 text-white font-bold shadow-md w-full sm:w-auto"
                : "bg-white text-black border-2 border-gray-300 hover:border-red-600 hover:text-red-600 w-full sm:w-auto"
            }
            onClick={() => setActiveTab("consignacion")}
          >
            Boleto de consignacion
          </Button>
          <Button
            className={
              activeTab === "dashboard"
                ? "bg-red-600 hover:bg-red-700 text-white font-bold shadow-md w-full sm:w-auto"
                : "bg-white text-black border-2 border-gray-300 hover:border-red-600 hover:text-red-600 w-full sm:w-auto"
            }
            onClick={() => setActiveTab("dashboard")}
          >
            Dashboard
          </Button>
        </nav>

        <main>
          {activeTab === "compra" && <FormBoletoCompraVenta tipo="compra" />}
          {activeTab === "venta" && <FormBoletoCompraVenta tipo="venta" />}
          {activeTab === "consignacion" && (
            <FormBoletoCompraVenta tipo="consignacion" />
          )}
          {activeTab === "dashboard" && <Dashboard />}
        </main>
      </div>
    </div>
  );
}

export default App;
