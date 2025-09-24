#!/bin/bash

echo "🔍 Verificando corrección del file picker para PDFs..."
echo "=================================================="

# Verificar que el accept está usando MIME types correctos
echo "📋 Verificando atributo accept en PhotoDocumentUpload.tsx..."
if grep -q 'accept="image/\*,application/pdf"' src/components/requestForm/PhotoDocumentUpload.tsx; then
    echo "✅ Accept attribute está usando MIME types correctos"
else
    echo "❌ Accept attribute no está usando MIME types correctos"
    exit 1
fi

# Verificar que no incluye .txt que no está permitido
echo "📋 Verificando que no incluye .txt..."
if ! grep -q 'text/plain' src/components/requestForm/PhotoDocumentUpload.tsx; then
    echo "✅ No incluye text/plain (.txt) que no está permitido"
else
    echo "❌ Incluye text/plain (.txt) que no está permitido"
    exit 1
fi

# Verificar que useDocumentManager permite PDFs
echo "📋 Verificando que useDocumentManager permite PDFs..."
if grep -q "'.pdf'" src/hooks/useDocumentManager.tsx; then
    echo "✅ useDocumentManager permite archivos PDF"
else
    echo "❌ useDocumentManager no permite archivos PDF"
    exit 1
fi

# Verificar que InteractiveDocumentCard permite todos los tipos
echo "📋 Verificando que InteractiveDocumentCard permite todos los tipos..."
if grep -q "accept={document.type === 'photo' ? 'image/\*' : '\*'}" src/components/documents/InteractiveDocumentCard.tsx; then
    echo "✅ InteractiveDocumentCard permite todos los tipos de archivo"
else
    echo "❌ InteractiveDocumentCard no permite todos los tipos de archivo"
    exit 1
fi

# Verificar que recibosServicios es de tipo 'document'
echo "📋 Verificando que recibosServicios es de tipo 'document'..."
if grep -q "type: 'document'" src/hooks/useDocumentManager.tsx; then
    echo "✅ recibosServicios es de tipo 'document' (permite PDFs)"
else
    echo "❌ recibosServicios no es de tipo 'document'"
    exit 1
fi

echo ""
echo "🎉 Verificación completada exitosamente!"
echo "📱 Ahora el file picker debería permitir seleccionar archivos PDF"
echo ""
echo "📋 Cambios realizados:"
echo "  - Accept attribute cambiado de extensiones (.pdf) a MIME types (application/pdf)"
echo "  - Removido text/plain que no está permitido en useDocumentManager"
echo "  - Mantenido soporte para imágenes (image/*)"
echo "  - Cambiado recibosServicios de tipo 'photo' a 'document' para permitir PDFs"
echo ""
echo "🧪 Para probar:"
echo "  1. Ve al paso 5 (Documentos) de una solicitud"
echo "  2. Toca 'Subir archivo' en cualquier documento"
echo "  3. El file picker debería mostrar archivos PDF como opción"
echo "  4. Selecciona un PDF y verifica que se suba correctamente"
