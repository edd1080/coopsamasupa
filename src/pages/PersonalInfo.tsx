import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Info, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useAuth } from '@/hooks/useAuth';
import { getFirstNameAndLastName } from '@/lib/nameUtils';

const PersonalInfo = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: userProfile, isLoading, error } = useUserProfile();

  // Función para obtener el valor del perfil o un valor por defecto
  const getProfileValue = (field: string, defaultValue: string = 'No disponible') => {
    if (isLoading) return 'Cargando...';
    if (error || !userProfile) return defaultValue;
    return userProfile[field] || defaultValue;
  };

  // Función para obtener el primer nombre del full_name
  const getFirstName = () => {
    const fullName = getProfileValue('full_name', '');
    if (fullName === 'Cargando...' || fullName === 'No disponible') return fullName;
    return fullName.split(' ')[0] || 'No disponible';
  };

  // Función para obtener el apellido del full_name
  const getLastName = () => {
    const fullName = getProfileValue('full_name', '');
    if (fullName === 'Cargando...' || fullName === 'No disponible') return fullName;
    const parts = fullName.split(' ');
    return parts.slice(1).join(' ') || 'No disponible';
  };

  // Función para obtener el email del usuario autenticado
  const getUserEmail = () => {
    if (isLoading) return 'Cargando...';
    if (error || !user) return 'No disponible';
    return user.email || 'No disponible';
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-background border-b border-border px-4 py-3">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/settings')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">Información Personal</h1>
        </div>
      </div>

      <main className="px-4 py-6 space-y-6">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            La información personal es de solo consulta. Para realizar cambios, contacta al administrador del sistema.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Datos Personales
              {isLoading && <Loader2 className="h-4 w-4 animate-spin ml-2" />}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Nombre</Label>
                <Input
                  id="firstName"
                  value={getFirstName()}
                  readOnly
                  className="bg-muted"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Apellido</Label>
                <Input
                  id="lastName"
                  value={getLastName()}
                  readOnly
                  className="bg-muted"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                value={getUserEmail()}
                readOnly
                className="bg-muted"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  value={getProfileValue('phone')}
                  readOnly
                  className="bg-muted"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Puesto</Label>
                <Input
                  id="position"
                  value={getProfileValue('role')}
                  readOnly
                  className="bg-muted"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="branch">Sucursal</Label>
              <Input
                id="branch"
                value={getProfileValue('agency_id')}
                readOnly
                className="bg-muted"
              />
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default PersonalInfo; 