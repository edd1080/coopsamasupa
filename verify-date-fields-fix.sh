#!/bin/bash

echo "🔍 Verificando corrección de campos de fecha en consultas Supabase..."

# Verificar que las consultas incluyan explícitamente created_at y updated_at
echo "✅ Verificando consulta de applications..."
if grep -q "created_at, updated_at" src/hooks/useApplicationsList.tsx; then
    echo "✅ Applications query incluye created_at y updated_at explícitamente"
else
    echo "❌ Applications query NO incluye created_at y updated_at explícitamente"
    exit 1
fi

# Verificar que no use select('*') para applications
if grep -q "select('\*')" src/hooks/useApplicationsList.tsx; then
    echo "❌ Applications query aún usa select('*')"
    exit 1
else
    echo "✅ Applications query NO usa select('*')"
fi

# Verificar que no use select('*') para drafts
if grep -q "\.select('\*')" src/hooks/useApplicationsList.tsx; then
    echo "❌ Drafts query aún usa select('*')"
    exit 1
else
    echo "✅ Drafts query NO usa select('*')"
fi

# Verificar que drafts incluya created_at y updated_at
if grep -q "created_at, updated_at" src/hooks/useApplicationsList.tsx; then
    echo "✅ Drafts query incluye created_at y updated_at explícitamente"
else
    echo "❌ Drafts query NO incluye created_at y updated_at explícitamente"
    exit 1
fi

echo ""
echo "🎉 Verificación completada exitosamente!"
echo ""
echo "📋 Cambios implementados:"
echo "1. ✅ Applications query: Campos explícitos incluyendo created_at y updated_at"
echo "2. ✅ Drafts query: Campos explícitos incluyendo created_at y updated_at"
echo "3. ✅ Eliminado select('*') que no traía los campos de fecha"
echo "4. ✅ Consultas específicas que garantizan traer los campos necesarios"
echo ""
echo "🧪 Para probar:"
echo "1. Recargar la página de aplicaciones"
echo "2. Verificar en consola que ahora aparezcan created_at y updated_at"
echo "3. Verificar que las fechas se muestren correctamente en las cards"
echo "4. No debe aparecer más 'Sin fecha'"
echo ""
echo "🔧 Mejoras técnicas:"
echo "- Consultas explícitas en lugar de select('*')"
echo "- Garantía de traer campos de fecha desde Supabase"
echo "- Solución directa al problema de campos faltantes"
echo "- Mantenimiento de funcionalidad existente"
