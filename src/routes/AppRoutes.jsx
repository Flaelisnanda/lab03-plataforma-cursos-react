import { Routes, Route } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout.jsx';
import DashboardPage from '../pages/DashboardPage.jsx';
import CategoriasPage from '../pages/CategoriasPage.jsx';
import CursosPage from '../pages/CursosPage.jsx';
import TrilhasPage from '../pages/TrilhasPage.jsx';
import ModulosPage from '../pages/ModulosPage.jsx';
import UsuariosPage from '../pages/UsuariosPage.jsx';
import MatriculasPage from '../pages/MatriculasPage.jsx';
import ProgressoPage from '../pages/ProgressoPage.jsx';
import CertificadosPage from '../pages/CertificadosPage.jsx';
import PlanosPage from '../pages/PlanosPage.jsx';
import CheckoutPage from '../pages/CheckoutPage.jsx';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="categorias" element={<CategoriasPage />} />
        <Route path="cursos" element={<CursosPage />} />
        <Route path="trilhas" element={<TrilhasPage />} />
        <Route path="modulos" element={<ModulosPage />} />
        <Route path="usuarios" element={<UsuariosPage />} />
        <Route path="matriculas" element={<MatriculasPage />} />
        <Route path="progresso" element={<ProgressoPage />} />
        <Route path="certificados" element={<CertificadosPage />} />
        <Route path="planos" element={<PlanosPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
      </Route>
    </Routes>
  );
}
