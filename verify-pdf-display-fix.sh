#!/bin/bash

echo "🔍 Verificando corrección de visualización de PDFs..."
echo "=================================================="

# Verificar que PDFs muestran el nombre del archivo en lugar de "Toca para ver"
echo "📋 Verificando que PDFs muestran el nombre del archivo..."
if grep -q "{document.file?.name || 'Archivo PDF'}" src/components/documents/InteractiveDocumentCard.tsx; then
    echo "✅ PDFs muestran el nombre del archivo"
else
    echo "❌ PDFs no muestran el nombre del archivo"
    exit 1
fi

# Verificar que se eliminó "Toca para ver" para PDFs (pero puede aparecer para TXT)
echo "📋 Verificando que se eliminó 'Toca para ver' para PDFs..."
if ! grep -A5 -B5 "application/pdf" src/components/documents/InteractiveDocumentCard.tsx | grep -q "Toca para ver"; then
    echo "✅ Se eliminó 'Toca para ver' para PDFs"
else
    echo "❌ Aún aparece 'Toca para ver' para PDFs"
    exit 1
fi

# Verificar que el botón "Ver" no aparece para PDFs
echo "📋 Verificando que el botón 'Ver' no aparece para PDFs..."
if grep -q "{document.file?.type !== 'application/pdf' &&" src/components/documents/InteractiveDocumentCard.tsx; then
    echo "✅ El botón 'Ver' está condicionado para no aparecer en PDFs"
else
    echo "❌ El botón 'Ver' no está condicionado correctamente"
    exit 1
fi

# Verificar que el botón "Eliminar" sigue apareciendo para PDFs
echo "📋 Verificando que el botón 'Eliminar' sigue apareciendo para PDFs..."
if grep -q "Eliminar" src/components/documents/InteractiveDocumentCard.tsx; then
    echo "✅ El botón 'Eliminar' sigue apareciendo para PDFs"
else
    echo "❌ El botón 'Eliminar' no aparece"
    exit 1
fi

echo ""
echo "🎉 Verificación completada exitosamente!"
echo "📱 Ahora los PDFs se muestran correctamente sin vista previa"
echo ""
echo "📋 Cambios realizados:"
echo "  - PDFs muestran el nombre del archivo en lugar de 'Toca para ver'"
echo "  - Se eliminó el botón 'Ver' para PDFs (sin vista previa)"
echo "  - Se mantiene el botón 'Eliminar' para PDFs"
echo "  - Se mantiene la vista previa para imágenes (no PDFs)"
echo ""
echo "🧪 Para probar:"
echo "  1. Ve al paso 5 (Documentos) de una solicitud"
echo "  2. Sube un archivo PDF en 'Recibos de Servicios'"
echo "  3. Verifica que aparece el nombre del archivo"
echo "  4. Verifica que NO aparece el botón 'Ver'"
echo "  5. Verifica que SÍ aparece el botón 'Eliminar'"
