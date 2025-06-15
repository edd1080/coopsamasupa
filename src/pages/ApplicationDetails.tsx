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
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const [application, setApplication] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [toastShown, setToastShown] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchApplicationData = () => {
      setTimeout(() => {
        const mockApplication = {
          id: 'SCO_459034',
          status: 'reviewing',
          progress: 4,
          createdAt: '2025-04-05',
          updatedAt: '2025-04-07',
          identification: {
            agencia: 'Guatemala Central',
            cui: '3456 78901 2345',
            nit: '1234567-8',
            tipoSocio: 'Nuevo',
            fullName: 'María Elena Rodríguez García',
            email: 'maria.rodriguez@example.com',
            phone: '502-5555-1234',
            estadoCivil: 'Casada',
            address: 'Zona 10, Ciudad de Guatemala',
            birthDate: '1990-05-15',
            nacionalidad: 'Guatemalteca',
            genero: 'Femenino',
            profesion: 'Comerciante',
            educationLevel: 'Diversificado',
            housingType: 'Propia',
            housingYears: 5,
            dependents: 2,
            conyuge: {
              nombre: 'Carlos Martínez',
              dpi: '2345 67890 1234',
              telefono: '502-5555-5678',
              trabajo: 'Albañil'
            }
          },
          work: {
            employmentStatus: 'Independiente',
            companyName: 'Abarrotes María (Negocio Propio)',
            position: 'Propietaria',
            yearsEmployed: 8,
            monthsEmployed: 0,
            workAddress: 'Mercado Central, Local 45, Zona 1',
            workPhone: '502-2222-5678',
            workType: 'Comercio',
            incomeStability: 'Estable'
          },
          finances: {
            primaryIncome: 20000,
            secondaryIncome: 5000,
            incomeSource: 'Ventas del negocio',
            rent: 3500,
            utilities: 800,
            food: 2500,
            transportation: 1200,
            otherExpenses: 2000,
            totalExpenses: 10000,
            currentLoans: 15000,
            creditCards: 5000,
            totalDebts: 20000,
            // Evaluación financiera
            netIncome: 15000,
            debtToIncomeRatio: 0.8,
            paymentCapacity: 12000,
            // Estado patrimonial
            assets: {
              cash: 5000,
              inventory: 50000,
              equipment: 30000,
              realEstate: 200000,
              vehicles: 45000,
              total: 330000
            },
            liabilities: {
              loans: 45000,
              creditCards: 5000,
              suppliers: 15000,
              total: 65000
            },
            netWorth: 265000
          },
          creditRequest: {
            loanAmount: 25000,
            termMonths: 18,
            creditType: 'Crédito Comercial',
            purpose: 'Ampliación de inventario',
            collateral: 'Inventario del negocio'
          },
          guarantors: [{
            id: 'G001',
            nombre: 'Carlos Alberto Martínez',
            dpi: '1234 56789 0123',
            telefono: '502-5555-9876',
            parentesco: 'Esposo',
            salario: 8000,
            tipoEmpleo: 'Asalariado',
            empresa: 'Constructora ABC',
            porcentajeCobertura: 50,
            status: 'in-progress',
            progress: 80
          }],
          documents: {
            dpiFrontal: {
              status: 'complete',
              url: '/placeholder.svg'
            },
            dpiTrasero: {
              status: 'complete',
              url: '/placeholder.svg'
            },
            fotoSolicitante: {
              status: 'complete',
              url: '/placeholder.svg'
            },
            recibosServicios: {
              status: 'pending',
              url: null
            },
            firmaCanvas: {
              status: 'pending',
              url: null
            }
          }
        };
        setApplication(mockApplication);
        setLoading(false);
      }, 500);
    };
    fetchApplicationData();
  }, [id]);

  useEffect(() => {
    if (application && !toastShown) {
      toast({
        title: "Solicitud cargada",
        description: `Solicitud ${id} cargada correctamente`,
        duration: 3000
      });
      setToastShown(true);
    }
  }, [application, toast, id, toastShown]);
  
  const handleEditApplication = () => {
    navigate(`/applications/${id}/edit`);
  };
  
  const navigateToFormSection = (sectionId: string) => {
    navigate(`/applications/${id}/edit`, {
      state: {
        sectionId
      }
    });
    toast({
      title: "Navegación a sección",
      description: `Navegando a la sección: ${sectionId}`,
      duration: 2000
    });
  };

  const navigateToDocuments = () => {
    navigate(`/applications/${id}/edit`, {
      state: {
        sectionId: 'documents'
      }
    });
    toast({
      title: "Agregar Documentos",
      description: "Navegando a la sección de documentos",
      duration: 2000
    });
  };

  const handleAddGuarantor = () => {
    navigate(`/applications/${id}/edit`, {
      state: {
        sectionId: 'guarantors'
      }
    });
    toast({
      title: "Agregar Fiador",
      description: "Navegando al formulario de fiadores",
      duration: 2000
    });
  };

  const isApplicationReadyToSubmit = () => {
    if (!application) return false;

    // Check if all 6 sections are completed
    const allSectionsComplete = application.progress >= 6;

    // Check if required documents are uploaded
    const requiredDocs = ['dpiFrontal', 'dpiTrasero', 'fotoSolicitante'];
    const requiredDocsComplete = requiredDocs.every(doc => application.documents[doc]?.status === 'complete');

    // Check if at least one guarantor is registered
    const hasGuarantors = application.guarantors && application.guarantors.length > 0;
    return allSectionsComplete && requiredDocsComplete && hasGuarantors;
  };

  const handleSubmitApplication = async () => {
    // Check if application is ready first
    if (!isApplicationReadyToSubmit()) {
      toast({
        title: "Solicitud incompleta",
        description: "Para enviar la solicitud, completa todas las secciones, sube los documentos requeridos y registra al menos un fiador.",
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
      // Simulate API call
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
    return <div className="min-h-screen flex flex-col">
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
      </div>;
  }
  
  if (!application) {
    return <div className="min-h-screen flex flex-col">
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
            <p className="text-lg text-muted-foreground">No se pudo encontrar la solicitud solicitada.</p>
            <Button onClick={() => navigate('/applications')}>
              Volver a Solicitudes
            </Button>
          </div>
        </main>
        <BottomNavigation />
      </div>;
  }

  const getStatusIcon = () => {
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
    return applicationStatuses[application.status as keyof typeof applicationStatuses]?.color || '';
  };

  return <div className="min-h-screen flex flex-col">
      <Header personName={application?.identification?.fullName?.split(' ')[0] || ''} applicationStatus={application?.status} applicationId={application?.id} />
      
      <main className="flex-1 container mx-auto px-4 py-0 pb-20">
        <BreadcrumbNavigation />
        
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
          <div className="flex-1">
            <h1 className="text-xl font-medium">{application.identification.fullName}</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={handleEditApplication}>
              <Edit className="h-4 w-4 mr-1" />
              Editar
            </Button>
            <Button size="sm" onClick={handleSubmitApplication} disabled={!isApplicationReadyToSubmit()} className={!isApplicationReadyToSubmit() ? 'opacity-50 cursor-not-allowed' : ''}>
              <Send className="mr-2 h-4 w-4" />
              Enviar Solicitud
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium">Progreso:</span>
            <span>{application.progress}/6 secciones completadas</span>
          </div>
          <Progress value={application.progress / 6 * 100} className="h-2" />
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
              {formSections.map(section => <Button key={section.id} variant="outline" className="h-auto py-2 flex flex-col items-center text-xs gap-1 flex-1 min-h-[5rem] sm:min-h-[4.5rem]" onClick={() => navigateToFormSection(section.id)}>
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mb-1">
                    {section.icon}
                  </div>
                  <span className="text-center leading-tight px-1 whitespace-normal sm:whitespace-nowrap overflow-hidden">
                    {section.name}
                  </span>
                </Button>)}
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
              application={application}
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
                    Información Personal Detallada
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Agencia</p>
                      <p className="font-medium">{application.identification.agencia}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Tipo de Socio</p>
                      <p className="font-medium">{application.identification.tipoSocio}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">CUI</p>
                      <p className="font-medium">{application.identification.cui}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">NIT</p>
                      <p className="font-medium">{application.identification.nit}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Nombre Completo</p>
                      <p className="font-medium">{application.identification.fullName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Estado Civil</p>
                      <p className="font-medium">{application.identification.estadoCivil}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Fecha de Nacimiento</p>
                      <p className="font-medium">{application.identification.birthDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Nacionalidad</p>
                      <p className="font-medium">{application.identification.nacionalidad}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Género</p>
                      <p className="font-medium">{application.identification.genero}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Profesión</p>
                      <p className="font-medium">{application.identification.profesion}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Nivel Educativo</p>
                      <p className="font-medium">{application.identification.educationLevel}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Tipo de Vivienda</p>
                      <p className="font-medium">{application.identification.housingType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Años en Vivienda</p>
                      <p className="font-medium">{application.identification.housingYears} años</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Dependientes</p>
                      <p className="font-medium">{application.identification.dependents}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Correo Electrónico</p>
                      <p className="font-medium">{application.identification.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Teléfono</p>
                      <p className="font-medium">{application.identification.phone}</p>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-sm text-muted-foreground">Dirección</p>
                      <p className="font-medium">{application.identification.address}</p>
                    </div>
                  </div>
                  
                  {application.identification.conyuge && <div className="mt-6">
                      <h4 className="text-sm font-medium mb-3">Información del Cónyuge</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Nombre</p>
                          <p className="font-medium">{application.identification.conyuge.nombre}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">DPI</p>
                          <p className="font-medium">{application.identification.conyuge.dpi}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Teléfono</p>
                          <p className="font-medium">{application.identification.conyuge.telefono}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Trabajo</p>
                          <p className="font-medium">{application.identification.conyuge.trabajo}</p>
                        </div>
                      </div>
                    </div>}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Briefcase className="h-5 w-5 mr-2 text-primary" />
                    Información Laboral Detallada
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Situación Laboral</p>
                      <p className="font-medium">{application.work.employmentStatus}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Empresa/Negocio</p>
                      <p className="font-medium">{application.work.companyName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Puesto/Posición</p>
                      <p className="font-medium">{application.work.position}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Años de Experiencia</p>
                      <p className="font-medium">{application.work.yearsEmployed} años</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Tipo de Trabajo</p>
                      <p className="font-medium">{application.work.workType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Estabilidad de Ingresos</p>
                      <p className="font-medium">{application.work.incomeStability}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Teléfono del Trabajo</p>
                      <p className="font-medium">{application.work.workPhone}</p>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-sm text-muted-foreground">Dirección del Trabajo</p>
                      <p className="font-medium">{application.work.workAddress}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <DollarSign className="h-5 w-5 mr-2 text-primary" />
                    Análisis Financiero Detallado
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium mb-3">Ingresos</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Ingresos Principales</p>
                        <p className="font-medium">Q{application.finances.primaryIncome.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Ingresos Secundarios</p>
                        <p className="font-medium">Q{application.finances.secondaryIncome.toLocaleString()}</p>
                      </div>
                      <div className="sm:col-span-2">
                        <p className="text-sm text-muted-foreground">Fuente de Ingresos</p>
                        <p className="font-medium">{application.finances.incomeSource}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-3">Gastos Mensuales</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Renta/Vivienda</p>
                        <p className="font-medium">Q{application.finances.rent.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Servicios</p>
                        <p className="font-medium">Q{application.finances.utilities.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Alimentación</p>
                        <p className="font-medium">Q{application.finances.food.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Transporte</p>
                        <p className="font-medium">Q{application.finances.transportation.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Otros Gastos</p>
                        <p className="font-medium">Q{application.finances.otherExpenses.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground font-bold">Total Gastos</p>
                        <p className="font-bold">Q{application.finances.totalExpenses.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-3">Deudas Actuales</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Préstamos Actuales</p>
                        <p className="font-medium">Q{application.finances.currentLoans.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Tarjetas de Crédito</p>
                        <p className="font-medium">Q{application.finances.creditCards.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-md">
                    <h4 className="text-sm font-medium mb-3">Evaluación Financiera</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Ingreso Neto</p>
                        <p className="font-bold text-green-600">Q{application.finances.netIncome.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Ratio Deuda/Ingreso</p>
                        <p className="font-bold">{(application.finances.debtToIncomeRatio * 100).toFixed(1)}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Capacidad de Pago</p>
                        <p className="font-bold text-blue-600">Q{application.finances.paymentCapacity.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-3">Estado Patrimonial</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="text-sm font-medium mb-2">Activos</h5>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Efectivo</span>
                            <span className="text-sm">Q{application.finances.assets.cash.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Inventario</span>
                            <span className="text-sm">Q{application.finances.assets.inventory.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Equipos</span>
                            <span className="text-sm">Q{application.finances.assets.equipment.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Bienes Inmuebles</span>
                            <span className="text-sm">Q{application.finances.assets.realEstate.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Vehículos</span>
                            <span className="text-sm">Q{application.finances.assets.vehicles.toLocaleString()}</span>
                          </div>
                          <Separator />
                          <div className="flex justify-between font-bold">
                            <span className="text-sm">Total Activos</span>
                            <span className="text-sm">Q{application.finances.assets.total.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="text-sm font-medium mb-2">Pasivos</h5>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Préstamos</span>
                            <span className="text-sm">Q{application.finances.liabilities.loans.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Tarjetas de Crédito</span>
                            <span className="text-sm">Q{application.finances.liabilities.creditCards.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Proveedores</span>
                            <span className="text-sm">Q{application.finances.liabilities.suppliers.toLocaleString()}</span>
                          </div>
                          <Separator />
                          <div className="flex justify-between font-bold">
                            <span className="text-sm">Total Pasivos</span>
                            <span className="text-sm">Q{application.finances.liabilities.total.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between font-bold text-primary">
                            <span className="text-sm">Patrimonio Neto</span>
                            <span className="text-sm">Q{application.finances.netWorth.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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
                {application.guarantors.length === 0 ? <div className="text-center p-12">
                    <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No hay fiadores registrados</h3>
                    <p className="text-muted-foreground mb-6">
                      Para procesar la solicitud de crédito se requieren mínimo 2 fiadores
                    </p>
                    <Button onClick={handleAddGuarantor} className="bg-primary hover:bg-primary/90">
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar Fiador
                    </Button>
                  </div> : <div className="space-y-4">
                    {application.guarantors.map((guarantor: any) => <Card key={guarantor.id} className="p-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Nombre</p>
                            <p className="font-medium">{guarantor.nombre}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">DPI</p>
                            <p className="font-medium">{guarantor.dpi}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Parentesco</p>
                            <p className="font-medium">{guarantor.parentesco}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Teléfono</p>
                            <p className="font-medium">{guarantor.telefono}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Salario</p>
                            <p className="font-medium">Q{guarantor.salario.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Tipo de Empleo</p>
                            <p className="font-medium">{guarantor.tipoEmpleo}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Empresa/Empleador</p>
                            <p className="font-medium">{guarantor.empresa}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">% Cobertura</p>
                            <p className="font-medium">{guarantor.porcentajeCobertura}%</p>
                          </div>
                        </div>
                        <div className="mt-4">
                          <div className="flex justify-between text-sm mb-2">
                            <span>Progreso:</span>
                            <span>{guarantor.progress}%</span>
                          </div>
                          <Progress value={guarantor.progress} className="h-2" />
                        </div>
                      </Card>)}
                    
                    <div className="text-center pt-4">
                      <Button onClick={handleAddGuarantor} variant="outline">
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar Otro Fiador
                      </Button>
                    </div>
                  </div>}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="docs">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(application.documents).map(([key, value]: [string, any]) => <Card key={key} className={value.status === 'complete' ? 'border-green-200' : 'border-amber-200'}>
                  <CardContent className="p-4">
                    <div className="flex flex-col items-center">
                      {value.status === 'complete' ? <>
                          <div className="relative aspect-square w-full max-w-[180px] rounded-md overflow-hidden mb-3">
                            <img src={value.url} alt={`Document ${key}`} className="object-cover w-full h-full" />
                            <div className="absolute top-2 right-2">
                              <Badge className="bg-green-500">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Completo
                              </Badge>
                            </div>
                          </div>
                        </> : <div className="aspect-square w-full max-w-[180px] rounded-md bg-muted flex items-center justify-center mb-3">
                          <div className="text-center p-4">
                            <Camera className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                            <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
                              <Clock className="h-3 w-3 mr-1" />
                              Pendiente
                            </Badge>
                          </div>
                        </div>}
                      <p className="font-medium text-center">
                        {key === 'dpiFrontal' && 'DPI Frontal'}
                        {key === 'dpiTrasero' && 'DPI Trasero'}
                        {key === 'fotoSolicitante' && 'Foto Solicitante'}
                        {key === 'recibosServicios' && 'Recibos Servicios'}
                        {key === 'firmaCanvas' && 'Firma Digital'}
                      </p>
                    </div>
                  </CardContent>
                </Card>)}
            </div>
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
    </div>;
};
export default ApplicationDetails;
