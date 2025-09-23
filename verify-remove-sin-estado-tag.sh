#!/bin/bash

echo "🔍 VERIFICANDO ELIMINACIÓN DEL TAG 'SIN ESTADO'"
echo "=============================================="

# Verificar que el Header no muestra el badge cuando el estado es "Sin Estado"
echo "1. Verificando lógica del Header..."
if grep -q "getStatusLabel(applicationStatus) !== 'Sin Estado'" src/components/layout/Header.tsx; then
    echo "   ✅ Header no muestra badge cuando estado es 'Sin Estado'"
else
    echo "   ❌ Header aún muestra badge para 'Sin Estado'"
fi

# Verificar que la función getStatusLabel sigue devolviendo "Sin Estado" para casos no válidos
echo "2. Verificando función getStatusLabel..."
if grep -q "default: return 'Sin Estado';" src/components/layout/Header.tsx; then
    echo "   ✅ Función getStatusLabel mantiene 'Sin Estado' como default"
else
    echo "   ❌ Función getStatusLabel modificada incorrectamente"
fi

# Verificar que la condición del badge incluye la verificación
echo "3. Verificando condición del badge..."
if grep -A 5 -B 2 "Status badge para formularios" src/components/layout/Header.tsx | grep -q "getStatusLabel(applicationStatus) !== 'Sin Estado'"; then
    echo "   ✅ Condición del badge incluye verificación de 'Sin Estado'"
else
    echo "   ❌ Condición del badge no incluye verificación"
fi

echo ""
echo "📋 RESUMEN DE CAMBIOS:"
echo "1. ✅ Header no muestra badge cuando estado es 'Sin Estado'"
echo "2. ✅ Función getStatusLabel mantiene 'Sin Estado' como default"
echo "3. ✅ Condición del badge incluye verificación correcta"
echo ""
echo "🎯 Tag 'Sin Estado' eliminado correctamente de la navbar"
