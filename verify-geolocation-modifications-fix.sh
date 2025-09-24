#!/bin/bash

echo "🔍 Verificando modificaciones del componente de geolocalización"
echo "=============================================================="

# Verificar que el botón "Compartir" tiene tamaño más pequeño
echo "✅ Verificando botón 'Compartir'..."
if grep -q 'h-6 px-2 text-xs' src/components/requestForm/LocationShare.tsx; then
    echo "✅ Botón 'Compartir' tiene tamaño más pequeño (h-6 px-2 text-xs)"
else
    echo "❌ Botón 'Compartir' NO tiene tamaño más pequeño"
    exit 1
fi

if grep -q 'gap-1' src/components/requestForm/LocationShare.tsx; then
    echo "✅ Botón 'Compartir' tiene gap reducido (gap-1)"
else
    echo "❌ Botón 'Compartir' NO tiene gap reducido"
    exit 1
fi

# Verificar que el título "Ubicación Capturada" está simplificado
echo "✅ Verificando título 'Ubicación Capturada'..."
if grep -q 'font-bold text-green-700' src/components/requestForm/GeolocationCapture.tsx; then
    echo "✅ Título 'Ubicación Capturada' es bold"
else
    echo "❌ Título 'Ubicación Capturada' NO es bold"
    exit 1
fi

if grep -q 'Ubicación Capturada' src/components/requestForm/GeolocationCapture.tsx; then
    echo "✅ Título 'Ubicación Capturada' presente"
    # Verificar que el título del componente (no del toast) está simplificado
    if grep -A3 -B3 'text-sm font-bold text-green-700' src/components/requestForm/GeolocationCapture.tsx | grep -q 'Ubicación Capturada' && ! grep -A3 -B3 'text-sm font-bold text-green-700' src/components/requestForm/GeolocationCapture.tsx | grep -q 'GPS Preciso\|GPS Aprox'; then
        echo "✅ Título simplificado a solo 'Ubicación Capturada'"
    else
        echo "❌ Título del componente aún contiene información de GPS"
        exit 1
    fi
else
    echo "❌ Título 'Ubicación Capturada' NO está presente"
    exit 1
fi

# Verificar que el icono está al lado izquierdo del título
if grep -q 'flex items-center gap-2' src/components/requestForm/GeolocationCapture.tsx && grep -q 'CheckCircle.*h-4 w-4.*text-green-600' src/components/requestForm/GeolocationCapture.tsx; then
    echo "✅ Icono está al lado izquierdo del título"
else
    echo "❌ Icono NO está al lado izquierdo del título"
    exit 1
fi

# Verificar que se eliminó el texto "Ubicación capturada con GPS aproximado"
echo "✅ Verificando eliminación de texto redundante..."
if ! grep -q 'Ubicación capturada con GPS aproximado\|Ubicación capturada con precisión GPS' src/components/requestForm/CoordinateDisplay.tsx; then
    echo "✅ Texto 'Ubicación capturada con GPS aproximado' eliminado"
else
    echo "❌ Texto 'Ubicación capturada con GPS aproximado' NO eliminado"
    exit 1
fi

# Verificar que se eliminaron los iconos de latitud y longitud
echo "✅ Verificando eliminación de iconos..."
if ! grep -q 'Target.*h-3 w-3.*text-blue-500' src/components/requestForm/CoordinateDisplay.tsx; then
    echo "✅ Iconos de latitud y longitud eliminados"
else
    echo "❌ Iconos de latitud y longitud NO eliminados"
    exit 1
fi

# Verificar que los títulos de latitud y longitud están sin iconos
if grep -q 'Latitud' src/components/requestForm/CoordinateDisplay.tsx && grep -q 'Longitud' src/components/requestForm/CoordinateDisplay.tsx; then
    echo "✅ Títulos 'Latitud' y 'Longitud' presentes sin iconos"
else
    echo "❌ Títulos 'Latitud' y 'Longitud' NO están presentes"
    exit 1
fi

# Verificar que no hay elementos flex con gap para los títulos
if ! grep -q 'flex items-center gap-1' src/components/requestForm/CoordinateDisplay.tsx; then
    echo "✅ Títulos de coordenadas sin elementos flex e iconos"
else
    echo "❌ Títulos de coordenadas aún tienen elementos flex"
    exit 1
fi

echo ""
echo "🎉 Verificación completada exitosamente!"
echo ""
echo "📋 Modificaciones implementadas:"
echo "1. ✅ Botón 'Compartir': Tamaño reducido (h-6 px-2 text-xs)"
echo "2. ✅ Botón 'Compartir': Gap reducido (gap-1)"
echo "3. ✅ Título 'Ubicación Capturada': Simplificado y en bold"
echo "4. ✅ Título 'Ubicación Capturada': Icono al lado izquierdo"
echo "5. ✅ Texto redundante: 'Ubicación capturada con GPS aproximado' eliminado"
echo "6. ✅ Iconos de coordenadas: Eliminados de títulos 'Latitud' y 'Longitud'"
echo "7. ✅ Títulos de coordenadas: Simplificados sin elementos flex"
echo ""
echo "🎯 Cambios visuales implementados:"
echo "- ✅ Botón 'Compartir' más compacto y con texto más pequeño"
echo "- ✅ Título 'Ubicación Capturada' en bold y simplificado"
echo "- ✅ Icono de check verde al lado izquierdo del título"
echo "- ✅ Eliminación de texto redundante sobre GPS"
echo "- ✅ Títulos 'Latitud' y 'Longitud' sin iconos"
echo "- ✅ Interfaz más limpia y minimalista"
echo ""
echo "🧪 Para probar las modificaciones:"
echo "1. Ir al paso 1 (Identificación) → sub-paso 2 (Contacto y Vivienda)"
echo "2. Hacer clic en 'Capturar Ubicación'"
echo "3. Verificar que el botón 'Compartir' es más pequeño"
echo "4. Verificar que el título dice solo 'Ubicación Capturada' en bold"
echo "5. Verificar que el icono verde está al lado izquierdo del título"
echo "6. Verificar que no aparece texto sobre GPS aproximado"
echo "7. Verificar que los títulos 'Latitud' y 'Longitud' no tienen iconos"
echo ""
echo "🔧 Mejoras técnicas implementadas:"
echo "- Interfaz más limpia y minimalista"
echo "- Reducción de elementos visuales redundantes"
echo "- Mejor jerarquía visual con títulos en bold"
echo "- Botón de compartir más compacto"
echo "- Eliminación de información duplicada"
echo "- Simplificación de la presentación de coordenadas"
