
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { sanitizeConsoleOutput } from '@/utils/securityUtils';

interface Application {
  id: string;
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
        ...(applications || []).map(app => ({
          id: app.id,
          clientName: app.client_name,
          product: app.product,
          amount: app.amount_requested?.toString() || '0',
          status: app.status,
          date: new Date(app.created_at).toLocaleDateString(),
          progress: app.progress_step || 0,
          stage: app.current_stage || 'En proceso'
        })),
        ...(drafts || []).map(draft => ({
          id: draft.id,
          clientName: draft.client_name || 'Sin nombre',
          product: 'Borrador',
          amount: '0',
          status: 'draft',
          date: new Date(draft.updated_at).toLocaleDateString(),
          progress: draft.last_step || 0,
          stage: 'Borrador'
        }))
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
