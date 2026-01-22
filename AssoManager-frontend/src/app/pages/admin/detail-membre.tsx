import { useState, useEffect } from 'react';
import { PrivateLayout } from '@/app/components/layouts/private-layout';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Mail, Calendar, CheckCircle, Edit, XCircle } from 'lucide-react';
import { memberService, MemberDetail } from '../../services/memberService';

export function DetailMembre() {
  const { id } = useParams<{ id: string }>();
  const [memberDetail, setMemberDetail] = useState<MemberDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);

  const loadMemberDetail = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const data = await memberService.getMemberDetail(parseInt(id));
      setMemberDetail(data);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors du chargement des détails du membre');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMemberDetail();
  }, [id]);

  const handleStatusToggle = async () => {
    if (!memberDetail) return;
    
    try {
      setUpdating(true);
      const newStatus = memberDetail.member.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      const updatedMember = await memberService.updateMemberStatus(memberDetail.member.id, newStatus);
      
      setMemberDetail({
        ...memberDetail,
        member: { ...memberDetail.member, status: updatedMember.status }
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour du statut');
    } finally {
      setUpdating(false);
    }
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

  if (loading) {
    return (
      <PrivateLayout userRole="admin" userName="Admin Principal">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des détails du membre...</p>
        </div>
      </PrivateLayout>
    );
  }

  if (error || !memberDetail) {
    return (
      <PrivateLayout userRole="admin" userName="Admin Principal">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error || 'Membre introuvable'}
        </div>
      </PrivateLayout>
    );
  }

  return (
    <PrivateLayout userRole="admin" userName="Admin Principal">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link
            to="/admin/membres"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Retour</span>
          </Link>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {memberDetail.member.first_name} {memberDetail.member.last_name}
            </h2>
            <p className="text-gray-600 mt-1">Détails du membre</p>
          </div>
          <button 
            onClick={handleStatusToggle}
            disabled={updating}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              memberDetail.member.status === 'ACTIVE'
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-green-600 text-white hover:bg-green-700'
            } disabled:opacity-50`}
          >
            {memberDetail.member.status === 'ACTIVE' ? (
              <XCircle className="w-4 h-4" />
            ) : (
              <CheckCircle className="w-4 h-4" />
            )}
            {updating ? 'Mise à jour...' : (memberDetail.member.status === 'ACTIVE' ? 'Désactiver' : 'Activer')}
          </button>
        </div>
        
        {/* Informations personnelles */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations personnelles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600">Nom complet</p>
              <p className="text-base font-medium text-gray-900 mt-1">
                {memberDetail.member.first_name} {memberDetail.member.last_name}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-gray-600">Date d'inscription</p>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="w-4 h-4 text-gray-400" />
                <p className="text-base font-medium text-gray-900">{formatDate(memberDetail.member.created_at)}</p>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <div className="flex items-center gap-2 mt-1">
                <Mail className="w-4 h-4 text-gray-400" />
                <p className="text-base font-medium text-gray-900">{memberDetail.member.email}</p>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-600">Rôle</p>
              <p className="text-base font-medium text-gray-900 mt-1">{memberDetail.member.role}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-600">Statut</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(memberDetail.member.status)}`}>
                  {memberDetail.member.status === 'ACTIVE' ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <XCircle className="w-4 h-4" />
                  )}
                  {getStatusDisplay(memberDetail.member.status)}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Historique des cotisations */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Historique des cotisations</h3>
            <Link
              to="/admin/ajouter-cotisation"
              className="text-green-600 hover:text-green-800 text-sm font-medium"
            >
              + Ajouter une cotisation
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Année
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Montant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date de paiement
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {memberDetail.payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">{payment.year}/{payment.month}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{payment.amount} €</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">{formatDate(payment.payment_date)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3" />
                        {payment.payment_method}
                      </span>
                    </td>
                  </tr>
                ))}
                {memberDetail.payments.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                      Aucune cotisation enregistrée
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