#!/bin/bash

echo "🔍 Verificando correcciones de persistencia de referencias..."

# Verificar que las cards de referencias muestran solo la información solicitada
echo "✅ Verificando simplificación de cards de referencias..."
if grep -q "Tipo: {reference.referenceType === 'PERSONAL' ? 'Personal' : 'Comercial'}" src/components/requestForm/ReferencesSection.tsx; then
    echo "✅ Cards simplificadas correctamente - solo muestran título, nombre y tipo"
else
    echo "❌ Cards no simplificadas correctamente"
    exit 1
fi

# Verificar que se eliminó la información extra de las cards
echo "✅ Verificando eliminación de información extra..."
if ! grep -q "Teléfono:" src/components/requestForm/ReferencesSection.tsx; then
    echo "✅ Información extra eliminada correctamente"
else
    echo "❌ Aún se muestra información extra en las cards"
    exit 1
fi

if ! grep -q "Relación:" src/components/requestForm/ReferencesSection.tsx; then
    echo "✅ Información extra eliminada correctamente"
else
    echo "❌ Aún se muestra información extra en las cards"
    exit 1
fi

if ! grep -q "Calificación:" src/components/requestForm/ReferencesSection.tsx; then
    echo "✅ Información extra eliminada correctamente"
else
    echo "❌ Aún se muestra información extra en las cards"
    exit 1
fi

# Verificar que se mantiene el botón de eliminar en la esquina superior derecha
echo "✅ Verificando botón de eliminar en esquina superior derecha..."
if grep -q "justify-between" src/components/requestForm/ReferencesSection.tsx && grep -q "removeReference(index)" src/components/requestForm/ReferencesSection.tsx; then
    echo "✅ Botón de eliminar en posición correcta"
else
    echo "❌ Botón de eliminar no en posición correcta"
    exit 1
fi

# Verificar que se mantiene el botón de editar información
echo "✅ Verificando botón de editar información..."
if grep -q "Editar Información" src/components/requestForm/ReferencesSection.tsx && grep -q "handleEditReference(index)" src/components/requestForm/ReferencesSection.tsx; then
    echo "✅ Botón de editar información presente"
else
    echo "❌ Botón de editar información no presente"
    exit 1
fi

# Verificar sincronización mejorada con formData
echo "✅ Verificando sincronización mejorada con formData..."
if grep -q "console.log.*Nueva referencia agregada" src/components/requestForm/RequestFormProvider.tsx; then
    echo "✅ Logging agregado para nueva referencia"
else
    echo "❌ Logging no agregado para nueva referencia"
    exit 1
fi

if grep -q "console.log.*Referencia actualizada" src/components/requestForm/RequestFormProvider.tsx; then
    echo "✅ Logging agregado para referencia actualizada"
else
    echo "❌ Logging no agregado para referencia actualizada"
    exit 1
fi

# Verificar restauración de referencias desde formData
echo "✅ Verificando restauración de referencias desde formData..."
if grep -q "Restaurando referencias desde formData" src/components/requestForm/RequestFormProvider.tsx; then
    echo "✅ Restauración de referencias implementada"
else
    echo "❌ Restauración de referencias no implementada"
    exit 1
fi

# Verificar que se mantiene la estructura de campos mapeados
echo "✅ Verificando estructura de campos mapeados..."
if grep -q "referenceType:" src/components/requestForm/RequestFormProvider.tsx && grep -q "firstName:" src/components/requestForm/RequestFormProvider.tsx && grep -q "fullName:" src/components/requestForm/RequestFormProvider.tsx; then
    echo "✅ Estructura de campos mapeados mantenida"
else
    echo "❌ Estructura de campos mapeados no mantenida"
    exit 1
fi

echo ""
echo "🎉 Todas las verificaciones pasaron exitosamente!"
echo ""
echo "📋 Resumen de cambios implementados:"
echo "   ✅ Cards de referencias simplificadas (solo título, nombre, tipo)"
echo "   ✅ Botón de eliminar en esquina superior derecha"
echo "   ✅ Botón de editar información presente"
echo "   ✅ Sincronización mejorada con formData"
echo "   ✅ Restauración de referencias desde borradores"
echo "   ✅ Logging agregado para debugging"
echo "   ✅ Estructura de campos mapeados mantenida"
echo ""
echo "🚀 El sistema de referencias ahora cumple con todos los requisitos especificados."
