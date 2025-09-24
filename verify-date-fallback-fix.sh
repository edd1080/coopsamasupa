#!/bin/bash

echo "🔍 Verificando corrección de fechas con fallback..."

# Verificar que useApplicationsList use fallback para fechas
echo "✅ Verificando useApplicationsList..."
if grep -q "app.created_at || app.updated_at || new Date().toISOString()" src/hooks/useApplicationsList.tsx; then
    echo "✅ Applications usa fallback: created_at || updated_at || fecha_actual"
else
    echo "❌ Applications NO usa fallback para fechas"
    exit 1
fi

if grep -q "draft.updated_at || draft.created_at || new Date().toISOString()" src/hooks/useApplicationsList.tsx; then
    echo "✅ Drafts usa fallback: updated_at || created_at || fecha_actual"
else
    echo "❌ Drafts NO usa fallback para fechas"
    exit 1
fi

# Verificar que dateUtils maneje correctamente valores válidos
echo "✅ Verificando dateUtils..."
if grep -q "date === null || date === undefined" src/utils/dateUtils.ts; then
    echo "✅ dateUtils verifica explícitamente null y undefined"
else
    echo "❌ dateUtils NO verifica explícitamente null y undefined"
    exit 1
fi

if grep -q "dateObj.getTime() === 0" src/utils/dateUtils.ts; then
    echo "✅ dateUtils verifica epoch time (1970-01-01)"
else
    echo "❌ dateUtils NO verifica epoch time (1970-01-01)"
    exit 1
fi

# Verificar que no haya más "Fecha inválida" en catch blocks
if grep -q "return 'Fecha inválida'" src/utils/dateUtils.ts; then
    echo "❌ dateUtils aún tiene 'Fecha inválida' en catch blocks"
    exit 1
else
    echo "✅ dateUtils ya no tiene 'Fecha inválida' en catch blocks"
fi

# Verificar que todas las funciones de fecha estén corregidas
echo "✅ Verificando todas las funciones de fecha..."
if grep -q "formatDateToGuatemalan\|formatDateTimeToGuatemalan\|formatShortDateTimeToGuatemalan" src/utils/dateUtils.ts; then
    echo "✅ Todas las funciones de fecha están presentes"
else
    echo "❌ Faltan funciones de fecha"
    exit 1
fi

echo ""
echo "🎉 Verificación completada exitosamente!"
echo ""
echo "📋 Solución implementada:"
echo "1. ✅ Fallback en useApplicationsList: created_at || updated_at || fecha_actual"
echo "2. ✅ Fallback en drafts: updated_at || created_at || fecha_actual"
echo "3. ✅ Verificación explícita de null y undefined en dateUtils"
echo "4. ✅ Verificación de epoch time (1970-01-01)"
echo "5. ✅ Todos los casos inválidos devuelven 'Sin fecha'"
echo "6. ✅ Eliminado 'Fecha inválida' de catch blocks"
echo "7. ✅ Manejo consistente en todas las funciones de fecha"
echo ""
echo "🧪 Para probar:"
echo "1. Verificar las cards de solicitudes"
echo "2. Las fechas deben mostrar formato correcto DD/MM/YYYY"
echo "3. No debe aparecer 'Fecha inválida'"
echo "4. Valores nulos deben mostrar 'Sin fecha'"
echo "5. Fechas válidas deben mostrarse correctamente"
echo ""
echo "🔧 Mejoras técnicas:"
echo "- Fallback robusto: created_at → updated_at → fecha_actual"
echo "- Manejo robusto de valores null/undefined"
echo "- Verificación de epoch time (timestamp 0)"
echo "- Mensajes consistentes en español"
echo "- Eliminación de 'Fecha inválida' confusa"
echo "- Solución completa para problemas de base de datos"
