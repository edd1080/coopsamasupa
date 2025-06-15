
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from "@/hooks/use-toast";

// Hook para eliminar solicitud
export const useDeleteApplication = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (applicationId: string) => {
      if (!user?.id) throw new Error('Usuario no autenticado');
      
      const { error } = await supabase
        .from('applications')
        .delete()
        .eq('id', applicationId)
        .eq('agent_id', user.id);
        
      if (error) throw error;
      return applicationId;
    },
    onSuccess: (applicationId) => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['application-metrics'] });
      toast({
        title: "Solicitud eliminada",
        description: `La solicitud ${applicationId} ha sido eliminada permanentemente`,
        variant: "destructive",
        duration: 3000
      });
    },
    onError: (error) => {
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
