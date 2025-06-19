
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Menu, User, Bell, Home, PlusCircle } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from "@/hooks/use-toast";
import { formatApplicationId } from '@/utils/applicationIdGenerator';

interface HeaderProps {
  personName?: string;
  applicationId?: string;
}

const Header: React.FC<HeaderProps> = ({ personName, applicationId }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();
  const { toast } = useToast();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isHomePage = location.pathname === '/';
  const isApplicationsPage = location.pathname === '/applications';
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
    if (isHomePage) return "Inicio";
    if (isApplicationsPage) return "Solicitudes";
    if (isFormPage && personName) return personName;
    if (isApplicationDetails && personName) return personName;
    return "MicroCredit Pro";
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
      <div className="container flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-4 flex-1">
          {!isHomePage && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBackClick}
              className="h-9 w-9"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          
          <div className="flex flex-col justify-center min-h-[32px]">
            <h1 className="text-lg font-semibold leading-tight">{getPageTitle()}</h1>
            {getSubtitle() && (
              <p className="text-xs text-muted-foreground leading-tight">{getSubtitle()}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isHomePage && (
            <Button
              onClick={handleNewApplication}
              size="sm"
              className="hidden sm:flex"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Nueva Solicitud
            </Button>
          )}

          <Button variant="ghost" size="icon" className="h-9 w-9 relative">
            <Bell className="h-4 w-4" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs bg-red-500 text-white">
              3
            </Badge>
          </Button>

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
