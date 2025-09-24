#!/bin/bash

echo "🔍 Verificando eliminación de card de referencias personales"
echo "============================================================"

# Verificar que la card de referencias personales fue eliminada (no la definición de sección)
echo "✅ Verificando eliminación de card de referencias personales..."
if ! grep -q "CardTitle.*Referencias Personales" src/pages/ApplicationDetails.tsx; then
    echo "✅ Card 'Referencias Personales' eliminada correctamente"
else
    echo "❌ Card 'Referencias Personales' aún está presente"
    exit 1
fi

# Verificar que no hay mapeo de referencias
echo "✅ Verificando eliminación de mapeo de referencias..."
if ! grep -q "references.map" src/pages/ApplicationDetails.tsx; then
    echo "✅ Mapeo de referencias eliminado correctamente"
else
    echo "❌ Mapeo de referencias aún está presente"
    exit 1
fi

# Verificar que no hay botones de agregar referencias
echo "✅ Verificando eliminación de botones de agregar referencias..."
if ! grep -q "Agregar Referencias" src/pages/ApplicationDetails.tsx; then
    echo "✅ Botones de agregar referencias eliminados correctamente"
else
    echo "❌ Botones de agregar referencias aún están presentes"
    exit 1
fi

# Verificar que no hay lógica de referencias vacías
echo "✅ Verificando eliminación de lógica de referencias vacías..."
if ! grep -q "references.length === 0" src/pages/ApplicationDetails.tsx; then
    echo "✅ Lógica de referencias vacías eliminada correctamente"
else
    echo "❌ Lógica de referencias vacías aún está presente"
    exit 1
fi

# Verificar que no hay construcción de fullName para referencias
echo "✅ Verificando eliminación de construcción de fullName para referencias..."
if ! grep -q "reference.firstName.*reference.firstLastName" src/pages/ApplicationDetails.tsx; then
    echo "✅ Construcción de fullName para referencias eliminada correctamente"
else
    echo "❌ Construcción de fullName para referencias aún está presente"
    exit 1
fi

# Verificar que no hay mapeo de tipo de referencia
echo "✅ Verificando eliminación de mapeo de tipo de referencia..."
if ! grep -q "referenceType.*reference.referenceType" src/pages/ApplicationDetails.tsx; then
    echo "✅ Mapeo de tipo de referencia eliminado correctamente"
else
    echo "❌ Mapeo de tipo de referencia aún está presente"
    exit 1
fi

# Verificar que no hay mapeo de teléfono
echo "✅ Verificando eliminación de mapeo de teléfono..."
if ! grep -q "phone.*reference.mobile" src/pages/ApplicationDetails.tsx; then
    echo "✅ Mapeo de teléfono eliminado correctamente"
else
    echo "❌ Mapeo de teléfono aún está presente"
    exit 1
fi

# Verificar que no hay límite de 3 referencias
echo "✅ Verificando eliminación de límite de 3 referencias..."
if ! grep -q "references.length < 3" src/pages/ApplicationDetails.tsx; then
    echo "✅ Límite de 3 referencias eliminado correctamente"
else
    echo "❌ Límite de 3 referencias aún está presente"
    exit 1
fi

# Verificar que no hay mensaje de máximo alcanzado
echo "✅ Verificando eliminación de mensaje de máximo alcanzado..."
if ! grep -q "Máximo de 3 referencias alcanzado" src/pages/ApplicationDetails.tsx; then
    echo "✅ Mensaje de máximo alcanzado eliminado correctamente"
else
    echo "❌ Mensaje de máximo alcanzado aún está presente"
    exit 1
fi

# Verificar que la variable references sigue existiendo (para otras funcionalidades)
echo "✅ Verificando que la variable references sigue existiendo para otras funcionalidades..."
if grep -q "const references = formData.references" src/pages/ApplicationDetails.tsx; then
    echo "✅ Variable references mantenida para otras funcionalidades"
else
    echo "❌ Variable references eliminada (puede afectar otras funcionalidades)"
    exit 1
fi

# Verificar que los iconos Users y Plus siguen importados (para otras funcionalidades)
echo "✅ Verificando que los iconos Users y Plus siguen importados..."
if grep -q "Users.*Plus" src/pages/ApplicationDetails.tsx; then
    echo "✅ Iconos Users y Plus mantenidos para otras funcionalidades"
else
    echo "❌ Iconos Users y Plus eliminados (puede afectar otras funcionalidades)"
    exit 1
fi

echo ""
echo "🎉 Verificación completada exitosamente!"
echo ""
echo "📋 Card de referencias personales eliminada completamente:"
echo "1. ✅ Título 'Referencias Personales' eliminado"
echo "2. ✅ Mapeo de referencias (references.map) eliminado"
echo "3. ✅ Botones 'Agregar Referencias' eliminados"
echo "4. ✅ Lógica de referencias vacías eliminada"
echo "5. ✅ Construcción de fullName para referencias eliminada"
echo "6. ✅ Mapeo de tipo de referencia eliminado"
echo "7. ✅ Mapeo de teléfono eliminado"
echo "8. ✅ Límite de 3 referencias eliminado"
echo "9. ✅ Mensaje de máximo alcanzado eliminado"
echo ""
echo "🔧 Funcionalidades mantenidas:"
echo "- ✅ Variable references mantenida para otras funcionalidades"
echo "- ✅ Iconos Users y Plus mantenidos para otras funcionalidades"
echo "- ✅ Estructura general del archivo preservada"
echo ""
echo "🧪 Para probar la eliminación:"
echo "1. Ir a la pantalla de detalles de cualquier solicitud"
echo "2. Verificar que NO aparece la card 'Referencias Personales'"
echo "3. Verificar que NO aparecen botones de agregar referencias"
echo "4. Verificar que NO aparece información de referencias"
echo "5. Verificar que las otras cards siguen funcionando correctamente"
echo ""
echo "📝 Próximos pasos sugeridos:"
echo "- Implementar nueva funcionalidad de referencias si es necesaria"
echo "- Verificar que no hay dependencias rotas en otras partes del código"
echo "- Actualizar documentación si es necesario"
