
-- Cambiar el tipo de columna id de uuid a text en application_drafts
-- Esto permitirá usar el formato SCO_###### directamente como ID
ALTER TABLE public.application_drafts 
ALTER COLUMN id TYPE text;

-- Actualizar el valor por defecto para generar IDs en formato SCO_######
-- Removemos el default de gen_random_uuid() ya que ahora manejaremos los IDs en el código
ALTER TABLE public.application_drafts 
ALTER COLUMN id DROP DEFAULT;

-- Los registros existentes mantendrán sus UUIDs actuales, 
-- pero los nuevos usarán el formato SCO_######
