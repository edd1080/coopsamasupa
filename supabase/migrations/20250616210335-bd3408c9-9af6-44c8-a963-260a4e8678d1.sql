
-- Enable Row Level Security on all tables
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prequalifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view their own applications" ON public.applications;
DROP POLICY IF EXISTS "Users can create their own applications" ON public.applications;
DROP POLICY IF EXISTS "Users can update their own applications" ON public.applications;
DROP POLICY IF EXISTS "Users can delete their own applications" ON public.applications;

DROP POLICY IF EXISTS "Users can view their own drafts" ON public.application_drafts;
DROP POLICY IF EXISTS "Users can create their own drafts" ON public.application_drafts;
DROP POLICY IF EXISTS "Users can update their own drafts" ON public.application_drafts;
DROP POLICY IF EXISTS "Users can delete their own drafts" ON public.application_drafts;

DROP POLICY IF EXISTS "Users can view their own prequalifications" ON public.prequalifications;
DROP POLICY IF EXISTS "Users can create their own prequalifications" ON public.prequalifications;
DROP POLICY IF EXISTS "Users can update their own prequalifications" ON public.prequalifications;
DROP POLICY IF EXISTS "Users can delete their own prequalifications" ON public.prequalifications;

DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

-- RLS Policies for applications table
CREATE POLICY "Users can view their own applications" 
  ON public.applications 
  FOR SELECT 
  USING (auth.uid() = agent_id);

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

-- RLS Policies for application_drafts table
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
  USING (auth.uid() = agent_id);

CREATE POLICY "Users can delete their own drafts" 
  ON public.application_drafts 
  FOR DELETE 
  USING (auth.uid() = agent_id);

-- RLS Policies for prequalifications table
CREATE POLICY "Users can view their own prequalifications" 
  ON public.prequalifications 
  FOR SELECT 
  USING (auth.uid() = agent_id);

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

-- RLS Policies for profiles table
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);
