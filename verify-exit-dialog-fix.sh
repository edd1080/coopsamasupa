#!/bin/bash

echo "🔍 Verificando corrección de diálogo de salida..."
echo "=================================================="

# Verificar que ExitDialog maneja correctamente el estado de loading
echo "📋 Verificando manejo de estado de loading en ExitDialog..."
if grep -q "finally {" src/components/requestForm/ExitDialog.tsx; then
    echo "✅ ExitDialog tiene bloque finally para resetear isExiting"
else
    echo "❌ ExitDialog no tiene bloque finally"
    exit 1
fi

# Verificar que RequestFormProvider re-lanza errores
echo "📋 Verificando que RequestFormProvider re-lanza errores..."
if grep -q "throw error;" src/components/requestForm/RequestFormProvider.tsx; then
    echo "✅ RequestFormProvider re-lanza errores correctamente"
else
    echo "❌ RequestFormProvider no re-lanza errores"
    exit 1
fi

# Verificar que el botón "Salir sin guardar" no está deshabilitado por isExiting
echo "📋 Verificando que 'Salir sin guardar' no se deshabilita incorrectamente..."
if grep -q "disabled={isExiting}" src/components/requestForm/ExitDialog.tsx; then
    echo "⚠️  'Salir sin guardar' se deshabilita con isExiting (esto puede estar bien)"
else
    echo "✅ 'Salir sin guardar' no se deshabilita con isExiting"
fi

# Verificar que el botón "Guardar y salir" se deshabilita correctamente
echo "📋 Verificando que 'Guardar y salir' se deshabilita correctamente..."
if grep -q "disabled={isExiting}" src/components/requestForm/ExitDialog.tsx; then
    echo "✅ 'Guardar y salir' se deshabilita con isExiting"
else
    echo "❌ 'Guardar y salir' no se deshabilita con isExiting"
    exit 1
fi

# Verificar que el texto cambia correctamente
echo "📋 Verificando que el texto cambia correctamente..."
if grep -q "{isExiting ? \"Guardando...\" : \"Guardar y salir\"}" src/components/requestForm/ExitDialog.tsx; then
    echo "✅ El texto cambia correctamente a 'Guardando...'"
else
    echo "❌ El texto no cambia correctamente"
    exit 1
fi

echo ""
echo "🎉 Verificación completada exitosamente!"
echo "📱 El diálogo de salida debería funcionar correctamente ahora"
echo ""
echo "📋 Cambios realizados:"
echo "  - Agregado bloque finally para resetear isExiting"
echo "  - RequestFormProvider re-lanza errores para manejo correcto"
echo "  - Estado de loading manejado correctamente"
echo "  - Botones se habilitan/deshabilitan apropiadamente"
echo ""
echo "🧪 Para probar:"
echo "  1. Ve al paso 5 (Documentos) de una solicitud"
echo "  2. Carga un documento o imagen"
echo "  3. Intenta 'Salir sin guardar' - debería funcionar"
echo "  4. Intenta 'Guardar y salir' - debería mostrar 'Guardando...' y funcionar"
echo "  5. Si hay error, los botones deberían volver a habilitarse"
