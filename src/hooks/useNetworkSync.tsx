import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import localforage from 'localforage';
import { offlineQueue } from '@/utils/offlineQueue';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { sanitizeObjectData } from '@/utils/inputValidation';

export const useNetworkSync = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Safely get auth context - may not be available during app initialization
  let user = null;
  try {
    const auth = useAuth();
    user = auth.user;
  } catch (error) {
    // Auth context not available yet - this is fine during app startup
    console.log('Auth context not available yet');
  }

  const processOfflineQueue = async () => {
    if (!navigator.onLine || !user?.id || isSyncing) return;

    const queue = await offlineQueue.getQueue();
    if (queue.length === 0) return;

    setIsSyncing(true);
    console.log('🔄 Processing offline queue:', queue.length, 'tasks');
    try {
      console.log('🧾 Offline queue content:', queue.map((t: any) => ({ id: t.id, type: t.type })));
    } catch {}

    let successCount = 0;
    let failureCount = 0;

    for (const task of queue) {
      try {
        let success = false;

        switch (task.type) {
          case 'createApplication':
            // Payload is already properly formatted from useFinalizeApplication
            const sanitized = sanitizeObjectData(task.payload);
            console.log('📝 [createApplication] Payload summary:', {
              hasOfficialData: !!sanitized?.official_data,
              client_name: sanitized?.client_name,
              agent_id: sanitized?.agent_id,
              applicationId: sanitized?.draft_data?.applicationId,
              amount_requested: sanitized?.amount_requested
            });
            const { data: appInsertData, error: appError } = await supabase
              .from('applications')
              .insert(sanitized)
              .select()
              .single();
            if (!appError && appInsertData) {
              success = true;
              console.log('✅ [createApplication] Inserted into applications:', { id: appInsertData.id });

              try {
                await supabase
                  .from('applications')
                  .update({ coopsama_sync_status: 'pending' })
                  .eq('id', appInsertData.id);

                const applicationId = sanitized?.draft_data?.applicationId || appInsertData.id;
                const coopsamaPayload = sanitized?.official_data || null;
                console.log('🚀 [createApplication] Invoking Coopsama integration (background)...', {
                  applicationId,
                  hasPayload: !!coopsamaPayload
                });

                const withTimeout = async (promise: Promise<any>, ms: number) => new Promise((resolve, reject) => {
                  const timer = setTimeout(() => reject(new Error('Timeout en integración Coopsama (sync)')), ms);
                  promise.then(v => { clearTimeout(timer); resolve(v); })
                         .catch(e => { clearTimeout(timer); reject(e); });
                });

                (async () => {
                  try {
                    const result = await withTimeout(
                      supabase.functions.invoke('coopsama-integration', {
                        body: { applicationId, payload: coopsamaPayload, userEmail: user.email }
                      }),
                      30000
                    );
                    console.log('🔍 [createApplication] Coopsama raw response:', result);

                    if (result?.error) {
                      const msg = result.error.message || 'Error al conectar con el microservicio';
                      console.warn('⚠️ [createApplication] Coopsama error:', msg);
                      await supabase
                        .from('applications')
                        .update({ coopsama_sync_status: 'error', coopsama_sync_error: msg })
                        .eq('id', appInsertData.id);
                    } else if (result?.data && typeof result.data === 'object') {
                      const data = result.data;
                      if (data.code === 1 || data.success === false) {
                        let message = data.message || 'Error en el envío de la solicitud';
                        if (data.errors && typeof data.errors === 'object') {
                          const validationErrors = (Object.values(data.errors) as any[]).flat();
                          if (validationErrors.length > 0) message += ': ' + validationErrors.join(', ');
                        }
                        console.warn('⚠️ [createApplication] Coopsama microservice returned error:', message);
                        await supabase
                          .from('applications')
                          .update({ coopsama_sync_status: 'error', coopsama_sync_error: message })
                          .eq('id', appInsertData.id);
                      } else if (data.code === 0 && data.success === true) {
                        const responseData = data.data || {};
                        const externalReferenceId = responseData.externalReferenceId || responseData.external_reference_id || responseData.referenceId || responseData.reference_id || responseData.id || responseData.solicitudId || responseData.applicationId;
                        const operationId = responseData.operationId || responseData.operation_id || responseData.processId || responseData.process_id;
                        await supabase
                          .from('applications')
                          .update({
                            coopsama_external_reference_id: externalReferenceId,
                            coopsama_operation_id: operationId,
                            coopsama_sync_status: 'success',
                            coopsama_synced_at: new Date().toISOString()
                          })
                          .eq('id', appInsertData.id);
                        console.log('✅ [createApplication] Coopsama success:', { externalReferenceId, operationId });
                      }
                    }

                    await queryClient.invalidateQueries({ queryKey: ['applications'] });
                    await queryClient.invalidateQueries({ queryKey: ['applications-list'] });
                  } catch (e: any) {
                    console.error('❌ [createApplication] Coopsama background sync failed:', e);
                    await supabase
                      .from('applications')
                      .update({ coopsama_sync_status: 'error', coopsama_sync_error: e.message || 'Error de conexión' })
                      .eq('id', appInsertData.id);
                  }
                })();
              } catch (e) {
                console.warn('⚠️ Coopsama background sync (post-offline) setup failed:', e);
              }
            } else {
              console.error('❌ [createApplication] Insert failed:', appError);
              success = false;
            }
            break;

          case 'deleteDraft':
            const { error: deleteDraftError } = await supabase
              .from('application_drafts')
              .delete()
              .eq('id', task.payload.id);
            success = !deleteDraftError;
            break;

          case 'createPrequalification':
            const { data: prequalData, error: prequalError } = await supabase
              .from('prequalifications')
              .insert({
                ...sanitizeObjectData(task.payload),
                agent_id: user.id
              });
            success = !prequalError;
            break;

          case 'updateDraft':
            console.log('🔄 Processing updateDraft task:', {
              id: task.payload?.id,
              applicationId: task.payload?.draft_data?.applicationId,
              client_name: task.payload?.client_name
            });
            
            // Check for existing draft to avoid duplication during sync
            const { data: existingDrafts } = await supabase
              .from('application_drafts')
              .select('id, draft_data')
              .eq('agent_id', user.id);
            
            const applicationId = task.payload.draft_data?.applicationId || task.payload.id;
            const existingDraft = existingDrafts?.find(draft => 
              draft.draft_data && 
              typeof draft.draft_data === 'object' && 
              (draft.draft_data as any).applicationId === applicationId
            );
            
            // Ensure we have a valid UUID for application_drafts table
            const draftId = existingDraft ? existingDraft.id : crypto.randomUUID();
            
            const draftPayload = {
              id: draftId,
              agent_id: user.id,
              client_name: task.payload.client_name || 'Sin nombre',
              draft_data: task.payload.draft_data || {},
              last_step: task.payload.last_step || 0,
              last_sub_step: task.payload.last_sub_step || 0,
              created_at: task.payload.created_at || new Date().toISOString(),
              updated_at: new Date().toISOString()
            };
            
            console.log('🔄 Draft payload for sync:', draftPayload);
            
            const { data: draftData, error: draftError } = await supabase
              .from('application_drafts')
              .upsert(draftPayload);
              
            if (draftError) {
              console.error('❌ Draft sync error:', draftError);
            } else {
              console.log('✅ Draft synced successfully:', draftData);
            }
            
            success = !draftError;
            break;

          case 'uploadDocument':
            // Handle document upload from offline queue
            const { payload: uploadPayload } = task;
            if (uploadPayload.blobKey) {
              // Retrieve ArrayBuffer from localforage and convert to Blob for upload
              const arrayBuffer = await localforage.getItem(uploadPayload.blobKey);
              if (arrayBuffer && arrayBuffer instanceof ArrayBuffer) {
                // Convert ArrayBuffer to Blob for Supabase Storage
                const blob = new Blob([arrayBuffer], { type: 'application/octet-stream' });
                const { data: uploadData, error: uploadError } = await supabase.storage
                  .from('documents')
                  .upload(uploadPayload.path, blob, { upsert: true });
                success = !uploadError;
                
                if (success) {
                  // Clean up ArrayBuffer from localforage
                  await localforage.removeItem(uploadPayload.blobKey);
                }
              }
            }
            break;
        }

        if (success) {
          await offlineQueue.removeTask(task.id);
          successCount++;
        } else {
          const shouldRetry = await offlineQueue.incrementRetries(task.id);
          if (!shouldRetry) {
            failureCount++;
          }
        }
      } catch (error) {
        console.error('❌ Error processing offline task:', error);
        const shouldRetry = await offlineQueue.incrementRetries(task.id);
        if (!shouldRetry) {
          failureCount++;
        }
      }
    }

    // Invalidate queries to refresh data
    await queryClient.invalidateQueries({ queryKey: ['applications'] });
    await queryClient.invalidateQueries({ queryKey: ['prequalifications'] });

    setIsSyncing(false);

    if (successCount > 0) {
      toast({
        title: "Sincronización exitosa",
        description: `${successCount} ${successCount === 1 ? 'cambio sincronizado' : 'cambios sincronizados'} correctamente`,
        variant: "success",
        duration: 4000
      });
    }

    if (failureCount > 0) {
      toast({
        title: "Error de sincronización",
        description: `${failureCount} ${failureCount === 1 ? 'elemento' : 'elementos'} no se ${failureCount === 1 ? 'pudo sincronizar' : 'pudieron sincronizar'}. Se reintentará automáticamente.`,
        variant: "destructive",
        duration: 6000
      });
    }

    console.log('✅ Sync completed:', { successCount, failureCount });
  };

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      console.log('🌐 Network connected');
      
      // Small delay to ensure connection is stable
      setTimeout(() => {
        processOfflineQueue();
      }, 1000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      console.log('📵 Network disconnected');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Process queue on mount if online
    if (navigator.onLine) {
      processOfflineQueue();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [user?.id]);

  return {
    isOnline,
    isSyncing,
    processOfflineQueue
  };
};