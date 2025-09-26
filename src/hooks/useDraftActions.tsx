
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from "@/hooks/use-toast";
import { sanitizeObjectData, validateTextInput } from '@/utils/inputValidation';
import { sanitizeConsoleOutput, formRateLimit } from '@/utils/securityUtils';
import { calculateRobustProgress } from '@/utils/progressTracker';
import { generateApplicationId } from '@/utils/applicationIdGenerator';
import { useOfflineStorage } from '@/hooks/useOfflineStorage';

// Hook para guardar borrador con soporte incremental y validación mejorada
export const useSaveDraft = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { saveOfflineData, isOffline } = useOfflineStorage();
  
  return useMutation({
    mutationFn: async ({ 
      formData, 
      currentStep, 
      currentSubStep, 
      isIncremental = false, 
      changedData = null,
      lastEditedField = ''
    }: { 
      formData: any; 
      currentStep: number; 
      currentSubStep?: number;
      isIncremental?: boolean;
      changedData?: any;
      lastEditedField?: string;
    }) => {
      try {
        console.log('🚀 MUTATION FUNCTION EXECUTING - useSaveDraft started');
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
      
      // Sanitize all input data, but preserve documents structure
      const sanitizedFormData = sanitizeObjectData(formData);
      const sanitizedChangedData = changedData ? sanitizeObjectData(changedData) : null;
      
      // CORREGIDO: Preservar estructura de documentos para persistencia
      if (sanitizedFormData.documents) {
        console.log('📄 Preserving documents structure for persistence:', Object.keys(sanitizedFormData.documents));
        // Los documentos ya están en el formato correcto desde PhotoDocumentUpload
        // No necesitamos modificar la estructura, solo asegurar que se preserve
      }
      
      // Generate or use existing application display ID (SCO_######)
      if (!sanitizedFormData.applicationId) {
        sanitizedFormData.applicationId = generateApplicationId();
        console.log('🆔 Generated new application ID:', sanitizedFormData.applicationId);
      }

      const clientName = sanitizedFormData?.fullName ||
                        sanitizedFormData?.identification?.fullName || 
                        sanitizedFormData?.personalInfo?.fullName || 
                        sanitizedFormData?.basicData?.fullName ||
                        (sanitizedFormData?.firstName && sanitizedFormData?.lastName ? `${sanitizedFormData.firstName} ${sanitizedFormData.lastName}` : '') ||
                        (sanitizedFormData?.identification?.firstName && sanitizedFormData?.identification?.lastName ? `${sanitizedFormData.identification.firstName} ${sanitizedFormData.identification.lastName}` : '') ||
                        sanitizedFormData?.firstName || 
                        'Sin nombre';

      // Calcular progreso robusto basado en el último campo editado
      const robustProgress = calculateRobustProgress(lastEditedField, sanitizedFormData);
      console.log('📊 Progreso calculado:', {
        lastEditedField,
        progressStep: robustProgress.progressStep,
        progressPercentage: robustProgress.progressPercentage,
        currentSection: robustProgress.currentSection
      });

      // Save offline immediately for instant feedback
      const offlineKey = `draft_${sanitizedFormData.applicationId}`;
      const offlineData = {
        id: sanitizedFormData.applicationId,
        agent_id: user.id,
        client_name: clientName,
        draft_data: isIncremental && sanitizedChangedData ? sanitizedChangedData : sanitizedFormData,
        last_step: currentStep,
        last_sub_step: currentSubStep || 0,
        updated_at: new Date().toISOString()
      };

      await saveOfflineData(offlineKey, offlineData);

      // Check if offline - enqueue if no connection and return early
      const isCurrentlyOffline = isOffline || !navigator.onLine;
      console.log('🔍 Checking offline status:', { 
        isOffline, 
        navigatorOnLine: navigator.onLine, 
        isCurrentlyOffline,
        connectionType: navigator.connection?.effectiveType || 'unknown'
      });
      
      if (isCurrentlyOffline) {
        console.log('📵 OFFLINE MODE DETECTED - Saving locally and enqueueing...');
        console.log('📵 Form data being saved offline:', sanitizedFormData);
        
        const { offlineQueue } = await import('@/utils/offlineQueue');
        await offlineQueue.enqueue({
          type: 'updateDraft',
          payload: offlineData
        });
        
        console.log('✅ OFFLINE SAVE COMPLETED - Returning optimistic result');
        console.log('✅ Offline data saved:', offlineData);
        
        // Return optimistic result for offline - no need to verify session
        return offlineData;
      }
      
      // Session verification only when online
      console.log('🔒 Verifying session before online save...');
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
      
      console.log('🆔 Using existing application ID:', sanitizedFormData.applicationId);
      
      // Client name already extracted above
      
      // Validate client name
      const nameValidation = validateTextInput(clientName, 'Nombre del cliente', 2, 100);
      if (!nameValidation.isValid) {
        throw new Error(nameValidation.errors[0]);
      }
      
      console.log('👤 Extracted and validated client name:', sanitizeConsoleOutput({ clientName }));
      
      // Check for existing draft by applicationId BEFORE creating new ones
      let finalDraftData = sanitizedFormData;
      let draftId: string;
      
      // Always check for existing draft by the display applicationId in draft_data
      const { data: existingDrafts } = await supabase
        .from('application_drafts')
        .select('id, draft_data')
        .eq('agent_id', user.id);
      
      const existingDraft = existingDrafts?.find(draft => 
        draft.draft_data && 
        typeof draft.draft_data === 'object' && 
        (draft.draft_data as any).applicationId === sanitizedFormData.applicationId
      );
      
      if (existingDraft) {
        // Reuse existing draft ID to update instead of creating new
        draftId = existingDraft.id;
        
        if (isIncremental && sanitizedChangedData && existingDraft.draft_data && typeof existingDraft.draft_data === 'object') {
          // For incremental saves, merge with existing data
          finalDraftData = {
            ...(existingDraft.draft_data as Record<string, any>),
            ...sanitizedChangedData,
            applicationId: sanitizedFormData.applicationId // Ensure the display ID is maintained
          };
          console.log('🔄 Incremental update of existing draft with UUID:', draftId);
        } else {
          // For full saves, use the new data but keep the same ID
          finalDraftData = sanitizedFormData;
          console.log('🔄 Full update of existing draft with UUID:', draftId);
        }
      } else {
        // Generate new UUID only if no existing draft found
        draftId = crypto.randomUUID();
        console.log('📝 Creating new draft with UUID:', draftId);
      }
      
      // Crear payload base
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
      
      // Intentar primero con progress_step
      let data, error;
      try {
        const payloadWithProgress = {
          ...draftPayload,
          progress_step: robustProgress.progressStep
        };
        
        console.log('📊 Intentando guardar con progress_step:', robustProgress.progressStep);
        
        const result = await supabase
          .from('application_drafts')
          .upsert(payloadWithProgress)
          .select()
          .single();
        
        data = result.data;
        error = result.error;
        
        if (error && error.message.includes('progress_step')) {
          console.log('⚠️ Columna progress_step no existe, intentando sin ella...');
          // Si falla por progress_step, intentar sin esa columna
          const resultWithoutProgress = await supabase
            .from('application_drafts')
            .upsert(draftPayload)
            .select()
            .single();
          
          data = resultWithoutProgress.data;
          error = resultWithoutProgress.error;
        }
      } catch (err) {
        console.log('⚠️ Error inesperado, intentando sin progress_step...');
        // Fallback: intentar sin progress_step
        const resultWithoutProgress = await supabase
          .from('application_drafts')
          .upsert(draftPayload)
          .select()
          .single();
        
        data = resultWithoutProgress.data;
        error = resultWithoutProgress.error;
      }
        
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
      
      // Return data with applicationId for form updates
      return {
        ...data,
        applicationId: sanitizedFormData.applicationId
      };
      } catch (error) {
        console.error('❌ CRITICAL ERROR in mutationFn:', error);
        console.error('❌ Error details:', {
          message: error.message,
          stack: error.stack,
          userId: user?.id,
          isOffline: isOffline || !navigator.onLine
        });
        throw error; // Re-throw to let React Query handle it
      }
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

      const displayId = (data as any)?.applicationId || variables?.formData?.applicationId || (data as any)?.id;

      // Permitir silenciar el toast cuando el flujo lo maneje manualmente (e.g., Guardar y salir)
      const shouldShowToast = !(variables as any)?.silentToast;
      if (shouldShowToast) {
        toast({
          title: `${saveType.charAt(0).toUpperCase() + saveType.slice(1)}`,
          description: `Tu solicitud ha sido guardada${!navigator.onLine ? ' offline' : ''}${displayId ? ` con ID: ${displayId}` : ''}`,
          variant: "success",
          duration: variables.isIncremental ? 2000 : 3000,
        });
      }
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
    
    // Validación más relajada del nombre - solo requiere mínimo 2 caracteres
    if (!fullName || fullName.trim().length < 2) {
      missingFields.push('Nombre completo (mínimo 2 caracteres)');
    }
    
    // Validar DPI (Documento Personal de Identificación) - solo formato, no espacios
    const dpi = formData?.dpi || formData?.identification?.dpi || formData?.personalInfo?.dpi;
    const cleanDpi = dpi ? dpi.replace(/[\s-]/g, '') : '';
    if (!cleanDpi || cleanDpi.length !== 13 || !/^\d{13}$/.test(cleanDpi)) {
      missingFields.push('DPI (Documento Personal de Identificación)');
    }
    
    console.log('✅ Validation result:', { 
      fullName, 
      dpi,
      cleanDpi,
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
