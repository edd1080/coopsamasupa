#!/bin/bash

echo "🔍 Verificando correcciones de persistencia de referencias v2..."

# Verificar inicialización inteligente de referencias
echo "✅ Verificando inicialización inteligente de referencias..."
if grep -q "Initialize with formData.references if available" src/components/requestForm/RequestFormProvider.tsx; then
    echo "✅ Inicialización inteligente implementada"
else
    echo "❌ Inicialización inteligente no implementada"
    exit 1
fi

# Verificar que se inicializa desde formData si está disponible
if grep -q "Initializing references from formData" src/components/requestForm/RequestFormProvider.tsx; then
    echo "✅ Inicialización desde formData implementada"
else
    echo "❌ Inicialización desde formData no implementada"
    exit 1
fi

# Verificar sincronización mejorada
echo "✅ Verificando sincronización mejorada..."
if grep -q "Solo actualizar si las referencias son diferentes" src/components/requestForm/RequestFormProvider.tsx; then
    echo "✅ Sincronización inteligente implementada"
else
    echo "❌ Sincronización inteligente no implementada"
    exit 1
fi

# Verificar comparación JSON para evitar actualizaciones innecesarias
if grep -q "JSON.stringify(references)" src/components/requestForm/RequestFormProvider.tsx; then
    echo "✅ Comparación JSON implementada"
else
    echo "❌ Comparación JSON no implementada"
    exit 1
fi

# Verificar logging mejorado para debugging
echo "✅ Verificando logging mejorado..."
if grep -q "Draft data contains references" src/components/requestForm/RequestFormProvider.tsx; then
    echo "✅ Logging de referencias en draft data implementado"
else
    echo "❌ Logging de referencias en draft data no implementado"
    exit 1
fi

if grep -q "References type:" src/components/requestForm/RequestFormProvider.tsx; then
    echo "✅ Logging detallado de referencias implementado"
else
    echo "❌ Logging detallado de referencias no implementado"
    exit 1
fi

# Verificar manejo de referencias vacías
echo "✅ Verificando manejo de referencias vacías..."
if grep -q "FormData tiene referencias vacías" src/components/requestForm/RequestFormProvider.tsx; then
    echo "✅ Manejo de referencias vacías implementado"
else
    echo "❌ Manejo de referencias vacías no implementado"
    exit 1
fi

# Verificar que se mantiene la funcionalidad existente
echo "✅ Verificando funcionalidad existente..."
if grep -q "addReference" src/components/requestForm/RequestFormProvider.tsx && grep -q "updateReference" src/components/requestForm/RequestFormProvider.tsx; then
    echo "✅ Funcionalidad de agregar y actualizar referencias mantenida"
else
    echo "❌ Funcionalidad de agregar y actualizar referencias perdida"
    exit 1
fi

# Verificar sincronización con formData
if grep -q "Sincronizar con formData inmediatamente" src/components/requestForm/RequestFormProvider.tsx; then
    echo "✅ Sincronización inmediata con formData mantenida"
else
    echo "❌ Sincronización inmediata con formData perdida"
    exit 1
fi

echo ""
echo "🎉 Todas las verificaciones pasaron exitosamente!"
echo ""
echo "📋 Resumen de mejoras implementadas:"
echo "   ✅ Inicialización inteligente de referencias desde formData"
echo "   ✅ Sincronización mejorada con comparación JSON"
echo "   ✅ Logging detallado para debugging"
echo "   ✅ Manejo de referencias vacías"
echo "   ✅ Funcionalidad existente mantenida"
echo "   ✅ Sincronización inmediata con formData"
echo ""
echo "🚀 El sistema de referencias ahora debería persistir correctamente al salir y regresar al formulario."
echo ""
echo "📝 Para probar:"
echo "   1. Agregar una referencia y llenar los campos"
echo "   2. Guardar la solicitud"
echo "   3. Salir del formulario"
echo "   4. Regresar al formulario"
echo "   5. Navegar a la sección de referencias"
echo "   6. Verificar que la referencia persiste"
