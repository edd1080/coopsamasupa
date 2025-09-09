import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { sanitizeObjectData } from '@/utils/inputValidation';
import { sanitizeConsoleOutput } from '@/utils/securityUtils';

// Hook para obtener el perfil del agente
export const useAgentProfile = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['agent-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('Usuario no autenticado');
      
      console.log('🔍 Fetching agent profile for user:', sanitizeConsoleOutput({ userId: user.id }));
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (error) {
        console.error('❌ Error fetching agent profile:', sanitizeConsoleOutput(error));
        throw error;
      }
      
      console.log('✅ Agent profile fetched successfully');
      return data;
    },
    enabled: !!user?.id,
  });
};

// Hook para obtener precalificaciones desde Supabase
export const usePrequalifications = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['prequalifications', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('Usuario no autenticado');
      
      console.log('🔍 Fetching prequalifications for user:', sanitizeConsoleOutput({ userId: user.id }));
      
      const { data, error } = await supabase
        .from('prequalifications')
        .select('*')
        .eq('agent_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('❌ Error fetching prequalifications:', sanitizeConsoleOutput(error));
        throw error;
      }
      
      console.log('✅ Prequalifications fetched successfully:', data?.length || 0, 'records');
      return data;
    },
    enabled: !!user?.id,
  });
};

// Hook para obtener solicitudes con formato mejorado, incluyendo borradores - CORREGIDO ORDENAMIENTO
export const useApplications = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['applications', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('Usuario no autenticado');
      
      // Obtener solicitudes completas - MÁS RECIENTES PRIMERO
      const { data: applications, error: appsError } = await supabase
        .from('applications')
        .select('*')
        .eq('agent_id', user.id)
        .order('created_at', { ascending: false }); // Cambiado a false para más recientes primero
        
      if (appsError) throw appsError;
      
      // Obtener borradores - MÁS RECIENTES PRIMERO
      const { data: drafts, error: draftsError } = await supabase
        .from('application_drafts')
        .select('*')
        .eq('agent_id', user.id)
        .order('updated_at', { ascending: false }); // Cambiado a false para más recientes primero
        
      if (draftsError) throw draftsError;
      
      // Combinar solicitudes y borradores con timestamps para ordenamiento correcto
      const applicationItems = applications.map(app => ({
        id: app.id,
        clientName: app.client_name,
        product: app.product,
        amount: new Intl.NumberFormat('es-GT', {
          style: 'currency',
          currency: 'GTQ'
        }).format(app.amount_requested),
        status: app.status,
        date: new Date(app.created_at).toISOString().split('T')[0],
        progress: app.progress_step || 1,
        stage: app.current_stage || 'Información Personal',
        isDraft: false,
        draftData: app.draft_data,
        timestamp: new Date(app.created_at).getTime() // Para ordenamiento
      }));
      
      const draftItems = drafts.map(draft => ({
        id: draft.id,
        clientName: draft.client_name || 'Sin nombre',
        product: 'Préstamo Personal',
        amount: 'Por definir',
        status: 'pending',
        date: new Date(draft.updated_at).toISOString().split('T')[0],
        progress: draft.last_step || 0,
        stage: getStageNameFromStep(draft.last_step || 0),
        isDraft: true,
        draftData: draft.draft_data,
        lastStep: draft.last_step,
        lastSubStep: draft.last_sub_step,
        timestamp: new Date(draft.updated_at).getTime() // Para ordenamiento
      }));
      
      // Combinar y ordenar por timestamp más reciente primero
      const allApplications = [...applicationItems, ...draftItems]
        .sort((a, b) => b.timestamp - a.timestamp)
        .map(({ timestamp, ...item }) => item); // Remover timestamp del resultado final
      
      return allApplications;
    },
    enabled: !!user?.id,
  });
};

// Helper function to get stage name from step number
const getStageNameFromStep = (step: number): string => {
  const stageNames = {
    0: 'Información Personal',
    1: 'Información Financiera',
    2: 'Información del Negocio',
    3: 'Fiadores y Referencias',
    4: 'Documentos',
    5: 'Revisión Final'
  };
  return stageNames[step as keyof typeof stageNames] || 'En progreso';
};

