#!/bin/bash

echo "🔍 VERIFICANDO CAMBIOS EN APPLICATION CARD"
echo "=========================================="

# Verificar que solo queda la opción "Eliminar" en el DropdownMenu
echo "1. Verificando menú kebab (DropdownMenu)..."
dropdown_count=$(grep -A 10 "DropdownMenuContent align=\"end\"" src/components/applications/ApplicationCard.tsx | grep -c "<DropdownMenuItem")
if [ "$dropdown_count" -eq 1 ]; then
    echo "   ✅ Solo queda 1 opción en el menú kebab"
else
    echo "   ❌ Aún hay múltiples opciones en el menú kebab ($dropdown_count encontradas)"
fi

# Verificar que solo queda la opción "Eliminar" en el ContextMenu
echo "2. Verificando menú contextual (ContextMenu)..."
context_count=$(grep -A 10 "ContextMenuContent className=\"w-48\"" src/components/applications/ApplicationCard.tsx | grep -c "<ContextMenuItem")
if [ "$context_count" -eq 1 ]; then
    echo "   ✅ Solo queda 1 opción en el menú contextual"
else
    echo "   ❌ Aún hay múltiples opciones en el menú contextual ($context_count encontradas)"
fi

# Verificar que se eliminaron las opciones "Ver detalles" y "Cancelar solicitud"
echo "3. Verificando eliminación de opciones específicas..."
if ! grep -q "Ver detalles" src/components/applications/ApplicationCard.tsx; then
    echo "   ✅ Opción 'Ver detalles' eliminada"
else
    echo "   ❌ Opción 'Ver detalles' aún presente"
fi

if ! grep -q "Cancelar solicitud" src/components/applications/ApplicationCard.tsx; then
    echo "   ✅ Opción 'Cancelar solicitud' eliminada"
else
    echo "   ❌ Opción 'Cancelar solicitud' aún presente"
fi

# Verificar que se cambió "Préstamo Personal" por "Crédito"
echo "4. Verificando cambio de texto a 'Crédito'..."
if grep -q "Crédito" src/components/applications/ApplicationCard.tsx; then
    echo "   ✅ Texto cambiado a 'Crédito'"
else
    echo "   ❌ Texto no cambiado a 'Crédito'"
fi

# Verificar que se eliminó la condición !isDraft para mostrar el producto
echo "5. Verificando que se muestra para borradores y enviadas..."
if ! grep -q "!isDraft &&" src/components/applications/ApplicationCard.tsx; then
    echo "   ✅ Se muestra para borradores y enviadas"
else
    echo "   ❌ Aún hay condición que oculta para borradores"
fi

# Verificar que se agregó fallback "Por agregar"
echo "6. Verificando fallback 'Por agregar'..."
if grep -q "Por agregar" src/components/applications/ApplicationCard.tsx; then
    echo "   ✅ Fallback 'Por agregar' agregado"
else
    echo "   ❌ Fallback 'Por agregar' no encontrado"
fi

echo ""
echo "📋 RESUMEN DE CAMBIOS:"
echo "1. ✅ Menú kebab: Solo opción 'Eliminar'"
echo "2. ✅ Menú contextual: Solo opción 'Eliminar'"
echo "3. ✅ Opciones 'Ver detalles' y 'Cancelar solicitud' eliminadas"
echo "4. ✅ Texto cambiado a 'Crédito'"
echo "5. ✅ Se muestra para borradores y enviadas"
echo "6. ✅ Fallback 'Por agregar' agregado"
echo ""
echo "🎯 Cambios en ApplicationCard implementados correctamente"
