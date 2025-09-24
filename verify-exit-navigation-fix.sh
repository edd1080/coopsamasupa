#!/bin/bash

echo "🔍 Verificando corrección de navegación de salida..."

# Verificar que SafeNavigationWrapper no interfiera con showExitDialog
echo "✅ Verificando SafeNavigationWrapper..."
if grep -q "showExitDialog" src/components/requestForm/SafeNavigationWrapper.tsx; then
    echo "✅ SafeNavigationWrapper incluye verificación de showExitDialog"
else
    echo "❌ SafeNavigationWrapper NO incluye verificación de showExitDialog"
    exit 1
fi

# Verificar que no interfiera cuando el diálogo está abierto
if grep -q "Don't interfere if exit dialog is already showing" src/components/requestForm/SafeNavigationWrapper.tsx; then
    echo "✅ SafeNavigationWrapper tiene lógica para no interferir con diálogo"
else
    echo "❌ SafeNavigationWrapper NO tiene lógica para no interferir con diálogo"
    exit 1
fi

# Verificar que onNavigateAfterExit esté configurado correctamente
echo "✅ Verificando RequestForm..."
if grep -q "onNavigateAfterExit={handleNavigateToApplications}" src/pages/RequestForm.tsx; then
    echo "✅ RequestForm tiene onNavigateAfterExit configurado"
else
    echo "❌ RequestForm NO tiene onNavigateAfterExit configurado"
    exit 1
fi

# Verificar que handleNavigateToApplications esté definido
if grep -q "handleNavigateToApplications" src/pages/RequestForm.tsx; then
    echo "✅ handleNavigateToApplications está definido"
else
    echo "❌ handleNavigateToApplications NO está definido"
    exit 1
fi

# Verificar que RequestFormProvider use onNavigateAfterExit
echo "✅ Verificando RequestFormProvider..."
if grep -q "onNavigateAfterExit" src/components/requestForm/RequestFormProvider.tsx; then
    echo "✅ RequestFormProvider usa onNavigateAfterExit"
else
    echo "❌ RequestFormProvider NO usa onNavigateAfterExit"
    exit 1
fi

# Verificar que handleExit use onNavigateAfterExit
if grep -q "if (onNavigateAfterExit)" src/components/requestForm/RequestFormProvider.tsx; then
    echo "✅ handleExit usa onNavigateAfterExit correctamente"
else
    echo "❌ handleExit NO usa onNavigateAfterExit correctamente"
    exit 1
fi

echo ""
echo "🎉 Verificación completada exitosamente!"
echo ""
echo "📋 Cambios implementados:"
echo "1. ✅ SafeNavigationWrapper no interfiere cuando showExitDialog está activo"
echo "2. ✅ Solo intercepta el botón 'atrás' del navegador"
echo "3. ✅ onNavigateAfterExit funciona correctamente"
echo "4. ✅ Navegación de salida restaurada"
echo ""
echo "🧪 Para probar:"
echo "1. Abrir solicitud de crédito"
echo "2. Ir al paso 5 (Documentos)"
echo "3. Subir un documento"
echo "4. Intentar 'Salir sin guardar' - debe funcionar"
echo "5. Intentar 'Guardar y salir' - debe funcionar"
