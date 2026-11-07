import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RecetasRecientesProvider } from "./context/RecetasRecientesContext.jsx";
import { Layout } from "./components/Layout.jsx";
import { HomePage } from "./pages/HomePage.jsx";
import { RecetaDetailPage } from "./pages/RecetaDetailPage.jsx";
import { RecientesPage } from "./pages/RecientesPage.jsx";
import { NotFoundPage } from "./pages/NotFoundPage.jsx";

// Router > Provider (historial global) > Layout (header/footer) > Routes
export default function App() {
  return (
    <BrowserRouter>
      <RecetasRecientesProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/recetas/:id" element={<RecetaDetailPage />} />
            <Route path="/recientes" element={<RecientesPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </RecetasRecientesProvider>
    </BrowserRouter>
  );
}
