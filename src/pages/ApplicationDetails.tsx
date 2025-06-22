import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Calendar,
  DollarSign,
  FileText,
  User,
  Phone,
  Edit,
  Download,
  Trash2,
  MoreVertical,
  ArrowLeft
} from 'lucide-react';

import Header from '@/components/layout/Header';
import BottomNavigation from '@/components/layout/BottomNavigation';
import BreadcrumbNavigation from '@/components/navigation/BreadcrumbNavigation';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { getFirstNameAndLastName } from '@/lib/nameUtils';

const ApplicationDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const { data: applicationData, isLoading, error } = useQuery({
    queryKey: ['application', id],
    queryFn: async () => {
      if (!id) throw new Error('No application ID provided');
      
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: drafts } = useQuery({
    queryKey: ['drafts', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('application_drafts')
        .select('*')
        .eq('agent_id', user.id);

      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  // Determine if this is a draft or application
  const isDraft = !applicationData;
  const draftData = drafts?.find(draft => draft.id === id);
  const displayData = applicationData || draftData;

  // Helper functions to safely access union type properties
  const getProgressStep = (data: any) => {
    if (!data) return 0;
    if ('progress_step' in data) return data.progress_step || 0;
    if ('last_step' in data) return data.last_step || 0;
    return 0;
  };

  const getStatus = (data: any) => {
    if (!data) return 'draft';
    if ('status' in data) return data.status;
    return 'draft';
  };

  const getLastStep = (data: any) => {
    if (!data) return 0;
    if ('last_step' in data) return data.last_step || 0;
    if ('progress_step' in data) return data.progress_step || 0;
    return 0;
  };

  const getFormData = (data: any) => {
    if (!data) return {};
    if ('draft_data' in data && data.draft_data) {
      if (typeof data.draft_data === 'object') {
        return data.draft_data;
      }
      try {
        return JSON.parse(data.draft_data as string);
      } catch {
        return {};
      }
    }
    if ('data' in data) return data.data || {};
    return {};
  };

  const getAmountRequested = (data: any) => {
    if (!data) return 0;
    if ('amount_requested' in data) return data.amount_requested || 0;
    // For drafts, try to get from form data
    const formData = getFormData(data);
    return formData.requestedAmount || 0;
  };

  const getProduct = (data: any) => {
    if (!data) return 'Crédito General';
    if ('product' in data) return data.product;
    if ('type' in data) return data.type;
    return 'Crédito General';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header 
          personName=""
          applicationId=""
          onExitFormClick={() => navigate('/applications')}
        />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Cargando detalles...</p>
            </div>
          </div>
        </main>
        <BottomNavigation />
      </div>
    );
  }

  if (error || !displayData) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header 
          personName=""
          applicationId=""
          onExitFormClick={() => navigate('/applications')}
        />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4">Solicitud no encontrada</h2>
            <p className="text-muted-foreground mb-4">
              No se pudo encontrar la solicitud solicitada.
            </p>
            <Button onClick={() => navigate('/applications')}>
              Volver a Solicitudes
            </Button>
          </div>
        </main>
        <BottomNavigation />
      </div>
    );
  }

  const progressStep = getProgressStep(displayData);
  const status = getStatus(displayData);
  const lastStep = getLastStep(displayData);
  const formData = getFormData(displayData);
  const amountRequested = getAmountRequested(displayData);
  const product = getProduct(displayData);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Aprobada</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rechazada</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pendiente</Badge>;
      case 'in_review':
        return <Badge className="bg-blue-100 text-blue-800">En Revisión</Badge>;
      case 'draft':
        return <Badge variant="outline">Borrador</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const calculateProgress = () => {
    const totalSteps = 10;
    return Math.round((progressStep / totalSteps) * 100);
  };

  const progress = calculateProgress();

  const handleEdit = () => {
    if (isDraft) {
      navigate(`/request-form/${id}`);
    } else {
      console.log('Editing application:', id);
    }
  };

  const handleDownloadPDF = () => {
    console.log('Downloading PDF for:', id);
  };

  const handleDelete = async () => {
    try {
      if (isDraft) {
        const { error } = await supabase
          .from('application_drafts')
          .delete()
          .eq('id', id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('applications')
          .delete()
          .eq('id', id);

        if (error) throw error;
      }

      navigate('/applications');
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  const personName = displayData.client_name || `${formData.firstName || ''} ${formData.lastName || ''}`.trim();

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        personName={getFirstNameAndLastName(personName)}
        applicationId={displayData.id || ''}
        onExitFormClick={() => navigate('/applications')}
      />
      
      <main className="flex-1 container mx-auto px-4 py-0 pb-20 max-w-5xl">
        {/* Breadcrumb Navigation */}
        <div className="mb-3 mt-4">
          <BreadcrumbNavigation />
        </div>

        {/* Application Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {isDraft ? 'Borrador' : 'Solicitud'} #{displayData.id}
              </h1>
              <p className="text-gray-600">
                {displayData.client_name || `${formData.firstName || ''} ${formData.lastName || ''}`.trim()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(status)}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleEdit}>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </DropdownMenuItem>
                  {!isDraft && (
                    <DropdownMenuItem onClick={handleDownloadPDF}>
                      <Download className="h-4 w-4 mr-2" />
                      Descargar PDF
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem 
                    onClick={handleDelete}
                    className="text-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Progreso del formulario
              </span>
              <span className="text-sm text-gray-500">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Basic Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm text-gray-600">Creado</p>
                    <p className="font-medium">
                      {format(new Date(displayData.created_at), 'dd/MM/yyyy')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm text-gray-600">Monto Solicitado</p>
                    <p className="font-medium">
                      Q {amountRequested.toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm text-gray-600">Producto</p>
                    <p className="font-medium">{product}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Form Data Sections */}
        <div className="space-y-6">
          {/* Personal Information */}
          {(formData.firstName || formData.lastName) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Información Personal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Nombre Completo</Label>
                    <p>{`${formData.firstName || ''} ${formData.middleName || ''} ${formData.lastName || ''}`.trim()}</p>
                  </div>
                  {formData.birthDate && (
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Fecha de Nacimiento</Label>
                      <p>{formData.birthDate}</p>
                    </div>
                  )}
                  {formData.dpi && (
                    <div>
                      <Label className="text-sm font-medium text-gray-500">DPI</Label>
                      <p>{formData.dpi}</p>
                    </div>
                  )}
                  {formData.nit && (
                    <div>
                      <Label className="text-sm font-medium text-gray-500">NIT</Label>
                      <p>{formData.nit}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Contact Information */}
          {(formData.mobilePhone || formData.email || formData.address) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Phone className="h-5 w-5 mr-2" />
                  Información de Contacto
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formData.mobilePhone && (
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Teléfono Móvil</Label>
                      <p>{formData.mobilePhone}</p>
                    </div>
                  )}
                  {formData.homePhone && (
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Teléfono Casa</Label>
                      <p>{formData.homePhone}</p>
                    </div>
                  )}
                  {formData.email && (
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Email</Label>
                      <p>{formData.email}</p>
                    </div>
                  )}
                  {formData.address && (
                    <div className="md:col-span-2">
                      <Label className="text-sm font-medium text-gray-500">Dirección</Label>
                      <p>{formData.address}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Financial Information */}
          {(formData.ingresoPrincipal || formData.requestedAmount) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Información Financiera
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formData.ingresoPrincipal && (
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Ingreso Principal</Label>
                      <p>Q {Number(formData.ingresoPrincipal).toLocaleString()}</p>
                    </div>
                  )}
                  {formData.ingresoSecundario && (
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Ingreso Secundario</Label>
                      <p>Q {Number(formData.ingresoSecundario).toLocaleString()}</p>
                    </div>
                  )}
                  {formData.requestedAmount && (
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Monto Solicitado</Label>
                      <p>Q {Number(formData.requestedAmount).toLocaleString()}</p>
                    </div>
                  )}
                  {formData.termMonths && (
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Plazo</Label>
                      <p>{formData.termMonths} meses</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end">
            <Button
              variant="outline"
              onClick={() => navigate('/applications')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            
            <Button onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-2" />
              {isDraft ? 'Continuar Editando' : 'Editar'}
            </Button>

            {!isDraft && status === 'pending' && (
              <Button onClick={handleDownloadPDF}>
                <Download className="h-4 w-4 mr-2" />
                Descargar PDF
              </Button>
            )}
          </div>
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default ApplicationDetails;
