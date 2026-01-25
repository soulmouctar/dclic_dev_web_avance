import { ReactNode, useState } from 'react';
import { Header } from '@/app/components/header';
import { Sidebar } from '@/app/components/sidebar';

interface PrivateLayoutProps {
  children: ReactNode;
  userRole: 'admin' | 'membre';
  userName?: string;
}

export function PrivateLayout({ children, userRole, userName }: PrivateLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header 
        userRole={userRole} 
        userName={userName} 
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
      />
      <div className="flex pt-16">
        <Sidebar 
          userRole={userRole} 
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:ml-0">
          {children}
        </main>
      </div>
    </div>
  );
}
