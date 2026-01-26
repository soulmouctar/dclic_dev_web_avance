import { useState, useEffect } from 'react';
import { PrivateLayout } from '@/app/components/layouts/private-layout';
import { Link } from 'react-router-dom';
import { Search, Eye, CheckCircle, XCircle, UserPlus, Key } from 'lucide-react';
import { apiRequest } from '../../config/api';
import { useAuth } from '../../contexts/AuthContext';
import { ChangePasswordModal } from '../../components/modals/ChangePasswordModal';

interface Member {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: 'ADMIN' | 'MEMBER';
  status: 'ACTIVE' | 'INACTIVE';
  created_at: string;
  updated_at: string;
}

interface MembersResponse {
  members: Member[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export function ListeMembres() {
  const { user } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 0
  });
  const [selectedMemberForPassword, setSelectedMemberForPassword] = useState<Member | null>(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const loadMembers = async (searchTerm = '', page = 1) => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: '20',
        ...(searchTerm && { search: searchTerm })
      });
      
      const response = await apiRequest(`/members?${params}`);
      
      if (response.ok) {
        const data: MembersResponse = await response.json();
        setMembers(data.members || []);
        setPagination(data.pagination || {
          current_page: 1,
          last_page: 1,
          per_page: 20,
          total: 0
        });
      } else {
        setMembers([]);
        setError('Erreur lors du chargement des membres');
      }
      
      setError('');
    } catch (err: any) {
      setError('Erreur lors du chargement des membres');
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    loadMembers(search, 1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    loadMembers(search, page);
  };

  const handleChangePassword = (member: Member) => {
    setSelectedMemberForPassword(member);
    setIsPasswordModalOpen(true);
  };

  const handlePasswordChangeSuccess = () => {
    setSuccessMessage(`Mot de passe de ${selectedMemberForPassword?.first_name} ${selectedMemberForPassword?.last_name} modifié avec succès`);
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  const handleClosePasswordModal = () => {
    setSelectedMemberForPassword(null);
    setIsPasswordModalOpen(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const getStatusDisplay = (status: string) => {
    return status === 'ACTIVE' ? 'Actif' : 'Inactif';
  };

  const getStatusColor = (status: string) => {
    return status === 'ACTIVE' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  return (
    <PrivateLayout userRole="admin" userName="Admin Principal">
      <div className="space-y-4 sm:space-y-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Liste des Membres</h2>
            <p className="text-gray-600 mt-1">Gestion des membres de l'association</p>
          </div>
          <Link
            to="/admin/ajouter-membre"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors inline-flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <UserPlus className="w-4 h-4" />
            Nouveau membre
          </Link>
        </div>
        
        {/* Barre de recherche et filtres */}
        <div className="bg-white rounded-lg shadow p-4">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un membre..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>
            <button 
              type="submit"
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Search className="w-5 h-5" />
              Rechercher
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
            <p className="mt-4 text-gray-600">Chargement des membres...</p>
          </div>
        )}
                {/* Tableau des membres */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nom
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Prénom
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Statut
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Date d'inscription
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {!loading && members.length === 0 && !error && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      Aucun membre trouvé
                    </td>
                  </tr>
                )}
                {!loading && members.map((member: Member) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">{member.last_name}</span>
                        <span className="text-xs text-gray-500 sm:hidden">{member.first_name}</span>
                        <span className="text-xs text-gray-500 md:hidden">{getStatusDisplay(member.status)}</span>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                      <span className="text-sm text-gray-900">{member.first_name}</span>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">{member.email}</span>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}
                      >
                        {member.status === 'ACTIVE' ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : (
                          <XCircle className="w-3 h-3" />
                        )}
                        {getStatusDisplay(member.status)}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                      <span className="text-sm text-gray-600">{formatDate(member.created_at)}</span>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <Link
                          to={`/admin/membre/${member.id}`}
                          className="inline-flex items-center gap-1 text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-50"
                          title="Voir le profil"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleChangePassword(member)}
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                          title="Changer le mot de passe"
                        >
                          <Key className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!loading && members.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      Aucun membre trouvé
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {!loading && members.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Affichage de {((pagination.current_page - 1) * pagination.per_page) + 1} à {Math.min(pagination.current_page * pagination.per_page, pagination.total)} sur {pagination.total} membres
              </p>
              <div className="flex gap-2">
                <button 
                  onClick={() => handlePageChange(pagination.current_page - 1)}
                  disabled={pagination.current_page <= 1}
                  className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Précédent
                </button>
                
                {Array.from({ length: Math.min(5, pagination.last_page) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button 
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 rounded ${
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
                  className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Suivant
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Message de succès */}
        {successMessage && (
          <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-lg z-50">
            <p className="text-sm">{successMessage}</p>
          </div>
        )}

        {/* Modal de changement de mot de passe */}
        <ChangePasswordModal
          member={selectedMemberForPassword}
          isOpen={isPasswordModalOpen}
          onClose={handleClosePasswordModal}
          onSuccess={handlePasswordChangeSuccess}
        />
      </div>
    </PrivateLayout>
  );
}