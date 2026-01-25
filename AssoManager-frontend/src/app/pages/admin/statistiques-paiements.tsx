import { useState, useEffect } from 'react';
import { PrivateLayout } from '@/app/components/layouts/private-layout';
import { Calendar, Filter, TrendingUp, BarChart3, PieChart, Users, DollarSign, User, CreditCard } from 'lucide-react';
import { apiRequest } from '../../config/api';
import { useAvailableYears } from '../../hooks/useAvailableYears';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
);

interface MemberPaymentStats {
  member_id: number;
  member_name: string;
  total_paid: number;
  months_paid: number;
  last_payment_date: string;
  status: 'ACTIVE' | 'INACTIVE';
  average_monthly: number;
}

interface PaymentTrend {
  month: string;
  total_amount: number;
  member_count: number;
  average_per_member: number;
}

export function StatistiquesAdmin() {
  const { availableYears } = useAvailableYears();
  const [memberStats, setMemberStats] = useState<MemberPaymentStats[]>([]);
  const [trends, setTrends] = useState<PaymentTrend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    month: new Date().getMonth() + 1,
    year: 2026,
    viewType: 'bar' as 'bar' | 'pie',
    sortBy: 'total_paid' as 'total_paid' | 'months_paid' | 'member_name'
  });

  useEffect(() => {
    loadStatistics();
  }, [filters]);

  const loadStatistics = async () => {
    setLoading(true);
    try {
      // Charger les statistiques de paiement par membre depuis l'API
      const memberStatsResponse = await apiRequest(`/admin/member-payment-stats?year=${filters.year}&month=${filters.month}`);

      let memberStatsData: MemberPaymentStats[] = [];
      if (memberStatsResponse.ok) {
        const data = await memberStatsResponse.json();
        memberStatsData = data.member_stats || [];
      }

      // Charger les tendances de paiement depuis l'API
      const trendsResponse = await apiRequest(`/admin/payment-trends?year=${filters.year}`);

      let trendsData: PaymentTrend[] = [];
      if (trendsResponse.ok) {
        const data = await trendsResponse.json();
        trendsData = data.trends || [];
      }

      // Si pas de données API, utiliser des données de fallback
      if (memberStatsData.length === 0) {
        memberStatsData = [
          {
            member_id: 1,
            member_name: 'Aucune donnée disponible',
            total_paid: 0,
            months_paid: 0,
            last_payment_date: new Date().toISOString(),
            status: 'ACTIVE',
            average_monthly: 0
          }
        ];
      }

      if (trendsData.length === 0) {
        trendsData = [
          { month: 'Jan', total_amount: 0, member_count: 0, average_per_member: 0 },
          { month: 'Fév', total_amount: 0, member_count: 0, average_per_member: 0 },
          { month: 'Mar', total_amount: 0, member_count: 0, average_per_member: 0 },
          { month: 'Avr', total_amount: 0, member_count: 0, average_per_member: 0 },
          { month: 'Mai', total_amount: 0, member_count: 0, average_per_member: 0 },
          { month: 'Juin', total_amount: 0, member_count: 0, average_per_member: 0 }
        ];
      }
      
      // Tri des données selon le filtre
      const sortedStats = [...memberStatsData].sort((a, b) => {
        switch (filters.sortBy) {
          case 'total_paid':
            return b.total_paid - a.total_paid;
          case 'months_paid':
            return b.months_paid - a.months_paid;
          case 'member_name':
            return a.member_name.localeCompare(b.member_name);
          default:
            return 0;
        }
      });
      
      setMemberStats(sortedStats);
      setTrends(trendsData);
    } catch (err: any) {
      setError('Erreur lors du chargement des statistiques');
    } finally {
      setLoading(false);
    }
  };

  const getTrendChartData = () => {
    return {
      labels: trends.map(trend => trend.month),
      datasets: [
        {
          label: 'Montant total (€)',
          data: trends.map(trend => trend.total_amount),
          backgroundColor: 'rgba(34, 197, 94, 0.8)',
          borderColor: 'rgba(34, 197, 94, 1)',
          borderWidth: 2,
        },
        {
          label: 'Nombre de cotisants',
          data: trends.map(trend => trend.member_count),
          backgroundColor: 'rgba(59, 130, 246, 0.8)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 2,
        }
      ],
    };
  };

  const getStatusDistribution = () => {
    const activeCount = memberStats.filter(m => m.status === 'ACTIVE').length;
    const inactiveCount = memberStats.filter(m => m.status === 'INACTIVE').length;

    return {
      labels: ['Actifs', 'Inactifs'],
      datasets: [
        {
          data: [activeCount, inactiveCount],
          backgroundColor: [
            'rgba(34, 197, 94, 0.8)',
            'rgba(239, 68, 68, 0.8)',
          ],
          borderColor: [
            'rgba(34, 197, 94, 1)',
            'rgba(239, 68, 68, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  const formatDate = (dateString: string) => {
    if (!dateString || dateString === 'Invalid Date') {
      return 'Aucune date';
    }
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Date invalide';
      }
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      return 'Date invalide';
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

  if (error) {
    return (
      <PrivateLayout userRole="admin" userName="Admin Principal">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </PrivateLayout>
    );
  }

  return (
    <PrivateLayout userRole="admin" userName="Admin Principal">
      <div className="space-y-4 sm:space-y-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 sm:mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Statistiques de Paiement par Membre</h2>
            <p className="text-gray-600 mt-1">Analyse détaillée des cotisations et paiements</p>
          </div>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 overflow-hidden">
          <div className="flex items-center gap-4 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Filtres</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative z-50">
              <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
                Année
              </label>
              <select
                id="year"
                value={filters.year}
                onChange={(e) => setFilters(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 relative z-50"
              >
                {availableYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <div className="relative z-40">
              <label htmlFor="month" className="block text-sm font-medium text-gray-700 mb-1">
                Mois
              </label>
              <select
                id="month"
                value={filters.month}
                onChange={(e) => setFilters(prev => ({ ...prev, month: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 relative z-40"
              >
                <option value={0}>Tous les mois</option>
                <option value={1}>Janvier</option>
                <option value={2}>Février</option>
                <option value={3}>Mars</option>
                <option value={4}>Avril</option>
                <option value={5}>Mai</option>
                <option value={6}>Juin</option>
                <option value={7}>Juillet</option>
                <option value={8}>Août</option>
                <option value={9}>Septembre</option>
                <option value={10}>Octobre</option>
                <option value={11}>Novembre</option>
                <option value={12}>Décembre</option>
              </select>
            </div>

            <div className="relative z-30">
              <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">
                Trier par
              </label>
              <select
                id="sortBy"
                value={filters.sortBy}
                onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 relative z-30"
              >
                <option value="total_paid">Montant total</option>
                <option value="months_paid">Nombre de cotisations</option>
                <option value="member_name">Nom</option>
              </select>
            </div>

            <div className="relative z-20">
              <label htmlFor="viewType" className="block text-sm font-medium text-gray-700 mb-1">
                Type de vue
              </label>
              <select
                id="viewType"
                value={filters.viewType}
                onChange={(e) => setFilters(prev => ({ ...prev, viewType: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 relative z-20"
              >
                <option value="bar">Barres</option>
                <option value="pie">Camembert</option>
              </select>
            </div>
          </div>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white rounded-lg shadow p-4 sm:p-6 w-full">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Total membres</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{memberStats.length}</p>
              </div>
              <Users className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 sm:p-6 w-full">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Revenus totaux</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">
                  {memberStats.reduce((sum, stat) => sum + stat.total_paid, 0)} €
                </p>
              </div>
              <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 sm:p-6 w-full">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Cotisations totales</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">
                  {memberStats.reduce((sum, stat) => sum + stat.months_paid, 0)}
                </p>
              </div>
              <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 sm:p-6 w-full">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Moyenne par membre</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">
                  {memberStats.length > 0 ? Math.round(memberStats.reduce((sum, stat) => sum + stat.total_paid, 0) / memberStats.length) : 0} €
                </p>
              </div>
              <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Graphiques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-white rounded-lg shadow p-4 sm:p-6 overflow-hidden">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Évolution mensuelle</h3>
            <div className="h-48 sm:h-64 w-full overflow-hidden">
              {filters.viewType === 'bar' ? (
                <Bar data={getTrendChartData()} options={chartOptions} />
              ) : (
                <Pie data={getStatusDistribution()} options={chartOptions} />
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 sm:p-6 overflow-hidden">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Répartition par statut</h3>
            <div className="h-48 sm:h-64 w-full overflow-hidden">
              <Pie data={getStatusDistribution()} />
            </div>
          </div>
        </div>

        {/* Tableau détaillé */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Détail des paiements par membre</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Membre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cotisations payées
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Montant total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Moyenne mensuelle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dernier paiement
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {memberStats.map((stat) => (
                  <tr key={stat.member_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <User className="w-5 h-5 text-gray-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {stat.member_name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <CreditCard className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{stat.months_paid}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                      {stat.total_paid} €
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {stat.average_monthly} €
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(stat.last_payment_date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          stat.status === 'ACTIVE'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {stat.status === 'ACTIVE' ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PrivateLayout>
  );
}
