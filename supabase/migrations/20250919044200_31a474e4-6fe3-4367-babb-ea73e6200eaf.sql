-- Eliminar campos relacionados con Coopsama de la tabla applications
ALTER TABLE public.applications 
DROP COLUMN IF EXISTS coopsama_sync_status,
DROP COLUMN IF EXISTS coopsama_synced_at,
DROP COLUMN IF EXISTS coopsama_operation_id,
DROP COLUMN IF EXISTS coopsama_external_reference_id,
DROP COLUMN IF EXISTS coopsama_sync_error;