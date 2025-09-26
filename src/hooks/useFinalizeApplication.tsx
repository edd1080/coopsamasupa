import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { sanitizeObjectData } from '@/utils/inputValidation';
import { toCoopsamaPayload } from '@/utils/fieldMapper';
import { formatDateToGuatemalan } from '@/utils/dateUtils';

// Build application payload with proper column mapping
const buildApplicationPayload = (formData: any, userId: string) => {
  // Extract full name with fallback logic
  const fullName = 
    formData?.fullName ||
    formData?.identification?.fullName ||
    formData?.personalInfo?.fullName ||
    formData?.basicData?.fullName ||
    (formData?.firstName && formData?.lastName ? `${formData.firstName} ${formData.lastName}` : '') ||
    (formData?.identification?.firstName && formData?.identification?.lastName ? `${formData.identification.firstName} ${formData.identification.lastName}` : '') ||
    formData?.firstName ||
    'Sin nombre';

  // Extract amount with fallback logic
  const amount = Number(formData?.loanAmount ?? formData?.requestedAmount ?? formData?.montoSolicitado ?? 0) || 0;

  return {
    // Remove id to let PostgreSQL generate UUID automatically
    agent_id: userId,
    client_name: fullName,
    amount_requested: amount,
    product: formData?.applicationType || 'Préstamo Personal',
    status: 'submitted',
    current_stage: 'Revisión Final',
    progress_step: 5,
    draft_data: formData, // Store complete form data as JSON
    official_data: null as any, // Will be set later
  };
};

