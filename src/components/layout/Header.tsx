
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Menu, User, Bell, Home, PlusCircle, X } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from "@/hooks/use-toast";
import { formatApplicationId } from '@/utils/applicationIdGenerator';

interface HeaderProps {
  personName?: string;
  applicationId?: string;
  onExitFormClick?: () => void; // Nueva prop para manejar el botón X del formulario
}

const Header: React.FC<HeaderProps> = ({ personName, applicationId, onExitFormClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();
  const { toast } = useToast();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Definir páginas principales que NO deben tener botón atrás
  const mainPages = ['/', '/applications', '/prequalifications', '/settings'];
  const isMainPage = mainPages.includes(location.pathname);
  const isFormPage = location.pathname.includes('/request-form');
  const isApplicationDetails = location.pathname.includes('/applications/') && !location.pathname.includes('/request-form');

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
    setIsMenuOpen(false);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión exitosamente.",
        duration: 3000,
      });
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error",
        description: "Hubo un problema al cerrar sesión.",
        variant: "destructive",
        duration: 3000,
      });
    }
    setIsMenuOpen(false);
  };

  const getPageTitle = () => {
    // Títulos específicos para cada pantalla principal
    if (location.pathname === '/') return "Coopsama App";
    if (location.pathname === '/applications') return "Solicitudes";
    if (location.pathname === '/prequalifications') return "Precalificación";
    if (location.pathname === '/settings') return "Ajustes";
    
    // Para formularios de solicitud
    if (isFormPage) {
      // Si hay nombre de persona, usar ese
      if (personName) return personName;
      // Si no hay applicationId o es una nueva solicitud, mostrar "Solicitud Nueva"
      if (!applicationId) return "Solicitud Nueva";
      // Si hay applicationId pero no nombre, usar el ID formateado
      return `Solicitud ${formatApplicationId(applicationId)}`;
    }
    
    // Para detalles de aplicación
    if (isApplicationDetails && personName) return personName;
    
    // Fallback solo si no coincide con ningún caso anterior
    return "Coopsama App";
  };

  const getSubtitle = () => {
    if (isFormPage && applicationId) {
      return `Solicitud ${formatApplicationId(applicationId)}`;
    }
    if (isApplicationDetails && applicationId) {
      return `Solicitud ${formatApplicationId(applicationId)}`;
    }
    return null;
  };

  return (
    <header className="bg-background border-b border-border/40 sticky top-0 z-40 w-full backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center px-4">
        {/* Left side - Back button (solo si NO es página principal) */}
        <div className="flex items-center">
          {!isMainPage && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBackClick}
              className="h-9 w-9 mr-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Center - Title (centrado) */}
        <div className="flex-1 flex justify-center">
          <div className="flex flex-col justify-center min-h-[32px] text-center">
            <h1 className="text-lg font-semibold leading-tight">{getPageTitle()}</h1>
            {getSubtitle() && (
              <p className="text-xs text-muted-foreground leading-tight">{getSubtitle()}</p>
            )}
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-2">
          {/* Botón X para formularios - ahora en el Header principal */}
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

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="h-9 w-9 relative">
            <Bell className="h-4 w-4" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs bg-red-500 text-white">
              3
            </Badge>
          </Button>

          {/* Menu */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px]">
              <div className="flex flex-col gap-4 mt-6">
                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={() => { navigate('/'); setIsMenuOpen(false); }}
                >
                  <Home className="mr-2 h-4 w-4" />
                  Inicio
                </Button>
                
                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={handleNewApplication}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Nueva Solicitud
                </Button>

                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={() => { navigate('/settings'); setIsMenuOpen(false); }}
                >
                  <User className="mr-2 h-4 w-4" />
                  Configuración
                </Button>

                <div className="border-t pt-4 mt-4">
                  <Button
                    variant="ghost"
                    className="justify-start w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={handleSignOut}
                  >
                    Cerrar Sesión
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
