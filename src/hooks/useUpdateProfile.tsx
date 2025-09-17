import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

interface UpdateProfileData {
  full_name?: string;
  phone?: string;
  agency_id?: string;
}

export const useUpdateProfile = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateProfileData) => {
      if (!user?.id) throw new Error('Usuario no autenticado');

      const { data: result, error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      // Invalidar caché del perfil para refrescar los datos
      queryClient.invalidateQueries({ queryKey: ['user-profile', user?.id] });
      
      toast({
        variant: "success",
        title: "Perfil actualizado",
        description: "La información personal se ha guardado correctamente."
      });
    },
    onError: (error: any) => {
      console.error('Error updating profile:', error);
      toast({
        variant: "destructive",
        title: "Error al guardar",
        description: "No se pudo actualizar la información. Intenta nuevamente."
      });
    }
  });
};