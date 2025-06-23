
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
      
      // Also fetch drafts
      const { data: drafts, error: draftError } = await supabase
        .from('application_drafts')
        .select('*')
        .eq('agent_id', user.id)
        .order('created_at', { ascending: false });
        
      if (draftError) {
        console.error('❌ Error fetching drafts:', sanitizeConsoleOutput(draftError));
        throw draftError;
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
          date: new Date(draft.created_at).toLocaleDateString(),
          progress: draft.last_step || 0,
          stage: 'Borrador'
        }))
      ];
      
      console.log('✅ Applications list fetched successfully:', transformedApplications.length);
      return transformedApplications;
    },
    enabled: !!user?.id,
  });
};
