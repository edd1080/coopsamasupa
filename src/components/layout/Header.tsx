
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, X, User, Users, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';

// Import the form context to access exit dialog functionality
import { useFormContext } from '@/components/requestForm/RequestFormProvider';

const applicationStatuses = {
  'pending': {
    label: 'Pendiente',
    color: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
  },
  'reviewing': {
    label: 'En revisión',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
  },
  'approved': {
    label: 'Aprobado',
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
  },
  'rejected': {
    label: 'Rechazado',
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }
};

const Header = ({
  personName,
  applicationStatus,
  applicationId
}: {
  personName?: string;
  applicationStatus?: string;
  applicationId?: string;
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Try to get form context if available (only in request form routes)
  let formContext;
  try {
    formContext = useFormContext();
  } catch {
    // Not in a form context, continue with normal behavior
    formContext = null;
  }

  // Determine if we're in a guarantor form
  const isGuarantorForm = location.pathname.includes('/guarantors');

  // Check if we're on application details page
  const isApplicationDetailsPage = location.pathname.match(/^\/applications\/[^\/]+(?:\/edit)?$/);

  // Check if we're creating a new application
  const isNewApplication = location.pathname === '/applications/new';

  // Check if we should center the title (mobile view for specific pages)
  const shouldCenterTitle = ['/', '/applications', '/prequalifications', '/settings'].includes(location.pathname);

  // Get page title based on current path
  const getPageTitle = () => {
    const isEditRoute = location.pathname.includes('/edit');
    
    // If we have an applicationId, show it (for application details pages)
    if (applicationId && isApplicationDetailsPage) {
      return applicationId;
    }
    
    if (personName && isEditRoute) {
      return personName;
    }
    
    switch (location.pathname) {
      case '/':
        return 'Coopsama App';
      case '/prospects':
        return 'Prospectos';
      case '/applications':
        return 'Solicitudes';
      case '/applications/new':
        return 'Nueva Solicitud';
      case '/prequalifications':
        return 'Precalificaciones';
      case '/alerts':
        return 'Alertas';
      case '/settings':
        return 'Ajustes';
      case '/login':
        return 'Iniciar Sesión';
      default:
        return 'Coopsama App';
    }
  };

  const handleGoBack = () => {
    // Special handling for edit routes
    if (location.pathname.includes('/edit')) {
      // Extract application ID from path like "/applications/SCO_884214/edit"
      const pathParts = location.pathname.split('/');
      const appId = pathParts[2];
      if (appId) {
        navigate(`/applications/${appId}`);
      } else {
        navigate('/applications');
      }
    } else if (location.pathname.match(/^\/applications\/[^\/]+$/)) {
      // From application details to applications list
      navigate('/applications');
    } else {
      // Default back behavior
      navigate(-1);
    }
  };

  const handleExit = () => {
    // If we're in a form context (request form), use the form's exit handler
    if (formContext && (location.pathname.includes('/edit') || isNewApplication)) {
      formContext.handleShowExitDialog();
    } else {
      // Default behavior for other routes
      if (location.pathname.includes('/edit')) {
        navigate('/applications');
      } else {
        navigate(-1);
      }
    }
  };

  // Show back button for application details and edit routes (but not main pages or new applications)
  const showBackButton = !['/', '/prospects', '/applications', '/prequalifications', '/alerts', '/settings', '/login'].includes(location.pathname) && !isNewApplication;

  // Show X button for new applications and edit routes
  const showExitButton = isNewApplication || location.pathname.includes('/edit');

  const getStatusBadge = () => {
    if (!applicationStatus || !isApplicationDetailsPage) return null;
    
    const statusConfig = applicationStatuses[applicationStatus as keyof typeof applicationStatuses];
    if (!statusConfig) return null;

    return (
      <Badge className={`text-xs px-2 py-1 ${statusConfig.color}`}>
        {statusConfig.label}
      </Badge>
    );
  };

  return (
    <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="flex h-14 items-center px-4 relative">
        {/* Left button area */}
        <div className="flex items-center gap-3 flex-1">
          {showBackButton && (
            <Button variant="ghost" size="icon" className="rounded-full w-8 h-8" onClick={handleGoBack} aria-label="Regresar">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          
          {/* Title - Centered on specific pages */}
          <h1 className={`text-lg font-bold text-primary ${shouldCenterTitle ? 'flex-1 text-center' : ''}`}>
            {getPageTitle()}
          </h1>
          {isGuarantorForm && <Users className="h-4 w-4 text-accent" />}
        </div>
        
        {/* Right area - Status badge for application details and X button for forms */}
        <div className="flex items-center gap-2">
          {getStatusBadge()}
          {showExitButton && (
            <Button variant="ghost" size="icon" className="rounded-full w-8 h-8" onClick={handleExit} aria-label="Cerrar">
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
