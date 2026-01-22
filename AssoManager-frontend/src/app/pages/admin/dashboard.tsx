import { PrivateLayout } from '@/app/components/layouts/private-layout';
import { Users, CreditCard, TrendingUp, AlertCircle } from 'lucide-react';

export function DashboardAdmin() {
  return (
    <PrivateLayout userRole="admin" userName="Admin Principal">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard Administrateur</h2>
          <p className="text-gray-600 mt-1">Vue d'ensemble de l'association</p>
        </div>
        
        {/* Cartes statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Membres</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">156</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-xs text-green-600 mt-2">+12 ce mois</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Membres à jour</p>
                <p className="text-3xl font-bold text-green-600 mt-1">142</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">91% du total</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En retard</p>
                <p className="text-3xl font-bold text-orange-600 mt-1">14</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">9% du total</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Revenus 2024</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">7 800 €</p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-gray-600" />
              </div>
            </div>
            <p className="text-xs text-green-600 mt-2">+15% vs 2023</p>
          </div>
        </div>
        
        {/* Graphique simplifié */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Évolution des cotisations</h3>
          <div className="h-64 flex items-end gap-4">
            <div className="flex-1 flex flex-col items-center">
              <div className="w-full bg-green-600 rounded-t" style={{ height: '60%' }}></div>
              <span className="text-xs text-gray-600 mt-2">Jan</span>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div className="w-full bg-green-600 rounded-t" style={{ height: '75%' }}></div>
              <span className="text-xs text-gray-600 mt-2">Fév</span>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div className="w-full bg-green-600 rounded-t" style={{ height: '55%' }}></div>
              <span className="text-xs text-gray-600 mt-2">Mar</span>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div className="w-full bg-green-600 rounded-t" style={{ height: '80%' }}></div>
              <span className="text-xs text-gray-600 mt-2">Avr</span>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div className="w-full bg-green-600 rounded-t" style={{ height: '45%' }}></div>
              <span className="text-xs text-gray-600 mt-2">Mai</span>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div className="w-full bg-green-600 rounded-t" style={{ height: '90%' }}></div>
              <span className="text-xs text-gray-600 mt-2">Juin</span>
            </div>
          </div>
        </div>
        
        {/* Dernières activités */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Activités récentes</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div>
                <p className="text-sm font-medium text-gray-900">Nouvelle cotisation</p>
                <p className="text-xs text-gray-500">Marie Martin - 50€</p>
              </div>
              <span className="text-xs text-gray-500">Il y a 2h</span>
            </div>
            
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div>
                <p className="text-sm font-medium text-gray-900">Nouveau membre</p>
                <p className="text-xs text-gray-500">Pierre Dubois</p>
              </div>
              <span className="text-xs text-gray-500">Il y a 5h</span>
            </div>
            
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div>
                <p className="text-sm font-medium text-gray-900">Cotisation validée</p>
                <p className="text-xs text-gray-500">Sophie Laurent - 50€</p>
              </div>
              <span className="text-xs text-gray-500">Hier</span>
            </div>
          </div>
        </div>
      </div>
    </PrivateLayout>
  );
}