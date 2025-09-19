-- Agregar columna coopsama_process_id a la tabla applications para rastreo de solicitudes fallidas
ALTER TABLE public.applications ADD COLUMN coopsama_process_id text;