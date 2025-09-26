import React, { useState, useMemo, useCallback } from 'react';
import Header from '@/components/layout/Header';
import BottomNavigation from '@/components/layout/BottomNavigation';
import ApplicationsHeader from '@/components/applications/ApplicationsHeader';
import ApplicationsList from '@/components/applications/ApplicationsList';

import BreadcrumbNavigation from '@/components/navigation/BreadcrumbNavigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { PullToRefresh } from '@/components/ui/PullToRefresh';
import { useApplicationsList } from '@/hooks/useApplicationsList';
import { useDeleteApplication, useCancelApplication } from '@/hooks/useApplicationActions';
import { Trash2, RefreshCw } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from '@tanstack/react-query';
const Applications = () => {
  console.log('Applications component loaded - testing tools moved to form');
  const [searchTerm, setSearchTerm] = useState('');
  
  const {
    user
  } = useAuth();
  const {
    toast
  } = useToast();
  const queryClient = useQueryClient();
  const {
    data: applications,
    isLoading,
    refetch,
    isRefetching
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

  // Función para manejar el refresh manual usando React Query directamente
  const handleRefresh = useCallback(async () => {
    try {
      console.log('🔄 Manual refresh triggered by user');
      console.log('🌐 Network status:', { 
        isOffline: !navigator.onLine, 
        navigatorOnLine: navigator.onLine,
        connectionType: navigator.connection?.effectiveType || 'unknown'
      });
      
      // Invalidar cache directamente con React Query
      console.log('🔄 Invalidating applications list cache directly');
      queryClient.invalidateQueries({ queryKey: ['applications-list'] });
      
      // Refetch data
      await refetch();
      
      toast({
        title: "Lista actualizada",
        description: navigator.onLine 
          ? "Las aplicaciones se han actualizado correctamente"
          : "Lista de aplicaciones offline actualizada",
        variant: "success",
        duration: 2000,
      });
    } catch (error) {
      console.error('❌ Error during manual refresh:', error);
      toast({
        title: "Error al actualizar",
        description: "No se pudo actualizar la lista de aplicaciones",
        variant: "destructive",
        duration: 3000,
      });
    }
  }, [refetch, queryClient, toast]);

  // Función para normalizar texto (remover acentos)
  const normalizeText = useCallback((text: string) => {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  }, []);

  // Filtrar aplicaciones basado en el término de búsqueda
  const filteredApplications = React.useMemo(() => {
    if (!applications) return [];
    if (!searchTerm.trim()) return applications;

    const searchNormalized = normalizeText(searchTerm.trim());
    
    return applications.filter(app => {
      // Buscar por nombre del cliente
      const nameMatch = normalizeText(app.clientName).includes(searchNormalized);
      
      // Buscar por DPI
      const dpiMatch = app.dpi && normalizeText(app.dpi).includes(searchNormalized);
      
      // Buscar por número de solicitud (SCO_XXXXXX)
      const applicationIdMatch = app.applicationId && 
        normalizeText(app.applicationId).includes(searchNormalized);
      
      return nameMatch || dpiMatch || applicationIdMatch;
    });
  }, [applications, searchTerm]);

  // Debug: Log current user and applications
  React.useEffect(() => {
    console.log('🔍 Applications page debug info:', {
      currentUser: user?.id,
      applicationsCount: applications?.length || 0,
      filteredCount: filteredApplications.length,
      searchTerm,
      isLoading,
      applications: applications?.map(app => ({
        id: app.id,
        clientName: app.clientName,
        dpi: app.dpi,
        applicationId: app.applicationId,
        status: app.status,
        isDraft: app.status === 'draft'
      })) || []
    });
  }, [user, applications, filteredApplications, searchTerm, isLoading]);
  const editApplication = useCallback((id: string, clientName: string, e?: React.MouseEvent) => {
    console.log('Edit application:', id, clientName);
  }, []);
  
  const handleCancelApplication = useCallback((id: string, clientName: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    cancelApplication.mutate({
      applicationId: id,
      reason: 'Cancelado por el usuario'
    });
  }, [cancelApplication]);
  
  const handleDeleteApplication = useCallback((id: string, clientName: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    // Determinar si es borrador basándose en si existe en la lista con status 'draft'
    const application = filteredApplications?.find(app => app.id === id);
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
  }, [filteredApplications]);
  const confirmDelete = useCallback(() => {
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
  }, [deleteDialog, deleteApplication]);
  
  const cancelDelete = useCallback(() => {
    setDeleteDialog({
      open: false,
      applicationId: '',
      clientName: '',
      isDraft: false
    });
  }, []);
  return <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto pb-20 max-w-5xl py-[4px] px-[17px]">
        <PullToRefresh onRefresh={handleRefresh}>
          <div className="mb-4">
            <BreadcrumbNavigation />
          </div>
          
          <ApplicationsHeader 
            searchTerm={searchTerm} 
            onSearchChange={setSearchTerm}
            onRefresh={handleRefresh}
            isRefreshing={isRefetching}
          />
          
          <ApplicationsList 
            applications={filteredApplications || []} 
            isLoading={isLoading} 
            onEdit={editApplication} 
            onCancel={handleCancelApplication} 
            onDelete={handleDeleteApplication} 
          />
        </PullToRefresh>
      </main>
      
      <BottomNavigation />

      {/* Diálogo de confirmación de eliminación */}
      <AlertDialog open={deleteDialog.open} onOpenChange={open => !open && cancelDelete()}>
        <AlertDialogContent>
          <AlertDialogHeader className="text-center">
            <AlertDialogTitle className="flex items-center justify-center gap-2">
              <Trash2 className="h-5 w-5 text-red-500" />
              Eliminar {deleteDialog.isDraft ? 'borrador' : 'solicitud'}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              ¿Estás seguro de que quieres eliminar {deleteDialog.isDraft ? 'el borrador' : 'la solicitud'} de <strong>{deleteDialog.clientName}</strong>?
              <br />
              <br />
              Esta acción no se puede deshacer.
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