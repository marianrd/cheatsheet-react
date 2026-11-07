import { Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout.jsx";
import { HomePage } from "./pages/HomePage.jsx";
import { GameDetailPage } from "./pages/GameDetailPage.jsx";
import { NotFoundPage } from "./pages/NotFoundPage.jsx";

// Rutas de la SPA. El Layout (header + login + footer) envuelve a todas.
export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/juegos/:id" element={<GameDetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  );
}
