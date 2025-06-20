
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

// Hook para eliminar precalificación
export const useDeletePrequalification = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (prequalificationId: string) => {
      if (!user?.id) throw new Error('Usuario no autenticado');
      
      console.log('🗑️ Deleting prequalification:', { prequalificationId, userId: user.id });
      
      const { error } = await supabase
        .from('prequalifications')
        .delete()
        .eq('id', prequalificationId)
        .eq('agent_id', user.id);
        
      if (error) {
        console.error('❌ Error deleting prequalification:', error);
        throw error;
      }
      
      console.log('✅ Prequalification deleted successfully');
      return prequalificationId;
    },
    onSuccess: (prequalificationId) => {
      queryClient.invalidateQueries({ queryKey: ['prequalifications'] });
      toast({
        title: "Precalificación eliminada",
        description: `La precalificación ha sido eliminada permanentemente`,
        variant: "destructive",
        duration: 3000
      });
    },
    onError: (error) => {
      console.error('❌ Delete mutation error:', error);
      toast({
        title: "Error al eliminar",
        description: "No se pudo eliminar la precalificación. Inténtalo de nuevo.",
        variant: "destructive",
        duration: 3000
      });
    },
  });
};

// Hook para obtener datos de precalificación para repetir
export const useRepeatPrequalification = () => {
  const { toast } = useToast();
  
  return {
    repeatPrequalification: (prequalificationId: string) => {
      // Por ahora, simplemente mostrar un toast
      // En el futuro se puede implementar para pre-llenar el formulario
      toast({
        title: "Función pendiente",
        description: "La función de repetir precalificación estará disponible próximamente",
        duration: 3000
      });
    }
  };
};
