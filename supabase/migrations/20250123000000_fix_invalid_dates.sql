-- Fix invalid dates in applications table
-- This migration corrects any NULL or invalid created_at/updated_at values

-- Update applications with NULL or invalid created_at
UPDATE public.applications 
SET created_at = now() 
WHERE created_at IS NULL OR created_at = '1970-01-01 00:00:00+00'::timestamptz;

-- Update applications with NULL or invalid updated_at
UPDATE public.applications 
SET updated_at = now() 
WHERE updated_at IS NULL OR updated_at = '1970-01-01 00:00:00+00'::timestamptz;

-- Update application_drafts with NULL or invalid created_at
UPDATE public.application_drafts 
SET created_at = now() 
WHERE created_at IS NULL OR created_at = '1970-01-01 00:00:00+00'::timestamptz;

-- Update application_drafts with NULL or invalid updated_at
UPDATE public.application_drafts 
SET updated_at = now() 
WHERE updated_at IS NULL OR updated_at = '1970-01-01 00:00:00+00'::timestamptz;

-- Update prequalifications with NULL or invalid created_at
UPDATE public.prequalifications 
SET created_at = now() 
WHERE created_at IS NULL OR created_at = '1970-01-01 00:00:00+00'::timestamptz;

-- Verify the fix
SELECT 
  'applications' as table_name,
  COUNT(*) as total_records,
  COUNT(CASE WHEN created_at IS NULL THEN 1 END) as null_created_at,
  COUNT(CASE WHEN updated_at IS NULL THEN 1 END) as null_updated_at
FROM public.applications
UNION ALL
SELECT 
  'application_drafts' as table_name,
  COUNT(*) as total_records,
  COUNT(CASE WHEN created_at IS NULL THEN 1 END) as null_created_at,
  COUNT(CASE WHEN updated_at IS NULL THEN 1 END) as null_updated_at
FROM public.application_drafts
UNION ALL
SELECT 
  'prequalifications' as table_name,
  COUNT(*) as total_records,
  COUNT(CASE WHEN created_at IS NULL THEN 1 END) as null_created_at,
  0 as null_updated_at
FROM public.prequalifications;
