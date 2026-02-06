'use client';

import { ReactNode } from 'react';
import { useSidebar } from '@/contexts/SidebarContext';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { collapsed } = useSidebar();

  return (
    <main className={`flex-1 transition-all duration-300 pl-4 pr-4 pt-4 pb-8 md:pl-6 md:pr-6 md:pt-6 md:pb-12 ${collapsed ? 'md:ml-16' : 'md:ml-60'}`}>
      {children}
    </main>
  );
}