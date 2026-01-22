import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '@/app/pages/login';
import { RegisterPage } from '@/app/pages/register';
import { DashboardMembre } from '@/app/pages/membre/dashboard';
import { MesCotisations } from '@/app/pages/membre/mes-cotisations';
import { DashboardAdmin } from '@/app/pages/admin/dashboard';
import { ListeMembres } from '@/app/pages/admin/liste-membres';
import { DetailMembre } from '@/app/pages/admin/detail-membre';
import { AjouterCotisation } from '@/app/pages/admin/ajouter-cotisation';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Routes publiques */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Routes membre */}
        <Route path="/dashboard" element={<DashboardMembre />} />
        <Route path="/mes-cotisations" element={<MesCotisations />} />
        
        {/* Routes admin */}
        <Route path="/admin/dashboard" element={<DashboardAdmin />} />
        <Route path="/admin/membres" element={<ListeMembres />} />
        <Route path="/admin/membre/:id" element={<DetailMembre />} />
        <Route path="/admin/ajouter-cotisation" element={<AjouterCotisation />} />
        
        {/* Redirection par défaut */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
