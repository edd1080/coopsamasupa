#!/bin/bash

echo "🔍 Verificando corrección del input de edad y SubformHeader"
echo "=========================================================="

# Verificar que el input de edad usa las variables CSS correctas
echo "✅ Verificando input de edad..."
if grep -q "bg-muted text-muted-foreground" src/components/requestForm/identification/BirthDemographicsForm.tsx; then
    echo "✅ Input de edad usa variables CSS del sistema (bg-muted text-muted-foreground)"
else
    echo "❌ Input de edad NO usa variables CSS del sistema"
    exit 1
fi

# Verificar que no hay colores hardcodeados en el input de edad
if grep -q "bg-gray-100" src/components/requestForm/identification/BirthDemographicsForm.tsx; then
    echo "❌ Input de edad aún tiene colores hardcodeados (bg-gray-100)"
    exit 1
else
    echo "✅ Input de edad no tiene colores hardcodeados"
fi

# Verificar SubformHeader
echo "✅ Verificando SubformHeader..."
if grep -q "dark:from-primary dark:to-primary/80" src/components/forms/SubformHeader.tsx; then
    echo "✅ SubformHeader tiene gradientes para dark mode"
else
    echo "❌ SubformHeader NO tiene gradientes para dark mode"
    exit 1
fi

if grep -q "dark:bg-black/20" src/components/forms/SubformHeader.tsx; then
    echo "✅ SubformHeader tiene fondo de icono para dark mode"
else
    echo "❌ SubformHeader NO tiene fondo de icono para dark mode"
    exit 1
fi

# Verificar que el mensaje de error también usa dark mode
if grep -q "dark:text-red-400" src/components/requestForm/identification/BirthDemographicsForm.tsx; then
    echo "✅ Mensaje de error de edad usa dark mode"
else
    echo "❌ Mensaje de error de edad NO usa dark mode"
    exit 1
fi

echo ""
echo "🎉 Verificación completada exitosamente!"
echo ""
echo "📋 Correcciones implementadas:"
echo "1. ✅ Input de edad: Usa bg-muted text-muted-foreground (variables CSS del sistema)"
echo "2. ✅ SubformHeader: Gradientes optimizados para dark mode"
echo "3. ✅ Icono del SubformHeader: Fondo adaptado para dark mode"
echo "4. ✅ Mensaje de error: Colores consistentes con dark mode"
echo "5. ✅ Eliminados colores hardcodeados"
echo ""
echo "🧪 Para probar:"
echo "1. Activar dark mode en la aplicación"
echo "2. Ir al paso 1 (Identificación) → sub-paso 1 (Datos Demográficos)"
echo "3. Verificar que el input de edad tenga el mismo color que otros inputs"
echo "4. Verificar que el header 'Datos Demográficos y Nacimiento' se vea bien en dark mode"
echo "5. Verificar que el icono del calendario tenga fondo apropiado"
echo ""
echo "🔧 Mejoras técnicas:"
echo "- Uso de variables CSS del sistema de diseño (--muted, --muted-foreground)"
echo "- Gradientes optimizados para dark mode"
echo "- Consistencia visual con el resto de la aplicación"
echo "- Eliminación de colores hardcodeados específicos"
