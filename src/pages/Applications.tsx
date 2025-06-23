import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import BottomNavigation from '@/components/layout/BottomNavigation';
import ApplicationsHeader from '@/components/applications/ApplicationsHeader';
import ApplicationsList from '@/components/applications/ApplicationsList';
import BreadcrumbNavigation from '@/components/navigation/BreadcrumbNavigation';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useApplicationsList } from '@/hooks/useApplicationsList';
import { useDeleteApplication, useCancelApplication } from '@/hooks/useApplicationActions';
import { Trash2, RefreshCw } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from "@/hooks/use-toast";
const Applications = () => {
  const {
    user
  } = useAuth();
  const {
    toast
  } = useToast();
  const {
    data: applications,
    isLoading,
    refetch
  } = useApplicationsList();
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    applicationId: string;
    clientName: string;
    isDraft: boolean;
  }>({
    open: false,
    applicationId: '',
    clientName: '',
    isDraft: false
  });
  const deleteApplication = useDeleteApplication();
  const cancelApplication = useCancelApplication();

  // Debug: Log current user and applications
  React.useEffect(() => {
    console.log('🔍 Applications page debug info:', {
      currentUser: user?.id,
      applicationsCount: applications?.length || 0,
      isLoading,
      applications: applications?.map(app => ({
        id: app.id,
        clientName: app.clientName,
        status: app.status,
        isDraft: app.status === 'draft'
      })) || []
    });
  }, [user, applications, isLoading]);
  const handleRefresh = async () => {
    console.log('🔄 Manual refresh triggered by user');
    toast({
      title: "Actualizando lista",
      description: "Refrescando solicitudes...",
      duration: 2000
    });
    try {
      await refetch();
      toast({
        title: "Lista actualizada",
        description: "Las solicitudes se han actualizado correctamente",
        duration: 2000
      });
    } catch (error) {
      console.error('❌ Error during manual refresh:', error);
      toast({
        title: "Error al actualizar",
        description: "No se pudo actualizar la lista. Inténtalo de nuevo.",
        variant: "destructive",
        duration: 3000
      });
    }
  };
  const editApplication = (id: string, clientName: string, e?: React.MouseEvent) => {
    console.log('Edit application:', id, clientName);
  };
  const handleCancelApplication = (id: string, clientName: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    cancelApplication.mutate({
      applicationId: id,
      reason: 'Cancelado por el usuario'
    });
  };
  const handleDeleteApplication = (id: string, clientName: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    // Determinar si es borrador basándose en si existe en la lista con status 'draft'
    const application = applications?.find(app => app.id === id);
    const isDraft = application?.status === 'draft';
    console.log('🗑️ Delete triggered:', {
      id,
      clientName,
      isDraft,
      application
    });
    setDeleteDialog({
      open: true,
      applicationId: id,
      clientName,
      isDraft
    });
  };
  const confirmDelete = () => {
    console.log('🗑️ Confirming delete:', deleteDialog);
    deleteApplication.mutate({
      applicationId: deleteDialog.applicationId,
      isDraft: deleteDialog.isDraft
    });
    setDeleteDialog({
      open: false,
      applicationId: '',
      clientName: '',
      isDraft: false
    });
  };
  const cancelDelete = () => {
    setDeleteDialog({
      open: false,
      applicationId: '',
      clientName: '',
      isDraft: false
    });
  };
  return <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto pb-20 max-w-5xl py-[4px] px-[17px]">
        <div className="mb-4">
          <BreadcrumbNavigation />
        </div>
        
        <ApplicationsHeader />
        
        {/* Debug info and refresh button */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg border py-[12px] my-[16px]">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <span>Usuario: {user?.id?.slice(0, 8)}... | </span>
              <span>Solicitudes: {applications?.length || 0} | </span>
              <span>Cargando: {isLoading ? 'Sí' : 'No'}</span>
            </div>
            <Button onClick={handleRefresh} variant="outline" size="sm" disabled={isLoading} className="flex items-center gap-2">
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
          </div>
        </div>
        
        <ApplicationsList applications={applications || []} isLoading={isLoading} onEdit={editApplication} onCancel={handleCancelApplication} onDelete={handleDeleteApplication} />
      </main>
      
      <BottomNavigation />

      {/* Diálogo de confirmación de eliminación */}
      <AlertDialog open={deleteDialog.open} onOpenChange={open => !open && cancelDelete()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-red-500" />
              Eliminar {deleteDialog.isDraft ? 'borrador' : 'solicitud'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que quieres eliminar {deleteDialog.isDraft ? 'el borrador' : 'la solicitud'} de <strong>{deleteDialog.clientName}</strong>?
              <br />
              <br />
              Esta acción no se puede deshacer. {deleteDialog.isDraft ? 'El borrador' : 'La solicitud'} será eliminado permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDelete}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600 text-white">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>;
};
export default Applications;