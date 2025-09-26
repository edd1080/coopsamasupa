
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { sanitizeConsoleOutput } from '@/utils/securityUtils';
import { getFirstNameAndLastName } from '@/lib/nameUtils';
import { formatDateToGuatemalan } from '@/utils/dateUtils';
import { formatApplicationId } from '@/utils/applicationIdGenerator';
import { useEffect, useCallback } from 'react';

interface Application {
  id: string;
  applicationId?: string;
  externalReferenceId?: string;
  processId?: string;
  clientName: string;
  dpi: string;
  product: string;
  amount: string;
  status: string;
  date: string;
  progress: number;
  stage: string;
  draft_data?: any; // Agregar draft_data para cálculo de progreso
  is_offline?: boolean; // Flag para identificar aplicaciones offline
}

export const useApplicationsList = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // Listen for network status changes and invalidate query
  useEffect(() => {
    const handleOnline = () => {
      console.log('🌐 Network online - Invalidating applications list');
      queryClient.invalidateQueries({ queryKey: ['applications-list'] });
    };

    const handleOffline = () => {
      console.log('📵 Network offline - Invalidating applications list');
      queryClient.invalidateQueries({ queryKey: ['applications-list'] });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [queryClient]);
  
  const queryResult = useQuery({
    queryKey: ['applications-list', user?.id, navigator.onLine],
    queryFn: async () => {
      if (!user?.id) throw new Error('Usuario no autenticado');
      
      console.log('🔍 Fetching applications list for user:', sanitizeConsoleOutput({ userId: user.id }));
      
      let applications: any[] = [];
      let drafts: any[] = [];
      
      // Check if we're offline - prioritize navigator.onLine
      const isOffline = !navigator.onLine;
      const connectionType = navigator.connection?.effectiveType || 'unknown';
      const isActuallyOffline = isOffline; // Simplified: if navigator.onLine is false, we're offline
      
      console.log('🌐 Network status:', { 
        isOffline, 
        navigatorOnLine: navigator.onLine, 
        connectionType,
        isActuallyOffline,
        connection: navigator.connection
      });
      
      // Always load offline data first, regardless of connection status
      let offlineDrafts: any[] = [];
      try {
        console.log('📱 Loading offline data regardless of connection status...');
        
        const localforage = (await import('localforage')).default;
        const offlineStorage = localforage.createInstance({
          name: 'coopsama',
          storeName: 'offlineData'
        });
        
        const offlineKeys = await offlineStorage.keys();
        console.log('📱 Offline keys found:', offlineKeys.length, offlineKeys);
        
        // Get all offline data
        const offlineData: any[] = [];
        for (const key of offlineKeys) {
          if (key.startsWith('draft-') || key.startsWith('offline-')) {
            const data = await offlineStorage.getItem(key);
            console.log(`📱 Processing key ${key}:`, { 
              hasData: !!data, 
              hasOfflineSaved: data?._offline_saved,
              clientName: data?.client_name,
              agentId: data?.agent_id
            });
            if (data && data._offline_saved) {
              offlineData.push({
                ...data,
                _offline_key: key,
                _is_offline: true
              });
            }
          }
        }
        
        console.log('📱 Offline data loaded:', offlineData.length);
        console.log('📱 Offline data details:', offlineData.map(item => ({
          key: item._offline_key,
          client_name: item.client_name,
          agent_id: item.agent_id,
          has_draft_data: !!item.draft_data,
          applicationId: item.draft_data?.applicationId,
          timestamp: item._offline_timestamp
        })));
        
        // Convert offline data to draft format for consistency
        offlineDrafts = offlineData.map(offlineItem => ({
          id: offlineItem.id || offlineItem._offline_key,
          agent_id: offlineItem.agent_id || 'offline-user',
          client_name: offlineItem.client_name || `${offlineItem.draft_data?.firstName || ''} ${offlineItem.draft_data?.firstLastName || ''}`.trim() || 'Sin nombre',
          draft_data: offlineItem.draft_data,
          last_step: offlineItem.draft_data?.currentStep || 1,
          last_sub_step: offlineItem.draft_data?.currentSubStep || 0,
          created_at: offlineItem.created_at || new Date().toISOString(),
          updated_at: offlineItem.updated_at || new Date().toISOString(),
          _is_offline: true
        }));
        
        console.log('📝 Offline drafts processed:', offlineDrafts.length);
        console.log('📝 Offline drafts details:', offlineDrafts.map(draft => ({
          id: draft.id,
          client_name: draft.client_name,
          agent_id: draft.agent_id,
          _is_offline: draft._is_offline
        })));
        
      } catch (error) {
        console.error('❌ Error loading offline data:', error);
      }
      
      if (isActuallyOffline) {
        console.log('📵 OFFLINE MODE - Using offline data only');
        drafts = offlineDrafts;
      } else {
        console.log('🌐 ONLINE MODE - Loading applications from database');
        
        // Fetch from applications table including Coopsama fields - MÁS RECIENTES PRIMERO
        const { data: applicationsData, error: appError } = await supabase
          .from('applications')
          .select('id, agent_id, client_name, product, amount_requested, status, current_stage, progress_step, created_at, updated_at, coopsama_external_reference_id, coopsama_operation_id, coopsama_process_id, coopsama_sync_status, coopsama_sync_error, draft_data')
          .eq('agent_id', user.id)
          .order('created_at', { ascending: false }); // Más recientes primero
          
        if (appError) {
          console.error('❌ Error fetching applications:', sanitizeConsoleOutput(appError));
          throw appError;
        }
        
        applications = applicationsData || [];
        console.log('📋 Raw applications fetched:', applications.length);
        
        // Also fetch drafts - ordenar por updated_at para mostrar los más recientes primero
        const { data: draftsData, error: draftError } = await supabase
          .from('application_drafts')
          .select('id, agent_id, client_name, draft_data, last_step, last_sub_step, created_at, updated_at')
          .eq('agent_id', user.id)
          .order('updated_at', { ascending: false });
          
        if (draftError) {
          console.error('❌ Error fetching drafts:', sanitizeConsoleOutput(draftError));
          throw draftError;
        }
        
        drafts = draftsData || [];
        console.log('📝 Raw drafts fetched:', drafts.length);
        
        // Combine online drafts with offline drafts
        console.log('🔄 Combining online and offline drafts...');
        console.log('📊 Online drafts:', drafts.length, drafts.map(d => ({ id: d.id, client_name: d.client_name })));
        console.log('📊 Offline drafts:', offlineDrafts.length, offlineDrafts.map(d => ({ id: d.id, client_name: d.client_name, _is_offline: d._is_offline })));
        
        const combinedDrafts = [...drafts, ...offlineDrafts];
        
        // Remove duplicates based on applicationId
        const uniqueDrafts = combinedDrafts.filter((draft, index, self) => {
          const applicationId = draft.draft_data?.applicationId;
          return !applicationId || self.findIndex(d => d.draft_data?.applicationId === applicationId) === index;
        });
        
        drafts = uniqueDrafts;
        console.log('📝 Combined drafts (online + offline):', drafts.length);
        console.log('📝 Final drafts details:', drafts.map(d => ({ 
          id: d.id, 
          client_name: d.client_name, 
          _is_offline: d._is_offline,
          applicationId: d.draft_data?.applicationId 
        })));
      }
      
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
          // Extract applicationId from draft_data if available, otherwise format the UUID
          const applicationId = app.draft_data && typeof app.draft_data === 'object' && 
            (app.draft_data as any).applicationId ? 
            (app.draft_data as any).applicationId : 
            formatApplicationId(app.id);

          // Construct full name from draft_data if available, otherwise use client_name
          let fullName = app.client_name;
          let dpi = '';
          if (app.draft_data && typeof app.draft_data === 'object') {
            const draftData = app.draft_data as any;
            if (draftData.firstName && draftData.lastName) {
              fullName = `${draftData.firstName} ${draftData.lastName}`;
            } else if (draftData.firstLastName) {
              fullName = `${draftData.firstName || ''} ${draftData.firstLastName}`.trim();
            } else if (draftData.fullName) {
              fullName = draftData.fullName;
            }
            // Extract DPI for search functionality
            dpi = draftData.dpi || draftData.cedula || '';
          }
            
          return {
            id: app.id,
            applicationId: applicationId,
            externalReferenceId: app.coopsama_external_reference_id,
            processId: app.coopsama_process_id,
            clientName: getFirstNameAndLastName(fullName),
            dpi: dpi,
            product: app.product || 'Crédito Personal',
            amount: app.amount_requested?.toString() || '0',
            status: app.status,
            date: formatDateToGuatemalan(app.created_at || app.updated_at || new Date().toISOString()),
            progress: app.progress_step || 0,
            stage: app.current_stage || 'En proceso',
            draft_data: app.draft_data, // Incluir draft_data para cálculo de progreso
            timestamp: new Date(app.created_at || app.updated_at || new Date().toISOString()).getTime() // Para ordenamiento
          };
        }),
        ...(drafts || []).map(draft => {
          // Extract applicationId from draft_data, otherwise format the UUID
          const applicationId = draft.draft_data && typeof draft.draft_data === 'object' && 
            (draft.draft_data as any).applicationId ? 
            (draft.draft_data as any).applicationId : 
            formatApplicationId(draft.id);

          // Construct full name from draft_data if available, otherwise use client_name
          let fullName = draft.client_name || 'Sin nombre';
          let dpi = '';
          let requestedAmount = '';
          if (draft.draft_data && typeof draft.draft_data === 'object') {
            const draftData = draft.draft_data as any;
            if (draftData.firstName && draftData.lastName) {
              fullName = `${draftData.firstName} ${draftData.lastName}`;
            } else if (draftData.firstLastName) {
              fullName = `${draftData.firstName || ''} ${draftData.firstLastName}`.trim();
            } else if (draftData.fullName) {
              fullName = draftData.fullName;
            }
            // Extract DPI for search functionality
            dpi = draftData.dpi || draftData.cedula || '';
            // Extract requested amount
            requestedAmount = draftData.requestedAmount?.toString() || draftData.montoSolicitado?.toString() || '0';
          }

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
            externalReferenceId: undefined, // Drafts don't have external reference
            processId: undefined, // Drafts don't have process ID
            clientName: getFirstNameAndLastName(fullName),
            dpi: dpi,
            product: 'Crédito', // Show "Crédito" for drafts
            amount: requestedAmount,
            status: draft._is_offline ? 'offline' : 'draft', // Mark offline drafts
            date: formatDateToGuatemalan(draft.updated_at || draft.created_at || new Date().toISOString()),
            progress: draft.last_step || 0,
            stage: getStageFromStep(draft.last_step || 1),
            draft_data: draft.draft_data, // Incluir draft_data para cálculo de progreso
            is_offline: draft._is_offline || false, // Add offline flag
            timestamp: new Date(draft.updated_at || draft.created_at || new Date().toISOString()).getTime() // Para ordenamiento
          };
        })
      ];

      // Sort by timestamp (most recent first)
      const sortedApplications = transformedApplications
        .sort((a, b) => b.timestamp - a.timestamp)
        .map(({ timestamp, ...item }) => item); // Remove timestamp from final objects

      console.log('✅ Transformed and sorted applications:', sanitizeConsoleOutput(sortedApplications.map(app => ({
        id: app.id,
        applicationId: app.applicationId,
        clientName: app.clientName,
        status: app.status,
        progress: app.progress,
        stage: app.stage,
        isDraft: app.isDraft,
        date: app.date,
        hasDraftData: !!app.draft_data // Indicate if draft_data is present
      }))));

      return sortedApplications;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
    refetchInterval: 1000 * 60 * 1 // 1 minute
  });

  return {
    ...queryResult,
    refetch: queryResult.refetch,
    isRefetching: queryResult.isFetching
  };
};
