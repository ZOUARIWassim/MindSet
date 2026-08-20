import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useUI } from '../../contexts/UIContext';
import { cn } from '../../lib/cn';

const AppLayout: React.FC = () => {
  const { sidebarCollapsed } = useUI();

  return (
    <div className="min-h-screen bg-surface">
      <Sidebar />
      <main
        className={cn(
          'min-h-screen transition-all duration-200',
          sidebarCollapsed ? 'ml-16' : 'ml-56'
        )}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
