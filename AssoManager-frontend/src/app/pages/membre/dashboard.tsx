import { useState, useEffect } from 'react';
import { PrivateLayout } from '@/app/components/layouts/private-layout';
import { Calendar, CreditCard, Users, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { apiRequest } from '../../config/api';

interface CurrentStatus {
  year: number;
  month: number;
  is_paid: boolean;
  payment?: {
    amount: number;
    payment_date: string;
    payment_method: string;
  } | null;
}

interface ContributionPayment {
  id: number;
  year: number;
  month: number;
  amount: number;
  payment_date: string;
  payment_method: string;
  reference: string;
}

export function DashboardMembre() {
  const { user } = useAuth();
  const [currentStatus, setCurrentStatus] = useState<CurrentStatus | null>(null);
  const [recentPayments, setRecentPayments] = useState<ContributionPayment[]>([]);
  const [totalPaidThisYear, setTotalPaidThisYear] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Charger le statut actuel
      const statusResponse = await apiRequest('/contributions/current-status');
      
      if (statusResponse.ok) {
        const statusData = await statusResponse.json();
        setCurrentStatus(statusData.current_month);
      }

      // Charger les paiements récents
      const paymentsResponse = await apiRequest('/contributions?per_page=5');
      
      if (paymentsResponse.ok) {
        const paymentsData = await paymentsResponse.json();
        setRecentPayments(paymentsData.payments || []);
        
        // Calculer le total payé cette année
        const currentYear = new Date().getFullYear();
        const totalThisYear = paymentsData.payments
          ?.filter((p: ContributionPayment) => p.year === currentYear)
          ?.reduce((sum: number, p: ContributionPayment) => sum + parseFloat(p.amount.toString()), 0) || 0;
        setTotalPaidThisYear(totalThisYear);
      }
      
    } catch (err: any) {
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  if (loading) {
    return (
      <PrivateLayout userRole="membre" userName={user?.first_name + ' ' + user?.last_name || 'Membre'}>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Chargement...</div>
        </div>
      </PrivateLayout>
    );
  }

  return (
    <PrivateLayout userRole="membre" userName={user?.first_name + ' ' + user?.last_name || 'Membre'}>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Tableau de bord</h2>
          <p className="text-gray-600 mt-1">Bienvenue, {user?.first_name} {user?.last_name}</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        
        {/* Cartes statistiques */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cotisation en cours</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{currentStatus?.year || new Date().getFullYear()}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Statut</p>
                <p className={`text-2xl font-bold mt-1 ${currentStatus?.is_paid ? 'text-green-600' : 'text-red-600'}`}>
                  {currentStatus?.is_paid ? 'À jour' : 'En attente'}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${currentStatus?.is_paid ? 'bg-green-100' : 'bg-red-100'}`}>
                {currentStatus?.is_paid ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-red-600" />
                )}
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total payé</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{totalPaidThisYear} €</p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Notifications */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h3>
          <div className="space-y-3">
            {currentStatus?.is_paid && currentStatus.payment && (
              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Cotisation validée</p>
                  <p className="text-sm text-gray-600">
                    Votre cotisation {currentStatus.year} a été validée le {formatDate(currentStatus.payment.payment_date)}
                  </p>
                </div>
              </div>
            )}
            
            {!currentStatus?.is_paid && (
              <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Cotisation en attente</p>
                  <p className="text-sm text-gray-600">
                    Votre cotisation {currentStatus?.year || new Date().getFullYear()} n'a pas encore été payée
                  </p>
                </div>
              </div>
            )}
            
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Prochaine assemblée générale</p>
                <p className="text-sm text-gray-600">Prévue le 15/03/2024 à 18h00</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Historique récent */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Historique récent</h3>
          <div className="space-y-3">
            {recentPayments.length > 0 ? (
              recentPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Cotisation {payment.year} - {payment.month.toString().padStart(2, '0')}
                    </p>
                    <p className="text-xs text-gray-500">{formatDate(payment.payment_date)}</p>
                  </div>
                  <span className="text-sm font-medium text-green-600">+ {payment.amount} €</span>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                <p className="text-sm">Aucun paiement récent</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PrivateLayout>
  );
}