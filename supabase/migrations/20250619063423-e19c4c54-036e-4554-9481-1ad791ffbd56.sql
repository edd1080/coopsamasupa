
-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own drafts" ON public.application_drafts;
DROP POLICY IF EXISTS "Users can create their own drafts" ON public.application_drafts;
DROP POLICY IF EXISTS "Users can update their own drafts" ON public.application_drafts;
DROP POLICY IF EXISTS "Users can delete their own drafts" ON public.application_drafts;

-- Create proper RLS policies for application_drafts with correct clauses
CREATE POLICY "Users can view their own drafts" 
  ON public.application_drafts 
  FOR SELECT 
  USING (auth.uid() = agent_id);

CREATE POLICY "Users can create their own drafts" 
  ON public.application_drafts 
  FOR INSERT 
  WITH CHECK (auth.uid() = agent_id);

CREATE POLICY "Users can update their own drafts" 
  ON public.application_drafts 
  FOR UPDATE 
  USING (auth.uid() = agent_id)
  WITH CHECK (auth.uid() = agent_id);

CREATE POLICY "Users can delete their own drafts" 
  ON public.application_drafts 
  FOR DELETE 
  USING (auth.uid() = agent_id);
