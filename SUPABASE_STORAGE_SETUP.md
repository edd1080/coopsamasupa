# Configuración de Supabase Storage para Documentos

## Estado Actual
La funcionalidad de adjuntar fotografías está funcionando con almacenamiento local. Para habilitar el almacenamiento en Supabase Storage, sigue estos pasos:

## Pasos para Configurar Supabase Storage

### 1. Crear el Bucket 'documents'

1. Ve al [Dashboard de Supabase](https://supabase.com/dashboard/project/fsgzurbqrxjrjipghkcz/storage/buckets)
2. Haz clic en "New bucket"
3. Configura el bucket:
   - **Name**: `documents`
   - **Public bucket**: ✅ (marcado)
   - **File size limit**: `50 MB`
   - **Allowed MIME types**: 
     - `image/jpeg`
     - `image/png` 
     - `image/webp`
     - `application/pdf`

### 2. Configurar Políticas RLS (Row Level Security)

Ejecuta estas consultas SQL en el SQL Editor de Supabase:

```sql
-- Crear políticas para que los usuarios solo puedan acceder a sus propios documentos
CREATE POLICY "Users can upload their own documents" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'documents' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own documents" ON storage.objects
FOR SELECT USING (
  bucket_id = 'documents' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own documents" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'documents' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own documents" ON storage.objects
FOR DELETE USING (
  bucket_id = 'documents' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);
```

### 3. Habilitar Supabase Storage en el Código

Una vez configurado el bucket, actualiza el archivo `src/hooks/useDocumentManager.tsx`:

```typescript
// Cambiar esta línea:
if (false) { // Disabled until Supabase Storage is configured

// Por esta:
if (navigator.onLine) { // Enable Supabase Storage
```

### 4. Verificar la Configuración

1. Reinicia el servidor de desarrollo
2. Ve al paso 5 del formulario
3. Intenta subir una fotografía
4. Verifica en el panel de debug que aparezca "Storage: Supabase" en lugar de "Local"

## Estructura de Archivos

Los archivos se organizan de la siguiente manera:
```
documents/
├── {applicationId}/
│   ├── dpiFrontal-{timestamp}.jpg
│   ├── dpiTrasero-{timestamp}.jpg
│   ├── fotoSolicitante-{timestamp}.jpg
│   └── ...
└── temp/
    └── {documentId}-{timestamp}.{ext}
```

## Scripts de Automatización

Se incluyen scripts para verificar y crear el bucket:

- `scripts/create-bucket.sh` - Script de bash para crear el bucket
- `scripts/create-bucket.ps1` - Script de PowerShell para Windows
- `scripts/create-bucket.js` - Script de Node.js (requiere SERVICE_ROLE_KEY)

## Troubleshooting

### Error: "Bucket not found"
- Verifica que el bucket 'documents' existe en Supabase
- Asegúrate de que el bucket es público

### Error: "Permission denied"
- Verifica que las políticas RLS están configuradas correctamente
- Asegúrate de que el usuario está autenticado

### Error: "File too large"
- Verifica que el límite de tamaño del bucket es suficiente (50MB)
- Comprueba el tamaño del archivo antes de subirlo

## Notas Importantes

- Los archivos se almacenan con el ID de la aplicación como prefijo
- Se mantiene un respaldo local para funcionamiento offline
- Los archivos se sincronizan automáticamente cuando hay conexión
- Se genera una URL pública para cada archivo subido
