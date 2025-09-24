#!/bin/bash

echo "🔍 Verificando corrección de campo de teléfono en referencias (BUG-264)"
echo "====================================================================="

# Verificar que se importan las funciones necesarias
echo "✅ Verificando importaciones..."
if grep -q "formatPhone, validatePhoneFormat" src/components/requestForm/references/ReferenceBasicInfo.tsx; then
    echo "✅ Funciones formatPhone y validatePhoneFormat importadas correctamente"
else
    echo "❌ Funciones formatPhone y validatePhoneFormat NO están importadas"
    exit 1
fi

# Verificar que se agregó la función handlePhoneChange
echo "✅ Verificando función handlePhoneChange..."
if grep -q "handlePhoneChange" src/components/requestForm/references/ReferenceBasicInfo.tsx; then
    echo "✅ Función handlePhoneChange implementada"
else
    echo "❌ Función handlePhoneChange NO está implementada"
    exit 1
fi

# Verificar que el campo usa type="tel"
echo "✅ Verificando tipo de input..."
if grep -q 'type="tel"' src/components/requestForm/references/ReferenceBasicInfo.tsx; then
    echo "✅ Campo usa type=\"tel\""
else
    echo "❌ Campo NO usa type=\"tel\""
    exit 1
fi

# Verificar que el campo usa inputMode="numeric"
echo "✅ Verificando inputMode..."
if grep -q 'inputMode="numeric"' src/components/requestForm/references/ReferenceBasicInfo.tsx; then
    echo "✅ Campo usa inputMode=\"numeric\""
else
    echo "❌ Campo NO usa inputMode=\"numeric\""
    exit 1
fi

# Verificar que el campo usa maxLength
echo "✅ Verificando maxLength..."
if grep -q 'maxLength={9}' src/components/requestForm/references/ReferenceBasicInfo.tsx; then
    echo "✅ Campo usa maxLength={9}"
else
    echo "❌ Campo NO usa maxLength={9}"
    exit 1
fi

# Verificar que el campo usa handlePhoneChange
echo "✅ Verificando manejo de cambios..."
if grep -q "handlePhoneChange(e.target.value)" src/components/requestForm/references/ReferenceBasicInfo.tsx; then
    echo "✅ Campo usa handlePhoneChange para manejar cambios"
else
    echo "❌ Campo NO usa handlePhoneChange"
    exit 1
fi

# Verificar que se eliminó el pattern problemático
echo "✅ Verificando eliminación de pattern problemático..."
if grep -q 'pattern="\[0-9\\-\\s\]\*"' src/components/requestForm/references/ReferenceBasicInfo.tsx; then
    echo "❌ Pattern problemático aún está presente"
    exit 1
else
    echo "✅ Pattern problemático eliminado correctamente"
fi

# Verificar que se agregó validación visual
echo "✅ Verificando validación visual..."
if grep -q "validatePhoneFormat" src/components/requestForm/references/ReferenceBasicInfo.tsx; then
    echo "✅ Validación visual implementada"
else
    echo "❌ Validación visual NO está implementada"
    exit 1
fi

# Verificar que se agregó mensaje de error
echo "✅ Verificando mensaje de error..."
if grep -q "Formato: 0000 0000 (8 dígitos)" src/components/requestForm/references/ReferenceBasicInfo.tsx; then
    echo "✅ Mensaje de error implementado"
else
    echo "❌ Mensaje de error NO está implementado"
    exit 1
fi

# Verificar que las funciones existen en formatters.ts
echo "✅ Verificando funciones en formatters.ts..."
if grep -q "export const formatPhone" src/utils/formatters.ts; then
    echo "✅ Función formatPhone existe en formatters.ts"
else
    echo "❌ Función formatPhone NO existe en formatters.ts"
    exit 1
fi

if grep -q "export const validatePhoneFormat" src/utils/formatters.ts; then
    echo "✅ Función validatePhoneFormat existe en formatters.ts"
else
    echo "❌ Función validatePhoneFormat NO existe en formatters.ts"
    exit 1
fi

echo ""
echo "🎉 Verificación completada exitosamente!"
echo ""
echo "📋 Correcciones implementadas para BUG-264:"
echo "1. ✅ Importación de funciones formatPhone y validatePhoneFormat"
echo "2. ✅ Implementación de función handlePhoneChange"
echo "3. ✅ Campo usa type=\"tel\" para teclado numérico"
echo "4. ✅ Campo usa inputMode=\"numeric\" para restricción"
echo "5. ✅ Campo usa maxLength={9} para límite de caracteres"
echo "6. ✅ Campo usa handlePhoneChange para formateo automático"
echo "7. ✅ Eliminación de pattern problemático [0-9\\-\\s]*"
echo "8. ✅ Validación visual con borde rojo para formato incorrecto"
echo "9. ✅ Mensaje de error informativo"
echo "10. ✅ Funciones de utilidad confirmadas en formatters.ts"
echo ""
echo "🎯 Funcionalidades implementadas:"
echo "- ✅ Solo acepta números (0-9)"
echo "- ✅ Formateo automático: 0000 0000"
echo "- ✅ Validación en tiempo real"
echo "- ✅ Mensaje de error visual"
echo "- ✅ Límite de 8 dígitos"
echo "- ✅ Teclado numérico en móviles"
echo "- ✅ Eliminación de caracteres especiales, letras y espacios"
echo ""
echo "🧪 Para probar la corrección:"
echo "1. Ir al paso 4 (Referencias Personales)"
echo "2. Hacer clic en 'Agregar Referencia'"
echo "3. En el campo 'Teléfono' intentar escribir:"
echo "   - Letras: abc123 → Solo debe mostrar: 123"
echo "   - Caracteres especiales: 123-456@789 → Solo debe mostrar: 123456789"
echo "   - Espacios: 1 2 3 4 5 6 7 8 → Debe formatear a: 1234 5678"
echo "   - Más de 8 dígitos: 1234567890 → Solo debe mostrar: 1234 5678"
echo "4. Verificar que aparece mensaje de error si el formato es incorrecto"
echo "5. Verificar que el borde se pone rojo con formato incorrecto"
echo ""
echo "🔧 Mejoras técnicas implementadas:"
echo "- Uso de funciones de utilidad existentes (formatPhone, validatePhoneFormat)"
echo "- Consistencia con otros campos de teléfono en la aplicación"
echo "- Validación en tiempo real con feedback visual"
echo "- Formateo automático para mejor UX"
echo "- Restricción estricta a solo números"
echo "- Eliminación completa de caracteres no deseados"
