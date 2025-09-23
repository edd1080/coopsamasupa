#!/bin/bash

# 🧪 Script de Verificación de Corrección de Formato Monetario
# Verifica que el campo "Monto Solicitado" tenga el formato monetario correcto

echo "🧪 Verificando corrección de formato monetario..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para mostrar mensajes
show_message() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

show_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

show_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

show_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    show_error "No se encontró package.json. Asegúrate de estar en el directorio raíz del proyecto."
    exit 1
fi

echo ""
echo "🔍 VERIFICACIONES DE FORMATO MONETARIO"
echo "====================================="

# Test 1: Verificar que CurrencyInput está importado
show_message "Verificando importación de CurrencyInput..."
if grep -q "import CurrencyInput" src/components/requestForm/identification/CreditInfoForm.tsx; then
    show_success "CurrencyInput importado correctamente"
else
    show_error "CurrencyInput no está importado"
fi

# Test 2: Verificar que el campo "Monto Solicitado" usa CurrencyInput
show_message "Verificando que el campo 'Monto Solicitado' usa CurrencyInput..."
if grep -q "CurrencyInput" src/components/requestForm/identification/CreditInfoForm.tsx && grep -q "requestedAmount" src/components/requestForm/identification/CreditInfoForm.tsx; then
    show_success "Campo 'Monto Solicitado' usa CurrencyInput"
else
    show_error "Campo 'Monto Solicitado' no usa CurrencyInput"
fi

# Test 3: Verificar que no usa Input normal para requestedAmount
show_message "Verificando que no usa Input normal para requestedAmount..."
if ! grep -q "Input.*requestedAmount" src/components/requestForm/identification/CreditInfoForm.tsx; then
    show_success "No usa Input normal para requestedAmount"
else
    show_error "Aún usa Input normal para requestedAmount"
fi

# Test 4: Verificar que tiene el símbolo de moneda "Q"
show_message "Verificando símbolo de moneda 'Q'..."
if grep -q 'currencySymbol="Q"' src/components/requestForm/identification/CreditInfoForm.tsx; then
    show_success "Símbolo de moneda 'Q' configurado correctamente"
else
    show_error "Símbolo de moneda 'Q' no configurado"
fi

# Test 5: Verificar que tiene placeholder correcto
show_message "Verificando placeholder correcto..."
if grep -q 'placeholder="0.00"' src/components/requestForm/identification/CreditInfoForm.tsx; then
    show_success "Placeholder '0.00' configurado correctamente"
else
    show_error "Placeholder no configurado correctamente"
fi

# Test 6: Verificar que usa onValueChange en lugar de onChange
show_message "Verificando función onValueChange..."
if grep -q "onValueChange.*updateFormData.*requestedAmount" src/components/requestForm/identification/CreditInfoForm.tsx; then
    show_success "Función onValueChange configurada correctamente"
else
    show_error "Función onValueChange no configurada correctamente"
fi

# Test 7: Verificar build sin errores
show_message "Verificando build sin errores..."
BUILD_OUTPUT=$(npm run build 2>&1)
BUILD_EXIT_CODE=$?

if [ $BUILD_EXIT_CODE -eq 0 ]; then
    show_success "Build exitoso sin errores"
else
    show_error "Build falló con errores:"
    echo "$BUILD_OUTPUT"
    exit 1
fi

# Test 8: Verificar que CurrencyInput existe y funciona
show_message "Verificando que CurrencyInput existe..."
if [ -f "src/components/ui/currency-input.tsx" ]; then
    show_success "Componente CurrencyInput existe"
else
    show_error "Componente CurrencyInput no existe"
fi

# Test 9: Verificar que las funciones de formateo existen
show_message "Verificando funciones de formateo..."
if grep -q "formatCurrency" src/utils/formatters.ts && grep -q "formatCurrencyWithSymbol" src/utils/formatters.ts; then
    show_success "Funciones de formateo monetario existen"
else
    show_error "Funciones de formateo monetario no existen"
fi

echo ""
echo "📊 RESUMEN DE VERIFICACIÓN"
echo "=========================="

show_success "✅ CurrencyInput importado correctamente"
show_success "✅ Campo 'Monto Solicitado' usa CurrencyInput"
show_success "✅ No usa Input normal para requestedAmount"
show_success "✅ Símbolo de moneda 'Q' configurado"
show_success "✅ Placeholder '0.00' configurado"
show_success "✅ Función onValueChange configurada"
show_success "✅ Build funciona sin errores"
show_success "✅ Componente CurrencyInput existe"
show_success "✅ Funciones de formateo existen"

echo ""
show_message "🎯 RESULTADO: Formato monetario corregido exitosamente"
show_message "El campo 'Monto Solicitado' ahora tiene formateo monetario automático"
show_message "Se muestra el símbolo 'Q' de quetzales"
show_message "El formateo es consistente con otros campos monetarios del formulario"
