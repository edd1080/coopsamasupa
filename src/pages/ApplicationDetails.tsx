import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
import { useApplicationData } from '@/hooks/useApplicationData';
import { getFirstNameAndLastName } from '@/lib/nameUtils';
import { supabase } from '@/integrations/supabase/client';

const ApplicationDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  console.log('🔍 ApplicationDetails - ID from params:', id);
  
  const { data: applicationData, isLoading, error } = useApplicationData(id || '');

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

  if (error || !applicationData) {
    console.error('❌ ApplicationDetails - Error or no data:', { error, applicationData, id });
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
              No se pudo encontrar la solicitud solicitada (ID: {id}).
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

  console.log('✅ ApplicationDetails - Data loaded:', applicationData);

  const isDraft = applicationData.isDraft || applicationData.type === 'draft';
  
  // Helper functions to safely access data with proper type checking
  const getProgressStep = () => {
    if (isDraft) {
      return (applicationData as any).last_step || 0;
    }
    return (applicationData as any).progress_step || 0;
  };

  const getStatus = () => {
    if (isDraft) return 'draft';
    return (applicationData as any).status || 'pending';
  };

  const getFormData = () => {
    if (!applicationData.draft_data) return {};
    if (typeof applicationData.draft_data === 'object') {
      return applicationData.draft_data;
    }
    try {
      return JSON.parse(applicationData.draft_data as string);
    } catch {
      return {};
    }
  };

  const getAmountRequested = () => {
    if (!isDraft && (applicationData as any).amount_requested) {
      return (applicationData as any).amount_requested;
    }
    // For drafts, try to get from form data
    const formData = getFormData();
    return formData.requestedAmount || 0;
  };

  const getProduct = () => {
    if (!isDraft && (applicationData as any).product) {
      return (applicationData as any).product;
    }
    return 'Crédito General';
  };

  const progressStep = getProgressStep();
  const status = getStatus();
  const formData = getFormData();
  const amountRequested = getAmountRequested();
  const product = getProduct();

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
      // For now, redirect to draft editing - this can be enhanced later
      navigate(`/request-form/${id}`);
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

  const personName = applicationData.client_name || `${formData.firstName || ''} ${formData.lastName || ''}`.trim();

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        personName={getFirstNameAndLastName(personName)}
        applicationId={applicationData.id || ''}
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
                {isDraft ? 'Borrador' : 'Solicitud'} #{applicationData.id}
              </h1>
              <p className="text-gray-600">
                {applicationData.client_name || `${formData.firstName || ''} ${formData.lastName || ''}`.trim()}
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
                      {format(new Date(applicationData.created_at), 'dd/MM/yyyy')}
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
                      Q {Number(amountRequested).toLocaleString()}
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
