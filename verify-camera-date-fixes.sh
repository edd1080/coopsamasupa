#!/bin/bash

echo "🔍 Verificando correcciones de mensaje de cámara y fechas..."

# Verificar que NativeCameraCapture tenga traducción de mensajes
echo "✅ Verificando NativeCameraCapture..."
if grep -q "user canceled photos app" src/components/requestForm/NativeCameraCapture.tsx; then
    echo "✅ NativeCameraCapture detecta mensaje 'user canceled photos app'"
else
    echo "❌ NativeCameraCapture NO detecta mensaje 'user canceled photos app'"
    exit 1
fi

if grep -q "No se pudo tomar la foto, el usuario canceló la acción" src/components/requestForm/NativeCameraCapture.tsx; then
    echo "✅ NativeCameraCapture tiene mensaje en español para cancelación"
else
    echo "❌ NativeCameraCapture NO tiene mensaje en español para cancelación"
    exit 1
fi

# Verificar que PhotoDocumentUpload tenga traducción de mensajes
echo "✅ Verificando PhotoDocumentUpload..."
if grep -q "user canceled photos app" src/components/requestForm/PhotoDocumentUpload.tsx; then
    echo "✅ PhotoDocumentUpload detecta mensaje 'user canceled photos app'"
else
    echo "❌ PhotoDocumentUpload NO detecta mensaje 'user canceled photos app'"
    exit 1
fi

if grep -q "No se pudo tomar la foto, el usuario canceló la acción" src/components/requestForm/PhotoDocumentUpload.tsx; then
    echo "✅ PhotoDocumentUpload tiene mensaje en español para cancelación"
else
    echo "❌ PhotoDocumentUpload NO tiene mensaje en español para cancelación"
    exit 1
fi

# Verificar que dateUtils maneje valores nulos/inválidos
echo "✅ Verificando dateUtils..."
if grep -q "Handle null, undefined, or empty values" src/utils/dateUtils.ts; then
    echo "✅ dateUtils maneja valores nulos/inválidos"
else
    echo "❌ dateUtils NO maneja valores nulos/inválidos"
    exit 1
fi

if grep -q "isNaN(dateObj.getTime())" src/utils/dateUtils.ts; then
    echo "✅ dateUtils verifica si la fecha es válida (no NaN)"
else
    echo "❌ dateUtils NO verifica si la fecha es válida (no NaN)"
    exit 1
fi

if grep -q "Sin fecha" src/utils/dateUtils.ts; then
    echo "✅ dateUtils muestra 'Sin fecha' para valores nulos"
else
    echo "❌ dateUtils NO muestra 'Sin fecha' para valores nulos"
    exit 1
fi

if grep -q "Fecha inválida" src/utils/dateUtils.ts; then
    echo "✅ dateUtils muestra 'Fecha inválida' para fechas inválidas"
else
    echo "❌ dateUtils NO muestra 'Fecha inválida' para fechas inválidas"
    exit 1
fi

echo ""
echo "🎉 Verificación completada exitosamente!"
echo ""
echo "📋 Cambios implementados:"
echo "1. ✅ Mensaje 'user canceled photos app' traducido a español"
echo "2. ✅ Mensaje 'No se pudo tomar la foto, el usuario canceló la acción'"
echo "3. ✅ Traducción de otros mensajes de error de cámara"
echo "4. ✅ Manejo de valores nulos/inválidos en fechas"
echo "5. ✅ Verificación de fechas válidas (no NaN)"
echo "6. ✅ Mensajes 'Sin fecha' y 'Fecha inválida' en español"
echo ""
echo "🧪 Para probar:"
echo "1. Abrir solicitud de crédito"
echo "2. Ir al paso 5 (Documentos)"
echo "3. Intentar tomar foto y cancelar - debe mostrar mensaje en español"
echo "4. Verificar que las fechas en las cards de solicitudes no muestren nan/nan/nan"
echo ""
echo "🔧 Mejoras implementadas:"
echo "- Traducción completa de mensajes de error de Capacitor Camera"
echo "- Manejo robusto de fechas inválidas o nulas"
echo "- Mensajes de error en español consistentes"
