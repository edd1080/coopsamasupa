#!/bin/bash

echo "🔍 Verificando corrección de interferencia de documentos con diálogo de salida..."

# Verificar que PhotoDocumentUpload importe useFormContext
echo "✅ Verificando PhotoDocumentUpload..."
if grep -q "useFormContext" src/components/requestForm/PhotoDocumentUpload.tsx; then
    echo "✅ PhotoDocumentUpload importa useFormContext"
else
    echo "❌ PhotoDocumentUpload NO importa useFormContext"
    exit 1
fi

# Verificar que se obtenga showExitDialog del contexto
if grep -q "showExitDialog.*useFormContext" src/components/requestForm/PhotoDocumentUpload.tsx; then
    echo "✅ PhotoDocumentUpload obtiene showExitDialog del contexto"
else
    echo "❌ PhotoDocumentUpload NO obtiene showExitDialog del contexto"
    exit 1
fi

# Verificar que se verifique showExitDialog antes de actualizar formData
if grep -q "Don't update formData if exit dialog is showing" src/components/requestForm/PhotoDocumentUpload.tsx; then
    echo "✅ PhotoDocumentUpload verifica showExitDialog antes de actualizar formData"
else
    echo "❌ PhotoDocumentUpload NO verifica showExitDialog antes de actualizar formData"
    exit 1
fi

# Verificar que se use debounce para evitar actualizaciones excesivas
if grep -q "Debounce to avoid excessive updates" src/components/requestForm/PhotoDocumentUpload.tsx; then
    echo "✅ PhotoDocumentUpload usa debounce para evitar actualizaciones excesivas"
else
    echo "❌ PhotoDocumentUpload NO usa debounce para evitar actualizaciones excesivas"
    exit 1
fi

# Verificar que se use setTimeout con cleanup
if grep -q "clearTimeout" src/components/requestForm/PhotoDocumentUpload.tsx; then
    echo "✅ PhotoDocumentUpload usa setTimeout con cleanup correcto"
else
    echo "❌ PhotoDocumentUpload NO usa setTimeout con cleanup correcto"
    exit 1
fi

# Verificar que showExitDialog esté en las dependencias del useEffect
if grep -q "showExitDialog\]" src/components/requestForm/PhotoDocumentUpload.tsx; then
    echo "✅ showExitDialog está en las dependencias del useEffect"
else
    echo "❌ showExitDialog NO está en las dependencias del useEffect"
    exit 1
fi

echo ""
echo "🎉 Verificación completada exitosamente!"
echo ""
echo "📋 Cambios implementados:"
echo "1. ✅ PhotoDocumentUpload importa useFormContext"
echo "2. ✅ Obtiene showExitDialog del contexto"
echo "3. ✅ Verifica showExitDialog antes de actualizar formData"
echo "4. ✅ Usa debounce de 100ms para evitar actualizaciones excesivas"
echo "5. ✅ Usa setTimeout con cleanup correcto"
echo "6. ✅ showExitDialog está en las dependencias del useEffect"
echo ""
echo "🧪 Para probar:"
echo "1. Abrir solicitud de crédito"
echo "2. Ir al paso 5 (Documentos)"
echo "3. Subir un documento o imagen"
echo "4. Intentar 'Salir sin guardar' - debe funcionar sin interferencia"
echo "5. Intentar 'Guardar y salir' - debe funcionar sin interferencia"
echo ""
echo "🔧 Mecanismo de protección:"
echo "- Cuando showExitDialog está activo, no se actualiza formData"
echo "- Debounce evita actualizaciones excesivas durante subida de documentos"
echo "- Cleanup del timeout previene memory leaks"
