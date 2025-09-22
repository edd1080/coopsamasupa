# Configuración de Supabase Storage RLS

## Problema Identificado

El error `"new row violates row-level security policy"` indica que el bucket existe pero las políticas RLS (Row Level Security) no están configuradas correctamente.

## Solución Manual (Recomendada)

### Paso 1: Ir al Dashboard de Supabase

1. Ve a: https://supabase.com/dashboard/project/fsgzurbqrxjrjipghkcz
2. Inicia sesión con tu cuenta

### Paso 2: Configurar el Bucket

1. Ve a **Storage** en el menú lateral
2. Si no existe el bucket "documents", créalo:
   - Click en "New bucket"
   - Nombre: `documents`
   - Marcar como público: ✅
   - Límite de tamaño: 50MB
   - Tipos MIME permitidos: `image/jpeg, image/png, image/gif, image/webp, application/pdf`

### Paso 3: Configurar Políticas RLS

1. Ve a **Storage** > **Policies**
2. Click en "New Policy" para cada una de las siguientes políticas:

#### Política 1: Upload
- **Policy Name**: `Users can upload documents`
- **Target Roles**: `authenticated`
- **Operation**: `INSERT`
- **Target**: `objects`
- **Policy Definition**:
```sql
bucket_id = 'documents' 
AND auth.role() = 'authenticated'
```

#### Política 2: View
- **Policy Name**: `Users can view their own documents`
- **Target Roles**: `authenticated`
- **Operation**: `SELECT`
- **Target**: `objects`
- **Policy Definition**:
```sql
bucket_id = 'documents' 
AND auth.role() = 'authenticated'
```

#### Política 3: Update
- **Policy Name**: `Users can update their own documents`
- **Target Roles**: `authenticated`
- **Operation**: `UPDATE`
- **Target**: `objects`
- **Policy Definition**:
```sql
bucket_id = 'documents' 
AND auth.role() = 'authenticated'
```

#### Política 4: Delete
- **Policy Name**: `Users can delete their own documents`
- **Target Roles**: `authenticated`
- **Operation**: `DELETE`
- **Target**: `objects`
- **Policy Definition**:
```sql
bucket_id = 'documents' 
AND auth.role() = 'authenticated'
```

### Paso 4: Verificar Configuración

1. Ve a **Storage** > **Policies**
2. Deberías ver 4 políticas para la tabla `objects`
3. Todas deben tener `bucket_id = 'documents'` y `auth.role() = 'authenticated'`

## Solución Automática (Alternativa)

Si prefieres usar el script automático:

1. Obtén tu Service Role Key:
   - Ve a **Settings** > **API**
   - Copia la "service_role" key

2. Ejecuta el script:
```bash
export SUPABASE_SERVICE_ROLE_KEY=" "
node scripts/fix-storage-final.cjs
```

## Verificación

Después de configurar las políticas:

1. Ve a la aplicación
2. Intenta subir una foto en el paso 5
3. Debería funcionar sin errores de RLS

## Troubleshooting

### Error: "new row violates row-level security policy"
- **Causa**: Las políticas RLS no están configuradas
- **Solución**: Seguir los pasos 2-3 arriba

### Error: "Bucket not found"
- **Causa**: El bucket no existe
- **Solución**: Crear el bucket "documents" en Storage

### Error: "File type not allowed"
- **Causa**: El tipo MIME no está permitido
- **Solución**: Verificar que el bucket permita `image/jpeg`, `image/png`, etc.

## SQL Directo (Si las políticas no se crean)

Si el editor de políticas no funciona, ejecuta este SQL en el **SQL Editor**:

```sql
-- Crear bucket si no existe
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documents',
  'documents', 
  true,
  52428800, -- 50MB
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];

-- Crear políticas RLS
CREATE POLICY "Users can upload documents" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'documents' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can view their own documents" ON storage.objects
FOR SELECT USING (
  bucket_id = 'documents' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can update their own documents" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'documents' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can delete their own documents" ON storage.objects
FOR DELETE USING (
  bucket_id = 'documents' 
  AND auth.role() = 'authenticated'
);
```
