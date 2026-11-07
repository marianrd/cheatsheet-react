import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PaisesRecientesProvider } from "./context/PaisesRecientesContext";
import Header from "./components/Header";
import Home from "./pages/Home";
import PaisDetail from "./pages/PaisDetail";
import Recientes from "./pages/Recientes";
import NotFound from "./pages/NotFound";

// Orden (de afuera hacia adentro): Router > Provider > Header + Routes
// El Provider envuelve a TODO lo que necesite el historial (Header no, pero Detail y Recientes sí).
function App() {
  return (
    <BrowserRouter>
      <PaisesRecientesProvider>
        <div className="app">
          <Header />
          <main className="main">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/pais/:cca3" element={<PaisDetail />} />
              <Route path="/recientes" element={<Recientes />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </PaisesRecientesProvider>
    </BrowserRouter>
  );
}

export default App;
