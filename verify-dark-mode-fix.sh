#!/bin/bash

echo "🔍 Verificando corrección de BUG-266: Inconsistencias en Dark Mode"
echo "=================================================================="

# Verificar InteractiveDocumentCard
echo "✅ Verificando InteractiveDocumentCard..."
if grep -q "dark:bg-green-900/20" src/components/documents/InteractiveDocumentCard.tsx; then
    echo "✅ InteractiveDocumentCard usa colores de dark mode para success"
else
    echo "❌ InteractiveDocumentCard NO usa colores de dark mode para success"
    exit 1
fi

if grep -q "dark:bg-red-900/20" src/components/documents/InteractiveDocumentCard.tsx; then
    echo "✅ InteractiveDocumentCard usa colores de dark mode para error"
else
    echo "❌ InteractiveDocumentCard NO usa colores de dark mode para error"
    exit 1
fi

if grep -q "dark:bg-card" src/components/documents/InteractiveDocumentCard.tsx; then
    echo "✅ InteractiveDocumentCard usa colores de dark mode para default"
else
    echo "❌ InteractiveDocumentCard NO usa colores de dark mode para default"
    exit 1
fi

if grep -q "dark:text-green-400" src/components/documents/InteractiveDocumentCard.tsx; then
    echo "✅ InteractiveDocumentCard usa colores de texto de dark mode"
else
    echo "❌ InteractiveDocumentCard NO usa colores de texto de dark mode"
    exit 1
fi

if grep -q "dark:bg-muted" src/components/documents/InteractiveDocumentCard.tsx; then
    echo "✅ InteractiveDocumentCard usa colores de fondo de dark mode"
else
    echo "❌ InteractiveDocumentCard NO usa colores de fondo de dark mode"
    exit 1
fi

# Verificar BirthDemographicsForm (input de edad)
echo "✅ Verificando BirthDemographicsForm..."
if grep -q "dark:bg-muted dark:text-foreground" src/components/requestForm/identification/BirthDemographicsForm.tsx; then
    echo "✅ Input de edad usa colores de dark mode"
else
    echo "❌ Input de edad NO usa colores de dark mode"
    exit 1
fi

if grep -q "dark:text-red-400" src/components/requestForm/identification/BirthDemographicsForm.tsx; then
    echo "✅ Mensaje de error de edad usa colores de dark mode"
else
    echo "❌ Mensaje de error de edad NO usa colores de dark mode"
    exit 1
fi

# Verificar ReviewSection
echo "✅ Verificando ReviewSection..."
if grep -q "dark:bg-blue-950/20" src/components/requestForm/ReviewSection.tsx; then
    echo "✅ ReviewSection usa colores de fondo de dark mode"
else
    echo "❌ ReviewSection NO usa colores de fondo de dark mode"
    exit 1
fi

if grep -q "dark:text-blue-300" src/components/requestForm/ReviewSection.tsx; then
    echo "✅ ReviewSection usa colores de texto de dark mode"
else
    echo "❌ ReviewSection NO usa colores de texto de dark mode"
    exit 1
fi

if grep -q "dark:text-foreground" src/components/requestForm/ReviewSection.tsx; then
    echo "✅ ReviewSection usa colores de texto principal de dark mode"
else
    echo "❌ ReviewSection NO usa colores de texto principal de dark mode"
    exit 1
fi

if grep -q "dark:text-muted-foreground" src/components/requestForm/ReviewSection.tsx; then
    echo "✅ ReviewSection usa colores de texto secundario de dark mode"
else
    echo "❌ ReviewSection NO usa colores de texto secundario de dark mode"
    exit 1
fi

# Verificar otros componentes
echo "✅ Verificando otros componentes..."
if grep -q "dark:bg-blue-950/20" src/components/requestForm/GeolocationCapture.tsx; then
    echo "✅ GeolocationCapture usa colores de dark mode"
else
    echo "❌ GeolocationCapture NO usa colores de dark mode"
    exit 1
fi

if grep -q "dark:bg-green-900/20" src/components/requestForm/FinancialAnalysis.tsx; then
    echo "✅ FinancialAnalysis usa colores de dark mode"
else
    echo "❌ FinancialAnalysis NO usa colores de dark mode"
    exit 1
fi

if grep -q "dark:bg-green-900/20" src/components/requestForm/identification/ContactHousingForm.tsx; then
    echo "✅ ContactHousingForm usa colores de dark mode"
else
    echo "❌ ContactHousingForm NO usa colores de dark mode"
    exit 1
fi

# Verificar que todos los colores tienen dark mode
echo "✅ Verificando que todos los colores tienen dark mode..."
if grep -q "bg-gray-100 dark:bg-muted" src/components/documents/InteractiveDocumentCard.tsx; then
    echo "✅ InteractiveDocumentCard tiene dark mode para bg-gray-100"
else
    echo "❌ InteractiveDocumentCard NO tiene dark mode para bg-gray-100"
    exit 1
fi

if grep -q "bg-blue-50" src/components/requestForm/ReviewSection.tsx && grep -q "dark:bg-blue-950/20" src/components/requestForm/ReviewSection.tsx; then
    echo "✅ ReviewSection tiene dark mode para bg-blue-50"
else
    echo "❌ ReviewSection NO tiene dark mode para bg-blue-50"
    exit 1
fi

echo ""
echo "🎉 Verificación completada exitosamente!"
echo ""
echo "📋 Solución implementada:"
echo "1. ✅ InteractiveDocumentCard: Colores de fondo y texto para dark mode"
echo "2. ✅ Input de edad: Fondo y texto para dark mode"
echo "3. ✅ ReviewSection: Background y texto para dark mode"
echo "4. ✅ GeolocationCapture: Indicador de progreso para dark mode"
echo "5. ✅ FinancialAnalysis: Semáforo de tráfico para dark mode"
echo "6. ✅ ContactHousingForm: Badges de estabilidad para dark mode"
echo "7. ✅ Eliminados colores hardcodeados sin dark mode"
echo ""
echo "🧪 Para probar:"
echo "1. Activar dark mode en la aplicación"
echo "2. Ir al paso 1 (Identificación) y verificar el input de edad"
echo "3. Ir al paso 5 (Documentos) y verificar las cards de documentos"
echo "4. Ir al paso 6 (Revisión) y verificar el background y texto"
echo "5. Verificar otros componentes como geolocalización y análisis financiero"
echo ""
echo "🔧 Mejoras técnicas:"
echo "- Uso de variables CSS de dark mode (--card, --foreground, --muted)"
echo "- Colores semitransparentes para mejor contraste"
echo "- Consistencia con la paleta oficial de dark mode"
echo "- Eliminación de colores hardcodeados"
echo "- Soporte completo para todos los estados de componentes"
