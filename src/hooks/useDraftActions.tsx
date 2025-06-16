
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from "@/hooks/use-toast";
import { sanitizeObjectData, validateTextInput } from '@/utils/inputValidation';
import { sanitizeConsoleOutput, formRateLimit } from '@/utils/securityUtils';

// Hook para guardar borrador con soporte incremental y validación mejorada
export const useSaveDraft = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ 
      formData, 
      currentStep, 
      currentSubStep, 
      isIncremental = false, 
      changedData = null 
    }: { 
      formData: any; 
      currentStep: number; 
      currentSubStep?: number;
      isIncremental?: boolean;
      changedData?: any;
    }) => {
      if (!user?.id) throw new Error('Usuario no autenticado');
      
      // Rate limiting check
      if (!formRateLimit.isAllowed(user.id)) {
        const remainingTime = Math.ceil(formRateLimit.getRemainingTime(user.id) / 1000 / 60);
        throw new Error(`Demasiados intentos. Espera ${remainingTime} minutos antes de intentar de nuevo.`);
      }
      
      console.log('💾 useSaveDraft: Saving draft', sanitizeConsoleOutput({ 
        isIncremental, 
        currentStep, 
        currentSubStep,
        userId: user.id
      }));
      
      // Sanitize all input data
      const sanitizedFormData = sanitizeObjectData(formData);
      const sanitizedChangedData = changedData ? sanitizeObjectData(changedData) : null;
      
      // Construir el nombre del cliente desde diferentes fuentes posibles
      const clientName = sanitizedFormData?.fullName ||
                        sanitizedFormData?.identification?.fullName || 
                        sanitizedFormData?.personalInfo?.fullName || 
                        sanitizedFormData?.basicData?.fullName ||
                        (sanitizedFormData?.firstName && sanitizedFormData?.lastName ? `${sanitizedFormData.firstName} ${sanitizedFormData.lastName}` : '') ||
                        (sanitizedFormData?.identification?.firstName && sanitizedFormData?.identification?.lastName ? `${sanitizedFormData.identification.firstName} ${sanitizedFormData.identification.lastName}` : '') ||
                        sanitizedFormData?.firstName || 
                        'Sin nombre';
      
      // Validate client name
      const nameValidation = validateTextInput(clientName, 'Nombre del cliente', 2, 100);
      if (!nameValidation.isValid) {
        throw new Error(nameValidation.errors[0]);
      }
      
      console.log('👤 Extracted and validated client name:', sanitizeConsoleOutput({ clientName }));
      
      // Para guardado incremental, primero obtener datos existentes
      let finalDraftData = isIncremental && sanitizedChangedData ? sanitizedChangedData : sanitizedFormData;
      
      if (isIncremental && sanitizedChangedData) {
        // Buscar borrador existente para combinar datos
        const { data: existingDraft } = await supabase
          .from('application_drafts')
          .select('draft_data')
          .eq('agent_id', user.id)
          .order('updated_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        
        if (existingDraft) {
          // Combinar datos existentes con cambios
          finalDraftData = {
            ...existingDraft.draft_data,
            ...sanitizedChangedData
          };
          console.log('🔄 Combined existing draft with changes');
        } else {
          // Si no hay borrador existente, usar datos completos
          finalDraftData = sanitizedFormData;
          console.log('📝 No existing draft found, using full data');
        }
      }
      
      const draftPayload = {
        agent_id: user.id,
        client_name: clientName,
        draft_data: finalDraftData,
        last_step: currentStep,
        last_sub_step: currentSubStep || 0,
        updated_at: new Date().toISOString()
      };
      
      console.log('📦 Draft payload prepared');
      
      const { data, error } = await supabase
        .from('application_drafts')
        .upsert(draftPayload)
        .select()
        .single();
        
      if (error) {
        console.error('❌ Supabase error:', sanitizeConsoleOutput(error));
        throw error;
      }
      
      console.log('✅ Draft saved successfully');
      return data;
    },
    onSuccess: (data, variables) => {
      console.log('🎉 Draft save success, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['application-drafts'] });
      
      const saveType = variables.isIncremental ? 'guardado incremental' : 'borrador guardado';
      
      toast({
        title: `${saveType.charAt(0).toUpperCase() + saveType.slice(1)}`,
        description: `Tu solicitud ha sido guardada (ID: ${data.id.slice(0, 8)}...)`,
        variant: "default",
        className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
        duration: variables.isIncremental ? 2000 : 3000,
      });
    },
    onError: (error, variables) => {
      console.error('❌ Error saving draft:', sanitizeConsoleOutput(error));
      const saveType = variables.isIncremental ? 'guardado incremental' : 'borrador';
      
      toast({
        title: `Error al guardar ${saveType}`,
        description: error.message || "No se pudo guardar el progreso. Inténtalo de nuevo.",
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

// Hook para validación de datos mínimos con validación mejorada
export const useApplicationValidation = () => {
  const validateMinimumRequiredData = (formData: any): { isValid: boolean; missingFields: string[] } => {
    const missingFields: string[] = [];
    
    console.log('🔍 Validating minimum required data:', formData);
    
    // Validar nombre completo desde diferentes fuentes posibles
    const fullName = formData?.identification?.fullName || 
                    formData?.personalInfo?.fullName || 
                    formData?.basicData?.fullName ||
                    formData?.fullName ||
                    (formData?.firstName && formData?.lastName ? `${formData.firstName} ${formData.lastName}` : '') ||
                    (formData?.identification?.firstName && formData?.identification?.lastName ? `${formData.identification.firstName} ${formData.identification.lastName}` : '') ||
                    formData?.firstName;
    
    // Validación más estricta del nombre
    if (!fullName || fullName.trim().length < 2) {
      missingFields.push('Nombre completo (mínimo 2 caracteres)');
    }
    
    // Validar que el nombre contenga al menos nombre y apellido
    const nameParts = fullName?.trim().split(' ').filter(part => part.length > 0) || [];
    if (nameParts.length < 2) {
      missingFields.push('Apellidos (se requiere nombre y apellido completos)');
    }
    
    console.log('✅ Validation result:', { 
      fullName, 
      nameParts, 
      isValid: missingFields.length === 0, 
      missingFields 
    });
    
    return {
      isValid: missingFields.length === 0,
      missingFields
    };
  };

  return { validateMinimumRequiredData };
};
