
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
        pending: applications.filter(app => app.status === 'pending').length,
        failed: applications.filter(app => app.status === 'error').length,
        // Enviadas: todas las que no son borradores y no están en error
        sent: applications.filter(app => app.status !== 'error' && app.status !== 'pending').length,
      };
      
      const metrics = {
        // Activas incluye borradores + aplicaciones pendientes
        active: (drafts?.length || 0) + applicationMetrics.pending,
        // Enviadas: aplicaciones que se enviaron exitosamente (no error, no pending)
        sent: applicationMetrics.sent,
        reviewing: applicationMetrics.reviewing,
        // Falló envío: aplicaciones con status 'error'
        failed: applicationMetrics.failed,
        cancelled: applicationMetrics.cancelled,
        total: applications.length + (drafts?.length || 0)
      };
      
      console.log('📊 Application metrics calculated:', {
        drafts: drafts?.length || 0,
        pendingApplications: applicationMetrics.pending,
        sentApplications: applicationMetrics.sent,
        failedApplications: applicationMetrics.failed,
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
