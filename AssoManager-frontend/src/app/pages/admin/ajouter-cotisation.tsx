import { PrivateLayout } from '@/app/components/layouts/private-layout';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function AjouterCotisation() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
        
        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="membre" className="block text-sm font-medium text-gray-700 mb-1">
                  Membre *
                </label>
                <select
                  id="membre"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                >
                  <option value="">Sélectionner un membre</option>
                  <option value="1">Dupont Jean</option>
                  <option value="2">Martin Marie</option>
                  <option value="3">Bernard Paul</option>
                  <option value="4">Dubois Sophie</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="annee" className="block text-sm font-medium text-gray-700 mb-1">
                  Année *
                </label>
                <select
                  id="annee"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                >
                  <option value="">Sélectionner une année</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="montant" className="block text-sm font-medium text-gray-700 mb-1">
                  Montant (€) *
                </label>
                <input
                  type="number"
                  id="montant"
                  required
                  min="0"
                  step="0.01"
                  placeholder="50.00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>
              
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                  Date de paiement *
                </label>
                <input
                  type="date"
                  id="date"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>
              
              <div>
                <label htmlFor="methode" className="block text-sm font-medium text-gray-700 mb-1">
                  Méthode de paiement
                </label>
                <select
                  id="methode"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                >
                  <option value="">Sélectionner une méthode</option>
                  <option value="virement">Virement bancaire</option>
                  <option value="cheque">Chèque</option>
                  <option value="especes">Espèces</option>
                  <option value="carte">Carte bancaire</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="statut" className="block text-sm font-medium text-gray-700 mb-1">
                  Statut *
                </label>
                <select
                  id="statut"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                >
                  <option value="payee">Payée</option>
                  <option value="en-attente">En attente</option>
                  <option value="annulee">Annulée</option>
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  id="notes"
                  rows={4}
                  placeholder="Informations complémentaires..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                ></textarea>
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
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Enregistrer la cotisation
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