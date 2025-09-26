
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
      if (!user?.id) throw new Error('Usuario no autenticado');
      if (!applicationId) return null; // Para nuevas aplicaciones, retornar null
      
      console.log('🔍 Fetching application data for ID:', sanitizeConsoleOutput({ applicationId, userId: user.id }));

      const isOffline = !navigator.onLine;
      // Helper to try offline storage lookups
      const tryOfflineLookup = async () => {
        try {
          const localforage = (await import('localforage')).default;
          const offlineStorage = localforage.createInstance({ name: 'coopsama', storeName: 'offlineData' });

          // 1) Look through offline drafts saved in localforage
          const keys = await offlineStorage.keys();
          for (const key of keys) {
            if (key.startsWith('draft-') || key.startsWith('draft_') || key.startsWith('offline-')) {
              const item: any = await offlineStorage.getItem(key);
              if (!item) continue;
              const matchesById = item.id === applicationId;
              const matchesByAppId = item.draft_data?.applicationId === applicationId;
              if (matchesById || matchesByAppId) {
                console.log('✅ Found offline draft by localforage:', { key, itemId: item.id, applicationId: item.draft_data?.applicationId });
                return {
                  ...item,
                  isDraft: true,
                  type: 'draft'
                };
              }
            }
          }

          // 2) Fallback to cached applications list (transformed items)
          const cacheKey = `applications-cache-${user.id}`;
          const cachedList = (await offlineStorage.getItem(cacheKey)) as any[] | null;
          if (Array.isArray(cachedList)) {
            const found = cachedList.find((it: any) => (it.id === applicationId) || (it.applicationId === applicationId));
            if (found) {
              console.log('✅ Found item in cached applications list');
              return {
                ...found,
                isDraft: found.status === 'draft' || found.status === 'offline',
                type: (found.status === 'draft' || found.status === 'offline') ? 'draft' : 'application'
              };
            }
          }
        } catch (e) {
          console.warn('⚠️ Offline lookup failed:', e);
        }
        return null;
      };
      
      // If offline, try local cache first
      if (isOffline) {
        const offlineResult = await tryOfflineLookup();
        if (offlineResult) return offlineResult;
        // Continue to DB fallback (might fail offline, but we tried cache)
      }

      // Primero intentar obtener desde aplicaciones completas
      const { data: application, error: appError } = await supabase
        .from('applications')
        .select('*, coopsama_external_reference_id, coopsama_operation_id')
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
      
      // Si no se encuentra en ninguna tabla, intentar nuevamente desde cache (por si está online pero no existe en DB)
      const cachedFallback = await tryOfflineLookup();
      if (cachedFallback) return cachedFallback;

      console.log('❌ Application/draft not found in DB or cache');
      throw new Error('Solicitud no encontrada');
    },
    enabled: !!user?.id && !!applicationId,
    networkMode: 'always'
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
