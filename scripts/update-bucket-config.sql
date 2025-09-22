-- Script para actualizar la configuración del bucket 'documents'
-- Ejecutar este script en el SQL Editor del Dashboard de Supabase

-- Actualizar el bucket para permitir archivos .txt además de imágenes y PDFs
UPDATE storage.buckets 
SET 
  allowed_mime_types = ARRAY[
    'image/jpeg', 
    'image/png', 
    'image/gif', 
    'image/webp', 
    'application/pdf',
    'text/plain'
  ]
WHERE name = 'documents';

-- Verificar la configuración actualizada
SELECT name, public, file_size_limit, allowed_mime_types 
FROM storage.buckets 
WHERE name = 'documents';
