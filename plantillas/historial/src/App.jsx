// App.jsx — PLANTILLA HISTORIAL: acá viven TODAS las rutas.
// ⚠️ Cada import tiene que coincidir con el export del archivo:
//    export default Home  ->  import Home from ...      (sin llaves)
//    export function Home ->  import { Home } from ...  (con llaves)
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header.jsx";
import Home from "./pages/Home.jsx";
import ItemDetail from "./pages/ItemDetail.jsx";
import Recientes from "./pages/Recientes.jsx";
import NotFound from "./pages/NotFound.jsx";

function App() {
  return (
    <div className="app">
      <Header />
      <main className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          {/* 🔧 CAMBIAR la ruta del enunciado: /clima/:id · /pais/:id · /recetas/:id */}
          {/* ⚠️ El nombre después de ":" tiene que ser el MISMO que useParams() en el detalle,
              y el mismo path que usa el <Link to> de la Card y de Recientes. */}
          <Route path="/items/:id" element={<ItemDetail />} />
          <Route path="/recientes" element={<Recientes />} />
          {/* 404: SIEMPRE la última */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
