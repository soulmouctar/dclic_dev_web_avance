import { useState, useEffect } from 'react';
import { PrivateLayout } from '@/app/components/layouts/private-layout';
import { Users, CreditCard, TrendingUp, AlertCircle, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { memberService, AdminStats } from '../../services/memberService';

export function DashboardAdmin() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await memberService.getAdminStats();
      setStats(data);
    } catch (err: any) {
      setError('Erreur lors du chargement des statistiques');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <PrivateLayout userRole="admin" userName="Admin Principal">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Chargement des statistiques...</div>
        </div>
      </PrivateLayout>
    );
  }

  if (error || !stats) {
    return (
      <PrivateLayout userRole="admin" userName="Admin Principal">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error || 'Erreur lors du chargement des données'}
        </div>
      </PrivateLayout>
    );
  }

  return (
    <PrivateLayout userRole="admin" userName="Admin Principal">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Dashboard Administrateur</h2>
            <p className="text-gray-600 mt-1">Vue d'ensemble de l'association</p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/admin/ajouter-membre"
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Nouveau membre
            </Link>
            <Link
              to="/admin/ajouter-cotisation"
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Nouvelle cotisation
            </Link>
          </div>
        </div>
        
        {/* Cartes statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Membres</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total_members}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-xs text-green-600 mt-2">+{stats.new_members_this_month || 0} ce mois</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Membres actifs</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{stats.active_members}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {stats.total_members > 0 ? Math.round((stats.active_members / stats.total_members) * 100) : 0}% du total
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Membres inactifs</p>
                <p className="text-3xl font-bold text-orange-600 mt-1">{stats.inactive_members}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {stats.total_members > 0 ? Math.round((stats.inactive_members / stats.total_members) * 100) : 0}% du total
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Revenus {new Date().getFullYear()}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total_revenue || 0} €</p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-gray-600" />
              </div>
            </div>
            <p className="text-xs text-green-600 mt-2">{stats.total_contributions} cotisations</p>
          </div>
        </div>
        
        {/* Graphique simplifié */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Évolution des cotisations</h3>
          <div className="h-64 flex items-end gap-4">
            <div className="flex-1 flex flex-col items-center">
              <div className="w-full bg-green-600 rounded-t" style={{ height: '60%' }}></div>
              <span className="text-xs text-gray-600 mt-2">Jan</span>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div className="w-full bg-green-600 rounded-t" style={{ height: '75%' }}></div>
              <span className="text-xs text-gray-600 mt-2">Fév</span>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div className="w-full bg-green-600 rounded-t" style={{ height: '55%' }}></div>
              <span className="text-xs text-gray-600 mt-2">Mar</span>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div className="w-full bg-green-600 rounded-t" style={{ height: '80%' }}></div>
              <span className="text-xs text-gray-600 mt-2">Avr</span>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div className="w-full bg-green-600 rounded-t" style={{ height: '45%' }}></div>
              <span className="text-xs text-gray-600 mt-2">Mai</span>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div className="w-full bg-green-600 rounded-t" style={{ height: '90%' }}></div>
              <span className="text-xs text-gray-600 mt-2">Juin</span>
            </div>
          </div>
        </div>
        
        {/* Dernières activités */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Activités récentes</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div>
                <p className="text-sm font-medium text-gray-900">Nouvelle cotisation</p>
                <p className="text-xs text-gray-500">Marie Martin - 50€</p>
              </div>
              <span className="text-xs text-gray-500">Il y a 2h</span>
            </div>
            
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div>
                <p className="text-sm font-medium text-gray-900">Nouveau membre</p>
                <p className="text-xs text-gray-500">Pierre Dubois</p>
              </div>
              <span className="text-xs text-gray-500">Il y a 5h</span>
            </div>
            
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div>
                <p className="text-sm font-medium text-gray-900">Cotisation validée</p>
                <p className="text-xs text-gray-500">Sophie Laurent - 50€</p>
              </div>
              <span className="text-xs text-gray-500">Hier</span>
            </div>
          </div>
        </div>
      </div>
    </PrivateLayout>
  );
}