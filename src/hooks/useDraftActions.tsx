
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
      
      console.log('💾 useSaveDraft: Saving draft with data:', { formData, currentStep, currentSubStep });
      
      // Construir el nombre del cliente desde diferentes fuentes posibles
      const clientName = formData?.fullName ||
                        formData?.identification?.fullName || 
                        formData?.personalInfo?.fullName || 
                        formData?.basicData?.fullName ||
                        (formData?.firstName && formData?.lastName ? `${formData.firstName} ${formData.lastName}` : '') ||
                        (formData?.identification?.firstName && formData?.identification?.lastName ? `${formData.identification.firstName} ${formData.identification.lastName}` : '') ||
                        formData?.firstName || 
                        'Sin nombre';
      
      console.log('👤 Extracted client name:', clientName);
      
      const draftPayload = {
        agent_id: user.id,
        client_name: clientName,
        draft_data: formData,
        last_step: currentStep,
        last_sub_step: currentSubStep || 0,
        updated_at: new Date().toISOString()
      };
      
      console.log('📦 Draft payload:', draftPayload);
      
      const { data, error } = await supabase
        .from('application_drafts')
        .upsert(draftPayload)
        .select()
        .single();
        
      if (error) {
        console.error('❌ Supabase error:', error);
        throw error;
      }
      
      console.log('✅ Draft saved successfully:', data);
      return data;
    },
    onSuccess: (data) => {
      console.log('🎉 Draft save success, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['application-drafts'] });
      
      toast({
        title: "Borrador guardado",
        description: `Tu solicitud ha sido guardada como borrador (ID: ${data.id.slice(0, 8)}...)`,
        variant: "default",
        className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
        duration: 3000,
      });
    },
    onError: (error) => {
      console.error('❌ Error saving draft:', error);
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
