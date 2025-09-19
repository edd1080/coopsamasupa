-- Agregar campos para tracking de Coopsama a la tabla applications
ALTER TABLE public.applications 
ADD COLUMN coopsama_operation_id TEXT,
ADD COLUMN coopsama_external_reference_id TEXT,
ADD COLUMN coopsama_sync_status TEXT,
ADD COLUMN coopsama_sync_error TEXT,
ADD COLUMN coopsama_synced_at TIMESTAMP WITH TIME ZONE;