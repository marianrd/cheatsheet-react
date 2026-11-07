// App.jsx — PLANTILLA LOGIN: Layout (header con login) envuelve todas las rutas.
// ⚠️ Los imports usan { llaves } porque estos archivos hacen `export function X`.
//    Si el esqueleto usa `export default`, quitá las llaves del import (o al revés).
import { Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout.jsx";
import { Home } from "./pages/Home.jsx";
import { ItemDetail } from "./pages/ItemDetail.jsx";
import { NotFound } from "./pages/NotFound.jsx";
// SI PIDEN ruta protegida: import { RutaProtegida } from "./components/RutaProtegida.jsx";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* 🔧 CAMBIAR la ruta del enunciado: /juegos/:id · /peliculas/:id · /eventos/:id
            y el MISMO path en el <Link to> de ItemCard.jsx */}
        <Route path="/items/:id" element={<ItemDetail />} />

        {/* SI PIDEN ruta protegida (solo logueados / solo admin):
        <Route path="/admin" element={<RutaProtegida rol="admin"><Admin /></RutaProtegida>} /> */}

        {/* 404: SIEMPRE la última */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}
