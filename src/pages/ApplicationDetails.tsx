
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import BottomNavigation from '@/components/layout/BottomNavigation';
import BreadcrumbNavigation from '@/components/navigation/BreadcrumbNavigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Edit, 
  Send, 
  PartyPopper, 
  AlertCircle,
  Clock,
  FileText,
  CheckCircle,
  XCircle,
  User,
  DollarSign,
  MapPin,
  Users,
  FileCheck,
  Briefcase,
  Plus,
  Camera
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import SummaryTab from '@/components/applications/tabs/SummaryTab';
import { useApplicationData } from '@/hooks/useApplicationData';

const applicationStatuses = {
  'pending': {
    label: 'Pendiente',
    color: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
  },
  'reviewing': {
    label: 'En revisión',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
  },
  'approved': {
    label: 'Aprobado',
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
  },
  'rejected': {
    label: 'Rechazado',
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }
};

const formSections = [{
  id: 'identification',
  icon: <User size={18} />,
  name: 'Identificación y Contacto'
}, {
  id: 'finances',
  icon: <DollarSign size={18} />,
  name: 'Finanzas y Patrimonio'
}, {
  id: 'business',
  icon: <MapPin size={18} />,
  name: 'Negocio y Perfil Económico'
}, {
  id: 'guarantors',
  icon: <Users size={18} />,
  name: 'Fiadores y Referencias'
}, {
  id: 'documents',
  icon: <FileCheck size={18} />,
  name: 'Documentos'
}, {
  id: 'review',
  icon: <CheckCircle size={18} />,
  name: 'Revisión Final'
}];

const ApplicationDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [toastShown, setToastShown] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Usar el hook real para obtener datos de la aplicación
  const { data: application, isLoading: loading, error } = useApplicationData(id || '');

  useEffect(() => {
    if (application && !toastShown) {
      const itemType = application.isDraft ? 'borrador' : 'solicitud';
      toast({
        title: `${itemType.charAt(0).toUpperCase() + itemType.slice(1)} cargada`,
        description: `${itemType.charAt(0).toUpperCase() + itemType.slice(1)} ${id} cargada correctamente`,
        duration: 3000
      });
      setToastShown(true);
    }
  }, [application, toast, id, toastShown]);
  
  const handleEditApplication = () => {
    if (application?.isDraft) {
      navigate(`/request-form/${id}`);
    } else {
      navigate(`/applications/${id}/edit`);
    }
  };
  
  const navigateToFormSection = (sectionId: string) => {
    const editPath = application?.isDraft ? `/request-form/${id}` : `/applications/${id}/edit`;
    navigate(editPath, {
      state: { sectionId }
    });
    toast({
      title: "Navegación a sección",
      description: `Navegando a la sección: ${sectionId}`,
      duration: 2000
    });
  };

  const navigateToDocuments = () => {
    const editPath = application?.isDraft ? `/request-form/${id}` : `/applications/${id}/edit`;
    navigate(editPath, {
      state: { sectionId: 'documents' }
    });
    toast({
      title: "Agregar Documentos",
      description: "Navegando a la sección de documentos",
      duration: 2000
    });
  };

  const handleAddGuarantor = () => {
    const editPath = application?.isDraft ? `/request-form/${id}` : `/applications/${id}/edit`;
    navigate(editPath, {
      state: { sectionId: 'guarantors' }
    });
    toast({
      title: "Agregar Fiador",
      description: "Navegando al formulario de fiadores",
      duration: 2000
    });
  };

  const isApplicationReadyToSubmit = () => {
    if (!application || application.isDraft) return false;
    // Para aplicaciones completas, verificar si están listas para envío
    return application.progress_step >= 6;
  };

  const handleSubmitApplication = async () => {
    if (!isApplicationReadyToSubmit()) {
      toast({
        title: "Solicitud incompleta",
        description: "Para enviar la solicitud, completa todas las secciones requeridas.",
        variant: "destructive",
        duration: 5000
      });
      return;
    }
    setShowConfirmDialog(true);
  };

  const confirmSubmitApplication = async () => {
    setIsSubmitting(true);
    try {
      // Aquí iría la lógica real para enviar la solicitud
      await new Promise(resolve => setTimeout(resolve, 2000));
      setShowConfirmDialog(false);
      setShowSuccessDialog(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo enviar la solicitud. Intenta nuevamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessDialog(false);
    navigate('/applications');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 pb-20">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-medium">Cargando solicitud...</h1>
          </div>
          <div className="flex items-center justify-center h-[70vh]">
            <div className="animate-pulse space-y-4 w-full max-w-3xl">
              <div className="h-10 bg-muted rounded-md w-1/3"></div>
              <div className="h-40 bg-muted rounded-md"></div>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded-md w-5/6"></div>
                <div className="h-4 bg-muted rounded-md w-4/6"></div>
                <div className="h-4 bg-muted rounded-md w-3/6"></div>
              </div>
            </div>
          </div>
        </main>
        <BottomNavigation />
      </div>
    );
  }
  
  if (error || !application) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 pb-20">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-medium">Solicitud no encontrada</h1>
          </div>
          <div className="flex flex-col items-center justify-center h-[70vh] space-y-4">
            <AlertCircle className="h-16 w-16 text-muted-foreground" />
            <p className="text-lg text-muted-foreground">
              {error?.message || 'No se pudo encontrar la solicitud solicitada.'}
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

  const getStatusIcon = () => {
    if (application.isDraft) {
      return <Clock className="h-5 w-5 text-blue-600" />;
    }
    
    switch (application.status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-amber-600" />;
      case 'reviewing':
        return <FileText className="h-5 w-5 text-blue-600" />;
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-destructive" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  const getStatusClass = () => {
    if (application.isDraft) {
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    }
    return applicationStatuses[application.status as keyof typeof applicationStatuses]?.color || '';
  };

  const getDisplayName = () => {
    return application.client_name || 'Sin nombre';
  };

  const getProgress = () => {
    if (application.isDraft) {
      return application.last_step || 0;
    }
    return application.progress_step || 0;
  };

  // Transformar los datos para SummaryTab - extraer desde draft_data si es borrador
  const getApplicationDataForSummary = () => {
    if (!application) return {};

    // Si es un borrador, extraer datos del draft_data
    if (application.isDraft && application.draft_data) {
      const draftData = application.draft_data;
      
      return {
        identification: {
          fullName: draftData.fullName || null,
          cui: draftData.cui || null,
          nit: draftData.nit || null,
          phone: draftData.phone || null,
          email: draftData.email || null
        },
        finances: {
          primaryIncome: draftData.monthlyIncome || draftData.primaryIncome || null,
          totalExpenses: draftData.monthlyExpenses || draftData.totalExpenses || null,
          netWorth: draftData.netWorth || null
        },
        work: {
          employmentStatus: draftData.employmentStatus || null,
          companyName: draftData.companyName || draftData.businessName || null,
          yearsEmployed: draftData.yearsEmployed || null
        },
        creditRequest: {
          loanAmount: draftData.creditAmount || draftData.loanAmount || null,
          termMonths: draftData.termMonths || null,
          creditType: draftData.creditType || null,
          purpose: draftData.creditPurpose || draftData.purpose || null
        },
        documents: draftData.documents || {}
      };
    }

    // Si es una aplicación completa, usar los datos como están
    return application;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        personName={getDisplayName().split(' ')[0] || ''} 
        applicationStatus={application.isDraft ? 'draft' : application.status} 
        applicationId={application.id} 
      />
      
      <main className="flex-1 container mx-auto px-4 py-0 pb-20">
        <BreadcrumbNavigation />
        
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
          <div className="flex-1">
            <h1 className="text-xl font-medium">{getDisplayName()}</h1>
            {application.isDraft && (
              <Badge variant="outline" className="mt-2 bg-blue-50 text-blue-700 border-blue-200">
                Borrador
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={handleEditApplication}>
              <Edit className="h-4 w-4 mr-1" />
              {application.isDraft ? 'Continuar' : 'Editar'}
            </Button>
            {!application.isDraft && (
              <Button 
                size="sm" 
                onClick={handleSubmitApplication} 
                disabled={!isApplicationReadyToSubmit()} 
                className={!isApplicationReadyToSubmit() ? 'opacity-50 cursor-not-allowed' : ''}
              >
                <Send className="mr-2 h-4 w-4" />
                Enviar Solicitud
              </Button>
            )}
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium">Progreso:</span>
            <span>{getProgress()}/6 secciones completadas</span>
          </div>
          <Progress value={getProgress() / 6 * 100} className="h-2" />
        </div>

        <Card className="mb-6 border-primary/20 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center">
              <FileText className="h-4 w-4 mr-2 text-primary" />
              Acceso Rápido
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-3 pb-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              {formSections.map(section => (
                <Button 
                  key={section.id} 
                  variant="outline" 
                  className="h-auto py-2 flex flex-col items-center text-xs gap-1 flex-1 min-h-[5rem] sm:min-h-[4.5rem]" 
                  onClick={() => navigateToFormSection(section.id)}
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mb-1">
                    {section.icon}
                  </div>
                  <span className="text-center leading-tight px-1 whitespace-normal sm:whitespace-nowrap overflow-hidden">
                    {section.name}
                  </span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="summary" className="mb-6">
          <TabsList className="mb-4">
            <TabsTrigger value="summary" className="font-semibold">Resumen</TabsTrigger>
            <TabsTrigger value="details">Detalles</TabsTrigger>
            <TabsTrigger value="guarantors">
              <div className="flex items-center gap-1">
                <span>Fiadores</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="docs">Documentos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="summary">
            <SummaryTab
              application={getApplicationDataForSummary()}
              onNavigateToSection={navigateToFormSection}
              onNavigateToDocuments={navigateToDocuments}
            />
          </TabsContent>
          
          <TabsContent value="details">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <User className="h-5 w-5 mr-2 text-primary" />
                    Información de la Solicitud
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">ID de Solicitud</p>
                      <p className="font-medium">{application.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Nombre del Cliente</p>
                      <p className="font-medium">{getDisplayName()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Tipo</p>
                      <p className="font-medium">{application.isDraft ? 'Borrador' : 'Solicitud Completa'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Estado</p>
                      <Badge className={getStatusClass()}>
                        {application.isDraft ? 'Borrador' : applicationStatuses[application.status as keyof typeof applicationStatuses]?.label || application.status}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Última Actualización</p>
                      <p className="font-medium">
                        {new Date(application.updated_at).toLocaleDateString('es-GT', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Progreso</p>
                      <p className="font-medium">{getProgress()}/6 pasos completados</p>
                    </div>
                  </div>
                  
                  {application.draft_data && (
                    <div className="mt-6">
                      <h4 className="text-sm font-medium mb-3">Datos del Formulario</h4>
                      <div className="bg-muted/30 p-4 rounded-md">
                        <p className="text-sm text-muted-foreground">
                          Los datos detallados del formulario están disponibles y se pueden editar.
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="guarantors">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Users className="h-5 w-5 mr-2 text-primary" />
                  Fiadores Registrados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center p-12">
                  <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No hay fiadores registrados</h3>
                  <p className="text-muted-foreground mb-6">
                    Para procesar la solicitud de crédito se requieren mínimo 2 fiadores
                  </p>
                  <Button onClick={handleAddGuarantor} className="bg-primary hover:bg-primary/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Fiador
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="docs">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <FileCheck className="h-5 w-5 mr-2 text-primary" />
                  Documentos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center p-12">
                  <Camera className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No hay documentos cargados</h3>
                  <p className="text-muted-foreground mb-6">
                    Sube los documentos requeridos para completar la solicitud
                  </p>
                  <Button onClick={navigateToDocuments} className="bg-primary hover:bg-primary/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Subir Documentos
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <BottomNavigation />

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Envío</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas enviar esta solicitud? Una vez enviada no podrás realizar cambios.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={confirmSubmitApplication} disabled={isSubmitting}>
              {isSubmitting ? 'Enviando...' : 'Confirmar Envío'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <PartyPopper className="h-8 w-8 text-green-600" />
              </div>
              <DialogTitle className="text-xl">¡Solicitud Enviada!</DialogTitle>
              <DialogDescription className="text-center">
                Tu solicitud ha sido enviada exitosamente. Recibirás una notificación cuando sea revisada.
              </DialogDescription>
            </div>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleSuccessClose} className="w-full">
              Continuar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApplicationDetails;
