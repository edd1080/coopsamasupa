#!/bin/bash

echo "🔍 Verificando corrección de colores de fondo inconsistentes"
echo "============================================================"

# Verificar que ReviewSection usa bg-background
echo "✅ Verificando ReviewSection..."
if grep -q "bg-background" src/components/requestForm/ReviewSection.tsx; then
    echo "✅ ReviewSection usa bg-background (hsl(219, 39%, 11%))"
else
    echo "❌ ReviewSection NO usa bg-background"
    exit 1
fi

# Verificar que no usa bg-card
if grep -q "bg-card" src/components/requestForm/ReviewSection.tsx; then
    echo "❌ ReviewSection aún usa bg-card"
    exit 1
else
    echo "✅ ReviewSection no usa bg-card"
fi

# Verificar que el input de edad usa bg-background
echo "✅ Verificando input de edad..."
if grep -q "bg-background text-foreground" src/components/requestForm/identification/BirthDemographicsForm.tsx; then
    echo "✅ Input de edad usa bg-background (hsl(219, 39%, 11%))"
else
    echo "❌ Input de edad NO usa bg-background"
    exit 1
fi

# Verificar que no usa bg-muted
if grep -q "bg-muted" src/components/requestForm/identification/BirthDemographicsForm.tsx; then
    echo "❌ Input de edad aún usa bg-muted"
    exit 1
else
    echo "✅ Input de edad no usa bg-muted"
fi

# Verificar que las variables CSS están correctas
echo "✅ Verificando variables CSS..."
if grep -q "219 39% 11%" src/index.css; then
    echo "✅ Variable --background está correcta (hsl(219, 39%, 11%))"
else
    echo "❌ Variable --background NO está correcta"
    exit 1
fi

if grep -q "219 30% 18%" src/index.css; then
    echo "✅ Variable --card está correcta (hsl(219, 30%, 18%))"
else
    echo "❌ Variable --card NO está correcta"
    exit 1
fi

# Verificar que otros componentes que deberían usar bg-card lo siguen usando
echo "✅ Verificando otros componentes..."
if grep -q "bg-card" src/components/documents/InteractiveDocumentCard.tsx; then
    echo "✅ InteractiveDocumentCard sigue usando bg-card (correcto para cards)"
else
    echo "❌ InteractiveDocumentCard NO usa bg-card"
    exit 1
fi

echo ""
echo "🎉 Verificación completada exitosamente!"
echo ""
echo "📋 Correcciones implementadas:"
echo "1. ✅ ReviewSection: Cambiado de bg-card a bg-background"
echo "2. ✅ Input de edad: Cambiado de bg-muted a bg-background"
echo "3. ✅ Variables CSS: Confirmadas correctas"
echo "4. ✅ Otros componentes: Mantienen bg-card apropiadamente"
echo ""
echo "🎨 Colores resultantes:"
echo "- Background principal: hsl(219, 39%, 11%) - Color más oscuro"
echo "- Card background: hsl(219, 30%, 18%) - Color más claro (para cards)"
echo "- Input de edad: Ahora usa el background principal"
echo "- ReviewSection: Ahora usa el background principal"
echo ""
echo "🧪 Para probar:"
echo "1. Activar dark mode en la aplicación"
echo "2. Ir al paso 1 (Identificación) → sub-paso 1 (Datos Demográficos)"
echo "3. Verificar que el input de edad tenga el mismo color que el fondo principal"
echo "4. Ir al paso 6 (Revisión Final)"
echo "5. Verificar que el fondo del resumen sea consistente con el fondo principal"
echo "6. Comparar con otros pasos para asegurar consistencia"
echo ""
echo "🔧 Mejoras técnicas:"
echo "- Uso correcto de variables CSS del sistema de diseño"
echo "- Consistencia visual entre componentes principales"
echo "- Separación clara entre background principal y card background"
echo "- Eliminación de inconsistencias de color"
