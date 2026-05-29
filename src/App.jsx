import { useState } from "react";
import { FormBoletoCompraVenta } from "./components/FormBoletoCompraVenta.jsx";
import { Button } from "@/components/ui/button";
import logoAgencia from "@/assets/logo.jpeg"; // <-- Asegúrate de que esta ruta sea correcta

function App() {
  const [activeTab, setActiveTab] = useState("boleto");

  return (
    <div className="min-h-screen bg-gray-50 text-black p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* HEADER CON LOGO A LA IZQUIERDA */}
        <header className="flex items-center gap-6 border-b-4 border-red-600 pb-6 bg-white p-6 rounded-lg shadow-sm">
          {/* Si el logo no carga, se mostrará este cuadro gris temporalmente */}
          <img
            src={logoAgencia}
            alt="Victor Molina Automotores"
            className="h-20 w-auto object-contain bg-gray-100 rounded"
          />
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-black">
              Generador de Documentos{" "}
              <span className="text-red-600">VICTOR MOLINA</span>
            </h1>
            <p className="text-gray-600 mt-1 font-medium">
              Seleccione el formulario que desea completar.
            </p>
          </div>
        </header>

        {/* NAVEGACIÓN CON COLORES INSTITUCIONALES */}
        <nav className="flex gap-4">
          <Button
            className={
              activeTab === "boleto"
                ? "bg-red-600 hover:bg-red-700 text-white font-bold shadow-md"
                : "bg-white text-black border-2 border-gray-300 hover:border-red-600 hover:text-red-600"
            }
            onClick={() => setActiveTab("boleto")}
          >
            Boleto de Compraventa
          </Button>
          <Button
            className={
              activeTab === "form2"
                ? "bg-red-600 hover:bg-red-700 text-white font-bold shadow-md"
                : "bg-white text-black border-2 border-gray-300 hover:border-red-600 hover:text-red-600"
            }
            onClick={() => setActiveTab("form2")}
          >
            Formulario 2
          </Button>
          <Button
            className={
              activeTab === "form3"
                ? "bg-red-600 hover:bg-red-700 text-white font-bold shadow-md"
                : "bg-white text-black border-2 border-gray-300 hover:border-red-600 hover:text-red-600"
            }
            onClick={() => setActiveTab("form3")}
          >
            Formulario 3
          </Button>
        </nav>

        <main>
          {activeTab === "boleto" && <FormBoletoCompraVenta />}
          {activeTab === "form2" && (
            <div className="p-12 text-center font-bold text-gray-500 bg-white border-2 border-dashed border-gray-300 rounded-lg">
              Formulario 2 en desarrollo...
            </div>
          )}
          {activeTab === "form3" && (
            <div className="p-12 text-center font-bold text-gray-500 bg-white border-2 border-dashed border-gray-300 rounded-lg">
              Formulario 3 en desarrollo...
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
