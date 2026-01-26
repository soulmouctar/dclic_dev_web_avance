import { useState, useEffect } from 'react';
import { PrivateLayout } from '@/app/components/layouts/private-layout';
import { Search, Key, CheckCircle, AlertCircle, User } from 'lucide-react';
import { apiRequest } from '../../config/api';

interface Member {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: 'ADMIN' | 'MEMBER';
  status: 'ACTIVE' | 'INACTIVE';
}

export function ChangerMotDePasse() {
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [search, setSearch] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      const params = new URLSearchParams({
        per_page: '50',
        ...(search && { search })
      });
      
      const response = await apiRequest(`/members?${params}`);
      
      if (response.ok) {
        const data = await response.json();
        setMembers(data.members || []);
      } else {
        setMembers([]);
      }
    } catch (err: any) {
      setError('Erreur lors du chargement des membres');
    }
  };

  const filteredMembers = members.filter(member =>
    `${member.first_name} ${member.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
    member.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMember) {
      setError('Veuillez sélectionner un membre');
      return;
    }

    if (newPassword.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await apiRequest(`/members/${selectedMember.id}/change-password`, {
        method: 'PUT',
        body: JSON.stringify({
          password: newPassword,
          password_confirmation: confirmPassword
        })
      });

      setSuccess(true);
      setNewPassword('');
      setConfirmPassword('');
      setSelectedMember(null);
      setSearch('');
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erreur lors du changement de mot de passe';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedMember(null);
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setSuccess(false);
    setSearch('');
  };

  return (
    <PrivateLayout userRole="admin" userName="Admin Principal">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow p-8">
          <div className="text-center mb-6">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
              <Key className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Changer le mot de passe d'un membre</h2>
            <p className="text-gray-600 mt-2">
              Sélectionnez un membre et définissez un nouveau mot de passe
            </p>
          </div>

          {success && (
            <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              Le mot de passe a été changé avec succès !
            </div>
          )}

          {error && (
            <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Sélection du membre */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Rechercher et sélectionner un membre
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  id="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Rechercher par nom ou email..."
                />
              </div>

              {/* Liste des membres filtrés */}
              {search && (
                <div className="mt-2 max-h-40 overflow-y-auto border border-gray-300 rounded-lg">
                  {filteredMembers.length > 0 ? (
                    filteredMembers.map((member) => (
                      <button
                        key={member.id}
                        type="button"
                        onClick={() => {
                          setSelectedMember(member);
                          setSearch(`${member.first_name} ${member.last_name}`);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b border-gray-200 last:border-b-0"
                      >
                        <div className="flex items-center">
                          <User className="w-4 h-4 text-gray-400 mr-2" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {member.first_name} {member.last_name}
                            </p>
                            <p className="text-xs text-gray-500">{member.email}</p>
                          </div>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-sm text-gray-500">
                      Aucun membre trouvé
                    </div>
                  )}
                </div>
              )}

              {/* Membre sélectionné */}
              {selectedMember && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <User className="w-5 h-5 text-blue-600 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {selectedMember.first_name} {selectedMember.last_name}
                        </p>
                        <p className="text-xs text-gray-500">{selectedMember.email}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedMember(null);
                        setSearch('');
                      }}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Changer
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Nouveau mot de passe */}
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Nouveau mot de passe
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Minimum 6 caractères"
                  required
                  minLength={6}
                />
              </div>
            </div>

            {/* Confirmer le mot de passe */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirmer le nouveau mot de passe
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Répétez le mot de passe"
                  required
                />
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading || !selectedMember || !newPassword || !confirmPassword}
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Changement en cours...
                  </>
                ) : (
                  <>
                    <Key className="w-4 h-4" />
                    Changer le mot de passe
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
            </div>
          </form>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Attention :</strong> Le changement de mot de passe prendra effet immédiatement. 
              L'utilisateur devra utiliser le nouveau mot de passe pour se connecter.
            </p>
          </div>
        </div>
      </div>
    </PrivateLayout>
  );
}
