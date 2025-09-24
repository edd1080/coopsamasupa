#!/bin/bash

echo "🔍 Verificando correcciones de Dark Mode y UX en Geolocalización"
echo "================================================================="

# Verificar dark mode en inputs de coordenadas
echo "✅ Verificando dark mode en inputs de coordenadas..."
if grep -q 'bg-muted text-foreground' src/components/requestForm/CoordinateDisplay.tsx; then
    echo "✅ Inputs de coordenadas usan bg-muted text-foreground (dark mode)"
else
    echo "❌ Inputs de coordenadas NO usan dark mode"
    exit 1
fi

# Verificar que no usan bg-gray-50
if ! grep -q 'bg-gray-50' src/components/requestForm/CoordinateDisplay.tsx; then
    echo "✅ Inputs de coordenadas NO usan bg-gray-50 (correcto)"
else
    echo "❌ Inputs de coordenadas aún usan bg-gray-50"
    exit 1
fi

# Verificar dark mode en labels
echo "✅ Verificando dark mode en labels..."
if grep -q 'text-muted-foreground' src/components/requestForm/CoordinateDisplay.tsx; then
    echo "✅ Labels usan text-muted-foreground (dark mode)"
else
    echo "❌ Labels NO usan dark mode"
    exit 1
fi

# Verificar que no usan text-gray-600
if ! grep -q 'text-gray-600' src/components/requestForm/CoordinateDisplay.tsx; then
    echo "✅ Labels NO usan text-gray-600 (correcto)"
else
    echo "❌ Labels aún usan text-gray-600"
    exit 1
fi

# Verificar dark mode en sección de precisión
echo "✅ Verificando dark mode en sección de precisión..."
if grep -q 'dark:bg-blue-950/20' src/components/requestForm/CoordinateDisplay.tsx; then
    echo "✅ Sección de precisión usa dark:bg-blue-950/20"
else
    echo "❌ Sección de precisión NO usa dark mode"
    exit 1
fi

if grep -q 'dark:border-blue-800' src/components/requestForm/CoordinateDisplay.tsx; then
    echo "✅ Sección de precisión usa dark:border-blue-800"
else
    echo "❌ Sección de precisión NO usa dark border"
    exit 1
fi

if grep -q 'dark:text-blue-300' src/components/requestForm/CoordinateDisplay.tsx; then
    echo "✅ Texto de precisión usa dark:text-blue-300"
else
    echo "❌ Texto de precisión NO usa dark mode"
    exit 1
fi

# Verificar eliminación de badge GPS
echo "✅ Verificando eliminación de badge GPS..."
if ! grep -q 'Badge' src/components/requestForm/CoordinateDisplay.tsx; then
    echo "✅ Badge GPS eliminado correctamente"
else
    echo "❌ Badge GPS aún está presente"
    exit 1
fi

if ! grep -q 'getAccuracyStatus' src/components/requestForm/CoordinateDisplay.tsx; then
    echo "✅ Función getAccuracyStatus eliminada"
else
    echo "❌ Función getAccuracyStatus aún está presente"
    exit 1
fi

# Verificar eliminación de título duplicado
echo "✅ Verificando eliminación de título duplicado..."
if ! grep -q 'captureProgress.*Obteniendo ubicación' src/components/requestForm/GeolocationCapture.tsx; then
    echo "✅ Título duplicado eliminado del botón"
else
    echo "❌ Título duplicado aún está en el botón"
    exit 1
fi

if grep -q 'Obteniendo ubicación\.\.\.' src/components/requestForm/GeolocationCapture.tsx; then
    echo "✅ Botón muestra texto fijo 'Obteniendo ubicación...'"
else
    echo "❌ Botón NO muestra texto fijo"
    exit 1
fi

# Verificar loader en botón de recaptura
echo "✅ Verificando loader en botón de recaptura..."
if grep -q 'Recapturando\.\.\.' src/components/requestForm/GeolocationCapture.tsx; then
    echo "✅ Botón de recaptura muestra 'Recapturando...'"
else
    echo "❌ Botón de recaptura NO muestra texto de carga"
    exit 1
fi

