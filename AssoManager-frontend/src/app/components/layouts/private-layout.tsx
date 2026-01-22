import { ReactNode } from 'react';
import { Header } from '@/app/components/header';
import { Sidebar } from '@/app/components/sidebar';

interface PrivateLayoutProps {
  children: ReactNode;
  userRole: 'admin' | 'membre';
  userName?: string;
}

export function PrivateLayout({ children, userRole, userName }: PrivateLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header userRole={userRole} userName={userName} />
      <div className="flex">
        <Sidebar userRole={userRole} />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
