import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HistorialConsultasProvider } from "./context/HistorialConsultasContext";
import Header from "./components/Header";
import Home from "./pages/Home";
import ClimaDetail from "./pages/ClimaDetail";
import Recientes from "./pages/Recientes";
import NotFound from "./pages/NotFound";
import "./index.css";

function App() {
  return (
    <HistorialConsultasProvider>
      <BrowserRouter>
        <div className="app">
          <Header />
          <main className="main">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/recientes" element={<Recientes />} />
              <Route path="/clima/:id" element={<ClimaDetail />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </HistorialConsultasProvider>
  );
}

export default App;
