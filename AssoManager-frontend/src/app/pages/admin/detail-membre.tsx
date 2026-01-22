import { PrivateLayout } from '@/app/components/layouts/private-layout';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Mail, Calendar, CheckCircle, Edit } from 'lucide-react';

export function DetailMembre() {
  const { id } = useParams();
  
  // Données mock du membre
  const membre = {
    id: id,
    nom: 'Dupont',
    prenom: 'Jean',
    email: 'jean.dupont@email.com',
    telephone: '06 12 34 56 78',
    adresse: '123 Rue de la République, 75001 Paris',
    dateInscription: '15/01/2021',
    statut: 'À jour',
  };
  
  const cotisations = [
    { id: 1, annee: '2024', montant: 50, statut: 'Payée', date: '15/01/2024' },
    { id: 2, annee: '2023', montant: 50, statut: 'Payée', date: '12/01/2023' },
    { id: 3, annee: '2022', montant: 45, statut: 'Payée', date: '18/01/2022' },
    { id: 4, annee: '2021', montant: 45, statut: 'Payée', date: '20/01/2021' },
  ];

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
              {membre.prenom} {membre.nom}
            </h2>
            <p className="text-gray-600 mt-1">Détails du membre</p>
          </div>
          <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
            <Edit className="w-4 h-4" />
            Modifier
          </button>
        </div>
        
        {/* Informations personnelles */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations personnelles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600">Nom complet</p>
              <p className="text-base font-medium text-gray-900 mt-1">
                {membre.prenom} {membre.nom}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-gray-600">Date d'inscription</p>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="w-4 h-4 text-gray-400" />
                <p className="text-base font-medium text-gray-900">{membre.dateInscription}</p>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <div className="flex items-center gap-2 mt-1">
                <Mail className="w-4 h-4 text-gray-400" />
                <p className="text-base font-medium text-gray-900">{membre.email}</p>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-600">Téléphone</p>
              <p className="text-base font-medium text-gray-900 mt-1">{membre.telephone}</p>
            </div>
            
            <div className="md:col-span-2">
              <p className="text-sm text-gray-600">Adresse</p>
              <p className="text-base font-medium text-gray-900 mt-1">{membre.adresse}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-600">Statut</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  <CheckCircle className="w-4 h-4" />
                  {membre.statut}
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