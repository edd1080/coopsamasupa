-- Add official_data column to applications table
ALTER TABLE public.applications 
ADD COLUMN official_data JSONB;