# Resumen de Cambios - ID de Solicitud SCO_XXXXXX

## ✅ Cambio Implementado

Se ha corregido el código para usar el **ID de solicitud (SCO_XXXXXX)** en lugar del ID de base de datos para:

1. **Nombre de la carpeta** en Supabase Storage
2. **Archivo de metadata** (solicitud_metadata.txt)

## 🔧 Archivos Modificados

### 1. `src/hooks/useFinalizeApplication.tsx`
**Antes:**
```typescript
const folderName = `${result.id}_${userEmail.replace('@', '_at_').replace(/[^a-zA-Z0-9_-]/g, '_')}`;
// ...
ID de Solicitud: ${result.id}
```

**Después:**
```typescript
const applicationId = formData?.applicationId || result.id; // Use SCO_XXXXXX format
const folderName = `${applicationId}_${userEmail.replace('@', '_at_').replace(/[^a-zA-Z0-9_-]/g, '_')}`;
// ...
ID de Solicitud: ${applicationId}
```

### 2. `scripts/test-metadata-upload.js`
**Antes:**
```javascript
const applicationId = 'SCO_TEST_' + Date.now();
```

**Después:**
```javascript
const applicationId = 'SCO_' + Math.floor(100000 + Math.random() * 900000);
```

## 🎯 Resultado

### Estructura de Carpetas:
- **Antes**: `{database_id}_{email}` (ej: `12345_juan_at_ejemplo_com`)
- **Después**: `{SCO_XXXXXX}_{email}` (ej: `SCO_965776_juan_at_ejemplo_com`)

### Archivo de Metadata:
- **Antes**: `ID de Solicitud: 12345`
- **Después**: `ID de Solicitud: SCO_965776`

## 📋 Ejemplo de Funcionamiento

Cuando un usuario envía una solicitud:

1. **Se genera ID**: `SCO_965776`
2. **Se crea carpeta**: `SCO_965776_juan_at_ejemplo_com`
3. **Se suben archivos**:
   - `SCO_965776_juan_at_ejemplo_com/solicitud_metadata.txt`
   - `SCO_965776_juan_at_ejemplo_com/cedula_front-1234567890.jpg`
   - `SCO_965776_juan_at_ejemplo_com/cedula_back-1234567890.jpg`

4. **Contenido del metadata**:
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
...
```

## ✅ Verificación

Para verificar que funciona correctamente:

1. **Ve a la aplicación**: http://localhost:8082
2. **Inicia sesión** y crea una solicitud
3. **Envía la solicitud** con fotos
4. **Verifica en Supabase Storage**:
   - Busca carpeta con formato `SCO_XXXXXX_email`
   - Verifica que el archivo `.txt` contenga el ID correcto

## 🎉 Beneficios

- **Consistencia**: Mismo ID en toda la aplicación
- **Trazabilidad**: Fácil identificación de solicitudes
- **Organización**: Carpetas con nombres descriptivos
- **Debugging**: IDs reconocibles en logs y errores
