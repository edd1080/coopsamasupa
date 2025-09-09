-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table for additional user information
CREATE TABLE public.profiles (
  id UUID NOT NULL PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  role TEXT DEFAULT 'agent',
  agency_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create applications table
CREATE TABLE public.applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID NOT NULL,
  client_name TEXT NOT NULL,
  product TEXT,
  amount_requested NUMERIC,
  status TEXT DEFAULT 'pending',
  current_stage TEXT DEFAULT 'Información Personal',
  progress_step INTEGER DEFAULT 1,
  draft_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create application_drafts table
CREATE TABLE public.application_drafts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID NOT NULL,
  client_name TEXT,
  draft_data JSONB,
  last_step INTEGER DEFAULT 0,
  last_sub_step INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create prequalifications table
CREATE TABLE public.prequalifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID NOT NULL,
  client_name TEXT NOT NULL,
  client_dpi TEXT,
  client_phone TEXT,
  economic_activity TEXT,
  monthly_income NUMERIC,
  credit_purpose TEXT,
  requested_amount NUMERIC,
  credit_history TEXT,
  evaluation_result JSONB,
  evaluation_status TEXT,
  can_proceed BOOLEAN DEFAULT false,
  requires_additional_data BOOLEAN DEFAULT false,
  evaluation_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prequalifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
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

-- Create RLS policies for applications
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

-- Create RLS policies for application_drafts
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

-- Create RLS policies for prequalifications
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

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_applications_updated_at
  BEFORE UPDATE ON public.applications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_application_drafts_updated_at
  BEFORE UPDATE ON public.application_drafts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', false);

-- Create storage policies for documents
CREATE POLICY "Users can view their own documents" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own documents" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own documents" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own documents" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);