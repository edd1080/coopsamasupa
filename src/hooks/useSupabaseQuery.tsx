
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

// Hook para obtener el perfil del agente
export const useAgentProfile = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['agent-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('Usuario no autenticado');
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (error) throw error;
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
      
      const { data, error } = await supabase
        .from('prequalifications')
        .select('*')
        .eq('agent_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });
};

// Hook para obtener solicitudes con formato mejorado, incluyendo borradores
export const useApplications = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['applications', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('Usuario no autenticado');
      
      // Obtener solicitudes completas
      const { data: applications, error: appsError } = await supabase
        .from('applications')
        .select('*')
        .eq('agent_id', user.id)
        .order('created_at', { ascending: false });
        
      if (appsError) throw appsError;
      
      // Obtener borradores
      const { data: drafts, error: draftsError } = await supabase
        .from('application_drafts')
        .select('*')
        .eq('agent_id', user.id)
        .order('updated_at', { ascending: false });
        
      if (draftsError) throw draftsError;
      
      // Combinar solicitudes y borradores
      const allApplications = [
        // Mapear solicitudes completas
        ...applications.map(app => ({
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
          isDraft: app.is_draft || false,
          draftData: app.draft_data
        })),
        // Mapear borradores - MOSTRAR COMO "PENDING" (ACTIVAS) VISUALMENTE
        ...drafts.map(draft => ({
          id: draft.id,
          clientName: draft.client_name || 'Sin nombre',
          product: 'Préstamo Personal', // Default product for drafts
          amount: 'Por definir',
          status: 'pending', // Mostrar como activas en lugar de draft
          date: new Date(draft.updated_at).toISOString().split('T')[0],
          progress: draft.last_step || 0,
          stage: getStageNameFromStep(draft.last_step || 0),
          isDraft: true,
          draftData: draft.draft_data,
          lastStep: draft.last_step,
          lastSubStep: draft.last_sub_step
        }))
      ];
      
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

// Hook para crear precalificación en Supabase
export const useCreatePrequalification = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: any) => {
      if (!user?.id) throw new Error('Usuario no autenticado');
      
      const { data: result, error } = await supabase
        .from('prequalifications')
        .insert({
          agent_id: user.id,
          client_name: data.nombre_completo,
          client_dpi: data.dpi,
          client_phone: data.telefono,
          economic_activity: data.actividad_economica,
          monthly_income: data.ingreso_mensual,
          credit_purpose: data.destino_credito,
          requested_amount: data.monto_solicitado,
          credit_history: data.historial,
          evaluation_result: data.result,
          evaluation_status: data.result.status,
          can_proceed: data.result.canProceed,
          requires_additional_data: data.result.requiresAdditionalData,
          evaluation_reason: data.result.reason
        })
        .select()
        .single();
        
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prequalifications'] });
    },
  });
};

// Hook para crear solicitud
export const useCreateApplication = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: any) => {
      if (!user?.id) throw new Error('Usuario no autenticado');
      
      const { data: result, error } = await supabase
        .from('applications')
        .insert({
          ...data,
          agent_id: user.id
        })
        .select()
        .single();
        
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['application-metrics'] });
    },
  });
};
