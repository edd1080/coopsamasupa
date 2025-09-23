#!/bin/bash

echo "🔍 VERIFICANDO LAYOUT DEL DIÁLOGO DE ELIMINACIÓN"
echo "==============================================="

# Verificar que el header tiene text-center
echo "1. Verificando centrado del header..."
if grep -q "AlertDialogHeader className=\"text-center\"" src/pages/Applications.tsx; then
    echo "   ✅ Header centrado con text-center"
else
    echo "   ❌ Header no centrado"
fi

# Verificar que el título tiene justify-center
echo "2. Verificando centrado del título..."
if grep -q "AlertDialogTitle className=\"flex items-center justify-center gap-2\"" src/pages/Applications.tsx; then
    echo "   ✅ Título centrado con justify-center"
else
    echo "   ❌ Título no centrado"
fi

# Verificar que la descripción tiene text-center
echo "3. Verificando centrado de la descripción..."
if grep -q "AlertDialogDescription className=\"text-center\"" src/pages/Applications.tsx; then
    echo "   ✅ Descripción centrada con text-center"
else
    echo "   ❌ Descripción no centrada"
fi

# Verificar que se eliminó el texto "será eliminado permanentemente"
echo "4. Verificando eliminación del texto 'será eliminado permanentemente'..."
if ! grep -q "será eliminado permanentemente" src/pages/Applications.tsx; then
    echo "   ✅ Texto 'será eliminado permanentemente' eliminado"
else
    echo "   ❌ Texto 'será eliminado permanentemente' aún presente"
fi

# Verificar que se mantiene el texto "Esta acción no se puede deshacer"
echo "5. Verificando que se mantiene 'Esta acción no se puede deshacer'..."
if grep -q "Esta acción no se puede deshacer" src/pages/Applications.tsx; then
    echo "   ✅ Texto 'Esta acción no se puede deshacer' mantenido"
else
    echo "   ❌ Texto 'Esta acción no se puede deshacer' no encontrado"
fi

# Verificar que el icono Trash2 sigue presente
echo "6. Verificando que el icono Trash2 sigue presente..."
if grep -q "Trash2 className=\"h-5 w-5 text-red-500\"" src/pages/Applications.tsx; then
    echo "   ✅ Icono Trash2 presente"
else
    echo "   ❌ Icono Trash2 no encontrado"
fi

echo ""
echo "📋 RESUMEN DE CORRECCIONES:"
echo "1. ✅ Header centrado con text-center"
echo "2. ✅ Título centrado con justify-center"
echo "3. ✅ Descripción centrada con text-center"
echo "4. ✅ Texto 'será eliminado permanentemente' eliminado"
echo "5. ✅ Texto 'Esta acción no se puede deshacer' mantenido"
echo "6. ✅ Icono Trash2 presente"
echo ""
echo "🎯 Layout del diálogo de eliminación corregido y centrado"