if grep -q 'Loader2.*h-3 w-3.*animate-spin' src/components/requestForm/GeolocationCapture.tsx; then
    echo "✅ Botón de recaptura tiene loader"
else
    echo "❌ Botón de recaptura NO tiene loader"
    exit 1
fi

# Verificar mejoras en precisión GPS
echo "✅ Verificando mejoras en precisión GPS..."
if grep -q 'targetAccuracy = 10' src/components/requestForm/GeolocationCapture.tsx; then
    echo "✅ Precisión objetivo mejorada a 10m"
else
    echo "❌ Precisión objetivo NO mejorada"
    exit 1
fi

if grep -q 'timeout: 15000' src/components/requestForm/GeolocationCapture.tsx; then
    echo "✅ Timeout aumentado a 15 segundos"
else
    echo "❌ Timeout NO aumentado"
    exit 1
fi

# Verificar que no hay imports innecesarios
echo "✅ Verificando imports limpios..."
if ! grep -q 'import.*Badge' src/components/requestForm/CoordinateDisplay.tsx; then
    echo "✅ Import de Badge eliminado"
else
    echo "❌ Import de Badge aún está presente"
    exit 1
fi

if ! grep -q 'import.*Target' src/components/requestForm/CoordinateDisplay.tsx; then
    echo "✅ Import de Target eliminado"
else
    echo "❌ Import de Target aún está presente"
    exit 1
fi

echo ""
echo "🎉 Verificación completada exitosamente!"
echo ""
echo "📋 Correcciones implementadas:"
echo "1. ✅ Dark Mode en inputs de coordenadas (bg-muted text-foreground)"
echo "2. ✅ Dark Mode en labels (text-muted-foreground)"
echo "3. ✅ Dark Mode en sección de precisión (dark:bg-blue-950/20, dark:border-blue-800)"
echo "4. ✅ Dark Mode en texto de precisión (dark:text-blue-300)"
echo "5. ✅ Badge GPS eliminado completamente"
echo "6. ✅ Función getAccuracyStatus eliminada"
echo "7. ✅ Título duplicado eliminado del botón"
echo "8. ✅ Loader agregado al botón de recaptura"
echo "9. ✅ Precisión GPS mejorada (10m objetivo)"
echo "10. ✅ Timeout aumentado (15 segundos)"
echo "11. ✅ Imports innecesarios eliminados"
echo ""
echo "🎯 Mejoras de UX implementadas:"
echo "- ✅ Interfaz completamente adaptada a dark mode"
echo "- ✅ Solo muestra distancia aproximada (sin badges GPS)"
echo "- ✅ Título de captura no duplicado"
echo "- ✅ Feedback visual en recaptura con loader"
echo "- ✅ Mayor precisión GPS (10m objetivo vs 20m anterior)"
echo "- ✅ Más tiempo para estabilización (15s vs 10s anterior)"
echo "- ✅ Código más limpio sin imports innecesarios"
echo ""
echo "🧪 Para probar las correcciones:"
echo "1. Activar dark mode en la aplicación"
echo "2. Ir al paso 1 (Identificación) → sub-paso 2 (Contacto y Vivienda)"
echo "3. Hacer clic en 'Capturar Ubicación'"
echo "4. Verificar que los inputs de coordenadas se ven correctamente en dark mode"
echo "5. Verificar que los labels se ven correctamente en dark mode"
echo "6. Verificar que la sección de precisión se ve correctamente en dark mode"
echo "7. Verificar que solo aparece la distancia (ej: '35m') sin badge GPS"
echo "8. Verificar que el título de captura aparece solo una vez"
echo "9. Hacer clic en 'Recapturar' y verificar que aparece loader y texto 'Recapturando...'"
echo "10. Verificar que la precisión puede ser mejor que 35m con los nuevos parámetros"
echo ""
echo "🔧 Mejoras técnicas implementadas:"
echo "- Adaptación completa a dark mode usando variables CSS del sistema"
echo "- Eliminación de elementos visuales redundantes"
echo "- Mejor feedback visual para acciones del usuario"
echo "- Parámetros GPS optimizados para mayor precisión"
echo "- Código más limpio y mantenible"
echo "- Consistencia visual en toda la aplicación"
