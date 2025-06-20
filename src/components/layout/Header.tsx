
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, PlusCircle, X } from 'lucide-react';
import { formatApplicationId } from '@/utils/applicationIdGenerator';
import { getFirstName } from '@/utils/nameExtraction';

interface HeaderProps {
  personName?: string;
  applicationId?: string;
  onExitFormClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ personName, applicationId, onExitFormClick }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Definir páginas principales que NO deben tener botón atrás
  const mainPages = ['/', '/applications', '/prequalifications', '/settings'];
  const isMainPage = mainPages.includes(location.pathname);
  
  // Actualizar lógica para detectar formularios - incluir /applications/new
  const isFormPage = location.pathname.includes('/request-form') || 
                     location.pathname === '/applications/new' ||
                     (location.pathname.includes('/applications/') && location.pathname.includes('/edit'));
  
  const isApplicationDetails = location.pathname.includes('/applications/') && 
                              !location.pathname.includes('/request-form') && 
                              !location.pathname.includes('/new') && 
                              !location.pathname.includes('/edit');

  const handleBackClick = () => {
    if (isFormPage || isApplicationDetails) {
      navigate('/applications');
    } else {
      navigate(-1);
    }
  };

  const handleNewApplication = () => {
    console.log('🎯 Header: Nueva solicitud button clicked');
    navigate('/applications/new');
  };

  const getPageTitle = () => {
    // Títulos específicos para cada pantalla principal
    if (location.pathname === '/') return "Coopsama App";
    if (location.pathname === '/applications') return "Solicitudes";
    if (location.pathname === '/prequalifications') return "Precalificación";
    if (location.pathname === '/settings') return "Ajustes";
    
    // Para formularios de solicitud y detalles de aplicación
    if (isFormPage || isApplicationDetails) {
      // Si hay nombre de persona, usar solo el primer nombre
      if (personName) {
        return getFirstName(personName);
      }
      // Si no hay applicationId o es una nueva solicitud, mostrar "Solicitud Nueva"
      if (!applicationId || location.pathname === '/applications/new') return "Solicitud Nueva";
      // Si hay applicationId pero no nombre, usar el ID formateado
      return `Solicitud ${formatApplicationId(applicationId)}`;
    }
    
    // Fallback solo si no coincide con ningún caso anterior
    return "Coopsama App";
  };

  const getSubtitle = () => {
    // Solo mostrar subtítulo para formularios y detalles de aplicación
    if ((isFormPage || isApplicationDetails) && applicationId && location.pathname !== '/applications/new') {
      return `Solicitud ${formatApplicationId(applicationId)}`;
    }
    return null;
  };

  return (
    <header className="bg-background border-b border-border/40 sticky top-0 z-40 w-full backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4">
        {/* Left side - Back button + Title */}
        <div className="flex items-center gap-2">
          {!isMainPage && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBackClick}
              className="h-9 w-9"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          
          {/* Title aligned to the left */}
          <div className="flex flex-col justify-center min-h-[32px]">
            <h1 className="text-lg font-semibold leading-tight">{getPageTitle()}</h1>
            {getSubtitle() && (
              <p className="text-xs text-muted-foreground leading-tight">{getSubtitle()}</p>
            )}
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-2">
          {/* Botón X para formularios */}
          {isFormPage && onExitFormClick && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onExitFormClick}
              className="h-9 w-9 hover:bg-destructive/10 hover:text-destructive"
              title="Salir de la solicitud"
            >
              <X className="h-4 w-4" />
            </Button>
          )}

          {/* Nueva Solicitud button - solo en homepage */}
          {location.pathname === '/' && (
            <Button
              onClick={handleNewApplication}
              size="sm"
              className="hidden sm:flex"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Nueva Solicitud
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
