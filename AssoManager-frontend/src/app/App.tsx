import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/app/contexts/AuthContext';
import { ProtectedRoute } from '@/app/components/ProtectedRoute';
import { AdminRoute } from '@/app/components/AdminRoute';
import { Login } from '@/app/pages/login';
import { Register } from '@/app/pages/register';
import { DashboardMembre } from '@/app/pages/membre/dashboard';
import { MesCotisations } from '@/app/pages/membre/mes-cotisations';
import { DashboardAdmin } from '@/app/pages/admin/dashboard';
import { ListeMembres } from '@/app/pages/admin/liste-membres';
import { DetailMembre } from '@/app/pages/admin/detail-membre';
import { AjouterCotisation } from '@/app/pages/admin/ajouter-cotisation';
import { AjouterMembre } from '@/app/pages/admin/ajouter-membre';
import { StatistiquesAdmin } from '@/app/pages/admin/statistiques-paiements';
import { GestionUtilisateurs } from '@/app/pages/admin/gestion-utilisateurs';
import { ReinitialiserMotDePasse } from '@/app/pages/admin/reinitialiser-mot-de-passe';
import { StatistiquesMembres } from '@/app/pages/admin/statistiques-membres';
import { ListeCotisations } from '@/app/pages/admin/liste-cotisations';
import { ChangerMotDePasse } from '@/app/pages/admin/changer-mot-de-passe';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Routes publiques */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
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
          <Route path="/admin/ajouter-membre" element={
            <AdminRoute>
              <AjouterMembre />
            </AdminRoute>
          } />
          <Route path="/admin/statistiques" element={
            <AdminRoute>
              <StatistiquesAdmin />
            </AdminRoute>
          } />
          <Route path="/admin/gestion-utilisateurs" element={
            <AdminRoute>
              <GestionUtilisateurs />
            </AdminRoute>
          } />
          <Route path="/admin/reinitialiser-mot-de-passe" element={
            <AdminRoute>
              <ReinitialiserMotDePasse />
            </AdminRoute>
          } />
          <Route path="/admin/statistiques-membres" element={
            <AdminRoute>
              <StatistiquesMembres />
            </AdminRoute>
          } />
          <Route path="/admin/liste-cotisations" element={
            <AdminRoute>
              <ListeCotisations />
            </AdminRoute>
          } />
          <Route path="/admin/changer-mot-de-passe" element={
            <AdminRoute>
              <ChangerMotDePasse />
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
