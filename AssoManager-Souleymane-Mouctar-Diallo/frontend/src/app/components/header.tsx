import { LogOut, User, Menu } from 'lucide-react';
import { Logo } from '@/app/components/logo';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  userRole: 'admin' | 'membre';
  userName?: string;
  onMenuClick?: () => void;
}

export function Header({ userRole = 'membre', userName = 'Jean Dupont', onMenuClick }: HeaderProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            {/* Bouton hamburger pour mobile */}
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 mr-3"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Logo size="md" showText={true} />
          </div>
        
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2 text-gray-700">
              <User className="w-5 h-5" />
              <span className="text-sm font-medium hidden sm:inline">{userName}</span>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {userRole === 'admin' ? 'Admin' : 'Membre'}
              </span>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}