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
      <div className="space-y-4 sm:space-y-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Statistiques Générales</h2>
          <p className="text-gray-600 mt-1">Analyse des cotisations et des membres</p>
        </div>

        {/* Cartes statistiques */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Total Revenus</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  {data?.yearly_contributions.reduce((sum, y) => sum + y.amount, 0).toLocaleString()} €
                </p>
              </div>
              <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Cotisations {filters.year}</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  {data?.yearly_contributions.find(y => y.year === filters.year)?.count || 0}
                </p>
              </div>
              <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Membres Actifs</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  {data?.member_status.find(s => s.status === 'Actif')?.count || 0}
                </p>
              </div>
              <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Méthodes Paiement</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  {data?.payment_methods.length || 0}
                </p>
              </div>
              <PieChart className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 overflow-hidden">
          <div className="flex items-center gap-4 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Filtres</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <select
              value={filters.year}
              onChange={(e) => setFilters(prev => ({ ...prev, year: parseInt(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            >
              {[2024, 2025, 2026].map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>

            <select
              value={filters.month}
              onChange={(e) => setFilters(prev => ({ ...prev, month: parseInt(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            >
              <option value={0}>Tous les mois</option>
              {Array.from({length: 12}, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleDateString('fr-FR', { month: 'long' })}
                </option>
              ))}
            </select>

            <select
              value={filters.view}
              onChange={(e) => setFilters(prev => ({ ...prev, view: e.target.value as any }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            >
              <option value="monthly">Vue mensuelle</option>
              <option value="yearly">Vue annuelle</option>
              <option value="methods">Méthodes de paiement</option>
              <option value="members">Statut des membres</option>
            </select>
          </div>
        </div>

        {/* Graphiques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-white rounded-lg shadow p-4 sm:p-6 overflow-hidden">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">{getChartTitle()}</h3>
            <div className="h-48 sm:h-64 w-full overflow-hidden">
              {renderChart()}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 sm:p-6 overflow-hidden">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Répartition par statut</h3>
            <div className="h-48 sm:h-64 w-full overflow-hidden">
              {data && (
                <Pie 
                  data={{
                    labels: data.member_status.map(s => s.status),
                    datasets: [{
                      data: data.member_status.map(s => s.count),
                      backgroundColor: ['#10B981', '#EF4444', '#F59E0B'],
                    }]
                  }}
                  options={chartOptions}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </PrivateLayout>
  );
}
