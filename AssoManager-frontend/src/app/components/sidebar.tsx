import { Link, useLocation } from 'react-router-dom';
import { Home, Users, CreditCard, Plus } from 'lucide-react';

interface SidebarProps {
  userRole: 'admin' | 'membre';
}

export function Sidebar({ userRole }: SidebarProps) {
  const location = useLocation();
  
  const memberLinks = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/mes-cotisations', icon: CreditCard, label: 'Mes Cotisations' },
  ];
  
  const adminLinks = [
    { path: '/admin/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/admin/membres', icon: Users, label: 'Liste des Membres' },
    { path: '/admin/ajouter-cotisation', icon: Plus, label: 'Ajouter Cotisation' },
  ];
  
  const links = userRole === 'admin' ? adminLinks : memberLinks;
  
  return (
    <aside className="w-64 bg-gray-50 border-r border-gray-200 min-h-screen p-4">
      <nav className="space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          
          return (
            <Link
              key={link.path}
              to={link.path}
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
  );
}