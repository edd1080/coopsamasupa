#!/bin/bash

echo "🔍 Verificando corrección final de visualización de fechas..."

# Verificar que ApplicationCard ya no use formatDate
echo "✅ Verificando ApplicationCard..."
if grep -q "formatDate(" src/components/applications/ApplicationCard.tsx; then
    echo "❌ ApplicationCard aún usa formatDate()"
    exit 1
else
    echo "✅ ApplicationCard NO usa formatDate()"
fi

if grep -q "formatDateToGuatemalan" src/components/applications/ApplicationCard.tsx; then
    echo "❌ ApplicationCard aún importa formatDateToGuatemalan"
    exit 1
else
    echo "✅ ApplicationCard NO importa formatDateToGuatemalan"
fi

if grep -q "{application.date}" src/components/applications/ApplicationCard.tsx; then
    echo "✅ ApplicationCard usa directamente application.date"
else
    echo "❌ ApplicationCard NO usa directamente application.date"
    exit 1
fi

# Verificar que useApplicationsList mantenga el formateo
echo "✅ Verificando useApplicationsList..."
if grep -q "formatDateToGuatemalan.*app.created_at" src/hooks/useApplicationsList.tsx; then
    echo "✅ useApplicationsList formatea fechas de applications"
else
    echo "❌ useApplicationsList NO formatea fechas de applications"
    exit 1
fi

if grep -q "formatDateToGuatemalan.*draft.updated_at" src/hooks/useApplicationsList.tsx; then
    echo "✅ useApplicationsList formatea fechas de drafts"
else
    echo "❌ useApplicationsList NO formatea fechas de drafts"
    exit 1
fi

# Verificar que las consultas incluyan campos de fecha
if grep -q "created_at, updated_at" src/hooks/useApplicationsList.tsx; then
    echo "✅ Consultas incluyen campos de fecha explícitamente"
else
    echo "❌ Consultas NO incluyen campos de fecha explícitamente"
    exit 1
fi

echo ""
echo "🎉 Verificación completada exitosamente!"
echo ""
echo "📋 Solución implementada:"
echo "1. ✅ ApplicationCard usa directamente application.date (sin formateo duplicado)"
echo "2. ✅ useApplicationsList formatea fechas una sola vez"
echo "3. ✅ Consultas Supabase incluyen campos de fecha explícitamente"
echo "4. ✅ Eliminado formateo duplicado que causaba 'Sin fecha'"
echo "5. ✅ Limpieza de logging temporal"
echo ""
echo "🧪 Para probar:"
echo "1. Recargar la página de aplicaciones"
echo "2. Verificar que las fechas se muestren correctamente (DD/MM/YYYY)"
echo "3. No debe aparecer más 'Sin fecha'"
echo "4. Las fechas deben ser reales de creación/actualización"
echo ""
echo "🔧 Mejoras técnicas:"
echo "- Eliminación de formateo duplicado"
echo "- Uso directo de datos ya formateados"
echo "- Consultas explícitas de Supabase"
echo "- Arquitectura limpia sin redundancias"