export const useFinalizeApplication = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: any) => {
      if (!user?.id) throw new Error('Usuario no autenticado');

      // Extract full name with fallback logic (same as in buildApplicationPayload)
      const fullName = 
        formData?.fullName ||
        formData?.identification?.fullName ||
        formData?.personalInfo?.fullName ||
        formData?.basicData?.fullName ||
        (formData?.firstName && formData?.lastName ? `${formData.firstName} ${formData.lastName}` : '') ||
        (formData?.identification?.firstName && formData?.identification?.lastName ? `${formData.identification.firstName} ${formData.identification.lastName}` : '') ||
        formData?.firstName ||
        'Sin nombre';

      // Extract amount with fallback logic
      const amount = Number(formData?.loanAmount ?? formData?.requestedAmount ?? formData?.montoSolicitado ?? 0) || 0;

      console.log('📤 Finalizing application for user:', user.id);

      // Get user profile for agent data
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      // DEBUG: Email del agente autenticado
      console.log("🔍 DEBUG AGENT EMAIL - user.email:", user.email);
      console.log("🔍 DEBUG AGENT EMAIL - userProfile.email:", userProfile?.email);
      console.log("🔍 DEBUG AGENT EMAIL - userProfile:", userProfile);

      // Convert to Coopsama format first - include agent email
      const agentData = {
        ...userProfile,
        email: user.email || userProfile?.email // Prioritize authenticated user email
      };
      
      console.log("🔍 DEBUG AGENT DATA FINAL:", agentData);
      console.log("🔍 DEBUG AGENT EMAIL FINAL:", agentData.email);
      
      const coopsamaPayload = toCoopsamaPayload(formData, agentData);
      console.log("🔍 COOPSAMA PAYLOAD DEBUG (useFinalizeApplication):", JSON.stringify(coopsamaPayload, null, 2));
      
      // Build the application payload with official data
      const applicationPayload = buildApplicationPayload(formData, user.id);
      
      // Add the official formatted data to the payload (keeping for backward compatibility)
      applicationPayload.official_data = coopsamaPayload;
      console.log("🔍 APPLICATION PAYLOAD DEBUG (before sanitization):", JSON.stringify(applicationPayload, null, 2));
      
      // Sanitize the payload
      const sanitizedPayload = sanitizeObjectData(applicationPayload);
      console.log("🔍 SANITIZED PAYLOAD DEBUG (after sanitization):", JSON.stringify(sanitizedPayload, null, 2));

      // Check if offline - enqueue if no connection
      if (!navigator.onLine) {
        const { offlineQueue } = await import('@/utils/offlineQueue');
        await offlineQueue.enqueue({
          type: 'createApplication',
          payload: sanitizedPayload
        });

        // Add the submitted application to local cache so it appears in the list while offline
        try {
          const localforage = (await import('localforage')).default;
          const offlineStorage = localforage.createInstance({ name: 'coopsama', storeName: 'offlineData' });
          const cacheKey = `applications-cache-${user.id}`;
          const cachedList = (await offlineStorage.getItem(cacheKey)) as any[] | null;

          const newItem = {
            id: `offline-${Date.now()}`,
            applicationId: (sanitizedPayload as any)?.draft_data?.applicationId || (formData?.applicationId) || undefined,
            externalReferenceId: undefined,
            processId: undefined,
            clientName: (sanitizedPayload as any)?.client_name || 'Sin nombre',
            dpi: (sanitizedPayload as any)?.draft_data?.dpi || '',
            product: (sanitizedPayload as any)?.product || 'Crédito Personal',
            amount: ((sanitizedPayload as any)?.amount_requested ?? 0).toString(),
            status: 'submitted',
            date: formatDateToGuatemalan(new Date().toISOString()),
            progress: (sanitizedPayload as any)?.progress_step ?? 5,
            stage: (sanitizedPayload as any)?.current_stage || 'Revisión Final',
            draft_data: (sanitizedPayload as any)?.draft_data || formData || {},
            is_offline: true,
          };

          const merged = Array.isArray(cachedList) ? [newItem, ...cachedList] : [newItem];
          await offlineStorage.setItem(cacheKey, merged);

          // Invalidate queries so the list re-renders from cache immediately
          queryClient.invalidateQueries({ queryKey: ['applications-list'] });
        } catch (e) {
          console.warn('⚠️ Failed to add offline submitted application to cache:', e);
        }

        // Note: Draft deletion will be handled after sync

        return {
          id: `offline-${Date.now()}`, // Temporary ID for offline mode
          offline: true,
          ...sanitizedPayload
        };
      }

      // Online flow: Insert application and delete draft
      const { data: result, error } = await supabase
        .from('applications')
        .insert(sanitizedPayload)
        .select()
        .single();

      if (error) {
        console.error('❌ Error creating application:', error);
        throw new Error(`Error al enviar la solicitud: ${error.message}`);
      }

      // Delete the draft after successful application creation using the generated UUID
      const { error: deleteError } = await supabase
        .from('application_drafts')
        .delete()
        .eq('client_name', fullName)
        .eq('agent_id', user.id);

      if (deleteError) {
        console.warn('⚠️ Warning: Could not delete draft:', deleteError);
        // Don't fail the whole operation if draft deletion fails
      }

      console.log('✅ Application finalized successfully');

      // Upload documents to Supabase Storage if they exist
      let documentUploadResult = null;
      if (formData?.documents) {
        try {
          console.log('📤 Starting document upload to Supabase Storage...');
          
          // Filter documents that have files and are successful
          const documentsToUpload = Object.entries(formData.documents)
            .filter(([key, doc]: [string, any]) => 
              doc && doc.file && doc.status === 'success'
            )
            .map(([key, doc]: [string, any]) => ({ id: key, file: doc.file, status: doc.status, ...doc }));
          
          if (documentsToUpload.length > 0) {
            console.log(`📤 Found ${documentsToUpload.length} documents to upload`);
            
            // Upload each document individually
            const { supabase } = await import('@/integrations/supabase/client');
            const { getBestStorageBucket } = await import('@/utils/storageUtils');
            
            const bucketName = await getBestStorageBucket();
            if (bucketName) {
              // Create folder structure: {applicationId}_{userEmail}
              const userEmail = user?.email || 'unknown@email.com';
              const applicationId = formData?.applicationId || result.id; // Use SCO_XXXXXX format
              const folderName = `${applicationId}_${userEmail.replace('@', '_at_').replace(/[^a-zA-Z0-9_-]/g, '_')}`;
              
              console.log(`📁 Creating folder structure: ${folderName}`);
              console.log(`🆔 Using Application ID: ${applicationId}`);

              // Create metadata file
              const metadataContent = `SOLICITUD DE CRÉDITO - METADATA
=====================================

ID de Solicitud: ${applicationId}
Email del Agente: ${userEmail}
Fecha de Envío: ${formatDateToGuatemalan(new Date())}
Hora de Envío: ${new Date().toLocaleTimeString('es-GT')}
Nombre Completo del Solicitante: ${formData?.firstName || ''} ${formData?.lastName || ''}
Monto Solicitado: Q${amount.toLocaleString('es-GT')}
Estado: ${result.status}

DOCUMENTOS ADJUNTOS:
===================
${documentsToUpload.map(doc => `- ${doc.id}: ${doc.file?.name || 'N/A'}`).join('\n')}

INFORMACIÓN ADICIONAL:
=====================
Teléfono: ${formData?.phone || 'N/A'}
Dirección: ${formData?.address || 'N/A'}
Ocupación: ${formData?.occupation || 'N/A'}

Generado automáticamente el ${new Date().toISOString()}
`;

              const metadataFile = new File([metadataContent], 'solicitud_metadata.txt', { 
                type: 'text/plain' 
              });

              // Upload metadata file first
              const metadataPath = `${folderName}/solicitud_metadata.txt`;
              console.log(`📄 Uploading metadata file: ${metadataPath}`);

              const { data: metadataUploadData, error: metadataError } = await supabase.storage
                .from(bucketName)
                .upload(metadataPath, metadataFile, { upsert: true });

              if (metadataError) {
                console.error(`❌ Failed to upload metadata:`, metadataError);
              } else {
                console.log(`✅ Metadata uploaded:`, metadataUploadData);
              }

              // Upload documents
              const uploadPromises = documentsToUpload.map(async (doc: any) => {
                if (!doc.file) return null;

                const timestamp = Date.now();
                const extension = doc.file.name.split('.').pop() || 'jpg';
                const fileName = `${doc.id}-${timestamp}.${extension}`;
                const filePath = `${folderName}/${fileName}`;

                console.log(`📤 Uploading ${doc.id}:`, { filePath, fileSize: doc.file.size, fileType: doc.file.type });

                const { data, error } = await supabase.storage
                  .from(bucketName)
                  .upload(filePath, doc.file, { upsert: true });

                if (error) {
                  console.error(`❌ Failed to upload ${doc.id}:`, error);
                  return null;
                }

                // Get public URL
                const { data: { publicUrl } } = supabase.storage
                  .from(bucketName)
                  .getPublicUrl(filePath);

                console.log(`✅ Uploaded ${doc.id}:`, data);

                return {
                  documentId: doc.id,
                  filePath,
                  publicUrl,
                  fileName
                };
              });

              const uploadResults = await Promise.all(uploadPromises);
              const successfulUploads = uploadResults.filter(result => result !== null);
              
              documentUploadResult = {
                success: true,
                uploadedCount: successfulUploads.length,
                results: successfulUploads
              };
              
              console.log(`✅ Successfully uploaded ${successfulUploads.length}/${documentsToUpload.length} documents`);
            } else {
              console.warn('⚠️ No storage bucket available for document upload');
              documentUploadResult = {
                success: false,
                uploadedCount: 0,
                error: 'No storage bucket available'
              };
            }
          } else {
            console.log('📭 No documents to upload');
            documentUploadResult = {
              success: true,
              uploadedCount: 0
            };
          }
        } catch (docError: any) {
          console.error('❌ Document upload failed:', docError);
          documentUploadResult = {
            success: false,
            uploadedCount: 0,
            error: docError.message
          };
        }
      }

      // Mark sync as pending and trigger Coopsama integration in background (non-blocking)
      await supabase
        .from('applications')
        .update({ coopsama_sync_status: 'pending' })
        .eq('id', result.id);

      (async () => {
        // Helper: run with timeout to avoid hanging forever
        const withTimeout = async <T,>(promise: Promise<T>, ms: number): Promise<T> => {
          return new Promise<T>((resolve, reject) => {
            const timer = setTimeout(() => reject(new Error('Timeout en integración Coopsama')), ms);
            promise
              .then((value) => { clearTimeout(timer); resolve(value); })
              .catch((err) => { clearTimeout(timer); reject(err); });
          });
        };

        try {
          console.log('🔄 Sending to Coopsama microservice (background)...');
          const coopsamaResult = await withTimeout(
            supabase.functions.invoke('coopsama-integration', {
              body: {
                applicationId: formData.applicationId,
                payload: coopsamaPayload,
                userEmail: user.email
              }
            }),
            30000
          );

          console.log('🔍 RAW Coopsama function response:', coopsamaResult);

          if (coopsamaResult.error) {
            let actualErrorMessage = coopsamaResult.error.message || 'Error al conectar con el microservicio';
            try {
              const errorData = JSON.parse(coopsamaResult.error.message);
              if (errorData.message) {
                actualErrorMessage = errorData.message;
                if (errorData.errors && typeof errorData.errors === 'object') {
                  const validationErrors = (Object.values(errorData.errors) as any[]).flat();
                  if (validationErrors.length > 0) {
                    actualErrorMessage += ': ' + validationErrors.join(', ');
                  }
                }
              }
            } catch {
              if (actualErrorMessage.includes('edge function returned a non 2xx status code')) {
                actualErrorMessage = 'Error en el servidor: la solicitud no pudo ser procesada correctamente';
              } else if (actualErrorMessage.includes('COOPSAMA_ERROR:')) {
                actualErrorMessage = actualErrorMessage.replace('COOPSAMA_ERROR:', '');
              }
            }

            await supabase
              .from('applications')
              .update({
                coopsama_sync_status: 'error',
                coopsama_sync_error: actualErrorMessage
              })
              .eq('id', result.id);
            return;
          }

          const data = coopsamaResult.data;
          if (data && typeof data === 'object') {
            if (data.code === 1 || data.success === false) {
              let errorMessage = data.message || 'Error en el envío de la solicitud';
              if (data.errors && typeof data.errors === 'object') {
                const validationErrors = (Object.values(data.errors) as any[]).flat();
                if (validationErrors.length > 0) {
                  errorMessage += ': ' + validationErrors.join(', ');
                }
              }
              await supabase
                .from('applications')
                .update({
                  coopsama_sync_status: 'error',
                  coopsama_sync_error: errorMessage
                })
                .eq('id', result.id);
              return;
            }

            if (data.code === 0 && data.success === true) {
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
                .eq('id', result.id);
              return;
            }
          }

          await supabase
            .from('applications')
            .update({ coopsama_sync_status: 'error', coopsama_sync_error: 'Respuesta inválida del microservicio' })
            .eq('id', result.id);
        } catch (coopsamaError: any) {
          console.warn('⚠️ Coopsama integration failed (background):', coopsamaError);
          await supabase
            .from('applications')
            .update({
              coopsama_sync_status: 'error',
              coopsama_sync_error: coopsamaError.message || 'Error de conexión'
            })
            .eq('id', result.id);
        } finally {
          // Refresh queries after background sync attempt
          queryClient.invalidateQueries({ queryKey: ['applications'] });
          queryClient.invalidateQueries({ queryKey: ['applications-list'] });
        }
      })();

      return {
        ...result,
        externalReferenceId: null,
        operationId: null,
        documentUploadResult
      };
    },
    onSuccess: () => {
      // Invalidate all relevant queries
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['applications-list'] });
      queryClient.invalidateQueries({ queryKey: ['application-metrics'] });
      queryClient.invalidateQueries({ queryKey: ['application-drafts'] });
      
      toast({
        title: "¡Solicitud enviada!",
        description: "Tu solicitud de crédito ha sido enviada exitosamente.",
        variant: "success",
        duration: 5000
      });
    },
    onError: (error: any) => {
      console.error('❌ Error finalizing application:', error);
      
      // Check if this is a Coopsama microservice error
      if (error.message?.includes('COOPSAMA_ERROR:')) {
        // Don't show toast for microservice errors - let the error screen handle it
        return;
      }
      
      const message = error.message?.includes('offline') 
        ? "Solicitud guardada sin conexión. Se enviará automáticamente al reconectar."
        : `Error al enviar la solicitud: ${error.message || 'Error desconocido'}`;
      
      toast({
        title: navigator.onLine ? "Error al enviar" : "Guardado sin conexión",
        description: message,
        variant: navigator.onLine ? "destructive" : "default",
        duration: 5000
      });
    },
  });
};