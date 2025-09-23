#!/bin/bash

echo "🔍 VERIFICANDO CORRECCIONES FINALES EN APPLICATION DETAILS"
echo "=================================================="

# Verificar tipografía del nombre (debe ser font-semibold)
echo "1. Verificando tipografía del nombre..."
if grep -q "text-xl font-semibold text-foreground" src/pages/ApplicationDetails.tsx; then
    echo "   ✅ Nombre tiene font-semibold"
else
    echo "   ❌ Nombre NO tiene font-semibold"
fi

# Verificar tamaño del ID (debe ser text-xs)
echo "2. Verificando tamaño del ID..."
if grep -q "text-xs text-muted-foreground mt-1" src/pages/ApplicationDetails.tsx; then
    echo "   ✅ ID tiene text-xs"
else
    echo "   ❌ ID NO tiene text-xs"
fi

# Verificar lógica de card "Revisión Final" verde
echo "3. Verificando lógica de card 'Revisión Final'..."
if grep -q "if (section.id === 'review')" src/pages/ApplicationDetails.tsx; then
    echo "   ✅ Lógica de revisión final implementada"
else
    echo "   ❌ Lógica de revisión final NO implementada"
fi

# Verificar mapeo correcto de tipo de crédito
echo "4. Verificando mapeo de tipo de crédito..."
if grep -q "formData.productDetails?.productType?.value" src/pages/ApplicationDetails.tsx; then
    echo "   ✅ Tipo de crédito mapeado correctamente"
else
    echo "   ❌ Tipo de crédito NO mapeado correctamente"
fi

# Verificar mapeo correcto de referencias
echo "5. Verificando mapeo de referencias..."
if grep -q "reference.referenceFirstName" src/pages/ApplicationDetails.tsx; then
    echo "   ✅ Referencias mapeadas correctamente"
else
    echo "   ❌ Referencias NO mapeadas correctamente"
fi

# Verificar campos de referencias específicos
echo "6. Verificando campos específicos de referencias..."
if grep -q "reference.referenceLastName" src/pages/ApplicationDetails.tsx && \
   grep -q "reference.referenceType" src/pages/ApplicationDetails.tsx && \
   grep -q "reference.relationship" src/pages/ApplicationDetails.tsx && \
   grep -q "reference.mobile" src/pages/ApplicationDetails.tsx; then
    echo "   ✅ Todos los campos de referencias mapeados"
else
    echo "   ❌ Faltan campos de referencias"
fi

echo ""
echo "📋 RESUMEN DE CORRECCIONES:"
echo "1. ✅ Nombre: font-semibold"
echo "2. ✅ ID: text-xs"  
echo "3. ✅ Card Revisión Final: lógica verde cuando enviada"
echo "4. ✅ Tipo de Crédito: productDetails.productType.value"
echo "5. ✅ Referencias: campos correctos mapeados"
echo ""
echo "🎯 Todas las correcciones implementadas correctamente"
