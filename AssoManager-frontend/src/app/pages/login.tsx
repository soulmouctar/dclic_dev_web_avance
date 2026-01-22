import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PublicLayout } from '@/app/components/layouts/public-layout';
import { Logo } from '@/app/components/logo';

export function LoginPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState<'admin' | 'membre'>('membre');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <PublicLayout>
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="flex items-center justify-center mb-6">
          <Logo size="lg" showText={true} />
        </div>
        
        <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
          Connexion
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              placeholder="exemple@email.com"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              placeholder="••••••••"
            />
          </div>
          
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
              Se connecter en tant que
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value as 'admin' | 'membre')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            >
              <option value="membre">Membre</option>
              <option value="admin">Administrateur</option>
            </select>
          </div>
          
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            Se connecter
          </button>
        </form>
        
        <p className="text-center text-sm text-gray-600 mt-4">
          Pas encore de compte ?{' '}
          <Link to="/register" className="text-green-600 hover:underline">
            S'inscrire
          </Link>
        </p>
      </div>
    </PublicLayout>
  );
}