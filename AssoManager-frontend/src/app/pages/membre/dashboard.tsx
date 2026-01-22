import { PrivateLayout } from '@/app/components/layouts/private-layout';
import { CreditCard, Calendar, CheckCircle, AlertCircle } from 'lucide-react';

export function DashboardMembre() {
  return (
    <PrivateLayout userRole="membre" userName="Jean Dupont">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Tableau de bord</h2>
          <p className="text-gray-600 mt-1">Bienvenue, Jean Dupont</p>
        </div>
        
        {/* Cartes statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cotisation en cours</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">2024</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Statut</p>
                <p className="text-2xl font-bold text-green-600 mt-1">À jour</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total payé</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">50 €</p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Notifications */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Cotisation validée</p>
                <p className="text-sm text-gray-600">Votre cotisation 2024 a été validée le 15/01/2024</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <AlertCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Prochaine assemblée générale</p>
                <p className="text-sm text-gray-600">Prévue le 15/03/2024 à 18h00</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Historique récent */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Historique récent</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div>
                <p className="text-sm font-medium text-gray-900">Cotisation 2024</p>
                <p className="text-xs text-gray-500">15 janvier 2024</p>
              </div>
              <span className="text-sm font-medium text-green-600">+ 50 €</span>
            </div>
            
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div>
                <p className="text-sm font-medium text-gray-900">Cotisation 2023</p>
                <p className="text-xs text-gray-500">12 janvier 2023</p>
              </div>
              <span className="text-sm font-medium text-green-600">+ 50 €</span>
            </div>
          </div>
        </div>
      </div>
    </PrivateLayout>
  );
}