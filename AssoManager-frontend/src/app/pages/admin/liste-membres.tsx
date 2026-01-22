import { PrivateLayout } from '@/app/components/layouts/private-layout';
import { Link } from 'react-router-dom';
import { Search, Filter, Eye, CheckCircle, XCircle } from 'lucide-react';

export function ListeMembres() {
  const membres = [
    { id: 1, nom: 'Dupont', prenom: 'Jean', email: 'jean.dupont@email.com', statut: 'À jour', dateInscription: '15/01/2021' },
    { id: 2, nom: 'Martin', prenom: 'Marie', email: 'marie.martin@email.com', statut: 'À jour', dateInscription: '20/03/2021' },
    { id: 3, nom: 'Bernard', prenom: 'Paul', email: 'paul.bernard@email.com', statut: 'En retard', dateInscription: '10/06/2021' },
    { id: 4, nom: 'Dubois', prenom: 'Sophie', email: 'sophie.dubois@email.com', statut: 'À jour', dateInscription: '05/09/2021' },
    { id: 5, nom: 'Laurent', prenom: 'Pierre', email: 'pierre.laurent@email.com', statut: 'À jour', dateInscription: '12/11/2021' },
    { id: 6, nom: 'Simon', prenom: 'Claire', email: 'claire.simon@email.com', statut: 'En retard', dateInscription: '18/01/2022' },
    { id: 7, nom: 'Michel', prenom: 'Thomas', email: 'thomas.michel@email.com', statut: 'À jour', dateInscription: '25/02/2022' },
    { id: 8, nom: 'Lefebvre', prenom: 'Julie', email: 'julie.lefebvre@email.com', statut: 'À jour', dateInscription: '30/04/2022' },
  ];

  return (
    <PrivateLayout userRole="admin" userName="Admin Principal">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Liste des Membres</h2>
            <p className="text-gray-600 mt-1">Gestion des membres de l'association</p>
          </div>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
            + Nouveau membre
          </button>
        </div>
        
        {/* Barre de recherche et filtres */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un membre..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="w-5 h-5" />
              Filtrer
            </button>
          </div>
        </div>
        
        {/* Tableau des membres */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nom
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prénom
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date d'inscription
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {membres.map((membre) => (
                  <tr key={membre.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">{membre.nom}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{membre.prenom}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">{membre.email}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          membre.statut === 'À jour'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-orange-100 text-orange-800'
                        }`}
                      >
                        {membre.statut === 'À jour' ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : (
                          <XCircle className="w-3 h-3" />
                        )}
                        {membre.statut}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">{membre.dateInscription}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        to={`/admin/membre/${membre.id}`}
                        className="inline-flex items-center gap-1 text-green-600 hover:text-green-800"
                      >
                        <Eye className="w-4 h-4" />
                        <span className="text-sm">Voir</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-600">Affichage de 1 à 8 sur 156 membres</p>
            <div className="flex gap-2">
              <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">
                Précédent
              </button>
              <button className="px-3 py-1 bg-green-600 text-white rounded">1</button>
              <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">2</button>
              <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">3</button>
              <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">
                Suivant
              </button>
            </div>
          </div>
        </div>
      </div>
    </PrivateLayout>
  );
}