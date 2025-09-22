-- Add SCO ID field to applications table
ALTER TABLE public.applications 
ADD COLUMN IF NOT EXISTS sco_id TEXT;

-- Create index for SCO ID queries
CREATE INDEX IF NOT EXISTS idx_applications_sco_id ON public.applications(sco_id);

-- Add comment to explain the field
COMMENT ON COLUMN public.applications.sco_id IS 'SCO ID (SCO_XXXXXX) - Primary identifier for tracking applications across systems';
