
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { sanitizeConsoleOutput } from '@/utils/securityUtils';
import { getFirstNameAndLastName } from '@/lib/nameUtils';
import { formatDateToGuatemalan } from '@/utils/dateUtils';
import { formatApplicationId } from '@/utils/applicationIdGenerator';

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
}

export const useApplicationsList = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['applications-list', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('Usuario no autenticado');
      
      console.log('🔍 Fetching applications list for user:', sanitizeConsoleOutput({ userId: user.id }));
      
      // Fetch from applications table including Coopsama fields - MÁS RECIENTES PRIMERO
      const { data: applications, error: appError } = await supabase
        .from('applications')
        .select('id, agent_id, client_name, product, amount_requested, status, current_stage, progress_step, created_at, updated_at, coopsama_external_reference_id, coopsama_operation_id, coopsama_process_id, coopsama_sync_status, coopsama_sync_error')
        .eq('agent_id', user.id)
        .order('created_at', { ascending: false }); // Más recientes primero
        
      if (appError) {
        console.error('❌ Error fetching applications:', sanitizeConsoleOutput(appError));
        throw appError;
      }
      
      console.log('📋 Raw applications fetched:', applications?.length || 0);
      
      
      // Also fetch drafts - ordenar por updated_at para mostrar los más recientes primero
      const { data: drafts, error: draftError } = await supabase
        .from('application_drafts')
        .select('id, agent_id, client_name, draft_data, last_step, last_sub_step, created_at, updated_at')
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
            } else if (draftData.firstName && draftData.firstLastName) {
              fullName = `${draftData.firstName} ${draftData.firstLastName}`;
            } else if (draftData.fullName) {
              fullName = draftData.fullName;
            }
            // Extract DPI for search functionality
            dpi = draftData.dpi || draftData.cedula || '';
            // Extract requested amount from draft_data
            requestedAmount = draftData.requestedAmount?.toString() || '';
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
            amount: requestedAmount, // Use requestedAmount from draft_data
            status: 'draft',
            date: formatDateToGuatemalan(draft.updated_at || draft.created_at || new Date().toISOString()),
            progress: draft.last_step || 0,
            stage: getStageFromStep(draft.last_step || 1),
            timestamp: new Date(draft.updated_at || draft.created_at || new Date().toISOString()).getTime() // Para ordenamiento
          };
        })
      ];
      
      // Ordenar por timestamp (más recientes primero) y remover timestamp del resultado
      const sortedApplications = transformedApplications
        .sort((a, b) => b.timestamp - a.timestamp)
        .map(({ timestamp, ...item }) => item);
      
      console.log('✅ Final transformed applications list:', sortedApplications.length);
      console.log('📊 Applications by type:', {
        fullApplications: (applications || []).length,
        drafts: (drafts || []).length,
        total: sortedApplications.length
      });
      
      return sortedApplications;
    },
    enabled: !!user?.id,
  });
};
