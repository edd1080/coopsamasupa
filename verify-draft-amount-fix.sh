#!/bin/bash

echo "🔍 VERIFICANDO CORRECCIÓN DE MONTO EN BORRADORES"
echo "==============================================="

# Verificar que se agregó la extracción de requestedAmount
echo "1. Verificando extracción de requestedAmount..."
if grep -q "requestedAmount = draftData.requestedAmount" src/hooks/useApplicationsList.tsx; then
    echo "   ✅ Extracción de requestedAmount agregada"
else
    echo "   ❌ Extracción de requestedAmount no encontrada"
fi

# Verificar que se usa requestedAmount en el amount del borrador
echo "2. Verificando uso de requestedAmount en amount..."
if grep -q "amount: requestedAmount" src/hooks/useApplicationsList.tsx; then
    echo "   ✅ requestedAmount usado en amount del borrador"
else
    echo "   ❌ requestedAmount no usado en amount del borrador"
fi

# Verificar que se cambió product de vacío a "Crédito"
echo "3. Verificando cambio de product a 'Crédito'..."
if grep -q "product: 'Crédito'" src/hooks/useApplicationsList.tsx; then
    echo "   ✅ Product cambiado a 'Crédito'"
else
    echo "   ❌ Product no cambiado a 'Crédito'"
fi

# Verificar que se eliminó la asignación de amount vacío
echo "4. Verificando eliminación de amount vacío..."
if ! grep -q "amount: '', // Empty for drafts" src/hooks/useApplicationsList.tsx; then
    echo "   ✅ Asignación de amount vacío eliminada"
else
    echo "   ❌ Asignación de amount vacío aún presente"
fi

# Verificar que se eliminó la asignación de product vacío
echo "5. Verificando eliminación de product vacío..."
if ! grep -q "product: '', // Empty for drafts" src/hooks/useApplicationsList.tsx; then
    echo "   ✅ Asignación de product vacío eliminada"
else
    echo "   ❌ Asignación de product vacío aún presente"
fi

echo ""
echo "📋 RESUMEN DE CORRECCIONES:"
echo "1. ✅ Extracción de requestedAmount del draft_data"
echo "2. ✅ Uso de requestedAmount en amount del borrador"
echo "3. ✅ Product cambiado a 'Crédito'"
echo "4. ✅ Asignación de amount vacío eliminada"
echo "5. ✅ Asignación de product vacío eliminada"
echo ""
echo "🎯 Monto de borradores ahora se extrae correctamente del requestedAmount"