// Hook para crear precalificación en Supabase con validación mejorada
export const useCreatePrequalification = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: any) => {
      if (!user?.id) throw new Error('Usuario no autenticado');
      
      console.log('💾 Creating prequalification for user:', sanitizeConsoleOutput({ userId: user.id }));
      
      // Sanitize input data before storing
      const sanitizedData = sanitizeObjectData(data);
      
      // Check if offline - enqueue if no connection
      if (!navigator.onLine) {
        const { offlineQueue } = await import('@/utils/offlineQueue');
        await offlineQueue.enqueue({
          type: 'createPrequalification',
          payload: {
            agent_id: user.id,
            client_name: sanitizedData.nombre_completo,
            client_dpi: sanitizedData.dpi,
            client_phone: sanitizedData.telefono,
            economic_activity: sanitizedData.actividad_economica,
            monthly_income: sanitizedData.ingreso_mensual,
            credit_purpose: sanitizedData.destino_credito,
            requested_amount: sanitizedData.monto_solicitado,
            credit_history: sanitizedData.historial,
            evaluation_result: sanitizedData.result,
            evaluation_status: sanitizedData.result.status,
            can_proceed: sanitizedData.result.canProceed,
            requires_additional_data: sanitizedData.result.requiresAdditionalData,
            evaluation_reason: sanitizedData.result.reason
          }
        });
        
        // Return optimistic result for offline
        return {
          id: `offline-${Date.now()}`,
          agent_id: user.id,
          client_name: sanitizedData.nombre_completo,
          created_at: new Date().toISOString(),
          ...sanitizedData
        };
      }
      
      const { data: result, error } = await supabase
        .from('prequalifications')
        .insert({
          agent_id: user.id,
          client_name: sanitizedData.nombre_completo,
          client_dpi: sanitizedData.dpi,
          client_phone: sanitizedData.telefono,
          economic_activity: sanitizedData.actividad_economica,
          monthly_income: sanitizedData.ingreso_mensual,
          credit_purpose: sanitizedData.destino_credito,
          requested_amount: sanitizedData.monto_solicitado,
          credit_history: sanitizedData.historial,
          evaluation_result: sanitizedData.result,
          evaluation_status: sanitizedData.result.status,
          can_proceed: sanitizedData.result.canProceed,
          requires_additional_data: sanitizedData.result.requiresAdditionalData,
          evaluation_reason: sanitizedData.result.reason
        })
        .select()
        .single();
        
      if (error) {
        console.error('❌ Error creating prequalification:', sanitizeConsoleOutput(error));
        throw error;
      }
      
      console.log('✅ Prequalification created successfully');
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prequalifications'] });
    },
  });
};

// Hook para crear solicitud con validación mejorada
export const useCreateApplication = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: any) => {
      if (!user?.id) throw new Error('Usuario no autenticado');
      
      console.log('💾 Creating application for user:', sanitizeConsoleOutput({ userId: user.id }));
      
      // Sanitize input data before storing
      const sanitizedData = sanitizeObjectData(data);
      
      // Check if offline - enqueue if no connection
      if (!navigator.onLine) {
        const { offlineQueue } = await import('@/utils/offlineQueue');
        await offlineQueue.enqueue({
          type: 'createApplication',
          payload: {
            ...sanitizedData,
            agent_id: user.id
          }
        });
        
        // Return optimistic result for offline
        return {
          id: `offline-${Date.now()}`,
          agent_id: user.id,
          created_at: new Date().toISOString(),
          ...sanitizedData
        };
      }
      
      const { data: result, error } = await supabase
        .from('applications')
        .insert({
          ...sanitizedData,
          agent_id: user.id
        })
        .select()
        .single();
        
      if (error) {
        console.error('❌ Error creating application:', sanitizeConsoleOutput(error));
        throw error;
      }
      
      console.log('✅ Application created successfully');
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['application-metrics'] });
    },
  });
};
