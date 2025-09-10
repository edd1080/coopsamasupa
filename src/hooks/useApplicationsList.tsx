
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { sanitizeConsoleOutput } from '@/utils/securityUtils';
import { getFirstNameAndLastName } from '@/lib/nameUtils';

interface Application {
  id: string;
  applicationId?: string;
  clientName: string;
  product: string;
  amount: string;
  status: string;
  date: string;
  progress: number;
  stage: string;
}

export const useApplicationsList = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['applications-list', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('Usuario no autenticado');
      
      console.log('🔍 Fetching applications list for user:', sanitizeConsoleOutput({ userId: user.id }));
      
      // Fetch from applications table
      const { data: applications, error: appError } = await supabase
        .from('applications')
        .select('*')
        .eq('agent_id', user.id)
        .order('created_at', { ascending: false });
        
      if (appError) {
        console.error('❌ Error fetching applications:', sanitizeConsoleOutput(appError));
        throw appError;
      }
      
      console.log('📋 Raw applications fetched:', applications?.length || 0);
      
      // Also fetch drafts - ordenar por updated_at para mostrar los más recientes primero
      const { data: drafts, error: draftError } = await supabase
        .from('application_drafts')
        .select('*')
        .eq('agent_id', user.id)
        .order('updated_at', { ascending: false });
        
      if (draftError) {
        console.error('❌ Error fetching drafts:', sanitizeConsoleOutput(draftError));
        throw draftError;
      }
      
      console.log('📝 Raw drafts fetched:', drafts?.length || 0);
      console.log('📝 Draft details:', sanitizeConsoleOutput(drafts?.map(d => ({
        id: d.id,
        client_name: d.client_name,
        agent_id: d.agent_id,
        updated_at: d.updated_at
      })) || []));
      
      // Debug: Check if user ID matches agent IDs
      const draftsWithMismatch = drafts?.filter(draft => draft.agent_id !== user.id) || [];
      if (draftsWithMismatch.length > 0) {
        console.warn('⚠️ Found drafts with mismatched agent_id:', sanitizeConsoleOutput(draftsWithMismatch.map(d => ({
          id: d.id,
          expected_agent_id: user.id,
          actual_agent_id: d.agent_id
        }))));
      }
      
      // Transform data to match Application interface
      const transformedApplications: Application[] = [
        ...(applications || []).map(app => {
          // Extract applicationId from draft_data if available
          const applicationId = app.draft_data && typeof app.draft_data === 'object' && 
            (app.draft_data as any).applicationId ? 
            (app.draft_data as any).applicationId : 
            app.id;
            
          return {
            id: app.id,
            applicationId: applicationId,
            clientName: getFirstNameAndLastName(app.client_name),
            product: app.product || 'Crédito Personal',
            amount: app.amount_requested?.toString() || '0',
            status: app.status,
            date: new Date(app.created_at).toLocaleDateString(),
            progress: app.progress_step || 0,
            stage: app.current_stage || 'En proceso'
          };
        }),
        ...(drafts || []).map(draft => {
          // Extract applicationId from draft_data
          const applicationId = draft.draft_data && typeof draft.draft_data === 'object' && 
            (draft.draft_data as any).applicationId ? 
            (draft.draft_data as any).applicationId : 
            draft.id;

          // Map step number to stage name for drafts
          const getStageFromStep = (step: number): string => {
            switch(step) {
              case 1: return 'Identificación y Contacto';
              case 2: return 'Información Laboral';
              case 3: return 'Información Financiera';
              case 4: return 'Referencias Personales';
              case 5: return 'Documentos e Imágenes';
              case 6: return 'Revisión Final';
              default: return 'Identificación y Contacto';
            }
          };
            
          return {
            id: draft.id,
            applicationId: applicationId,
            clientName: getFirstNameAndLastName(draft.client_name || 'Sin nombre'),
            product: '', // Empty for drafts to hide in UI
            amount: '', // Empty for drafts to hide in UI
            status: 'draft',
            date: new Date(draft.updated_at).toLocaleDateString(),
            progress: draft.last_step || 0,
            stage: getStageFromStep(draft.last_step || 1)
          };
        })
      ];
      
      console.log('✅ Final transformed applications list:', transformedApplications.length);
      console.log('📊 Applications by type:', {
        fullApplications: (applications || []).length,
        drafts: (drafts || []).length,
        total: transformedApplications.length
      });
      
      return transformedApplications;
    },
    enabled: !!user?.id,
  });
};
