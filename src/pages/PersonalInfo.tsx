import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Info, Loader2, Edit2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useForm } from 'react-hook-form';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useUpdateProfile } from '@/hooks/useUpdateProfile';
import { useAuth } from '@/hooks/useAuth';
import { getFirstNameAndLastName } from '@/lib/nameUtils';

interface FormData {
  firstName: string;
  lastName: string;
  phone: string;
  branch: string;
}

const PersonalInfo = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: userProfile, isLoading, error } = useUserProfile();
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();
  const [isEditing, setIsEditing] = useState(false);
  
  const form = useForm<FormData>({
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      branch: ''
    }
  });

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

  // Verificar si un campo está vacío
  const isFieldEmpty = (value: string) => {
    return !value || value === 'No disponible' || value === 'Cargando...';
  };

  // Verificar si hay campos editables vacíos
  const hasEmptyEditableFields = () => {
    return isFieldEmpty(getFirstName()) || 
           isFieldEmpty(getProfileValue('phone')) || 
           isFieldEmpty(getProfileValue('agency_id'));
  };

  // Actualizar valores del formulario cuando cambie el perfil
  useEffect(() => {
    if (userProfile) {
      const fullName = userProfile.full_name || '';
      const nameParts = fullName.split(' ');
      
      form.reset({
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        phone: userProfile.phone || '',
        branch: userProfile.agency_id || ''
      });
    }
  }, [userProfile, form]);

  // Manejar envío del formulario
  const onSubmit = (data: FormData) => {
    const updateData: any = {};
    
    // Combinar nombre y apellido en full_name
    if (data.firstName || data.lastName) {
      updateData.full_name = `${data.firstName} ${data.lastName}`.trim();
    }
    
    if (data.phone) {
      updateData.phone = data.phone;
    }
    
    if (data.branch) {
      updateData.agency_id = data.branch;
    }

    updateProfile(updateData, {
      onSuccess: () => {
        setIsEditing(false);
      }
    });
  };

  // Cancelar edición
  const handleCancel = () => {
    if (userProfile) {
      const fullName = userProfile.full_name || '';
      const nameParts = fullName.split(' ');
      
      form.reset({
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        phone: userProfile.phone || '',
        branch: userProfile.agency_id || ''
      });
    }
    setIsEditing(false);
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
            {hasEmptyEditableFields() && !isEditing 
              ? "Completa tu información personal haciendo clic en 'Completar información'."
              : "Tu información personal está completa. Los campos de solo lectura requieren contactar al administrador."
            }
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Datos Personales
                {(isLoading || isUpdating) && <Loader2 className="h-4 w-4 animate-spin ml-2" />}
              </div>
              
              {!isEditing && hasEmptyEditableFields() && (
                <Button 
                  onClick={() => setIsEditing(true)}
                  size="md"
                  className="flex items-center gap-2"
                >
                  <Edit2 className="h-4 w-4" />
                  Editar datos
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nombre</Label>
                  {isEditing && isFieldEmpty(getFirstName()) ? (
                    <Input
                      id="firstName"
                      {...form.register('firstName', { 
                        required: 'El nombre es requerido',
                        minLength: { value: 2, message: 'Mínimo 2 caracteres' }
                      })}
                      placeholder="Ingresa tu nombre"
                    />
                  ) : (
                    <Input
                      id="firstName"
                      value={getFirstName()}
                      readOnly
                      className="bg-muted"
                    />
                  )}
                  {form.formState.errors.firstName && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.firstName.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Apellido</Label>
                  {isEditing && isFieldEmpty(getLastName()) ? (
                    <Input
                      id="lastName"
                      {...form.register('lastName')}
                      placeholder="Ingresa tu apellido"
                    />
                  ) : (
                    <Input
                      id="lastName"
                      value={getLastName()}
                      readOnly
                      className="bg-muted"
                    />
                  )}
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
                  {isEditing && isFieldEmpty(getProfileValue('phone')) ? (
                    <Input
                      id="phone"
                      {...form.register('phone', {
                        pattern: {
                          value: /^(\+502)?[0-9]{8}$/,
                          message: 'Formato: +502XXXXXXXX o XXXXXXXX'
                        }
                      })}
                      placeholder="Ej: +50212345678"
                    />
                  ) : (
                    <Input
                      id="phone"
                      value={getProfileValue('phone')}
                      readOnly
                      className="bg-muted"
                    />
                  )}
                  {form.formState.errors.phone && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.phone.message}
                    </p>
                  )}
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
                {isEditing && isFieldEmpty(getProfileValue('agency_id')) ? (
                  <Input
                    id="branch"
                    {...form.register('branch')}
                    placeholder="Ingresa tu sucursal"
                  />
                ) : (
                  <Input
                    id="branch"
                    value={getProfileValue('agency_id')}
                    readOnly
                    className="bg-muted"
                  />
                )}
              </div>

              {isEditing && (
                <div className="flex gap-2 pt-4">
                  <Button 
                    type="submit" 
                    disabled={isUpdating}
                    className="flex items-center gap-2"
                  >
                    <Check className="h-4 w-4" />
                    {isUpdating ? 'Guardando...' : 'Guardar'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isUpdating}
                    className="flex items-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    Cancelar
                  </Button>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default PersonalInfo; 