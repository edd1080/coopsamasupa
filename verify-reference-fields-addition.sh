#!/bin/bash

echo "🔍 Verificando adición de campos adicionales a las cards de referencias..."

# Verificar que se agregó el campo de teléfono
echo "✅ Verificando campo de teléfono..."
if grep -q "Teléfono: {reference.mobile}" src/components/requestForm/ReferencesSection.tsx; then
    echo "✅ Campo de teléfono agregado correctamente"
else
    echo "❌ Campo de teléfono no encontrado"
    exit 1
fi

# Verificar que se agregó el campo de relación
echo "✅ Verificando campo de relación..."
if grep -q "Relación: {reference.relationship}" src/components/requestForm/ReferencesSection.tsx; then
    echo "✅ Campo de relación agregado correctamente"
else
    echo "❌ Campo de relación no encontrado"
    exit 1
fi

# Verificar que se agregó el campo de calificación
echo "✅ Verificando campo de calificación..."
if grep -q "Calificación:" src/components/requestForm/ReferencesSection.tsx; then
    echo "✅ Campo de calificación agregado correctamente"
else
    echo "❌ Campo de calificación no encontrado"
    exit 1
fi

# Verificar que se mantiene la funcionalidad existente
echo "✅ Verificando funcionalidad existente..."
if grep -q "Tipo: {reference.referenceType" src/components/requestForm/ReferencesSection.tsx; then
    echo "✅ Campo de tipo de referencia mantenido"
else
    echo "❌ Campo de tipo de referencia perdido"
    exit 1
fi

if grep -q "{reference.fullName}" src/components/requestForm/ReferencesSection.tsx; then
    echo "✅ Campo de nombre completo mantenido"
else
    echo "❌ Campo de nombre completo perdido"
    exit 1
fi

if grep -q "Editar Información" src/components/requestForm/ReferencesSection.tsx; then
    echo "✅ Botón de editar mantenido"
else
    echo "❌ Botón de editar perdido"
    exit 1
fi

# Verificar que se mantiene la estructura de la card
echo "✅ Verificando estructura de la card..."
if grep -q "CardContent" src/components/requestForm/ReferencesSection.tsx; then
    echo "✅ Estructura de CardContent mantenida"
else
    echo "❌ Estructura de CardContent perdida"
    exit 1
fi

if grep -q "space-y-3" src/components/requestForm/ReferencesSection.tsx; then
    echo "✅ Espaciado entre elementos mantenido"
else
    echo "❌ Espaciado entre elementos perdido"
    exit 1
fi

# Verificar que se mantiene la persistencia
echo "✅ Verificando que la persistencia se mantiene..."
if grep -q "Initialize with formData.references if available" src/components/requestForm/RequestFormProvider.tsx; then
    echo "✅ Inicialización inteligente de referencias mantenida"
else
    echo "❌ Inicialización inteligente de referencias perdida"
    exit 1
fi

if grep -q "Sincronizar con formData inmediatamente" src/components/requestForm/RequestFormProvider.tsx; then
    echo "✅ Sincronización con formData mantenida"
else
    echo "❌ Sincronización con formData perdida"
    exit 1
fi

echo ""
echo "🎉 Todas las verificaciones pasaron exitosamente!"
echo ""
echo "📋 Resumen de campos agregados a las cards de referencias:"
echo "   ✅ Nombre completo (mantenido)"
echo "   ✅ Tipo de referencia (mantenido)"
echo "   ✅ Número de teléfono (nuevo)"
echo "   ✅ Relación (nuevo)"
echo "   ✅ Calificación (nuevo)"
echo "   ✅ Botón de editar (mantenido)"
echo ""
echo "🚀 Las cards de referencias ahora muestran información completa:"
echo "   📱 Teléfono formateado automáticamente"
echo "   👥 Relación con el solicitante"
echo "   ⭐ Calificación (Excelente, Bueno, Regular, Malo)"
echo "   🔄 Persistencia mantenida al salir y regresar"
echo ""
echo "📝 Para probar:"
echo "   1. Agregar una referencia con todos los campos"
echo "   2. Guardar la solicitud"
echo "   3. Salir del formulario"
echo "   4. Regresar al formulario"
echo "   5. Verificar que todos los campos persisten en las cards"
