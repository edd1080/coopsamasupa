import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from "@/hooks/use-toast";
import { sanitizeObjectData, validateTextInput } from '@/utils/inputValidation';
import { sanitizeConsoleOutput, formRateLimit } from '@/utils/securityUtils';
import { generateApplicationId } from '@/utils/applicationIdGenerator';

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
      console.log('💾 useSaveDraft: Starting save process', sanitizeConsoleOutput({ 
        isIncremental, 
        currentStep, 
        currentSubStep,
        userId: user?.id,
        hasUser: !!user
      }));

      // Verificar autenticación ANTES de cualquier procesamiento
      if (!user?.id) {
        console.error('❌ Usuario no autenticado');
        throw new Error('Usuario no autenticado. Por favor, inicia sesión nuevamente.');
      }
      
      // Rate limiting check
      if (!formRateLimit.isAllowed(user.id)) {
        const remainingTime = Math.ceil(formRateLimit.getRemainingTime(user.id) / 1000 / 60);
        throw new Error(`Demasiados intentos. Espera ${remainingTime} minutos antes de intentar de nuevo.`);
      }
      
      console.log('✅ User authenticated, proceeding with save');
      
      // Sanitize all input data
      const sanitizedFormData = sanitizeObjectData(formData);
      const sanitizedChangedData = changedData ? sanitizeObjectData(changedData) : null;
      
      // Use existing applicationId or generate new one only if it doesn't exist
      if (!sanitizedFormData.applicationId) {
        sanitizedFormData.applicationId = generateApplicationId();
        console.log('🆔 Generated new application ID:', sanitizedFormData.applicationId);
      } else {
        console.log('🆔 Using existing application ID:', sanitizedFormData.applicationId);
      }
      
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
        // Buscar borrador existente para combinar datos - usando el applicationId como filtro
        const { data: existingDraft } = await supabase
          .from('application_drafts')
          .select('draft_data')
          .eq('id', sanitizedFormData.applicationId)
          .eq('agent_id', user.id)
          .maybeSingle();
        
        if (existingDraft) {
          // Combinar datos existentes con cambios
          finalDraftData = {
            ...existingDraft.draft_data,
            ...sanitizedChangedData,
            applicationId: sanitizedFormData.applicationId // Asegurar que el ID se mantenga
          };
          console.log('🔄 Combined existing draft with changes');
        } else {
          // Si no hay borrador existente, usar datos completos
          finalDraftData = sanitizedFormData;
          console.log('📝 No existing draft found, using full data');
        }
      }
      
      // Use the application ID directly as the draft ID
      const draftId = sanitizedFormData.applicationId;
      
      const draftPayload = {
        id: draftId,
        agent_id: user.id, // CRITICAL: Asegurar que coincida con auth.uid()
        client_name: clientName,
        draft_data: finalDraftData,
        last_step: currentStep,
        last_sub_step: currentSubStep || 0,
        updated_at: new Date().toISOString()
      };
      
      console.log('📦 Draft payload prepared:', sanitizeConsoleOutput({
        id: draftPayload.id,
        agent_id: draftPayload.agent_id,
        client_name: draftPayload.client_name,
        last_step: draftPayload.last_step
      }));
      
      // Verificar que el usuario sigue autenticado antes del upsert
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser || currentUser.id !== user.id) {
        throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
      }
      
      const { data, error } = await supabase
        .from('application_drafts')
        .upsert(draftPayload)
        .select()
        .single();
        
      if (error) {
        console.error('❌ Supabase error:', sanitizeConsoleOutput({
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        }));
        
        // Proporcionar mensajes de error más específicos
        if (error.message.includes('row-level security policy')) {
          throw new Error('Error de permisos: No tienes autorización para guardar esta solicitud. Verifica tu sesión.');
        } else if (error.code === '23505') {
          throw new Error('Ya existe una solicitud con este ID. Intenta refrescar la página.');
        } else {
          throw new Error(`Error al guardar: ${error.message}`);
        }
      }
      
      console.log('✅ Draft saved successfully with ID:', draftId);
      return data;
    },
    onSuccess: (data, variables) => {
      console.log('🎉 Draft save success, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['application-drafts'] });
      queryClient.invalidateQueries({ queryKey: ['application-metrics'] });
      
      const saveType = variables.isIncremental ? 'guardado incremental' : 'borrador guardado';
      
      toast({
        title: `${saveType.charAt(0).toUpperCase() + saveType.slice(1)}`,
        description: `Tu solicitud ha sido guardada (ID: ${data.id})`,
        variant: "default",
        className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
        duration: variables.isIncremental ? 2000 : 3000,
      });
    },
    onError: (error: any, variables) => {
      console.error('❌ Error saving draft:', sanitizeConsoleOutput({
        message: error.message,
        isIncremental: variables.isIncremental
      }));
      
      const saveType = variables.isIncremental ? 'guardado incremental' : 'borrador';
      
      toast({
        title: `Error al guardar ${saveType}`,
        description: error.message || "No se pudo guardar el progreso. Inténtalo de nuevo.",
        variant: "destructive",
        duration: 5000
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
