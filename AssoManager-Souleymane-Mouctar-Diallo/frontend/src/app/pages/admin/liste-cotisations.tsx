import { useState, useEffect } from 'react';
import { PrivateLayout } from '@/app/components/layouts/private-layout';
import { Search, Filter, Calendar, DollarSign, User, Eye } from 'lucide-react';
import { apiRequest } from '../../config/api';
import { useAvailableYears } from '../../hooks/useAvailableYears';
import { Link } from 'react-router-dom';

interface ContributionPayment {
  id: number;
  user_id: number;
  year: number;
  month: number;
  amount: number;
  payment_date: string;
  payment_method: string;
  reference: string;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
}

interface ContributionsResponse {
  payments: ContributionPayment[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export function ListeCotisations() {
  const { availableYears } = useAvailableYears();
  const [payments, setPayments] = useState<ContributionPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    year: 2026,
    month: 0, // 0 = tous les mois
    payment_method: 'ALL'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 0
  });

  useEffect(() => {
    loadPayments();
  }, [filters, currentPage]);

  const loadPayments = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        per_page: '20',
        ...(filters.search && { search: filters.search }),
        ...(filters.year && { year: filters.year.toString() }),
        ...(filters.month > 0 && { month: filters.month.toString() }),
        ...(filters.payment_method !== 'ALL' && { payment_method: filters.payment_method })
      });

      const response = await apiRequest(`/contributions?${params}`);

      if (response.ok) {
        const data: ContributionsResponse = await response.json();
        setPayments(data.payments || []);
        setPagination(data.pagination || {
          current_page: 1,
          last_page: 1,
          per_page: 20,
          total: 0
        });
        setError('');
      } else {
        // Si l'API retourne une erreur, afficher le message d'erreur
        const errorData = await response.json().catch(() => ({}));
        setPayments([]);
        setPagination({
          current_page: 1,
          last_page: 1,
          per_page: 20,
          total: 0
        });
        setError(errorData.message || `Erreur ${response.status}: ${response.statusText}`);
      }
    } catch (err: any) {
      // En cas d'erreur réseau, afficher l'erreur
      setPayments([]);
      setPagination({
        current_page: 1,
        last_page: 1,
        per_page: 20,
        total: 0
      });
      setError(`Erreur de connexion: ${err.message || 'Impossible de se connecter à l\'API'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    loadPayments();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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

  const getPaymentMethodColor = (method: string) => {
    switch (method.toLowerCase()) {
      case 'especes':
        return 'bg-green-100 text-green-800';
      case 'cheque':
        return 'bg-blue-100 text-blue-800';
      case 'virement':
        return 'bg-purple-100 text-purple-800';
      case 'carte':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTotalAmount = () => {
    const total = payments.reduce((sum, payment) => sum + parseFloat(payment.amount.toString()), 0);
    return total.toFixed(2);
  };

  const formatAmount = (amount: number | string) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return numAmount.toFixed(2);
  };

  return (
    <PrivateLayout userRole="admin" userName="Admin Principal">
      <div className="space-y-4 sm:space-y-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Liste des Cotisations</h2>
            <p className="text-gray-600 mt-1">Gestion des paiements de cotisations</p>
          </div>
          <Link
            to="/admin/ajouter-cotisation"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors inline-flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <DollarSign className="w-4 h-4" />
            <span className="hidden sm:inline">Nouvelle cotisation</span>
            <span className="sm:hidden">Nouvelle</span>
          </Link>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow p-3 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Total cotisations</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{payments.length}</p>
              </div>
              <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-3 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Montant total</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{getTotalAmount()} €</p>
              </div>
              <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-3 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Année sélectionnée</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{filters.year}</p>
              </div>
              <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-3 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Moyenne par cotisation</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  {payments.length > 0 ? formatAmount(parseFloat(getTotalAmount()) / payments.length) : '0.00'} €
                </p>
              </div>
              <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Filtres et recherche */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 max-w-7xl mx-auto overflow-hidden">
          <div className="flex items-center gap-4 mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Filtres</h3>
          </div>
          
          <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                placeholder="Rechercher un membre..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>

            <select
              value={filters.year}
              onChange={(e) => setFilters(prev => ({ ...prev, year: parseInt(e.target.value) }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            >
              {availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>

            <select
              value={filters.month}
              onChange={(e) => setFilters(prev => ({ ...prev, month: parseInt(e.target.value) }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            >
              <option value={0}>Tous les mois</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {getMonthName(i + 1)}
                </option>
              ))}
            </select>

            <select
              value={filters.payment_method}
              onChange={(e) => setFilters(prev => ({ ...prev, payment_method: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            >
              <option value="ALL">Toutes les méthodes</option>
              <option value="especes">Espèces</option>
              <option value="cheque">Chèque</option>
              <option value="virement">Virement</option>
              <option value="carte">Carte bancaire</option>
            </select>

            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Filtrer
            </button>
          </form>
        </div>

        {/* Messages d'erreur et de chargement */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {loading && (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement des cotisations...</p>
          </div>
        )}

        {/* Tableau des cotisations */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Membre
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Période
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Montant
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Date de paiement
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Méthode
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Référence
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {!loading && payments.length === 0 && !error && (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      Aucune cotisation trouvée
                    </td>
                  </tr>
                )}
                {!loading && payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10">
                          <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                          </div>
                        </div>
                        <div className="ml-2 sm:ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {payment.user.first_name} {payment.user.last_name}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-500 sm:block hidden">{payment.user.email}</div>
                          <div className="text-xs text-gray-500 sm:hidden">
                            {getMonthName(payment.month)} {payment.year}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                      <span className="text-sm text-gray-600">
                        {getMonthName(payment.month)} {payment.year}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">{formatAmount(payment.amount)} €</span>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                      <span className="text-sm text-gray-600">{formatDate(payment.payment_date)}</span>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPaymentMethodColor(payment.payment_method)}`}
                      >
                        {payment.payment_method}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                      <span className="text-sm text-gray-600">{payment.reference}</span>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/admin/membre/${payment.user_id}`}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                          title="Voir le membre"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!loading && payments.length > 0 && (
            <div className="px-3 sm:px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
                <span className="hidden sm:inline">
                  Affichage de {((pagination.current_page - 1) * pagination.per_page) + 1} à {Math.min(pagination.current_page * pagination.per_page, pagination.total)} sur {pagination.total} cotisations
                </span>
                <span className="sm:hidden">
                  {pagination.current_page} / {pagination.last_page}
                </span>
              </p>
              <div className="flex gap-1 sm:gap-2">
                <button 
                  onClick={() => handlePageChange(pagination.current_page - 1)}
                  disabled={pagination.current_page <= 1}
                  className="px-2 sm:px-3 py-1 text-xs sm:text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="hidden sm:inline">Précédent</span>
                  <span className="sm:hidden">‹</span>
                </button>
                
                {Array.from({ length: Math.min(3, pagination.last_page) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button 
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded ${
                        page === pagination.current_page 
                          ? 'bg-green-600 text-white' 
                          : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                
                <button 
                  onClick={() => handlePageChange(pagination.current_page + 1)}
                  disabled={pagination.current_page >= pagination.last_page}
                  className="px-2 sm:px-3 py-1 text-xs sm:text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="hidden sm:inline">Suivant</span>
                  <span className="sm:hidden">›</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </PrivateLayout>
  );
}
