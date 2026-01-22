import { useState, useEffect } from 'react';
import { PrivateLayout } from '@/app/components/layouts/private-layout';
import { CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { apiRequest } from '../../config/api';

interface ContributionPayment {
  id: number;
  year: number;
  month: number;
  amount: number;
  payment_date: string;
  payment_method: string;
  reference: string;
}

interface ContributionsData {
  payments: ContributionPayment[];
  total_paid: number;
  total_payments: number;
  current_year_paid: boolean;
}

export function MesCotisations() {
  const { user } = useAuth();
  const [contributionsData, setContributionsData] = useState<ContributionsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadContributions();
  }, []);

  const loadContributions = async () => {
    try {
      setLoading(true);
      
      const response = await apiRequest('/contributions');
      
      if (response.ok) {
        const data = await response.json();
        
        // Calculer les statistiques à partir des données réelles
        const payments = data.payments || [];
        const currentYear = new Date().getFullYear();
        
        const totalPaid = payments.reduce((sum: number, p: ContributionPayment) => sum + parseFloat(p.amount.toString()), 0);
        const currentYearPayments = payments.filter((p: ContributionPayment) => p.year === currentYear);
        const currentYearPaid = currentYearPayments.length > 0;
        
        setContributionsData({
          payments: payments,
          total_paid: totalPaid,
          total_payments: payments.length,
          current_year_paid: currentYearPaid
        });
      } else {
        setError('Erreur lors du chargement des cotisations');
      }
      
    } catch (err: any) {
      setError('Erreur lors du chargement des cotisations');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const getMonthName = (month: number) => {
    const months = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    return months[month - 1] || month.toString();
  };

  if (loading) {
    return (
      <PrivateLayout userRole="membre" userName={user?.first_name + ' ' + user?.last_name || 'Membre'}>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Chargement des cotisations...</div>
        </div>
      </PrivateLayout>
    );
  }

  return (
    <PrivateLayout userRole="membre" userName={user?.first_name + ' ' + user?.last_name || 'Membre'}>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Mes Cotisations</h2>
          <p className="text-gray-600 mt-1">Historique de vos cotisations</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        
        {/* Carte de résumé */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-600">Total payé</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{contributionsData?.total_paid || 0} €</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Cotisations payées</p>
              <p className="text-3xl font-bold text-green-600 mt-1">{contributionsData?.total_payments || 0}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Statut actuel</p>
              <div className="flex items-center gap-2 mt-1">
                {contributionsData?.current_year_paid ? (
                  <>
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <p className="text-xl font-bold text-green-600">À jour</p>
                  </>
                ) : (
                  <>
                    <XCircle className="w-6 h-6 text-red-600" />
                    <p className="text-xl font-bold text-red-600">En retard</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Tableau des cotisations */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Historique détaillé</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Période
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Montant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date de paiement
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Méthode
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Référence
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {contributionsData?.payments && contributionsData.payments.length > 0 ? (
                  contributionsData.payments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">
                          {getMonthName(payment.month)} {payment.year}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{payment.amount} €</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">{formatDate(payment.payment_date)}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">{payment.payment_method}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">{payment.reference}</span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      <p className="text-sm">Aucune cotisation trouvée</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PrivateLayout>
  );
}
