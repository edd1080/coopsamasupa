
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export const useApplicationMetrics = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['application-metrics', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('Usuario no autenticado');
      
      // Fetch completed applications
      const { data: applications, error: appsError } = await supabase
        .from('applications')
        .select('status')
        .eq('agent_id', user.id);
        
      if (appsError) throw appsError;
      
      // Fetch drafts
      const { data: drafts, error: draftsError } = await supabase
        .from('application_drafts')
        .select('id')
        .eq('agent_id', user.id);
        
      if (draftsError) throw draftsError;
      
      // Contar aplicaciones por estado
      const applicationMetrics = {
        approved: applications.filter(app => app.status === 'approved').length,
        reviewing: applications.filter(app => app.status === 'reviewing').length,
        rejected: applications.filter(app => app.status === 'rejected').length,
        cancelled: applications.filter(app => app.status === 'cancelled').length,
        completed: applications.filter(app => app.status === 'pending').length,
      };
      
      const metrics = {
        // Activas incluye borradores + aplicaciones pendientes
        active: (drafts?.length || 0) + applicationMetrics.completed,
        approved: applicationMetrics.approved,
        reviewing: applicationMetrics.reviewing,
        rejected: applicationMetrics.rejected,
        cancelled: applicationMetrics.cancelled,
        total: applications.length + (drafts?.length || 0)
      };
      
      console.log('📊 Application metrics calculated:', {
        drafts: drafts?.length || 0,
        completedApplications: applicationMetrics.completed,
        totalActive: metrics.active,
        totalOverall: metrics.total
      });
      
      return metrics;
    },
    enabled: !!user?.id,
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: true,
  });
};
