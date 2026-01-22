import { LogOut, User } from 'lucide-react';
import { Logo } from '@/app/components/logo';

interface HeaderProps {
  userRole?: 'admin' | 'membre';
  userName?: string;
}

export function Header({ userRole = 'membre', userName = 'Jean Dupont' }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <Logo size="md" showText={true} />
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-gray-700">
            <User className="w-5 h-5" />
            <span className="text-sm font-medium">{userName}</span>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {userRole === 'admin' ? 'Admin' : 'Membre'}
            </span>
          </div>
          <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
            <LogOut className="w-5 h-5" />
            <span className="text-sm">Déconnexion</span>
          </button>
        </div>
      </div>
    </header>
  );
}