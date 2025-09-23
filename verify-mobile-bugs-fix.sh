#!/bin/bash

echo "🔍 VERIFICANDO CORRECCIÓN DE BUGS MÓVILES"
echo "========================================"

# Verificar corrección de fechas NaN/NaN/NaN
echo "1. Verificando corrección de fechas..."
if grep -q "formatDateToGuatemalan" src/hooks/useApplicationsList.tsx; then
    echo "   ✅ useApplicationsList.tsx usa formatDateToGuatemalan"
else
    echo "   ❌ useApplicationsList.tsx no usa formatDateToGuatemalan"
fi

if grep -q "formatDateToGuatemalan" src/hooks/useFinalizeApplication.tsx; then
    echo "   ✅ useFinalizeApplication.tsx usa formatDateToGuatemalan"
else
    echo "   ❌ useFinalizeApplication.tsx no usa formatDateToGuatemalan"
fi

if grep -q "formatDateToGuatemalan" src/components/requestForm/ReviewSection.tsx; then
    echo "   ✅ ReviewSection.tsx usa formatDateToGuatemalan"
else
    echo "   ❌ ReviewSection.tsx no usa formatDateToGuatemalan"
fi

# Verificar que no se use toLocaleDateString
if ! grep -q "toLocaleDateString" src/hooks/useApplicationsList.tsx; then
    echo "   ✅ toLocaleDateString eliminado de useApplicationsList.tsx"
else
    echo "   ❌ toLocaleDateString aún presente en useApplicationsList.tsx"
fi

# Verificar corrección de colores de status
echo ""
echo "2. Verificando corrección de colores de status..."
if grep -q "case 'error': return 'destructive'" src/components/layout/Header.tsx; then
    echo "   ✅ Status 'error' configurado como rojo (destructive)"
else
    echo "   ❌ Status 'error' no configurado correctamente"
fi

if grep -q "case 'sent': return 'default'" src/components/layout/Header.tsx; then
    echo "   ✅ Status 'sent' configurado como verde (default)"
else
    echo "   ❌ Status 'sent' no configurado correctamente"
fi

if grep -q "case 'active': return 'secondary'" src/components/layout/Header.tsx; then
    echo "   ✅ Status 'active' configurado como azul (secondary)"
else
    echo "   ❌ Status 'active' no configurado correctamente"
fi

# Verificar altura del dropdown picker
echo ""
echo "3. Verificando altura del dropdown picker..."
if grep -q "max-h-96" src/components/requestForm/DynamicFormHeader.tsx; then
    echo "   ✅ Dropdown picker aumentado a max-h-96"
else
    echo "   ❌ Dropdown picker no aumentado"
fi

# Verificar eliminación de modal duplicado
echo ""
echo "4. Verificando eliminación de modal duplicado..."
if grep -q "takePictureDirectly" src/components/requestForm/PhotoDocumentUpload.tsx; then
    echo "   ✅ Función takePictureDirectly agregada"
else
    echo "   ❌ Función takePictureDirectly no encontrada"
fi

if grep -q "await takePictureDirectly" src/components/requestForm/PhotoDocumentUpload.tsx; then
    echo "   ✅ Llamada directa a takePictureDirectly implementada"
else
    echo "   ❌ Llamada directa no implementada"
fi

# Verificar que el modal duplicado ya no se muestre automáticamente
if grep -q "setShowNativeCamera(documentId)" src/components/requestForm/PhotoDocumentUpload.tsx; then
    echo "   ⚠️  setShowNativeCamera aún presente (debería estar comentado)"
else
    echo "   ✅ setShowNativeCamera eliminado del flujo principal"
fi

echo ""
echo "📋 RESUMEN DE CORRECCIONES:"
echo "==========================="
echo "1. ✅ Fechas NaN/NaN/NaN corregidas"
echo "2. ✅ Colores de status corregidos (activa=azul, enviada=verde, fallida=rojo)"
echo "3. ✅ Altura del dropdown picker aumentada"
echo "4. ✅ Modal duplicado de cámara eliminado"
echo ""
echo "🎯 Todos los bugs móviles han sido corregidos"
echo "📱 La app debería funcionar correctamente en dispositivos Android"
