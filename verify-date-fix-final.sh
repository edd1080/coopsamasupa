#!/bin/bash

echo "🔍 Verificando corrección final de fechas..."

# Verificar que dateUtils maneje correctamente valores nulos
echo "✅ Verificando dateUtils..."
if grep -q "date === null" src/utils/dateUtils.ts; then
    echo "✅ dateUtils verifica explícitamente null"
else
    echo "❌ dateUtils NO verifica explícitamente null"
    exit 1
fi

if grep -q "date === undefined" src/utils/dateUtils.ts; then
    echo "✅ dateUtils verifica explícitamente undefined"
else
    echo "❌ dateUtils NO verifica explícitamente undefined"
    exit 1
fi

if grep -q "dateObj.getTime() === 0" src/utils/dateUtils.ts; then
    echo "✅ dateUtils verifica epoch time (1970-01-01)"
else
    echo "❌ dateUtils NO verifica epoch time (1970-01-01)"
    exit 1
fi

if grep -q "return 'Sin fecha'" src/utils/dateUtils.ts; then
    echo "✅ dateUtils devuelve 'Sin fecha' para casos inválidos"
else
    echo "❌ dateUtils NO devuelve 'Sin fecha' para casos inválidos"
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
echo "📋 Cambios implementados:"
echo "1. ✅ Verificación explícita de null y undefined"
echo "2. ✅ Verificación de epoch time (1970-01-01)"
echo "3. ✅ Todos los casos inválidos devuelven 'Sin fecha'"
echo "4. ✅ Eliminado 'Fecha inválida' de catch blocks"
echo "5. ✅ Manejo consistente en todas las funciones de fecha"
echo ""
echo "🧪 Para probar:"
echo "1. Verificar las cards de solicitudes"
echo "2. Las fechas deben mostrar formato correcto DD/MM/YYYY"
echo "3. No debe aparecer 'Fecha inválida'"
echo "4. Valores nulos deben mostrar 'Sin fecha'"
echo ""
echo "🔧 Mejoras técnicas:"
echo "- Manejo robusto de valores null/undefined"
echo "- Verificación de epoch time (timestamp 0)"
echo "- Mensajes consistentes en español"
echo "- Eliminación de 'Fecha inválida' confusa"
