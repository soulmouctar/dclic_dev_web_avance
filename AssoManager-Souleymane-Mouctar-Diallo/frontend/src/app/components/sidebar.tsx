import { Link, useLocation } from 'react-router-dom';
import { Home, Users, CreditCard, BarChart3, Settings, TrendingUp, List, X } from 'lucide-react';

interface SidebarProps {
  userRole: 'admin' | 'membre';
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ userRole, isOpen = false, onClose }: SidebarProps) {
  const location = useLocation();
  
  const memberLinks = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/mes-cotisations', icon: CreditCard, label: 'Mes Cotisations' },
  ];
  
  const adminLinks = [
    { path: '/admin/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/admin/membres', icon: Users, label: 'Liste des Membres' },
    { path: '/admin/liste-cotisations', icon: List, label: 'Liste des Cotisations' },
    { path: '/admin/statistiques', icon: BarChart3, label: 'Statistiques' },
    // { path: '/admin/statistiques-membres', icon: TrendingUp, label: 'Stats par Membre' },
    { path: '/admin/gestion-utilisateurs', icon: Settings, label: 'Gestion Utilisateurs' },
  ];
  
  const links = userRole === 'admin' ? adminLinks : memberLinks;
  
  return (
    <>
      {/* Overlay pour mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-45 w-64 bg-gray-50 border-r border-gray-200 min-h-screen p-4 pt-20 lg:pt-4
        transform transition-transform duration-300 ease-in-out lg:transform-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Bouton fermer pour mobile */}
        <div className="flex justify-end mb-4 lg:hidden">
          <button
            onClick={onClose}
            className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="space-y-2">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={onClose} // Fermer la sidebar sur mobile après clic
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-green-600 text-white'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}