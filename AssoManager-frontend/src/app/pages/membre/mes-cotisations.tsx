import { PrivateLayout } from '@/app/components/layouts/private-layout';
import { CheckCircle, XCircle } from 'lucide-react';

export function MesCotisations() {
  const cotisations = [
    { id: 1, annee: '2024', montant: 50, statut: 'Payée', date: '15/01/2024' },
    { id: 2, annee: '2023', montant: 50, statut: 'Payée', date: '12/01/2023' },
    { id: 3, annee: '2022', montant: 45, statut: 'Payée', date: '18/01/2022' },
    { id: 4, annee: '2021', montant: 45, statut: 'Payée', date: '20/01/2021' },
  ];

  return (
    <PrivateLayout userRole="membre" userName="Jean Dupont">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Mes Cotisations</h2>
          <p className="text-gray-600 mt-1">Historique de vos cotisations</p>
        </div>
        
        {/* Carte de résumé */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-600">Total payé</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">190 €</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Cotisations payées</p>
              <p className="text-3xl font-bold text-green-600 mt-1">4</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Statut actuel</p>
              <div className="flex items-center gap-2 mt-1">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <p className="text-xl font-bold text-green-600">À jour</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tableau des cotisations */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Historique détaillé</h3>
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
                {cotisations.map((cotisation) => (
                  <tr key={cotisation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">{cotisation.annee}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{cotisation.montant} €</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">{cotisation.date}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3" />
                        {cotisation.statut}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PrivateLayout>
  );
}
