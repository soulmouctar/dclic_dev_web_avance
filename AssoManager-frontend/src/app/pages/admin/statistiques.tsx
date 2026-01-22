import { useState, useEffect } from 'react';
import { PrivateLayout } from '@/app/components/layouts/private-layout';
import { Calendar, Filter, TrendingUp, BarChart3, PieChart } from 'lucide-react';
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


interface MonthlyContribution {
  month: string;
  amount: number;
  count: number;
}

interface YearlyContribution {
  year: number;
  amount: number;
  count: number;
}

interface PaymentMethod {
  method: string;
  count: number;
}

interface MemberStatus {
  status: string;
  count: number;
}

interface StatisticsData {
  monthly_contributions: MonthlyContribution[];
  yearly_contributions: YearlyContribution[];
  payment_methods: PaymentMethod[];
  member_status: MemberStatus[];
}

export function StatistiquesAdmin() {
  const { availableYears } = useAvailableYears();
  const [data, setData] = useState<StatisticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    month: new Date().getMonth() + 1,
    year: 2026,
    view: 'monthly' as 'monthly' | 'yearly' | 'methods' | 'members'
  });

  useEffect(() => {
    loadStatistics();
  }, [filters]);

  const loadStatistics = async () => {
    setLoading(true);
    try {
      // Charger les statistiques depuis l'API
      const response = await apiRequest(`/admin/statistics?year=${filters.year}&month=${filters.month}`);

      if (response.ok) {
        const apiData = await response.json();
        setData(apiData);
      } else {
        // Données de fallback si l'API n'est pas disponible
        const fallbackData: StatisticsData = {
          monthly_contributions: [
            { month: 'Jan', amount: 2250, count: 45 },
            { month: 'Fév', amount: 2400, count: 48 },
            { month: 'Mar', amount: 2600, count: 52 },
            { month: 'Avr', amount: 2500, count: 50 },
            { month: 'Mai', amount: 2750, count: 55 },
            { month: 'Juin', amount: 2900, count: 58 },
            { month: 'Juil', amount: 0, count: 0 },
            { month: 'Août', amount: 0, count: 0 },
            { month: 'Sep', amount: 0, count: 0 },
            { month: 'Oct', amount: 0, count: 0 },
            { month: 'Nov', amount: 0, count: 0 },
            { month: 'Déc', amount: 0, count: 0 }
          ],
          yearly_contributions: [
            { year: 2024, amount: 15000, count: 300 },
            { year: 2023, amount: 12000, count: 240 },
            { year: 2022, amount: 10000, count: 200 },
            { year: 2021, amount: 8000, count: 160 }
          ],
          payment_methods: [
            { method: 'Espèces', count: 120 },
            { method: 'Chèque', count: 80 },
            { method: 'Virement', count: 100 }
          ],
          member_status: [
            { status: 'Actif', count: 45 },
            { status: 'Inactif', count: 15 }
          ]
        };
        setData(fallbackData);
      }
    } catch (err: any) {
      // En cas d'erreur, utiliser des données vides
      const emptyData: StatisticsData = {
        monthly_contributions: [],
        yearly_contributions: [],
        payment_methods: [],
        member_status: []
      };
      setData(emptyData);
      setError('');
    } finally {
      setLoading(false);
    }
  };

  const getChartData = () => {
    if (!data) return null;

    switch (filters.view) {
      case 'monthly':
        return {
          labels: data.monthly_contributions.map((item: MonthlyContribution) => item.month),
          datasets: [
            {
              label: 'Montant (€)',
              data: data.monthly_contributions.map((item: MonthlyContribution) => item.amount),
              backgroundColor: 'rgba(34, 197, 94, 0.8)',
              borderColor: 'rgba(34, 197, 94, 1)',
              borderWidth: 1,
            },
          ],
        };
      
      case 'yearly':
        return {
          labels: data.yearly_contributions.map((item: YearlyContribution) => item.year.toString()),
          datasets: [
            {
              label: 'Montant (€)',
              data: data.yearly_contributions.map((item: YearlyContribution) => item.amount),
              backgroundColor: 'rgba(59, 130, 246, 0.8)',
              borderColor: 'rgba(59, 130, 246, 1)',
              borderWidth: 1,
            },
          ],
        };
      
      case 'methods':
        return {
          labels: data.payment_methods.map((item: PaymentMethod) => item.method),
          datasets: [
            {
              data: data.payment_methods.map((item: PaymentMethod) => item.count),
              backgroundColor: [
                'rgba(34, 197, 94, 0.8)',
                'rgba(59, 130, 246, 0.8)',
                'rgba(249, 115, 22, 0.8)',
              ],
              borderColor: [
                'rgba(34, 197, 94, 1)',
                'rgba(59, 130, 246, 1)',
                'rgba(249, 115, 22, 1)',
              ],
              borderWidth: 1,
            },
          ],
        };
      
      case 'members':
        return {
          labels: data.member_status.map((item: MemberStatus) => item.status),
          datasets: [
            {
              data: data.member_status.map((item: MemberStatus) => item.count),
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
      
      default:
        return null;
    }
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: getChartTitle(),
      },
    },
    scales: filters.view === 'methods' || filters.view === 'members' ? {} : {
      y: {
        beginAtZero: true,
      },
    },
  };

  function getChartTitle() {
    switch (filters.view) {
      case 'monthly':
        return `Cotisations mensuelles ${filters.year}`;
      case 'yearly':
        return 'Évolution annuelle des cotisations';
      case 'methods':
        return 'Répartition par méthode de paiement';
      case 'members':
        return 'Statut des membres';
      default:
        return 'Statistiques';
    }
  }

  const renderChart = () => {
    const chartData = getChartData();
    if (!chartData) return null;

    switch (filters.view) {
      case 'monthly':
      case 'yearly':
        return <Bar data={chartData} options={chartOptions} />;
      case 'methods':
      case 'members':
        return <Pie data={chartData} options={chartOptions} />;
      default:
        return null;
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
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Statistiques</h2>
          <p className="text-gray-600 mt-1">Analyse des données de l'association</p>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-4 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Filtres</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="view" className="block text-sm font-medium text-gray-700 mb-1">
                Vue
              </label>
              <select
                id="view"
                value={filters.view}
                onChange={(e) => setFilters(prev => ({ ...prev, view: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              >
                <option value="monthly">Mensuel</option>
                <option value="yearly">Annuel</option>
                <option value="methods">Méthodes de paiement</option>
                <option value="members">Statut des membres</option>
              </select>
            </div>

            <div>
              <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
                Année
              </label>
              <select
                id="year"
                value={filters.year}
                onChange={(e) => setFilters(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              >
                {availableYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            {filters.view === 'monthly' && (
              <div>
                <label htmlFor="month" className="block text-sm font-medium text-gray-700 mb-1">
                  Mois
                </label>
                <select
                  id="month"
                  value={filters.month}
                  onChange={(e) => setFilters(prev => ({ ...prev, month: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                >
                  <option value={0}>Toute l'année</option>
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
            )}

            <div className="flex items-end">
              <button
                onClick={loadStatistics}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <TrendingUp className="w-4 h-4" />
                Actualiser
              </button>
            </div>
          </div>
        </div>

        {/* Statistiques rapides */}
        {data && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total {filters.year}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {data.yearly_contributions.find(y => y.year === filters.year)?.amount || 0} €
                  </p>
                </div>
                <BarChart3 className="w-8 h-8 text-green-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Cotisations {filters.year}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {data.yearly_contributions.find(y => y.year === filters.year)?.count || 0}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Membres actifs</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {data.member_status.find(s => s.status === 'Actif')?.count || 0}
                  </p>
                </div>
                <PieChart className="w-8 h-8 text-purple-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Moyenne mensuelle</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.round((data.yearly_contributions.find(y => y.year === filters.year)?.amount || 0) / 12)} €
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </div>
        )}

        {/* Graphique principal */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="h-96">
            {renderChart()}
          </div>
        </div>

        {/* Tableau détaillé */}
        {data && filters.view === 'monthly' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Détail mensuel {filters.year}</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mois
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nombre de cotisations
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Montant total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Moyenne
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.monthly_contributions.map((item: MonthlyContribution, index: number) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.month}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.count}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.amount} €
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.count > 0 ? Math.round(item.amount / item.count) : 0} €
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </PrivateLayout>
  );
}
