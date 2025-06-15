
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from "@/hooks/use-toast";

// Hook para guardar borrador
export const useSaveDraft = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ formData, currentStep, currentSubStep }: { 
      formData: any; 
      currentStep: number; 
      currentSubStep?: number;
    }) => {
      if (!user?.id) throw new Error('Usuario no autenticado');
      
      // Construir el nombre del cliente desde diferentes fuentes posibles
      const clientName = formData?.identification?.fullName || 
                        formData?.personalInfo?.fullName || 
                        formData?.basicData?.fullName ||
                        formData?.fullName ||
                        (formData?.firstName && formData?.lastName ? `${formData.firstName} ${formData.lastName}` : '') ||
                        (formData?.identification?.firstName && formData?.identification?.lastName ? `${formData.identification.firstName} ${formData.identification.lastName}` : '') ||
                        formData?.firstName || 
                        '';
      
      const { data, error } = await supabase
        .from('application_drafts')
        .upsert({
          agent_id: user.id,
          client_name: clientName,
          draft_data: formData,
          last_step: currentStep,
          last_sub_step: currentSubStep || 0,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['application-drafts'] });
    },
    onError: (error) => {
      console.error('Error saving draft:', error);
      toast({
        title: "Error al guardar borrador",
        description: "No se pudo guardar el progreso. Inténtalo de nuevo.",
        variant: "destructive",
        duration: 3000
      });
    },
  });
};

// Hook para obtener borradores
export const useDrafts = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['application-drafts', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('Usuario no autenticado');
      
      const { data, error } = await supabase
        .from('application_drafts')
        .select('*')
        .eq('agent_id', user.id)
        .order('updated_at', { ascending: false });
        
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });
};

// Hook para validación de datos mínimos
export const useApplicationValidation = () => {
  const validateMinimumRequiredData = (formData: any): { isValid: boolean; missingFields: string[] } => {
    const missingFields: string[] = [];
    
    // Validar nombre completo desde diferentes fuentes posibles
    const fullName = formData?.identification?.fullName || 
                    formData?.personalInfo?.fullName || 
                    formData?.basicData?.fullName ||
                    formData?.fullName ||
                    (formData?.firstName && formData?.lastName ? `${formData.firstName} ${formData.lastName}` : '') ||
                    (formData?.identification?.firstName && formData?.identification?.lastName ? `${formData.identification.firstName} ${formData.identification.lastName}` : '') ||
                    formData?.firstName;
    
    if (!fullName || fullName.trim().length === 0) {
      missingFields.push('Nombre completo');
    }
    
    return {
      isValid: missingFields.length === 0,
      missingFields
    };
  };

  return { validateMinimumRequiredData };
};
