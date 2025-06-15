
-- Crear tabla para almacenar borradores de solicitudes
CREATE TABLE public.application_drafts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID NOT NULL,
  client_name TEXT,
  draft_data JSONB NOT NULL DEFAULT '{}',
  last_step INTEGER DEFAULT 0,
  last_sub_step INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Agregar campo para datos de borrador en la tabla applications existente
ALTER TABLE public.applications 
ADD COLUMN IF NOT EXISTS draft_data JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS is_draft BOOLEAN DEFAULT false;

-- Habilitar RLS en application_drafts
ALTER TABLE public.application_drafts ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para application_drafts
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

-- Función para actualizar timestamp automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at automáticamente
CREATE TRIGGER update_application_drafts_updated_at 
    BEFORE UPDATE ON public.application_drafts 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
