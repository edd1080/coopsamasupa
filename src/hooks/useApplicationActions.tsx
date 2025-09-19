
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from "@/hooks/use-toast";

// Hook para eliminar solicitud (borradores y aplicaciones completas)
export const useDeleteApplication = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ applicationId, isDraft }: { applicationId: string; isDraft?: boolean }) => {
      if (!user?.id) throw new Error('Usuario no autenticado');
      
      console.log('🗑️ Deleting application/draft:', { applicationId, isDraft, userId: user.id });
      
      // Si es borrador, eliminar de application_drafts
      if (isDraft) {
        const { error } = await supabase
          .from('application_drafts')
          .delete()
          .eq('id', applicationId)
          .eq('agent_id', user.id);
          
        if (error) {
          console.error('❌ Error deleting draft:', error);
          throw error;
        }
        
        console.log('✅ Draft deleted successfully');
        return { id: applicationId, type: 'draft' };
      }
      
      // Si es aplicación completa, eliminar de applications
      const { error } = await supabase
        .from('applications')
        .delete()
        .eq('id', applicationId)
        .eq('agent_id', user.id);
        
      if (error) {
        console.error('❌ Error deleting application:', error);
        throw error;
      }
      
      console.log('✅ Application deleted successfully');
      return { id: applicationId, type: 'application' };
    },
    onSuccess: (data) => {
      // Invalidar el query key correcto que usa useApplicationsList
      queryClient.invalidateQueries({ queryKey: ['applications-list', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['application-metrics'] });
      queryClient.invalidateQueries({ queryKey: ['application-drafts'] });
      
      const itemType = data.type === 'draft' ? 'borrador' : 'solicitud';
      toast({
        title: `${itemType.charAt(0).toUpperCase() + itemType.slice(1)} eliminada`,
        description: `La ${itemType} ${data.id.slice(0, 8)}... ha sido eliminada permanentemente`,
        variant: "success",
        duration: 3000
      });
    },
    onError: (error) => {
      console.error('❌ Delete mutation error:', error);
      toast({
        title: "Error al eliminar",
        description: "No se pudo eliminar la solicitud. Inténtalo de nuevo.",
        variant: "destructive",
        duration: 3000
      });
    },
  });
};

// Hook para cancelar solicitud
export const useCancelApplication = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ applicationId, reason }: { applicationId: string; reason: string }) => {
      if (!user?.id) throw new Error('Usuario no autenticado');
      
      const { data, error } = await supabase
        .from('applications')
        .update({ 
          status: 'cancelled',
          current_stage: 'Cancelado',
          progress_step: 0
        })
        .eq('id', applicationId)
        .eq('agent_id', user.id)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      // Invalidar el query key correcto que usa useApplicationsList
      queryClient.invalidateQueries({ queryKey: ['applications-list', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['application-metrics'] });
      
      toast({
        title: "Solicitud cancelada",
        description: `La solicitud de ${data.client_name} ha sido cancelada`,
        duration: 3000
      });
    },
    onError: (error) => {
      toast({
        title: "Error al cancelar",
        description: "No se pudo cancelar la solicitud. Inténtalo de nuevo.",
        variant: "destructive",
        duration: 3000
      });
    },
  });
};
