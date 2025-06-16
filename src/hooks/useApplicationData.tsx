
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { sanitizeConsoleOutput } from '@/utils/securityUtils';

// Hook para obtener datos de una aplicación específica por ID
export const useApplicationData = (applicationId: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['application-data', applicationId, user?.id],
    queryFn: async () => {
      if (!user?.id || !applicationId) throw new Error('Usuario no autenticado o ID inválido');
      
      console.log('🔍 Fetching application data for ID:', sanitizeConsoleOutput({ applicationId, userId: user.id }));
      
      // Primero intentar obtener desde aplicaciones completas
      const { data: application, error: appError } = await supabase
        .from('applications')
        .select('*')
        .eq('id', applicationId)
        .eq('agent_id', user.id)
        .maybeSingle();
        
      if (appError && appError.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('❌ Error fetching application:', sanitizeConsoleOutput(appError));
        throw appError;
      }
      
      if (application) {
        console.log('✅ Application found in applications table');
        return {
          ...application,
          isDraft: false,
          type: 'application'
        };
      }
      
      // Si no se encuentra en aplicaciones, buscar en borradores
      const { data: draft, error: draftError } = await supabase
        .from('application_drafts')
        .select('*')
        .eq('id', applicationId)
        .eq('agent_id', user.id)
        .maybeSingle();
        
      if (draftError && draftError.code !== 'PGRST116') {
        console.error('❌ Error fetching draft:', sanitizeConsoleOutput(draftError));
        throw draftError;
      }
      
      if (draft) {
        console.log('✅ Draft found in application_drafts table');
        return {
          ...draft,
          isDraft: true,
          type: 'draft'
        };
      }
      
      // Si no se encuentra en ninguna tabla
      console.log('❌ Application/draft not found');
      throw new Error('Solicitud no encontrada');
    },
    enabled: !!user?.id && !!applicationId,
  });
};

// Hook para obtener datos de borrador específico para el formulario
export const useDraftFormData = (draftId: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['draft-form-data', draftId, user?.id],
    queryFn: async () => {
      if (!user?.id || !draftId) throw new Error('Usuario no autenticado o ID inválido');
      
      console.log('🔍 Fetching draft form data for ID:', sanitizeConsoleOutput({ draftId, userId: user.id }));
      
      const { data: draft, error } = await supabase
        .from('application_drafts')
        .select('*')
        .eq('id', draftId)
        .eq('agent_id', user.id)
        .single();
        
      if (error) {
        console.error('❌ Error fetching draft form data:', sanitizeConsoleOutput(error));
        throw error;
      }
      
      console.log('✅ Draft form data fetched successfully');
      return draft;
    },
    enabled: !!user?.id && !!draftId,
  });
};
