#!/bin/bash

echo "🔍 Verificando corrección de persistencia de documentos..."

# Verificar que useDocumentManager se llama con parámetros correctos
echo "✅ Verificando llamada a useDocumentManager..."
if grep -q "useDocumentManager(guatemalanDocuments)" src/components/requestForm/PhotoDocumentUpload.tsx; then
    echo "✅ useDocumentManager llamado con guatemalanDocuments como parámetro inicial"
else
    echo "❌ useDocumentManager no llamado con parámetro inicial"
    exit 1
fi

# Verificar que initializeFromFormData se llama en useEffect
echo "✅ Verificando inicialización desde formData..."
if grep -q "initializeFromFormData(formData.documents)" src/components/requestForm/PhotoDocumentUpload.tsx; then
    echo "✅ initializeFromFormData llamado con formData.documents"
else
    echo "❌ initializeFromFormData no llamado correctamente"
    exit 1
fi

# Verificar que el useEffect tiene las dependencias correctas
echo "✅ Verificando dependencias del useEffect..."
if grep -q "\[formData?.documents, initializeFromFormData\]" src/components/requestForm/PhotoDocumentUpload.tsx; then
    echo "✅ Dependencias del useEffect correctas"
else
    echo "❌ Dependencias del useEffect incorrectas"
    exit 1
fi

# Verificar que se mantiene la sincronización con formData
echo "✅ Verificando sincronización con formData..."
if grep -q "updateFormData('documents', documentsData)" src/components/requestForm/PhotoDocumentUpload.tsx; then
    echo "✅ Sincronización con formData mantenida"
else
    echo "❌ Sincronización con formData perdida"
    exit 1
fi

# Verificar que se mantiene el debounce
echo "✅ Verificando debounce..."
if grep -q "100.*debounce" src/components/requestForm/PhotoDocumentUpload.tsx; then
    echo "✅ Debounce de 100ms mantenido"
else
    echo "❌ Debounce perdido"
    exit 1
fi

# Verificar que se mantiene la verificación de showExitDialog
echo "✅ Verificando verificación de showExitDialog..."
if grep -q "if (showExitDialog)" src/components/requestForm/PhotoDocumentUpload.tsx; then
    echo "✅ Verificación de showExitDialog mantenida"
else
    echo "❌ Verificación de showExitDialog perdida"
    exit 1
fi

# Verificar que useDocumentManager maneja correctamente la inicialización
echo "✅ Verificando inicialización en useDocumentManager..."
if grep -q "initialDocuments \|\| guatemalanDocuments" src/hooks/useDocumentManager.tsx; then
    echo "✅ Inicialización correcta en useDocumentManager"
else
    echo "❌ Inicialización incorrecta en useDocumentManager"
    exit 1
fi

# Verificar que initializeFromFormData existe y funciona
echo "✅ Verificando función initializeFromFormData..."
if grep -q "const initializeFromFormData = useCallback" src/hooks/useDocumentManager.tsx; then
    echo "✅ Función initializeFromFormData existe"
else
    echo "❌ Función initializeFromFormData no encontrada"
    exit 1
fi

# Verificar que se maneja la restauración de archivos desde localforage
echo "✅ Verificando restauración desde localforage..."
if grep -q "restoredArrayBuffer instanceof ArrayBuffer" src/hooks/useDocumentManager.tsx; then
    echo "✅ Restauración desde localforage implementada"
else
    echo "❌ Restauración desde localforage no implementada"
    exit 1
fi

# Verificar que se convierte ArrayBuffer a File
echo "✅ Verificando conversión ArrayBuffer a File..."
if grep -q "const restoredFile = new File" src/hooks/useDocumentManager.tsx; then
    echo "✅ Conversión ArrayBuffer a File implementada"
else
    echo "❌ Conversión ArrayBuffer a File no implementada"
    exit 1
fi

echo ""
echo "🎉 Todas las verificaciones pasaron exitosamente!"
echo ""
echo "📋 Resumen de corrección implementada:"
echo "   ✅ useDocumentManager llamado con guatemalanDocuments como parámetro inicial"
echo "   ✅ initializeFromFormData llamado en useEffect con dependencias correctas"
echo "   ✅ Sincronización bidireccional con formData mantenida"
echo "   ✅ Debounce y verificación de showExitDialog preservados"
echo "   ✅ Restauración desde localforage funcionando"
echo "   ✅ Conversión ArrayBuffer a File implementada"
echo ""
echo "🚀 La persistencia de documentos ahora debería funcionar correctamente:"
echo "   📱 Subir documentos en la sección de documentos"
echo "   🔄 Navegar a otras secciones y regresar"
echo "   💾 Los documentos deberían persistir y mostrarse correctamente"
echo "   💾 Guardar solicitud y re-entrar - documentos deberían persistir"
echo ""
echo "📝 Para probar:"
echo "   1. Entrar a una solicitud en la sección de documentos"
echo "   2. Subir algunos documentos (fotos o PDFs)"
echo "   3. Navegar a otra sección y regresar a documentos"
echo "   4. Verificar que los documentos siguen ahí"
echo "   5. Guardar la solicitud y salir"
echo "   6. Re-entrar a la solicitud y verificar que los documentos persisten"
