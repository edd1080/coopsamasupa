
-- Crear tabla de perfiles de usuario
CREATE TABLE public.profiles (
  id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  first_name text,
  last_name text,
  full_name text,
  role text DEFAULT 'asesor',
  agency text DEFAULT 'Agencia Central',
  employee_id text,
  phone text,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Crear tabla de solicitudes
CREATE TABLE public.applications (
  id text NOT NULL PRIMARY KEY,
  agent_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  client_name text NOT NULL,
  product text NOT NULL,
  amount_requested numeric NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  current_stage text,
  progress_step integer DEFAULT 1,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Habilitar RLS en ambas tablas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para profiles
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

-- Políticas RLS para applications
CREATE POLICY "Agents can view their own applications" 
  ON public.applications 
  FOR SELECT 
  USING (auth.uid() = agent_id);

CREATE POLICY "Agents can create applications" 
  ON public.applications 
  FOR INSERT 
  WITH CHECK (auth.uid() = agent_id);

CREATE POLICY "Agents can update their own applications" 
  ON public.applications 
  FOR UPDATE 
  USING (auth.uid() = agent_id);

-- Función para manejar nuevos usuarios
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, full_name)
  VALUES (
    new.id,
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name',
    COALESCE(
      new.raw_user_meta_data ->> 'full_name',
      CONCAT(
        new.raw_user_meta_data ->> 'first_name', 
        ' ', 
        new.raw_user_meta_data ->> 'last_name'
      )
    )
  );
  RETURN new;
END;
$$;

-- Trigger para crear perfil automáticamente
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insertar datos de ejemplo para el usuario actual (si existe)
INSERT INTO public.profiles (id, first_name, last_name, full_name, role, agency, employee_id)
SELECT 
  id,
  'Edgar',
  'Calderón',
  'Edgar Calderón',
  'Asesor de Créditos',
  'Agencia Central',
  'EMP001'
FROM auth.users
WHERE email = 'edgar.calderon@bowpi.com'
ON CONFLICT (id) DO UPDATE SET
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  agency = EXCLUDED.agency,
  employee_id = EXCLUDED.employee_id;

-- Insertar algunas solicitudes de ejemplo
INSERT INTO public.applications (id, agent_id, client_name, product, amount_requested, status, current_stage, progress_step)
SELECT 
  'SCO_' || LPAD(floor(random() * 900000 + 100000)::text, 6, '0'),
  u.id,
  clients.name,
  clients.product,
  clients.amount,
  clients.status,
  clients.stage,
  clients.progress
FROM auth.users u
CROSS JOIN (
  VALUES 
    ('Ana García Méndez', 'Crédito Personal', 25000, 'pending', 'Información Financiera', 2),
    ('Carlos López Ramírez', 'Hipoteca', 1200000, 'approved', 'Completado', 6),
    ('María Rodríguez Sánchez', 'Crédito Auto', 350000, 'reviewing', 'Análisis de Carácter', 3),
    ('José Hernández Torres', 'Crédito PYME', 500000, 'reviewing', 'Documentos e Imágenes', 4),
    ('Laura Sánchez Vega', 'Crédito Personal', 30000, 'rejected', 'Rechazado', 2),
    ('Roberto Morales Castro', 'Crédito Personal', 45000, 'pending', 'Información Personal', 1),
    ('Sandra Jiménez Flores', 'Crédito Auto', 280000, 'pending', 'Información Financiera', 2),
    ('David González Ruiz', 'Hipoteca', 950000, 'reviewing', 'Verificación', 5),
    ('Carmen Vargas León', 'Crédito PYME', 750000, 'approved', 'Completado', 6),
    ('Miguel Torres Herrera', 'Crédito Personal', 18000, 'pending', 'Información Personal', 1),
    ('Patricia Cruz Mendoza', 'Crédito Auto', 320000, 'reviewing', 'Análisis de Carácter', 3),
    ('Fernando Ramos Silva', 'Crédito Personal', 52000, 'approved', 'Completado', 6)
) AS clients(name, product, amount, status, stage, progress)
WHERE u.email = 'edgar.calderon@bowpi.com';
