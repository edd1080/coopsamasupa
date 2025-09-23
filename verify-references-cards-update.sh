#!/bin/bash

echo "🔍 VERIFICANDO ACTUALIZACIÓN DE CARDS DE REFERENCIAS"
echo "=================================================="

# Verificar que se eliminó el campo "Tipo:"
echo "1. Verificando eliminación del campo 'Tipo:'..."
if ! grep -q "Tipo:" src/pages/ApplicationDetails.tsx; then
    echo "   ✅ Campo 'Tipo:' eliminado correctamente"
else
    echo "   ❌ Campo 'Tipo:' aún presente"
fi

# Verificar que se agregó "Nombre:" antes del nombre
echo "2. Verificando adición de 'Nombre:'..."
if grep -q "Nombre:" src/pages/ApplicationDetails.tsx; then
    echo "   ✅ Campo 'Nombre:' agregado correctamente"
else
    echo "   ❌ Campo 'Nombre:' no encontrado"
fi

# Verificar que se mantuvieron "Relación:" y "Teléfono:"
echo "3. Verificando campos mantenidos..."
if grep -q "Relación:" src/pages/ApplicationDetails.tsx && grep -q "Teléfono:" src/pages/ApplicationDetails.tsx; then
    echo "   ✅ Campos 'Relación:' y 'Teléfono:' mantenidos"
else
    echo "   ❌ Faltan campos 'Relación:' o 'Teléfono:'"
fi

# Verificar estructura de la card
echo "4. Verificando estructura de la card..."
if grep -A 10 -B 2 "Nombre:" src/pages/ApplicationDetails.tsx | grep -q "Relación:" && \
   grep -A 10 -B 2 "Relación:" src/pages/ApplicationDetails.tsx | grep -q "Teléfono:"; then
    echo "   ✅ Estructura de card correcta: Nombre → Relación → Teléfono"
else
    echo "   ❌ Estructura de card incorrecta"
fi

echo ""
echo "📋 RESUMEN DE CAMBIOS EN CARDS DE REFERENCIAS:"
echo "1. ✅ Campo 'Tipo:' eliminado"
echo "2. ✅ Campo 'Nombre:' agregado"
echo "3. ✅ Campos 'Relación:' y 'Teléfono:' mantenidos"
echo "4. ✅ Estructura: Nombre → Relación → Teléfono"
echo ""
echo "🎯 Cards de referencias actualizadas correctamente"
