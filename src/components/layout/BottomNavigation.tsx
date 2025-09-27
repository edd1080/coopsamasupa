import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, FileSpreadsheet, AlertCircle, Settings, User } from 'lucide-react';

const BottomNavigation = () => {
  const location = useLocation();
  
  const isActive = (path: string): boolean => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  // Hide bottom navigation on request form page and application details
  if (location.pathname === '/request-form' || 
      location.pathname.startsWith('/request-form/') ||
      location.pathname.startsWith('/applications/') ||
      location.pathname.startsWith('/prospects/')) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50 pb-safe">
      <div className="flex justify-around items-center h-16">
        <Link 
          to="/" 
          className={`flex flex-col items-center justify-center w-1/3 py-2 ${isActive('/') && !isActive('/applications') && !isActive('/settings') ? 'text-primary' : 'text-muted-foreground'}`}
        >
          <Home className="h-6 w-6 mb-1" />
          <span className="text-xs">Inicio</span>
        </Link>

        <Link 
          to="/applications" 
          className={`flex flex-col items-center justify-center w-1/3 py-2 ${isActive('/applications') ? 'text-primary' : 'text-muted-foreground'}`}
        >
          <FileSpreadsheet className="h-6 w-6 mb-1" />
          <span className="text-xs">Solicitudes</span>
        </Link>

        <Link 
          to="/settings" 
          className={`flex flex-col items-center justify-center w-1/3 py-2 ${isActive('/settings') ? 'text-primary' : 'text-muted-foreground'}`}
        >
          <Settings className="h-6 w-6 mb-1" />
          <span className="text-xs">Ajustes</span>
        </Link>
      </div>
    </div>
  );
};

export default BottomNavigation;