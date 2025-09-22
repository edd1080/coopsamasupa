
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, PlusCircle, X } from 'lucide-react';
import { formatApplicationId } from '@/utils/applicationIdGenerator';
import { getFirstNameAndLastName } from '@/lib/nameUtils';

interface HeaderProps {
  personName?: string;
  applicationId?: string;
  externalReferenceId?: string;
  applicationStatus?: string;
  onExitFormClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ personName, applicationId, externalReferenceId, applicationStatus, onExitFormClick }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Definir páginas principales que NO deben tener botón atrás
  const mainPages = ['/', '/applications', '/settings'];
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
    if (location.pathname === '/settings') return "Ajustes";
    
    // Para formularios de solicitud y detalles de aplicación
    if (isFormPage || isApplicationDetails) {
      // Si hay nombre de persona, usar primer nombre y apellido
      if (personName) {
        return getFirstNameAndLastName(personName);
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
      // Priorizar SCO_XXXXXX > externalReferenceId > "Borrador" para drafts
      if (applicationId && applicationId.startsWith('SCO_')) {
        return `ID: ${applicationId}`;
      }
      if (externalReferenceId) {
        return `ID: ${externalReferenceId}`;
      }
      if (applicationStatus === 'draft') {
        return 'Borrador';
      }
      return `Solicitud ${formatApplicationId(applicationId)}`;
    }
    return null;
  };

  const getStatusBadgeVariant = (status?: string) => {
    switch (status) {
      case 'approved': return 'default';
      case 'reviewing': return 'secondary';
      case 'pending': return 'outline';
      case 'rejected': return 'destructive';
      case 'draft': return 'outline';
      default: return 'outline';
    }
  };

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case 'approved': return 'Aprobada';
      case 'reviewing': return 'En Revisión';
      case 'pending': return 'Pendiente';
      case 'rejected': return 'Rechazada';
      case 'draft': return 'Activa';
      default: return 'Sin Estado';
    }
  };

  return (
    <header className="bg-background border-b border-border/40 sticky top-0 z-40 w-full backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className={`container flex items-center justify-between px-4 ${
        isFormPage || isApplicationDetails ? 'h-16 py-3' : 'h-14'
      }`}>
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
          {/* Status badge para formularios y detalles de aplicación */}
          {(isFormPage || isApplicationDetails) && applicationStatus && (
            <Badge 
              variant={getStatusBadgeVariant(applicationStatus)}
              className="text-xs"
            >
              {getStatusLabel(applicationStatus)}
            </Badge>
          )}

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
