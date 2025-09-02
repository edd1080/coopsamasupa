
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, FileSpreadsheet, AlertCircle, Settings, User } from 'lucide-react';

const BottomNavigation = () => {
  const location = useLocation();
  
  const isActive = (path: string): boolean => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
      <div className="flex justify-around items-center h-20 pb-safe">
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

        {/* Alertas section commented out but preserved for future use
        <Link 
          to="/alerts" 
          className={`flex flex-col items-center justify-center w-1/5 py-2 ${isActive('/alerts') ? 'text-primary' : 'text-muted-foreground'}`}
        >
          <AlertCircle className="h-6 w-6 mb-1" />
          <span className="text-xs">Alertas</span>
        </Link>
        */}

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
