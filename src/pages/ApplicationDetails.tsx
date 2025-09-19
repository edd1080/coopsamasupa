import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

import { NewGuarantorSheet } from '@/components/requestForm/guarantors/NewGuarantorSheet';
import { useApplicationData } from '@/hooks/useApplicationData';
import { getFirstNameAndLastName } from '@/lib/nameUtils';
import { useToast } from '@/hooks/use-toast';
const ApplicationDetails = () => {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const navigate = useNavigate();
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
          applicationId: id
        }
      });
    }
  };
  const handleAddGuarantor = async (guarantorData: any) => {
    const newGuarantor = {
      id: Date.now().toString(),
      ...guarantorData,
      porcentajeCobertura: 0,
      status: 'draft',
      progress: 0
    };

    // Update the draft data
    const currentFormData = getFormData(applicationData);
    const updatedGuarantors = [...(currentFormData.guarantors || []), newGuarantor];
    toast({
      title: "Fiador agregado",
      description: `${guarantorData.nombre} ha sido agregado exitosamente.`,
      variant: "success"
    });
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
  const personName = applicationData.client_name || `${formData.firstName || ''} ${formData.lastName || ''}`.trim() || 'Sin nombre';
  return <div className="min-h-screen flex flex-col">
        <Header 
          personName={getFirstNameAndLastName(personName)} 
          applicationId={applicationData.id || ''} 
          externalReferenceId={'coopsama_external_reference_id' in applicationData ? applicationData.coopsama_external_reference_id : undefined}
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
          {/* Full-width name */}
          <div className="mb-4">
            <h1 className="text-xl font-medium text-foreground w-full">
              {personName}
            </h1>
            {'coopsama_external_reference_id' in applicationData && applicationData.coopsama_external_reference_id && (
              <p className="text-sm text-muted-foreground mt-1">
                ID: <span className="font-mono font-medium text-primary">{applicationData.coopsama_external_reference_id}</span>
              </p>
            )}
            {applicationData.isDraft && (
              <p className="text-sm text-muted-foreground mt-1">
                Estado: <span className="font-medium">Borrador</span>
              </p>
            )}
          </div>
          
          {/* Buttons below name */}
          <div className="flex items-center gap-2 mb-4">
            {applicationData.isDraft && (
              <>
                <Button variant="outline" size="md" onClick={() => navigate(`/request-form/${id}`)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
                <Button size="md" onClick={handleSubmitApplication} disabled={!isApplicationReadyToSubmit()} className={!isApplicationReadyToSubmit() ? 'opacity-50 cursor-not-allowed' : ''}>
                  <Send className="h-4 w-4 mr-2" />
                  Enviar Solicitud
                </Button>
              </>
            )}
            {!applicationData.isDraft && (
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1 text-sm px-3 py-1">
                  <CheckCircle className="h-4 w-4" />
                  <span>Solicitud Enviada</span>
                </Badge>
                <span className="text-sm text-muted-foreground">Esta solicitud ya fue enviada y está en modo de solo lectura</span>
              </div>
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
              <CardTitle>Acceso Rápido</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                 {sections.map((section, index) => {
                  const Icon = section.icon;
                  const isCompleted = progress > index;
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
              <CardTitle>Solicitud de Crédito</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-background rounded-md border">
                  <p className="text-xs text-muted-foreground mb-1">Monto Solicitado</p>
                  <p className="font-bold">Q {Number(formData.requestedAmount || 0).toLocaleString()}</p>
                </div>
                <div className="text-center p-3 bg-background rounded-md border">
                  <p className="text-xs text-muted-foreground mb-1">Plazo</p>
                  <p className="font-bold">{formData.termMonths || 0} meses</p>
                </div>
                <div className="text-center p-3 bg-background rounded-md border">
                  <p className="text-xs text-muted-foreground mb-1">Tipo de Crédito</p>
                  <p className="font-bold">{formData.creditType || 'Por definir'}</p>
                </div>
                <div className="text-center p-3 bg-background rounded-md border">
                  <p className="text-xs text-muted-foreground mb-1">Propósito</p>
                  <p className="font-bold">{formData.purpose || 'Por definir'}</p>
                </div>
              </div>
            </CardContent>
          </Card>


          {/* Guarantors Card */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
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
                  <Button onClick={() => navigate(`/request/${id}?step=4`)} className="bg-green-600 hover:bg-green-700 text-white border-0">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Referencias
                  </Button>
                </div> : <div className="space-y-4">
                  {references.map((reference: any, index: number) => <div key={reference.id || index} className="p-4 rounded-xl border bg-gradient-to-r from-primary/5 to-accent/5 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <UserCheck className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="font-medium">{reference.fullName}</h4>
                            <p className="text-sm text-muted-foreground">
                              {reference.referenceType} • {reference.phone}
                            </p>
                          </div>
                        </div>
                        <div className="text-right flex items-center gap-3">
                          <div>
                            <p className="text-sm font-medium">{reference.relation || 'N/A'}</p>
                            <p className="text-xs text-muted-foreground">{reference.rating || 'Sin calificar'}</p>
                          </div>
                          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                            <UserCheck className="h-5 w-5 text-green-600" />
                          </div>
                        </div>
                      </div>
                    </div>)}
                  <NewGuarantorSheet trigger={<Button className="w-full bg-green-600 hover:bg-green-700 text-white border-0">
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar Otro Fiador
                      </Button>} onCreateGuarantor={handleAddGuarantor} onDiscard={() => {}} />
                </div>}
            </CardContent>
          </Card>

          {/* Testing Tools moved to form ReviewSection */}
          <Card className="mb-6 bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                <Code2 className="h-5 w-5" />
                Herramientas de Testing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Las herramientas de testing ahora están integradas en el formulario.
                </p>
                <Button
                  onClick={() => navigate(`/request-form/${id}`)}
                  variant="outline"
                  className="border-blue-300 text-blue-700 hover:bg-blue-50"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Ir al Formulario
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="resumen" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="resumen">Resumen</TabsTrigger>
            <TabsTrigger value="detalles">Detalles</TabsTrigger>
            <TabsTrigger value="documentos">Documentos</TabsTrigger>
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
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigateToFormSection('documents')}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-base">
                  <span className="flex items-center">
                    <FileCheck className="h-4 w-4 mr-2" />
                    Estado de Documentos
                  </span>
                  <ChevronRight className="h-4 w-4" />
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
                  return <Card key={key} className={`p-3 border ${isComplete ? 'border-green-200 bg-green-50' : 'border-amber-200 bg-amber-50'}`}>
                        <div className="text-center">
                          <div className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center ${isComplete ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                            {isComplete ? <CheckCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                          </div>
                          <p className="text-xs font-medium mb-1">{label}</p>
                          <Badge variant={isComplete ? "default" : "secondary"} className={`text-xs ${isComplete ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>
                            {isComplete ? 'Completo' : 'Pendiente'}
                          </Badge>
                        </div>
                      </Card>;
                })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="detalles" className="space-y-6">
            {/* Personal Information Detailed */}
            <Card>
              <CardHeader>
                <CardTitle>Información Personal Detallada</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-semibold text-muted-foreground">Agencia</Label>
                    <p className="font-medium">{formData.agencia || 'Por ingresar'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-muted-foreground">Tipo Socio</Label>
                    <p className="font-medium">{formData.tipoSocio || 'Por ingresar'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-muted-foreground">CUI</Label>
                    <p className="font-medium">{formData.dpi || 'Por ingresar'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-muted-foreground">NIT</Label>
                    <p className="font-medium">{formData.nit || 'Por ingresar'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-muted-foreground">Nombre</Label>
                    <p className="font-medium">{personName}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-muted-foreground">Estado Civil</Label>
                    <p className="font-medium">{formData.estadoCivil || 'Por ingresar'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-muted-foreground">Fecha de Nacimiento</Label>
                    <p className="font-medium">{formData.birthDate || 'Por ingresar'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-muted-foreground">Nacionalidad</Label>
                    <p className="font-medium">{formData.nacionalidad || 'Por ingresar'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-muted-foreground">Género</Label>
                    <p className="font-medium">{formData.genero || 'Por ingresar'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-muted-foreground">Profesión</Label>
                    <p className="font-medium">{formData.profesion || 'Por ingresar'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-muted-foreground">Nivel Educativo</Label>
                    <p className="font-medium">{formData.educationLevel || 'Por ingresar'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-muted-foreground">Tipo de Vivienda</Label>
                    <p className="font-medium">{formData.housingType || 'Por ingresar'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-muted-foreground">Años en Vivienda</Label>
                    <p className="font-medium">{formData.housingYears || 'Por ingresar'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-muted-foreground">Dependientes</Label>
                    <p className="font-medium">{formData.dependents || 'Por ingresar'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-muted-foreground">Email</Label>
                    <p className="font-medium">{formData.email || 'Por ingresar'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-muted-foreground">Teléfono</Label>
                    <p className="font-medium">{formData.mobilePhone || 'Por ingresar'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-sm font-semibold text-muted-foreground">Dirección</Label>
                    <p className="font-medium">{formData.address || 'Por ingresar'}</p>
                  </div>
                </div>

                {formData.conyuge && <>
                    <Separator className="my-6" />
                    <h4 className="font-medium mb-4">Información del Cónyuge</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-semibold text-muted-foreground">Nombre</Label>
                        <p className="font-medium">{formData.conyuge.nombre || 'Por ingresar'}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-semibold text-muted-foreground">DPI</Label>
                        <p className="font-medium">{formData.conyuge.dpi || 'Por ingresar'}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-semibold text-muted-foreground">Teléfono</Label>
                        <p className="font-medium">{formData.conyuge.telefono || 'Por ingresar'}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-semibold text-muted-foreground">Ocupación</Label>
                        <p className="font-medium">{formData.conyuge.trabajo || 'Por ingresar'}</p>
                      </div>
                    </div>
                  </>}
              </CardContent>
            </Card>

            {/* Work Information Detailed */}
            <Card>
              <CardHeader>
                <CardTitle>Información Laboral Detallada</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-semibold text-muted-foreground">Situación</Label>
                    <p className="font-medium">{formData.employmentStatus || 'Por ingresar'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-muted-foreground">Empresa/Negocio</Label>
                    <p className="font-medium">{formData.companyName || 'Por ingresar'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-muted-foreground">Puesto</Label>
                    <p className="font-medium">{formData.position || 'Por ingresar'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-muted-foreground">Años de Experiencia</Label>
                    <p className="font-medium">{formData.yearsEmployed || 0} años</p>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-muted-foreground">Tipo de Trabajo</Label>
                    <p className="font-medium">{formData.workType || 'Por ingresar'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-muted-foreground">Estabilidad de Ingresos</Label>
                    <p className="font-medium">{formData.incomeStability || 'Por ingresar'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-muted-foreground">Teléfono Trabajo</Label>
                    <p className="font-medium">{formData.workPhone || 'Por ingresar'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-muted-foreground">Dirección Trabajo</Label>
                    <p className="font-medium">{formData.workAddress || 'Por ingresar'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Financial Analysis Detailed */}
            <Card>
              <CardHeader>
                <CardTitle>Análisis Financiero Detallado</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Income */}
                <div>
                  <h4 className="font-medium mb-4">Ingresos</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm font-semibold text-muted-foreground">Ingresos Principales</Label>
                      <p className="font-medium">Q {Number(formData.ingresoPrincipal || 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold text-muted-foreground">Ingresos Secundarios</Label>
                      <p className="font-medium">Q {Number(formData.ingresoSecundario || 0).toLocaleString()}</p>
                    </div>
                    <div className="md:col-span-2">
                      <Label className="text-sm font-semibold text-muted-foreground">Fuente</Label>
                      <p className="font-medium">{formData.incomeSource || 'Por ingresar'}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Expenses */}
                <div>
                  <h4 className="font-medium mb-4">Gastos Mensuales</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm font-semibold text-muted-foreground">Renta</Label>
                      <p className="font-medium">Q {Number(formData.rent || 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold text-muted-foreground">Servicios</Label>
                      <p className="font-medium">Q {Number(formData.utilities || 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold text-muted-foreground">Alimentación</Label>
                      <p className="font-medium">Q {Number(formData.food || 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold text-muted-foreground">Transporte</Label>
                      <p className="font-medium">Q {Number(formData.transportation || 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold text-muted-foreground">Otros</Label>
                      <p className="font-medium">Q {Number(formData.otherExpenses || 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold text-muted-foreground">Total Gastos</Label>
                      <p className="font-bold">Q {Number(formData.totalExpenses || 0).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Current Debts */}
                <div>
                  <h4 className="font-medium mb-4">Deudas Actuales</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-semibold text-muted-foreground">Préstamos</Label>
                      <p className="font-medium">Q {Number(formData.currentLoans || 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold text-muted-foreground">Tarjetas</Label>
                      <p className="font-medium">Q {Number(formData.creditCards || 0).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Financial Evaluation */}
                <div className="bg-purple-50 dark:bg-purple-950 p-4 rounded-md">
                  <h4 className="font-medium mb-4">Evaluación Financiera</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm font-semibold text-muted-foreground">Ingreso Neto</Label>
                      <p className="text-green-600 font-bold">Q {Number(formData.netIncome || 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold text-muted-foreground">Ratio Deuda/Ingreso</Label>
                      <p className="font-bold">{Number(formData.debtToIncomeRatio || 0).toFixed(1)}%</p>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold text-muted-foreground">Capacidad de Pago</Label>
                      <p className="text-purple-600 font-bold">Q {Number(formData.paymentCapacity || 0).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Patrimony */}
                <div>
                  <h4 className="font-medium mb-4">Estado Patrimonial</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Assets */}
                    <div>
                      <h5 className="font-medium text-green-600 mb-3">Activos</h5>
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
                      <h5 className="font-medium text-red-600 mb-3">Pasivos</h5>
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

          <TabsContent value="documentos" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries({
              dpiFrontal: 'DPI Frontal',
              dpiTrasero: 'DPI Trasero',
              fotoSolicitante: 'Foto Solicitante',
              recibosServicios: 'Recibos Servicios',
              firmaCanvas: 'Firma Digital'
            }).map(([key, label]) => {
              const doc = documents[key];
              const isComplete = doc?.status === 'complete';
              return <Card key={key} className={`border-2 ${isComplete ? 'border-green-200' : 'border-amber-200'}`}>
                    <CardContent className="p-4">
                      <div className="aspect-square mb-3">
                        {isComplete && doc.url ? <img src={doc.url} alt={label} className="w-full h-full object-cover rounded-md" /> : <div className="w-full h-full bg-muted rounded-md flex items-center justify-center">
                            <Camera className="h-8 w-8 text-muted-foreground" />
                          </div>}
                      </div>
                      <div className="text-center">
                        <h4 className="font-medium text-sm mb-2">{label}</h4>
                        <Badge variant={isComplete ? "default" : "secondary"} className={isComplete ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}>
                          {isComplete ? 'Completo' : 'Pendiente'}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>;
            })}
            </div>
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