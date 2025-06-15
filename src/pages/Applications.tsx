
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import BottomNavigation from '@/components/layout/BottomNavigation';
import PrequalificationModal from '@/components/prequalification/PrequalificationModal';
import CancelApplicationBottomSheet from '@/components/applications/CancelApplicationBottomSheet';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, SlidersHorizontal, FileSpreadsheet, Clock, Calendar, Edit, FileText, Trash2, MoreVertical, CheckCircle, AlertCircle, BarChart3, Banknote, FileSignature, UserCheck, FileImage, Users, X } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger, ContextMenuSeparator } from "@/components/ui/context-menu";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { useApplications } from '@/hooks/useSupabaseQuery';
import { useDeleteApplication } from '@/hooks/useApplicationActions';

const Applications = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPrequalificationModal, setShowPrequalificationModal] = useState(false);
  const [activeStatusFilter, setActiveStatusFilter] = useState('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [cancelBottomSheetOpen, setCancelBottomSheetOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<{ id: string; clientName: string } | null>(null);
  
  // Obtener aplicaciones reales de la base de datos
  const { data: applications = [], isLoading, error } = useApplications();
  const deleteMutation = useDeleteApplication();

  const handleViewApplication = (id: string) => {
    navigate(`/applications/${id}`);
  };

  const handleEditApplication = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigate(`/applications/${id}/edit`);
    toast({
      title: "Edición iniciada",
      description: `Editando solicitud ${id}`,
      duration: 3000
    });
  };

  const handleCancelApplication = (id: string, clientName: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedApplication({ id, clientName });
    setCancelBottomSheetOpen(true);
  };

  const handleDeleteApplication = (id: string, clientName: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedApplication({ id, clientName });
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedApplication) {
      deleteMutation.mutate(selectedApplication.id);
      setDeleteDialogOpen(false);
      setSelectedApplication(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 flex items-center gap-1 text-sm px-3 py-1">
            <BarChart3 className="h-4 w-4" />
            <span>Activo</span>
          </Badge>;
      case 'reviewing':
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200 flex items-center gap-1 text-sm px-3 py-1">
            <Clock className="h-4 w-4" />
            <span>Verificación</span>
          </Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1 text-sm px-3 py-1">
            <CheckCircle className="h-4 w-4" />
            <span>Aprobado</span>
          </Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200 flex items-center gap-1 text-sm px-3 py-1">
            <AlertCircle className="h-4 w-4" />
            <span>Rechazado</span>
          </Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200 flex items-center gap-1 text-sm px-3 py-1">
            <X className="h-4 w-4" />
            <span>Cancelado</span>
          </Badge>;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-GT', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  const filteredApplications = applications.filter(application => {
    if (activeStatusFilter === 'all') return true;
    if (activeStatusFilter === 'active') return application.status === 'pending';
    if (activeStatusFilter === 'verification') return application.status === 'reviewing';
    return application.status === activeStatusFilter;
  });

  const getStatusCounts = () => {
    return {
      all: applications.length,
      active: applications.filter(app => app.status === 'pending').length,
      verification: applications.filter(app => app.status === 'reviewing').length,
      approved: applications.filter(app => app.status === 'approved').length,
      rejected: applications.filter(app => app.status === 'rejected').length,
    };
  };

  const statusCounts = getStatusCounts();

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 px-4 py-4 pb-20">
          <div className="text-center py-12">
            <p className="text-red-500">Error al cargar solicitudes: {error.message}</p>
          </div>
        </main>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 px-4 py-4 pb-20 space-y-6">
        <div>
          <h1 className="text-title mb-1">Tus solicitudes asignadas</h1>
          <p className="text-muted-foreground">Gestiona y administra en tiempo real</p>
        </div>
        
        <div className="flex flex-col gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar solicitudes..." className="pl-10" />
          </div>
          
          <Button className="w-full" onClick={() => navigate('/applications/new')}>
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Nueva Solicitud
          </Button>
        </div>

        <Tabs value={activeStatusFilter} onValueChange={setActiveStatusFilter} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="all">
              Todas ({statusCounts.all})
            </TabsTrigger>
            <TabsTrigger value="active">
              Activas ({statusCounts.active})
            </TabsTrigger>
            <TabsTrigger value="verification">
              En Verificación ({statusCounts.verification})
            </TabsTrigger>
            <TabsTrigger value="approved">
              Aprobadas ({statusCounts.approved})
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Rechazadas ({statusCounts.rejected})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeStatusFilter} className="mt-0">
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Cargando solicitudes...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredApplications.map(application => (
                  <ContextMenu key={application.id}>
                    <ContextMenuTrigger>
                      <Card className="card-hover cursor-pointer group relative" onClick={() => handleViewApplication(application.id)}>
                        <CardContent className="p-4">
                          <div className="flex flex-col">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="text-section-title font-semibold">{application.clientName}</h3>
                                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                  <Calendar className="h-3 w-3" />
                                  <span>{formatDate(application.date)}</span>
                                  <FileText className="h-3 w-3 ml-2" />
                                  <span>{application.id}</span>
                                </div>
                              </div>
                              
                              <div className="flex flex-col items-end gap-2">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 ml-auto transition-opacity" onClick={e => e.stopPropagation()}>
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="w-48">
                                    <DropdownMenuItem onClick={() => handleViewApplication(application.id)}>
                                      <FileText className="mr-2 h-4 w-4" />
                                      <span>Ver detalles</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={e => handleEditApplication(application.id, e)}>
                                      <Edit className="mr-2 h-4 w-4" />
                                      <span>Editar</span>
                                    </DropdownMenuItem>
                                    {application.status !== 'cancelled' && application.status !== 'approved' && (
                                      <DropdownMenuItem onClick={e => handleCancelApplication(application.id, application.clientName, e)}>
                                        <X className="mr-2 h-4 w-4" />
                                        <span>Cancelar solicitud</span>
                                      </DropdownMenuItem>
                                    )}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={e => handleDeleteApplication(application.id, application.clientName, e)}>
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      <span>Eliminar</span>
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                                
                                {getStatusBadge(application.status)}
                              </div>
                            </div>
                            
                            <div className="mt-1 mb-1">
                              <div className="flex items-center text-base font-medium mb-1">
                                {application.stage === 'Información Financiera' && <Banknote className="h-4 w-4 mr-2" />}
                                {application.stage === 'Firma de Acta' && <FileSignature className="h-4 w-4 mr-2" />}
                                {application.stage === 'Análisis de Carácter' && <UserCheck className="h-4 w-4 mr-2" />}
                                {application.stage === 'Documentos e Imágenes' && <FileImage className="h-4 w-4 mr-2" />}
                                {application.stage === 'Fiadores' && <Users className="h-4 w-4 mr-2" />}
                                <span>{application.stage}</span>
                              </div>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-muted-foreground">Progreso</span>
                                <span className="font-medium">{Math.round(application.progress / 6 * 100)}%</span>
                              </div>
                              <Progress value={application.progress / 6 * 100} className="h-1.5" />
                            </div>
                            
                            <div className="flex justify-between items-center mt-2 text-sm">
                              <div className="font-medium">{application.product}</div>
                              <div className="text-primary">{application.amount}</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </ContextMenuTrigger>
                    <ContextMenuContent className="w-48">
                      <ContextMenuItem onClick={() => handleViewApplication(application.id)}>
                        <FileText className="mr-2 h-4 w-4" />
                        <span>Ver detalles</span>
                      </ContextMenuItem>
                      <ContextMenuItem onClick={e => handleEditApplication(application.id, e)}>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Editar</span>
                      </ContextMenuItem>
                      {application.status !== 'cancelled' && application.status !== 'approved' && (
                        <ContextMenuItem onClick={e => handleCancelApplication(application.id, application.clientName, e)}>
                          <X className="mr-2 h-4 w-4" />
                          <span>Cancelar solicitud</span>
                        </ContextMenuItem>
                      )}
                      <ContextMenuSeparator />
                      <ContextMenuItem className="text-destructive focus:text-destructive" onClick={e => handleDeleteApplication(application.id, application.clientName, e)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Eliminar</span>
                      </ContextMenuItem>
                    </ContextMenuContent>
                  </ContextMenu>
                ))}
              </div>
            )}
            
            {!isLoading && filteredApplications.length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No hay solicitudes</h3>
                <p className="text-muted-foreground">
                  No se encontraron solicitudes con el filtro seleccionado.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-center py-4">
          <Button variant="outline">Cargar más</Button>
        </div>
      </main>
      
      <BottomNavigation />
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar solicitud?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La solicitud de {selectedApplication?.clientName} será eliminada permanentemente del sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Cancel Application Bottom Sheet */}
      {selectedApplication && (
        <CancelApplicationBottomSheet
          open={cancelBottomSheetOpen}
          onOpenChange={setCancelBottomSheetOpen}
          applicationId={selectedApplication.id}
          clientName={selectedApplication.clientName}
        />
      )}
      
      <PrequalificationModal open={showPrequalificationModal} onOpenChange={setShowPrequalificationModal} />
    </div>
  );
};

export default Applications;
