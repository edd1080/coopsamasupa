
-- Primero, eliminar todas las solicitudes de ejemplo existentes
DELETE FROM public.applications;

-- Insertar solo 4 solicitudes de ejemplo (una de cada estado)
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
    ('María Rodríguez Sánchez', 'Crédito Auto', 350000, 'reviewing', 'Análisis de Carácter', 3),
    ('Carlos López Ramírez', 'Hipoteca', 1200000, 'approved', 'Completado', 6),
    ('Laura Sánchez Vega', 'Crédito Personal', 30000, 'rejected', 'Rechazado', 2)
) AS clients(name, product, amount, status, stage, progress)
WHERE u.email = 'edgar.calderon@bowpi.com';
