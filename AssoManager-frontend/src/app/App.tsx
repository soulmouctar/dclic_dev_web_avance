import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/app/contexts/AuthContext';
import { ProtectedRoute } from '@/app/components/ProtectedRoute';
import { AdminRoute } from '@/app/components/AdminRoute';
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
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Routes publiques */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Routes membre protégées */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardMembre />
            </ProtectedRoute>
          } />
          <Route path="/mes-cotisations" element={
            <ProtectedRoute>
              <MesCotisations />
            </ProtectedRoute>
          } />
          
          {/* Routes admin protégées */}
          <Route path="/admin/dashboard" element={
            <AdminRoute>
              <DashboardAdmin />
            </AdminRoute>
          } />
          <Route path="/admin/membres" element={
            <AdminRoute>
              <ListeMembres />
            </AdminRoute>
          } />
          <Route path="/admin/membre/:id" element={
            <AdminRoute>
              <DetailMembre />
            </AdminRoute>
          } />
          <Route path="/admin/ajouter-cotisation" element={
            <AdminRoute>
              <AjouterCotisation />
            </AdminRoute>
          } />
          
          {/* Redirection par défaut */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
