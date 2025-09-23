import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, Edit, Send, DollarSign, Users, Building2, BarChart3, MapPin, FileCheck, User, Briefcase, FileSignature, CheckCircle, Clock, Camera, Plus, PartyPopper, ChevronRight, UserCheck, Code2, TestTube } from 'lucide-react';
import Header from '@/components/layout/Header';
import BottomNavigation from '@/components/layout/BottomNavigation';
import BreadcrumbNavigation from '@/components/navigation/BreadcrumbNavigation';
import CircularProgress from '@/components/requestForm/CircularProgress';
// Removed old testing components - now integrated in ReviewSection

import { useApplicationData } from '@/hooks/useApplicationData';
import { getFirstNameAndLastName, getNavBarName } from '@/lib/nameUtils';
import { useToast } from '@/hooks/use-toast';
import { formatApplicationId } from '@/utils/applicationIdGenerator';
const ApplicationDetails = () => {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    toast
  } = useToast();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFieldMapping, setShowFieldMapping] = useState(false);
  const {
    data: applicationData,
    isLoading,
    error
  } = useApplicationData(id || '');

  // Helper functions to safely access and format data
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
    return {};
  };
  const getFormSections = (type: string) => {
    if (type === 'oficial') {
      return [{
        id: 'credit-details',
        name: 'Detalles del Credito e Info Personal',
        icon: DollarSign
      }, {
        id: 'character',
        name: 'Análisis de Carácter',
        icon: Users
      }, {
        id: 'business-financial',
        name: 'Info del Negocio',
        icon: Building2
      }, {
        id: 'financial-info',
        name: 'Info Financiera',
        icon: BarChart3
      }, {
        id: 'documents',
        name: 'Documentos e Imágenes',
        icon: MapPin
      }, {
        id: 'signature',
        name: 'Cláusula y Firma',
        icon: FileCheck
      }];
    }
    return [{
      id: 'identification',
      name: 'Identificación y Contacto',
      icon: User
    }, {
      id: 'credit',
      name: 'Información del Crédito',
      icon: DollarSign
    }, {
      id: 'finances',
      name: 'Finanzas y Patrimonio',
      icon: BarChart3
    }, {
      id: 'references',
      name: 'Referencias Personales',
      icon: Users
    }, {
      id: 'documents',
      name: 'Documentos',
      icon: FileSignature
    }, {
      id: 'review',
      name: 'Revisión Final',
      icon: CheckCircle
    }];
  };
  const isApplicationReadyToSubmit = () => {
    if (!applicationData) return false;
    const formData = getFormData(applicationData);
    const progress = applicationData.isDraft && 'last_step' in applicationData ? applicationData.last_step : 'progress_step' in applicationData ? applicationData.progress_step : 0;
    const documents = formData.documents || {};
    const references = formData.references || [];
    const allSectionsComplete = progress >= 6;
    const requiredDocsComplete = ['dpiFrontal', 'dpiTrasero', 'fotoSolicitante'].every(docKey => documents[docKey]?.status === 'complete');
    const hasReferences = references.length > 0;
    return allSectionsComplete && requiredDocsComplete && hasReferences;
  };
  const navigateToFormSection = (sectionId: string) => {
    // Map section IDs to step indices
    const sectionToStepMap: {
      [key: string]: number;
    } = {
      'identification': 0,
      'credit': 1,
      'finances': 2,
      'guarantors': 3,
      'documents': 4,
      'review': 5
    };
    const stepIndex = sectionToStepMap[sectionId];
    if (stepIndex !== undefined) {
      navigate(`/request-form/${id}`, {
        state: {
          sectionId,
          stepIndex,
          applicationId: publicApplicationId  // Use publicApplicationId instead of internal id
        }
      });
    }
  };
  const handleSubmitApplication = () => {
    if (!isApplicationReadyToSubmit()) {
      toast({
        title: "Solicitud incompleta",
        description: "Complete todas las secciones y documentos antes de enviar.",
        variant: "destructive"
      });
      return;
    }
    setShowConfirmDialog(true);
  };
  const confirmSubmission = async () => {
    setIsSubmitting(true);
    setShowConfirmDialog(false);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setShowSuccessDialog(true);
  };
  const handleSuccessClose = () => {
    setShowSuccessDialog(false);
    navigate('/applications');
  };
  if (isLoading) {
    return <div className="min-h-screen flex flex-col">
        <Header personName="" applicationId="" onExitFormClick={() => navigate('/applications')} />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Cargando solicitud...</p>
            </div>
          </div>
        </main>
        <BottomNavigation />
      </div>;
  }
  if (error || !applicationData) {
    return <div className="min-h-screen flex flex-col">
        <Header personName="" applicationId="" onExitFormClick={() => navigate('/applications')} />
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
      </div>;
  }
  const formData = getFormData(applicationData);
  const references = formData.references || [];
  const documents = formData.documents || {};
  const progress = applicationData.isDraft && 'last_step' in applicationData ? applicationData.last_step : 'progress_step' in applicationData ? applicationData.progress_step : 0;
  const progressPercentage = Math.round(progress / 6 * 100);
  const sections = getFormSections('legacy');
  // Get person name from location state (from cards) or fallback to application data
  const personName = location.state?.clientName || 
                    applicationData.client_name || 
                    `${formData.firstName || ''} ${formData.lastName || ''}`.trim() || 
                    'Sin nombre';
  
  // Get the public application ID from location state, formData, or generate it
  const publicApplicationId = location.state?.applicationId || 
                             formData?.applicationId || 
                             formatApplicationId(applicationData.id || '');
  
  // Get external reference ID from location state or application data
  const externalReferenceId = location.state?.externalReferenceId || 
                             ('coopsama_external_reference_id' in applicationData ? applicationData.coopsama_external_reference_id : undefined);
  
  return <div className="min-h-screen flex flex-col">
        <Header 
          personName={getNavBarName(personName)} 
          applicationId={publicApplicationId} 
          externalReferenceId={externalReferenceId}
          applicationStatus={'status' in applicationData ? applicationData.status : 'draft'} 
          onExitFormClick={() => navigate('/applications')} 
        />
      
      <main className="flex-1 container mx-auto px-4 py-0 pb-20 max-w-5xl">
        {/* Breadcrumb Navigation */}
        <div className="mb-3 mt-4">
          <BreadcrumbNavigation />
        </div>

        {/* Application Header */}
        <div className="mb-6">
          {/* Full-width name, ID and status in single row */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h1 className="text-xl font-semibold text-foreground">
                  {personName}
                </h1>
                {publicApplicationId && publicApplicationId.startsWith('SCO_') ? (
                  <p className="text-xs text-muted-foreground mt-1">
                    ID: <span className="font-mono font-medium text-primary">{publicApplicationId}</span>
                  </p>
                ) : externalReferenceId ? (
                  <p className="text-xs text-muted-foreground mt-1">
                    ID: <span className="font-mono font-medium text-primary">{externalReferenceId}</span>
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground mt-1">
                    ID: <span className="font-mono font-medium text-primary">{publicApplicationId}</span>
                  </p>
                )}
              </div>
              
              {/* Status badges and tags aligned with name and ID */}
              <div className="flex flex-col items-end gap-2">
                {'status' in applicationData && applicationData.status === 'error' && (
                  <p className="text-sm text-muted-foreground">
                    Código de error: <span className="font-mono font-medium text-destructive">{applicationData.id}</span>
                  </p>
                )}
                {applicationData.isDraft && (
                  <p className="text-sm text-muted-foreground">
                    Estado: <span className="font-medium">Borrador</span>
                    {'status' in applicationData && applicationData.status === 'error' && 'coopsama_sync_status' in applicationData && applicationData.coopsama_sync_status === 'error' && (
                      <span className="ml-4">
                        Código de error: <span className="font-mono font-medium text-destructive">{applicationData.id}</span>
                      </span>
                    )}
                  </p>
                )}
                {/* Tag de Solicitud Enviada en la misma fila */}
                {!applicationData.isDraft && 'status' in applicationData && applicationData.status !== 'error' && (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1 text-sm px-3 py-1">
                    <CheckCircle className="h-4 w-4" />
                    <span>Solicitud Enviada</span>
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          {/* Buttons and status section */}
          <div className="mb-4">
            {/* Draft applications or error applications */}
            {(applicationData.isDraft || ('status' in applicationData && applicationData.status === 'error')) && (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="md" onClick={() => navigate(`/request-form/${id}`)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
                <Button size="md" onClick={handleSubmitApplication} disabled={!isApplicationReadyToSubmit()} className={!isApplicationReadyToSubmit() ? 'opacity-50 cursor-not-allowed' : ''}>
                  <Send className="h-4 w-4 mr-2" />
                  {'status' in applicationData && applicationData.status === 'error' ? 'Reintentar Envío' : 'Enviar Solicitud'}
                </Button>
              </div>
            )}
            
            {/* Successfully submitted applications */}
            {!applicationData.isDraft && 'status' in applicationData && applicationData.status !== 'error' && (
              <p className="text-sm text-muted-foreground">Esta solicitud ya fue enviada y está en modo de solo lectura</p>
            )}
          </div>

          {/* Progress Summary */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">
                Progreso: {progress}/6 secciones completadas
              </span>
              <span className="text-sm text-muted-foreground">{progressPercentage}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          {/* Quick Access Card */}
          <Card className="mb-6 border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-base">Acceso Rápido</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                 {sections.map((section, index) => {
                  const Icon = section.icon;
                  let isCompleted = progress > index;
                  
                  // Lógica especial para la sección de referencias
                  if (section.id === 'references') {
                    isCompleted = references.length >= 2; // Al menos 2 referencias completas
                  }
                  
                  // Lógica especial para la sección de revisión final
                  if (section.id === 'review') {
                    isCompleted = !applicationData.isDraft && applicationData.status !== 'error';
                  }
                  return <Button key={section.id} variant="outline" className={`relative h-auto py-2 flex flex-col items-center text-xs gap-1 flex-1 min-h-[5rem] sm:min-h-[4.5rem] whitespace-normal break-words overflow-hidden ${
                    isCompleted ? 'bg-green-50 text-green-700 border-green-200' : ''
                  }`} onClick={() => navigateToFormSection(section.id)}>
                        {isCompleted && (
                          <div className="absolute top-1 right-1 h-4 w-4 rounded-full bg-green-500 flex items-center justify-center">
                            <CheckCircle size={10} className="text-white" />
                          </div>
                        )}
                       <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                         <Icon className="h-4 w-4" />
                       </div>
                       <span className="text-center leading-tight line-clamp-2" style={{
                     display: '-webkit-box',
                     WebkitLineClamp: 2,
                     WebkitBoxOrient: 'vertical',
                     overflow: 'hidden'
                   }}>{section.name}</span>
                     </Button>;
               })}
              </div>
            </CardContent>
          </Card>

          {/* Credit Summary Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-base">Solicitud de Crédito</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-background rounded-md border">
                  <p className="text-xs text-muted-foreground mb-1">Monto Solicitado</p>
                  <p className="font-bold">{formData.requestedAmount ? `Q ${Number(formData.requestedAmount).toLocaleString()}` : 'Por agregar'}</p>
                </div>
                <div className="text-center p-3 bg-background rounded-md border">
                  <p className="text-xs text-muted-foreground mb-1">Plazo</p>
                  <p className="font-bold">{formData.termMonths ? `${formData.termMonths} meses` : 'Por agregar'}</p>
                </div>
                <div className="text-center p-3 bg-background rounded-md border">
                  <p className="text-xs text-muted-foreground mb-1">Tipo de Crédito</p>
                  <p className="font-bold">{formData.productDetails?.productType?.value || formData.productType || 'Por agregar'}</p>
                </div>
                <div className="text-center p-3 bg-background rounded-md border">
                  <p className="text-xs text-muted-foreground mb-1">Propósito</p>
                  <p className="font-bold">{formData.creditPurpose || formData.purpose || 'Por agregar'}</p>
                </div>
              </div>
            </CardContent>
          </Card>


          {/* Guarantors Card */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">
                  Referencias Personales
                </CardTitle>
                
              </div>
            </CardHeader>
            <CardContent>
              {references.length === 0 ? <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                    <Users className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-medium mb-2">No hay referencias agregadas</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Agregue al menos dos referencias para continuar con la solicitud
                  </p>
                  <Button onClick={() => navigate(`/applications/${id}/edit?step=3`)} className="bg-green-600 hover:bg-green-700 text-white border-0">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Referencias
                  </Button>
                </div> : <div className="space-y-4">
                  {references.map((reference: any, index: number) => {
                    // Construir nombre completo desde campos correctos de referencias
                    const fullName = `${reference.firstName || ''} ${reference.firstLastName || ''}`.trim() || 'Por agregar';
                    
                    // Mapear tipo de referencia
                    const referenceType = reference.referenceType || 'Por agregar';
                    
                    // Mapear teléfono
                    const phone = reference.mobile || 'Por agregar';
                    
                    return (
                      <div key={reference.id || index} className="p-4 rounded-lg border bg-white hover:shadow-md transition-shadow">
                        <div className="space-y-2">
                          {/* Información en filas - Solo 3 campos esenciales */}
                          <div className="space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-muted-foreground">Nombre:</span>
                              <span className="text-xs font-medium text-foreground">{fullName}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-muted-foreground">Teléfono:</span>
                              <span className="text-xs font-medium text-foreground">{phone}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-muted-foreground">Tipo:</span>
                              <span className="text-xs font-medium text-foreground">{referenceType}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {references.length < 3 && (
                    <Button onClick={() => navigate(`/applications/${id}/edit?step=3`)} className="w-full bg-green-600 hover:bg-green-700 text-white border-0">
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar Otro Fiador
                    </Button>
                  )}
                  {references.length >= 3 && (
                    <div className="text-center py-4 text-sm text-muted-foreground">
                      Máximo de 3 referencias alcanzado
                    </div>
                  )}
                </div>}
            </CardContent>
          </Card>

          {/* Testing Tools card removed - no longer needed */}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="resumen" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="resumen" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Resumen</TabsTrigger>
            <TabsTrigger value="detalles" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Detalles</TabsTrigger>
          </TabsList>
          
          <TabsContent value="resumen" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Identification Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-base">
                    <User className="h-4 w-4 mr-2" />
                    Identificación
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <dl className="space-y-1">
                     <div>
                       <dt className="text-xs text-muted-foreground font-semibold">Nombre</dt>
                       <dd className="text-sm font-medium">{`${formData.firstName || ''} ${formData.secondName || ''} ${formData.firstLastName || ''} ${formData.secondLastName || ''}`.trim() || personName}</dd>
                     </div>
                    {formData.dpi && <div>
                        <dt className="text-xs text-muted-foreground font-semibold">CUI</dt>
                        <dd className="text-sm font-medium">{formData.dpi}</dd>
                      </div>}
                    {formData.nit && <div>
                        <dt className="text-xs text-muted-foreground font-semibold">NIT</dt>
                        <dd className="text-sm font-medium">{formData.nit}</dd>
                      </div>}
                    {formData.mobilePhone && <div>
                        <dt className="text-xs text-muted-foreground font-semibold">Teléfono</dt>
                        <dd className="text-sm font-medium">{formData.mobilePhone}</dd>
                      </div>}
                  </dl>
                </CardContent>
              </Card>

              {/* Finances Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-base">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Finanzas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <dl className="space-y-1">
                    <div>
                      <dt className="text-xs text-muted-foreground font-semibold">Ingresos Principales</dt>
                      <dd className="text-sm font-medium">Q {Number(formData.ingresoPrincipal || 0).toLocaleString()}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted-foreground font-semibold">Gastos Mensuales</dt>
                      <dd className="text-sm font-medium">Q {Number(formData.totalExpenses || 0).toLocaleString()}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted-foreground font-semibold">Patrimonio Neto</dt>
                      <dd className="text-sm font-medium">Q {Number(formData.netWorth || 0).toLocaleString()}</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>

              {/* Work Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-base">
                    <Briefcase className="h-4 w-4 mr-2" />
                    Trabajo
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <dl className="space-y-1">
                    <div>
                      <dt className="text-xs text-muted-foreground font-semibold">Situación Laboral</dt>
                      <dd className="text-sm font-medium">{formData.employmentStatus || 'Por ingresar'}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted-foreground font-semibold">Empresa/Negocio</dt>
                      <dd className="text-sm font-medium">{formData.companyName || 'Por ingresar'}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted-foreground font-semibold">Años de Experiencia</dt>
                      <dd className="text-sm font-medium">{formData.yearsEmployed || 0} años</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
            </div>

            {/* Document Status Card */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center text-base">
                  <FileCheck className="h-4 w-4 mr-2" />
                  Estado de Documentos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {Object.entries({
                  dpiFrontal: 'DPI Frontal',
                  dpiTrasero: 'DPI Trasero',
                  fotoSolicitante: 'Foto Solicitante',
                  recibosServicios: 'Recibos Servicios',
                  firmaCanvas: 'Firma Digital'
                }).map(([key, label]) => {
                  const doc = documents[key];
                  const isComplete = doc?.status === 'complete';
                  
                  const handleDocumentClick = () => {
                    if (isComplete && doc?.url) {
                      // Abrir vista previa del documento
                      window.open(doc.url, '_blank');
                    } else {
                      // Navegar a la sección de documentos
                      navigateToFormSection('documents');
                    }
                  };
                  
                  return (
                    <Card 
                      key={key} 
                      className={`p-3 border cursor-pointer hover:shadow-md transition-shadow ${
                        isComplete ? 'border-green-200 bg-green-50' : 'border-amber-200 bg-amber-50'
                      }`}
                      onClick={handleDocumentClick}
                    >
                      <div className="text-center">
                        {/* Thumbnail del documento */}
                        <div className="w-12 h-12 mx-auto mb-2 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                          {isComplete && doc?.url ? (
                            <img 
                              src={doc.url} 
                              alt={label}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                // Fallback si la imagen no carga
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div className={`w-full h-full flex items-center justify-center ${
                            isComplete ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {isComplete ? <CheckCircle className="h-6 w-6" /> : <Clock className="h-6 w-6" />}
                          </div>
                        </div>
                        
                        <p className="text-xs font-medium mb-1">{label}</p>
                        <Badge 
                          variant={isComplete ? "default" : "secondary"} 
                          className={`text-xs ${isComplete ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}
                        >
                          {isComplete ? 'Completo' : 'Pendiente'}
                        </Badge>
                        
                        {/* Indicador de clickeable */}
                        {isComplete && doc?.url && (
                          <p className="text-xs text-muted-foreground mt-1">Tap para ver</p>
                        )}
                      </div>
                    </Card>
                  );
                })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="detalles" className="space-y-6">
            {/* Personal Information Detailed */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Información Personal Detallada</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-muted-foreground font-semibold">Agencia</Label>
                    <p className="text-sm font-medium">{formData.agencia || 'Por ingresar'}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground font-semibold">Tipo Socio</Label>
                    <p className="text-sm font-medium">{formData.tipoSocio || 'Por ingresar'}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground font-semibold">CUI</Label>
                    <p className="text-sm font-medium">{formData.dpi || 'Por ingresar'}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground font-semibold">NIT</Label>
                    <p className="text-sm font-medium">{formData.nit || 'Por ingresar'}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground font-semibold">Nombre</Label>
                    <p className="text-sm font-medium">{personName}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground font-semibold">Estado Civil</Label>
                    <p className="text-sm font-medium">{formData.estadoCivil || 'Por ingresar'}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground font-semibold">Fecha de Nacimiento</Label>
                    <p className="text-sm font-medium">{formData.birthDate || 'Por ingresar'}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground font-semibold">Nacionalidad</Label>
                    <p className="text-sm font-medium">{formData.nacionalidad || 'Por ingresar'}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground font-semibold">Género</Label>
                    <p className="text-sm font-medium">{formData.genero || 'Por ingresar'}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground font-semibold">Profesión</Label>
                    <p className="text-sm font-medium">{formData.profesion || 'Por ingresar'}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground font-semibold">Nivel Educativo</Label>
                    <p className="text-sm font-medium">{formData.educationLevel || 'Por ingresar'}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground font-semibold">Tipo de Vivienda</Label>
                    <p className="text-sm font-medium">{formData.housingType || 'Por ingresar'}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground font-semibold">Años en Vivienda</Label>
                    <p className="text-sm font-medium">{formData.housingYears || 'Por ingresar'}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground font-semibold">Dependientes</Label>
                    <p className="text-sm font-medium">{formData.dependents || 'Por ingresar'}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground font-semibold">Email</Label>
                    <p className="text-sm font-medium">{formData.email || 'Por ingresar'}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground font-semibold">Teléfono</Label>
                    <p className="text-sm font-medium">{formData.mobilePhone || 'Por ingresar'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-xs text-muted-foreground font-semibold">Dirección</Label>
                    <p className="text-sm font-medium">{formData.address || 'Por ingresar'}</p>
                  </div>
                </div>

                {formData.conyuge && <>
                    <Separator className="my-6" />
                    <h4 className="text-sm font-medium mb-4">Información del Cónyuge</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs text-muted-foreground font-semibold">Nombre</Label>
                        <p className="text-sm font-medium">{formData.conyuge.nombre || 'Por ingresar'}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground font-semibold">DPI</Label>
                        <p className="text-sm font-medium">{formData.conyuge.dpi || 'Por ingresar'}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground font-semibold">Teléfono</Label>
                        <p className="text-sm font-medium">{formData.conyuge.telefono || 'Por ingresar'}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground font-semibold">Ocupación</Label>
                        <p className="text-sm font-medium">{formData.conyuge.trabajo || 'Por ingresar'}</p>
                      </div>
                    </div>
                  </>}
              </CardContent>
            </Card>


            {/* Financial Analysis Detailed */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Análisis Financiero Detallado</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Income */}
                <div>
                  <h4 className="text-sm font-medium mb-4">Ingresos</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-xs text-muted-foreground font-semibold">Ingresos Principales</Label>
                      <p className="text-sm font-medium">Q {Number(formData.ingresoPrincipal || 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground font-semibold">Ingresos Secundarios</Label>
                      <p className="text-sm font-medium">Q {Number(formData.ingresoSecundario || 0).toLocaleString()}</p>
                    </div>
                    <div className="md:col-span-2">
                      <Label className="text-xs text-muted-foreground font-semibold">Fuente</Label>
                      <p className="text-sm font-medium">{formData.incomeSource || 'Por ingresar'}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Expenses */}
                <div>
                  <h4 className="text-sm font-medium mb-4">Gastos Mensuales</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-xs text-muted-foreground font-semibold">Renta</Label>
                      <p className="text-sm font-medium">Q {Number(formData.rent || 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground font-semibold">Servicios</Label>
                      <p className="text-sm font-medium">Q {Number(formData.utilities || 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground font-semibold">Alimentación</Label>
                      <p className="text-sm font-medium">Q {Number(formData.food || 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground font-semibold">Transporte</Label>
                      <p className="text-sm font-medium">Q {Number(formData.transportation || 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground font-semibold">Otros</Label>
                      <p className="text-sm font-medium">Q {Number(formData.otherExpenses || 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground font-semibold">Total Gastos</Label>
                      <p className="text-sm font-bold">Q {Number(formData.totalExpenses || 0).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Current Debts */}
                <div>
                  <h4 className="text-sm font-medium mb-4">Deudas Actuales</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-muted-foreground font-semibold">Préstamos</Label>
                      <p className="text-sm font-medium">Q {Number(formData.currentLoans || 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground font-semibold">Tarjetas</Label>
                      <p className="text-sm font-medium">Q {Number(formData.creditCards || 0).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Financial Evaluation */}
                <div className="bg-purple-50 dark:bg-purple-950 p-4 rounded-md">
                  <h4 className="text-sm font-medium mb-4">Evaluación Financiera</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-xs text-muted-foreground font-semibold">Ingreso Neto</Label>
                      <p className="text-sm text-green-600 font-bold">Q {Number(formData.netIncome || 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground font-semibold">Ratio Deuda/Ingreso</Label>
                      <p className="text-sm font-bold">{Number(formData.debtToIncomeRatio || 0).toFixed(1)}%</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground font-semibold">Capacidad de Pago</Label>
                      <p className="text-sm text-purple-600 font-bold">Q {Number(formData.paymentCapacity || 0).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Patrimony */}
                <div>
                  <h4 className="text-sm font-medium mb-4">Estado Patrimonial</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Assets */}
                    <div>
                      <h5 className="text-sm font-medium text-green-600 mb-3">Activos</h5>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Efectivo</span>
                          <span className="text-sm">Q {Number(formData.assets?.cash || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Inventario</span>
                          <span className="text-sm">Q {Number(formData.assets?.inventory || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Equipos</span>
                          <span className="text-sm">Q {Number(formData.assets?.equipment || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Bienes Inmuebles</span>
                          <span className="text-sm">Q {Number(formData.assets?.realEstate || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Vehículos</span>
                          <span className="text-sm">Q {Number(formData.assets?.vehicles || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between font-bold border-t pt-2">
                          <span>Total Activos</span>
                          <span>Q {Number(formData.assets?.total || 0).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Liabilities */}
                    <div>
                      <h5 className="text-sm font-medium text-red-600 mb-3">Pasivos</h5>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Préstamos</span>
                          <span className="text-sm">Q {Number(formData.liabilities?.loans || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Tarjetas</span>
                          <span className="text-sm">Q {Number(formData.liabilities?.creditCards || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Proveedores</span>
                          <span className="text-sm">Q {Number(formData.liabilities?.suppliers || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between font-bold border-t pt-2">
                          <span>Total Pasivos</span>
                          <span>Q {Number(formData.liabilities?.total || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between font-bold text-primary border-t pt-2 mt-4">
                          <span>Patrimonio Neto</span>
                          <span>Q {Number(formData.netWorth || 0).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </main>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Envío de Solicitud</DialogTitle>
            <DialogDescription>
              ¿Está seguro que desea enviar esta solicitud? Una vez enviada no podrá ser modificada.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={confirmSubmission} disabled={isSubmitting}>
              {isSubmitting ? 'Enviando...' : 'Confirmar Envío'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <PartyPopper className="h-5 w-5 text-primary" />
              ¡Solicitud Enviada!
            </DialogTitle>
            <DialogDescription>
              Su solicitud ha sido enviada exitosamente y está siendo procesada.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleSuccessClose}>
              Continuar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <BottomNavigation />
    </div>;
};
export default ApplicationDetails;