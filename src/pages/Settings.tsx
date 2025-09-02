
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChevronRight, LogOut, User, Bell, Smartphone, HelpCircle, AlertTriangle, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import BottomNavigation from '@/components/layout/BottomNavigation';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useTheme } from '@/context/ThemeContext';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signOut } = useAuth();
  const { data: userProfile } = useUserProfile();
  const { theme, toggleTheme } = useTheme();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [systemAlerts, setSystemAlerts] = useState(true);
  const [highResolution, setHighResolution] = useState(true);

  const handleLogout = async () => {
    try {
      await signOut();
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

  const getUserInitials = (fullName: string) => {
    if (!fullName) return 'U';
    const names = fullName.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return fullName[0].toUpperCase();
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 px-4 pb-20 my-[20px]">
        {/* User Profile Header */}
        <div className="mb-6 p-4 bg-card rounded-lg border">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src="" alt="Profile" />
              <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                {getUserInitials(userProfile?.full_name || '')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-xl font-semibold">{userProfile?.full_name || 'Usuario'}</h2>
              <p className="text-muted-foreground">{userProfile?.role || 'Miembro'}</p>
              <p className="text-sm text-muted-foreground">{userProfile?.agency || 'Coopsama'}</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Cuenta Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Cuenta
            </h3>
            <div className="space-y-1">
              <div 
                className="flex items-center justify-between py-3 px-3 cursor-pointer hover:bg-accent/50 rounded-md transition-colors border-b border-border/50"
                onClick={() => navigate('/settings/personal-info')}
              >
                <div className="flex items-center gap-3">
                  <Info className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Información personal</p>
                    <p className="text-sm text-muted-foreground">Nombre, correo, teléfono</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </div>

          {/* Notificaciones Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Notificaciones
            </h3>
            <div className="space-y-1">
              <div className="flex items-center justify-between py-3 px-3 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Notificaciones push</p>
                    <p className="text-sm text-muted-foreground">Recibe alertas en tu dispositivo</p>
                  </div>
                </div>
                <Switch 
                  checked={pushNotifications}
                  onCheckedChange={setPushNotifications}
                />
              </div>
              <div className="flex items-center justify-between py-3 px-3 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Alertas de sistema</p>
                    <p className="text-sm text-muted-foreground">Cambios de estado en solicitudes</p>
                  </div>
                </div>
                <Switch 
                  checked={systemAlerts}
                  onCheckedChange={setSystemAlerts}
                />
              </div>
            </div>
          </div>

          {/* Preferencias del app Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-primary" />
              Preferencias del app
            </h3>
            <div className="space-y-1">
              <div className="flex items-center justify-between py-3 px-3 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <Smartphone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Tema oscuro</p>
                    <p className="text-sm text-muted-foreground">Activa el modo oscuro</p>
                  </div>
                </div>
                <Switch 
                  checked={theme === 'dark'} 
                  onCheckedChange={toggleTheme}
                />
              </div>
              <div className="flex items-center justify-between py-3 px-3 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <Smartphone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Alta resolución</p>
                    <p className="text-sm text-muted-foreground">Mejora la calidad visual</p>
                  </div>
                </div>
                <Switch 
                  checked={highResolution}
                  onCheckedChange={setHighResolution}
                />
              </div>
            </div>
          </div>

          {/* Ayuda y soporte Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" />
              Ayuda y soporte
            </h3>
            <div className="space-y-1">
              <div 
                className="flex items-center justify-between py-3 px-3 cursor-pointer hover:bg-accent/50 rounded-md transition-colors border-b border-border/50"
                onClick={() => navigate('/settings/report-problem')}
              >
                <div className="flex items-center gap-3">
                  <HelpCircle className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Reportar problema</p>
                    <p className="text-sm text-muted-foreground">Informa sobre errores o fallos</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <div className="pt-4">
            <Button 
              variant="destructive" 
              className="w-full flex items-center justify-center gap-2" 
              onClick={handleLogoutClick}
            >
              <LogOut className="h-5 w-5" />
              Cerrar sesión
            </Button>
          </div>
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
