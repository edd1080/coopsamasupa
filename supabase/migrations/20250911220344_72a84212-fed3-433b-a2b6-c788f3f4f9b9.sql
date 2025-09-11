-- Create tenant enum
CREATE TYPE public.app_tenant AS ENUM ('coopsama', 'cosmos', 'cch', 'ptc');

-- Add tenant column to profiles table
ALTER TABLE public.profiles ADD COLUMN tenant app_tenant DEFAULT 'coopsama';

-- Create index for tenant queries
CREATE INDEX idx_profiles_tenant ON public.profiles(tenant);

-- Update existing profiles to have default tenant
UPDATE public.profiles SET tenant = 'coopsama' WHERE tenant IS NULL;

-- Make tenant required
ALTER TABLE public.profiles ALTER COLUMN tenant SET NOT NULL;

-- Update RLS policies for applications to include tenant filtering
DROP POLICY IF EXISTS "Users can view their own applications" ON public.applications;
DROP POLICY IF EXISTS "Users can create their own applications" ON public.applications;
DROP POLICY IF EXISTS "Users can update their own applications" ON public.applications;
DROP POLICY IF EXISTS "Users can delete their own applications" ON public.applications;

CREATE POLICY "Users can view their own applications" 
ON public.applications 
FOR SELECT 
USING (
  auth.uid() = agent_id AND 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.tenant = (
      SELECT tenant FROM public.profiles WHERE id = applications.agent_id
    )
  )
);

CREATE POLICY "Users can create their own applications" 
ON public.applications 
FOR INSERT 
WITH CHECK (auth.uid() = agent_id);

CREATE POLICY "Users can update their own applications" 
ON public.applications 
FOR UPDATE 
USING (auth.uid() = agent_id);

CREATE POLICY "Users can delete their own applications" 
ON public.applications 
FOR DELETE 
USING (auth.uid() = agent_id);

-- Update RLS policies for application_drafts to include tenant filtering
DROP POLICY IF EXISTS "Users can view their own drafts" ON public.application_drafts;
DROP POLICY IF EXISTS "Users can create their own drafts" ON public.application_drafts;
DROP POLICY IF EXISTS "Users can update their own drafts" ON public.application_drafts;
DROP POLICY IF EXISTS "Users can delete their own drafts" ON public.application_drafts;

CREATE POLICY "Users can view their own drafts" 
ON public.application_drafts 
FOR SELECT 
USING (
  auth.uid() = agent_id AND 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.tenant = (
      SELECT tenant FROM public.profiles WHERE id = application_drafts.agent_id
    )
  )
);

CREATE POLICY "Users can create their own drafts" 
ON public.application_drafts 
FOR INSERT 
WITH CHECK (auth.uid() = agent_id);

CREATE POLICY "Users can update their own drafts" 
ON public.application_drafts 
FOR UPDATE 
USING (auth.uid() = agent_id);

CREATE POLICY "Users can delete their own drafts" 
ON public.application_drafts 
FOR DELETE 
USING (auth.uid() = agent_id);

-- Update RLS policies for prequalifications to include tenant filtering
DROP POLICY IF EXISTS "Users can view their own prequalifications" ON public.prequalifications;
DROP POLICY IF EXISTS "Users can create their own prequalifications" ON public.prequalifications;
DROP POLICY IF EXISTS "Users can update their own prequalifications" ON public.prequalifications;
DROP POLICY IF EXISTS "Users can delete their own prequalifications" ON public.prequalifications;

CREATE POLICY "Users can view their own prequalifications" 
ON public.prequalifications 
FOR SELECT 
USING (
  auth.uid() = agent_id AND 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.tenant = (
      SELECT tenant FROM public.profiles WHERE id = prequalifications.agent_id
    )
  )
);

CREATE POLICY "Users can create their own prequalifications" 
ON public.prequalifications 
FOR INSERT 
WITH CHECK (auth.uid() = agent_id);

CREATE POLICY "Users can update their own prequalifications" 
ON public.prequalifications 
FOR UPDATE 
USING (auth.uid() = agent_id);

CREATE POLICY "Users can delete their own prequalifications" 
ON public.prequalifications 
FOR DELETE 
USING (auth.uid() = agent_id);

-- Add fields to applications table for Coopsama integration
ALTER TABLE public.applications ADD COLUMN coopsama_operation_id text;
ALTER TABLE public.applications ADD COLUMN coopsama_external_reference_id text;
ALTER TABLE public.applications ADD COLUMN coopsama_sync_status text DEFAULT 'pending';
ALTER TABLE public.applications ADD COLUMN coopsama_sync_error text;
ALTER TABLE public.applications ADD COLUMN coopsama_synced_at timestamp with time zone;