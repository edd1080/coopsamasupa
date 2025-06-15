
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export const useApplicationMetrics = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['application-metrics', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('Usuario no autenticado');
      
      const { data, error } = await supabase
        .from('applications')
        .select('status')
        .eq('agent_id', user.id);
        
      if (error) throw error;
      
      // Contar aplicaciones por estado
      const metrics = {
        active: data.filter(app => app.status === 'pending').length,
        approved: data.filter(app => app.status === 'approved').length,
        reviewing: data.filter(app => app.status === 'reviewing').length,
        rejected: data.filter(app => app.status === 'rejected').length,
        cancelled: data.filter(app => app.status === 'cancelled').length,
        total: data.length
      };
      
      return metrics;
    },
    enabled: !!user?.id,
  });
};
