import { useState, useEffect } from 'react';
import { PrivateLayout } from '@/app/components/layouts/private-layout';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { contributionService, CreateContributionData } from '../../services/contributionService';
import { memberService, Member } from '../../services/memberService';

export function AjouterCotisation() {
  const navigate = useNavigate();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    user_id: '',
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    amount: '',
    payment_date: new Date().toISOString().split('T')[0],
    payment_method: 'CASH' as 'CASH' | 'TRANSFER' | 'OTHER',
    reference: ''
  });

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      const response = await memberService.getMembers('', 1);
      setMembers(response.members);
    } catch (err: any) {
      setError('Erreur lors du chargement des membres');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const contributionData: CreateContributionData = {
        user_id: parseInt(formData.user_id),
        year: formData.year,
        month: formData.month,
        amount: parseFloat(formData.amount),
        payment_date: formData.payment_date,
        payment_method: formData.payment_method,
        reference: formData.reference || undefined
      };

      await contributionService.createContribution(contributionData);
      setSuccess('Cotisation enregistrée avec succès !');
      
      // Redirection après 2 secondes
      setTimeout(() => {
        navigate('/admin/membres');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de l\'enregistrement de la cotisation');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

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
        
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Ajouter une cotisation</h2>
          <p className="text-gray-600 mt-1">Enregistrer une nouvelle cotisation pour un membre</p>
        </div>
        
        {/* Messages d'erreur et de succès */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {success}
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="user_id" className="block text-sm font-medium text-gray-700 mb-1">
                  Membre *
                </label>
                <select
                  id="user_id"
                  name="user_id"
                  value={formData.user_id}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                >
                  <option value="">Sélectionner un membre</option>
                  {members.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.first_name} {member.last_name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
                  Année *
                </label>
                <input
                  type="number"
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  min="2020"
                  max={new Date().getFullYear() + 1}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>
              
              <div>
                <label htmlFor="month" className="block text-sm font-medium text-gray-700 mb-1">
                  Mois *
                </label>
                <select
                  id="month"
                  name="month"
                  value={formData.month}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                >
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
              
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                  Montant (€) *
                </label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  placeholder="50.00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>
              
              <div>
                <label htmlFor="payment_date" className="block text-sm font-medium text-gray-700 mb-1">
                  Date de paiement *
                </label>
                <input
                  type="date"
                  id="payment_date"
                  name="payment_date"
                  value={formData.payment_date}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>
              
              <div>
                <label htmlFor="payment_method" className="block text-sm font-medium text-gray-700 mb-1">
                  Méthode de paiement *
                </label>
                <select
                  id="payment_method"
                  name="payment_method"
                  value={formData.payment_method}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                >
                  <option value="CASH">Espèces</option>
                  <option value="TRANSFER">Virement</option>
                  <option value="OTHER">Autre</option>
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="reference" className="block text-sm font-medium text-gray-700 mb-1">
                  Référence
                </label>
                <input
                  type="text"
                  id="reference"
                  name="reference"
                  value={formData.reference}
                  onChange={handleInputChange}
                  placeholder="Numéro de référence ou notes..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>
            </div>
            
            <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
              <Link
                to="/admin/membres"
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Enregistrement...' : 'Enregistrer la cotisation'}
              </button>
            </div>
          </form>
        </div>
        
        {/* Section d'aide */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-green-900 mb-2">💡 Aide</h4>
          <ul className="text-sm text-green-800 space-y-1">
            <li>• Sélectionnez le membre pour lequel vous souhaitez ajouter une cotisation</li>
            <li>• Indiquez l'année concernée et le montant payé</li>
            <li>• La date de paiement et la méthode sont importantes pour le suivi</li>
            <li>• Vous pouvez ajouter des notes pour des informations complémentaires</li>
          </ul>
        </div>
      </div>
    </PrivateLayout>
  );
}