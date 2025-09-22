# Funcionalidad de Metadata de Solicitudes

## ✅ Implementación Completada

Se ha implementado la funcionalidad para crear automáticamente un archivo `.txt` con metadata de cada solicitud enviada.

## 🔧 Cambios Realizados

### 1. Estructura de Carpetas
- **Formato**: `{applicationId}_{userEmail}`
- **Ejemplo**: `SCO_965776_juan_at_ejemplo_com`
- **Ubicación**: Bucket `documents` en Supabase Storage
- **Nota**: Usa el ID de solicitud (SCO_XXXXXX) no el ID de base de datos

### 2. Archivo de Metadata
- **Nombre**: `solicitud_metadata.txt`
- **Contenido**: Información completa de la solicitud
- **Ubicación**: Dentro de la carpeta de la solicitud

### 3. Información Incluida en el Metadata
```
SOLICITUD DE CRÉDITO - METADATA
=====================================

ID de Solicitud: SCO_965776
Email del Agente: juan@ejemplo.com
Fecha de Envío: 21/09/2025
Hora de Envío: 17:04:32
Nombre Completo del Solicitante: Juan Carlos Pérez García
Monto Solicitado: Q50,000
Estado: pending

DOCUMENTOS ADJUNTOS:
===================
- cedula_front: cedula_front-1234567890.jpg
- cedula_back: cedula_back-1234567890.jpg
- comprobante_ingresos: comprobante_ingresos-1234567890.pdf

INFORMACIÓN ADICIONAL:
=====================
Teléfono: 5555-1234
Dirección: Zona 10, Guatemala
Ocupación: Ingeniero

Generado automáticamente el 2025-09-21T23:04:32.000Z
```

## 📋 Configuración Requerida

### Paso 1: Actualizar Bucket para Permitir Archivos .txt

Ejecuta este SQL en el **SQL Editor** de Supabase:

```sql
-- Actualizar el bucket para permitir archivos .txt
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

-- Verificar la configuración
SELECT name, public, file_size_limit, allowed_mime_types 
FROM storage.buckets 
WHERE name = 'documents';
```

### Paso 2: Verificar Funcionamiento

1. **Ve a la aplicación**: http://localhost:8082
2. **Inicia sesión** con tu cuenta
3. **Crea una nueva solicitud** con fotos
4. **Envía la solicitud**
5. **Verifica en Supabase Storage**:
   - Ve a Storage > documents
   - Busca la carpeta con formato `{ID}_{email}`
   - Verifica que contenga:
     - Las fotos subidas
     - El archivo `solicitud_metadata.txt`

## 🎯 Resultado Esperado

### Estructura de Archivos en Storage:
```
documents/
├── SCO_965776_juan_at_ejemplo_com/
│   ├── solicitud_metadata.txt
│   ├── cedula_front-1234567890.jpg
│   ├── cedula_back-1234567890.jpg
│   └── comprobante_ingresos-1234567890.pdf
├── SCO_965777_maria_at_empresa_com/
│   ├── solicitud_metadata.txt
│   ├── cedula_front-1234567891.jpg
│   └── comprobante_ingresos-1234567891.pdf
└── ...
```

## 🔍 Verificación

### En la Consola del Navegador:
Deberías ver logs como:
```
📁 Creating folder structure: SCO_965776_juan_at_ejemplo_com
📄 Uploading metadata file: SCO_965776_juan_at_ejemplo_com/solicitud_metadata.txt
✅ Metadata uploaded: {path: "SCO_965776_juan_at_ejemplo_com/solicitud_metadata.txt", ...}
📤 Uploading cedula_front: SCO_965776_juan_at_ejemplo_com/cedula_front-1234567890.jpg
✅ Uploaded cedula_front: {path: "SCO_965776_juan_at_ejemplo_com/cedula_front-1234567890.jpg", ...}
```

### En Supabase Dashboard:
1. Ve a **Storage** > **documents**
2. Busca carpetas con formato `{ID}_{email}`
3. Cada carpeta debe contener:
   - Archivo `solicitud_metadata.txt`
   - Las fotos/documentos subidos

## 🚀 Beneficios

1. **Trazabilidad**: Cada solicitud tiene su metadata completa
2. **Organización**: Archivos organizados por solicitud y agente
3. **Auditoría**: Fácil identificación de quién envió qué y cuándo
4. **Debugging**: Información detallada para resolver problemas
5. **Compliance**: Registro completo de cada transacción

## 🔧 Troubleshooting

### Error: "invalid_mime_type"
- **Causa**: El bucket no acepta archivos .txt
- **Solución**: Ejecutar el SQL de actualización del bucket

### Error: "signature verification failed"
- **Causa**: Problema de autenticación
- **Solución**: Asegúrate de estar logueado en la aplicación

### Archivos no aparecen en Storage
- **Causa**: Error en la subida
- **Solución**: Revisar logs de la consola para errores específicos

## 📁 Archivos Modificados

- `src/hooks/useFinalizeApplication.tsx` - Lógica de subida con metadata
- `scripts/update-bucket-config.sql` - SQL para actualizar bucket
- `scripts/test-metadata-upload.js` - Script de prueba
