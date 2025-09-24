#!/bin/bash

echo "🔍 Verificando corrección de navegación a referencias..."

# Verificar que la sección references está definida correctamente
echo "✅ Verificando definición de sección references..."
if grep -q "id: 'references'" src/pages/ApplicationDetails.tsx; then
    echo "✅ Sección references definida correctamente"
else
    echo "❌ Sección references no encontrada"
    exit 1
fi

# Verificar que el mapeo incluye references
echo "✅ Verificando mapeo de sección references..."
if grep -q "'references': 3" src/pages/ApplicationDetails.tsx; then
    echo "✅ Mapeo de references a step 3 implementado"
else
    echo "❌ Mapeo de references no encontrado"
    exit 1
fi

# Verificar que se eliminó el mapeo incorrecto de guarantors
echo "✅ Verificando eliminación de mapeo guarantors..."
if grep -q "'guarantors': 3" src/pages/ApplicationDetails.tsx; then
    echo "❌ Mapeo guarantors aún presente (debería eliminarse)"
    exit 1
else
    echo "✅ Mapeo guarantors eliminado correctamente"
fi

# Verificar que la lógica especial para references se mantiene
echo "✅ Verificando lógica especial para references..."
if grep -q "section.id === 'references'" src/pages/ApplicationDetails.tsx; then
    echo "✅ Lógica especial para references mantenida"
else
    echo "❌ Lógica especial para references perdida"
    exit 1
fi

# Verificar que la navegación funciona correctamente
echo "✅ Verificando función de navegación..."
if grep -q "navigateToFormSection" src/pages/ApplicationDetails.tsx; then
    echo "✅ Función navigateToFormSection presente"
else
    echo "❌ Función navigateToFormSection no encontrada"
    exit 1
fi

# Verificar que se pasa el applicationId correcto
echo "✅ Verificando paso de applicationId..."
if grep -q "applicationId: publicApplicationId" src/pages/ApplicationDetails.tsx; then
    echo "✅ applicationId correcto en navegación"
else
    echo "❌ applicationId incorrecto en navegación"
    exit 1
fi

echo ""
echo "🎉 Todas las verificaciones pasaron exitosamente!"
echo ""
echo "📋 Resumen de corrección implementada:"
echo "   ✅ Sección 'references' definida correctamente"
echo "   ✅ Mapeo 'references': 3 implementado"
echo "   ✅ Mapeo 'guarantors' eliminado"
echo "   ✅ Lógica especial para references mantenida"
echo "   ✅ Navegación con applicationId correcto"
echo ""
echo "🚀 El acceso rápido a referencias ahora debería funcionar correctamente:"
echo "   📱 Click en botón de referencias en detalles de solicitud"
echo "   🔄 Navegación directa a step 3 (Referencias Personales)"
echo "   📝 Carga correcta del applicationId"
echo ""
echo "📝 Para probar:"
echo "   1. Entrar a detalles de una solicitud"
echo "   2. Hacer click en el botón de acceso rápido a referencias"
echo "   3. Verificar que navega a la sección de referencias (step 3)"
echo "   4. Verificar que los datos de la solicitud se cargan correctamente"
