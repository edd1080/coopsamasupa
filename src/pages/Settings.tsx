
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ChevronRight, LogOut, User, HelpCircle, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import BottomNavigation from '@/components/layout/BottomNavigation';
import { useAuth } from '@/hooks/useAuth';
// DeviceInfo commented out but preserved for future use
// import DeviceInfo from '@/components/settings/DeviceInfo';
import NotificationSettings from '@/components/settings/NotificationSettings';
import AppPreferences from '@/components/settings/AppPreferences';
// SecuritySettings commented out but preserved for future use
// import SecuritySettings from '@/components/settings/SecuritySettings';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signOut } = useAuth();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  // DeviceInfo data commented out but preserved for future use
  /*
  const deviceInfo = {
    ram: {
      total: '4GB',
      used: '2.5GB',
      free: '1.5GB'
    },
    storage: {
      total: '64GB',
      available: '32.5GB'
    },
    gps: {
      status: 'online'
    },
    system: {
      os: 'Android 13',
      model: 'Pixel 6',
      name: 'Pixel-Device'
    }
  };
  */

  const handleLogout = async () => {
    try {
      await signOut();
      // No need to navigate - AuthRouter will handle the redirect
      setShowLogoutDialog(false);
    } catch (error) {
      console.error('Error during logout:', error);
      toast({
        title: "Error al cerrar sesión",
        description: "Hubo un problema al cerrar la sesión",
        variant: "destructive"
      });
    }
  };

  const handleLogoutClick = () => {
    setShowLogoutDialog(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 px-4 pb-20 my-[20px]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Perfil
              </CardTitle>
              <CardDescription>
                Gestiona tu información personal y preferencias
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2 cursor-pointer hover:bg-accent/50 rounded-md px-2" onClick={() => navigate('/settings/personal-info')}>
                <div>
                  <p className="font-medium">Información personal</p>
                  <p className="text-sm text-muted-foreground">Nombre, correo, teléfono</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex items-center justify-between py-2 rounded-md px-2 opacity-50 cursor-not-allowed">
                <div>
                  <p className="font-medium text-muted-foreground">Cambiar contraseña</p>
                  <p className="text-sm text-muted-foreground">No disponible en esta versión</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          {/* DeviceInfo component commented out but preserved for future use
           <DeviceInfo deviceInfo={deviceInfo} />
           */}
          <NotificationSettings />
          <AppPreferences />
          
          {/* SecuritySettings component commented out but preserved for future use
           <SecuritySettings />
           */}
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-primary" />
                Ayuda y soporte
              </CardTitle>
              <CardDescription>
                Encuentra ayuda y recursos para usar Coopsama App
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2 cursor-pointer hover:bg-accent/50 rounded-md px-2" onClick={() => navigate('/settings/report-problem')}>
                <div>
                  <p className="font-medium">Reportar problema</p>
                  <p className="text-sm text-muted-foreground">Informa sobre errores o fallos</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Button variant="destructive" className="w-full flex items-center justify-center gap-2" onClick={handleLogoutClick}>
            <LogOut className="h-5 w-5" />
            Cerrar sesión
          </Button>
        </div>
      </main>
      
      <BottomNavigation />

      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent className="sm:max-w-[425px]">
          <AlertDialogHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <AlertDialogTitle>Cerrar sesión</AlertDialogTitle>
            </div>
            <AlertDialogDescription>
              ¿Estás seguro que quieres cerrar sesión? Tendrás que iniciar sesión nuevamente para acceder a tu cuenta.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Cerrar sesión
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Settings;
