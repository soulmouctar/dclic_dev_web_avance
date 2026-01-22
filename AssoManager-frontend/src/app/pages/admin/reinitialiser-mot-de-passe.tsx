import { useState } from 'react';
import { PrivateLayout } from '@/app/components/layouts/private-layout';
import { Key, Mail, Send, CheckCircle } from 'lucide-react';

export function ReinitialiserMotDePasse() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // TODO: Implémenter l'API de réinitialisation de mot de passe
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulation
      setSuccess(true);
    } catch (err: any) {
      setError('Erreur lors de l\'envoi de l\'email de réinitialisation');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setEmail('');
    setSuccess(false);
    setError('');
  };

  return (
    <PrivateLayout userRole="admin" userName="Admin Principal">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow p-8">
          <div className="text-center mb-6">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
              <Key className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Réinitialiser le mot de passe</h2>
            <p className="text-gray-600 mt-2">
              Envoyez un lien de réinitialisation à un utilisateur
            </p>
          </div>

          {success ? (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Email envoyé !</h3>
              <p className="text-gray-600 mb-6">
                Un lien de réinitialisation a été envoyé à <strong>{email}</strong>
              </p>
              <button
                onClick={handleReset}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
              >
                Envoyer un autre email
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse email de l'utilisateur
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="utilisateur@example.com"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Envoyer le lien de réinitialisation
                  </>
                )}
              </button>
            </form>
          )}

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Note :</strong> L'utilisateur recevra un email avec un lien sécurisé pour réinitialiser son mot de passe. Le lien expirera après 24 heures.
            </p>
          </div>
        </div>
      </div>
    </PrivateLayout>
  );
}
