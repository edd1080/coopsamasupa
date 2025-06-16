
-- Crear tabla prequalifications si no existe
CREATE TABLE IF NOT EXISTS public.prequalifications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_name text NOT NULL,
  client_dpi text NOT NULL,
  client_phone text,
  economic_activity text NOT NULL,
  monthly_income numeric NOT NULL,
  credit_purpose text NOT NULL,
  requested_amount numeric NOT NULL,
  credit_history text NOT NULL,
  evaluation_result jsonb NOT NULL DEFAULT '{}',
  evaluation_status text NOT NULL CHECK (evaluation_status IN ('green', 'yellow', 'red')),
  can_proceed boolean DEFAULT false,
  requires_additional_data boolean DEFAULT false,
  evaluation_reason text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Crear índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_prequalifications_agent_id ON public.prequalifications(agent_id);
CREATE INDEX IF NOT EXISTS idx_prequalifications_created_at ON public.prequalifications(created_at);
CREATE INDEX IF NOT EXISTS idx_prequalifications_status ON public.prequalifications(evaluation_status);

-- Trigger para actualizar updated_at
CREATE OR REPLACE TRIGGER update_prequalifications_updated_at
  BEFORE UPDATE ON public.prequalifications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
