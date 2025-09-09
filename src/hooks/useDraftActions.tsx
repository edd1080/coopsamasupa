
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
      
      // Debug: Log the current user ID being used
      console.log('👤 Current authenticated user ID for save:', sanitizeConsoleOutput({ userId: user.id }));
      
      // Rate limiting check
      if (!formRateLimit.isAllowed(user.id)) {
        const remainingTime = Math.ceil(formRateLimit.getRemainingTime(user.id) / 1000 / 60);
        throw new Error(`Demasiados intentos. Espera ${remainingTime} minutos antes de intentar de nuevo.`);
      }
      
      console.log('✅ User authenticated, proceeding with save');
      
      // Sanitize all input data
      const sanitizedFormData = sanitizeObjectData(formData);
      const sanitizedChangedData = changedData ? sanitizeObjectData(changedData) : null;
      
      // Check if offline - enqueue if no connection
      if (!navigator.onLine) {
        const { offlineQueue } = await import('@/utils/offlineQueue');
        await offlineQueue.enqueue({
          type: 'updateDraft',
          payload: {
            id: sanitizedFormData.applicationId || generateApplicationId(),
            agent_id: user.id,
            client_name: sanitizedFormData?.fullName || 'Sin nombre',
            draft_data: isIncremental && sanitizedChangedData ? sanitizedChangedData : sanitizedFormData,
            last_step: currentStep,
            last_sub_step: currentSubStep || 0
          }
        });
        
        // Return optimistic result for offline
        return {
          id: sanitizedFormData.applicationId || generateApplicationId(),
          agent_id: user.id,
          updated_at: new Date().toISOString(),
          client_name: sanitizedFormData?.fullName || 'Sin nombre',
          draft_data: isIncremental && sanitizedChangedData ? sanitizedChangedData : sanitizedFormData,
          last_step: currentStep,
          last_sub_step: currentSubStep || 0
        };
      }
      
      // Generate or use existing application display ID (SCO_######)
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
      let draftId: string;
      
      if (isIncremental && sanitizedChangedData) {
        // First try to find existing draft by the display applicationId in draft_data
        const { data: existingDrafts } = await supabase
          .from('application_drafts')
          .select('id, draft_data')
          .eq('agent_id', user.id);
        
        const existingDraft = existingDrafts?.find(draft => 
          draft.draft_data && 
          typeof draft.draft_data === 'object' && 
          (draft.draft_data as any).applicationId === sanitizedFormData.applicationId
        );
        
        if (existingDraft && existingDraft.draft_data && typeof existingDraft.draft_data === 'object') {
          // Use existing UUID and combine data
          draftId = existingDraft.id;
          finalDraftData = {
            ...(existingDraft.draft_data as Record<string, any>),
            ...sanitizedChangedData,
            applicationId: sanitizedFormData.applicationId // Ensure the display ID is maintained
          };
          console.log('🔄 Combined existing draft with changes, using UUID:', draftId);
        } else {
          // Generate new UUID for new draft
          draftId = crypto.randomUUID();
          finalDraftData = sanitizedFormData;
          console.log('📝 No existing draft found, creating new with UUID:', draftId);
        }
      } else {
        // For new drafts or full saves, generate new UUID
        draftId = crypto.randomUUID();
        console.log('🆔 Generated new UUID for draft:', draftId);
      }
      
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
        last_step: draftPayload.last_step,
        expected_user_id: user.id,
        agent_id_matches_user: draftPayload.agent_id === user.id
      }));
      
      // Debug: Double-check user authentication before upsert
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser || currentUser.id !== user.id) {
        console.error('❌ Session verification failed:', {
          expected: user.id,
          actual: currentUser?.id,
          sessionValid: !!currentUser
        });
        throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
      }
      
      console.log('🔒 Session verified before save:', {
        userId: currentUser.id,
        matches: currentUser.id === user.id
      });
      
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
          hint: error.hint,
          draftPayload: {
            id: draftPayload.id,
            agent_id: draftPayload.agent_id,
            client_name: draftPayload.client_name
          }
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
      console.log('✅ Draft save verification:', {
        savedId: data.id,
        savedAgentId: data.agent_id,
        expectedUserId: user.id,
        idsMatch: data.agent_id === user.id
      });
      
      return data;
    },
    onSuccess: (data, variables) => {
      console.log('🎉 Draft save success, invalidating queries');
      console.log('🎉 Saved draft details:', {
        id: data.id,
        agent_id: data.agent_id,
        client_name: data.client_name,
        updated_at: data.updated_at
      });
      
      // Invalidar el query key correcto que usa useApplicationsList
      queryClient.invalidateQueries({ queryKey: ['applications-list', user?.id] });
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
        isIncremental: variables.isIncremental,
        currentUserId: user?.id
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
    
    // Validar DPI (Documento Personal de Identificación)
    const dpi = formData?.dpi || formData?.identification?.dpi || formData?.personalInfo?.dpi;
    if (!dpi || dpi.trim().length < 13) {
      missingFields.push('DPI (Documento Personal de Identificación)');
    }
    
    // Validar teléfono móvil
    const mobilePhone = formData?.mobilePhone || formData?.identification?.mobilePhone || formData?.personalInfo?.mobilePhone;
    if (!mobilePhone || mobilePhone.trim().length < 8) {
      missingFields.push('Teléfono móvil');
    }
    
    console.log('✅ Validation result:', { 
      fullName, 
      nameParts,
      dpi,
      mobilePhone,
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
