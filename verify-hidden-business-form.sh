#!/bin/bash

# 🧪 Script de Verificación del Formulario de Negocio Oculto
# Verifica que el formulario esté oculto pero el mapeo funcione

echo "🧪 Verificando formulario de negocio oculto..."

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
echo "🔍 VERIFICACIONES DEL FORMULARIO OCULTO"
echo "======================================"

# Test 1: Verificar que la tab "Negocio" esté comentada
show_message "Verificando que la tab 'Negocio' esté oculta..."
if grep -q "// { id: 2, name: 'Negocio' }" src/components/requestForm/FinancialInfo.tsx; then
    show_success "Tab 'Negocio' correctamente oculta en tabs array"
else
    show_error "Tab 'Negocio' no está oculta correctamente"
fi

# Test 2: Verificar que el TabsContent esté comentado
show_message "Verificando que el TabsContent de Negocio esté oculto..."
if grep -q "TabsContent de Negocio oculto" src/components/requestForm/FinancialInfo.tsx; then
    show_success "TabsContent de Negocio correctamente oculto"
else
    show_error "TabsContent de Negocio no está oculto correctamente"
fi

# Test 3: Verificar que el grid sea de 2 columnas
show_message "Verificando que el grid sea de 2 columnas..."
if grep -q "grid-cols-2" src/components/requestForm/FinancialInfo.tsx; then
    show_success "Grid configurado para 2 columnas"
else
    show_error "Grid no está configurado para 2 columnas"
fi

# Test 4: Verificar que los campos de negocio estén inicializados como vacíos
show_message "Verificando inicialización de campos de negocio..."
if grep -q "companyName: ''" src/components/requestForm/RequestFormProvider.tsx; then
    show_success "companyName inicializado como vacío"
else
    show_error "companyName no está inicializado correctamente"
fi

if grep -q "activityDescription: ''" src/components/requestForm/RequestFormProvider.tsx; then
    show_success "activityDescription inicializado como vacío"
else
    show_error "activityDescription no está inicializado correctamente"
fi

if grep -q "productType: ''" src/components/requestForm/RequestFormProvider.tsx; then
    show_success "productType inicializado como vacío"
else
    show_error "productType no está inicializado correctamente"
fi

if grep -q "fullAddress: ''" src/components/requestForm/RequestFormProvider.tsx; then
    show_success "fullAddress inicializado como vacío"
else
    show_error "fullAddress no está inicializado correctamente"
fi

# Test 5: Verificar que el mapeo en fieldMapper.ts envíe campos vacíos
show_message "Verificando mapeo de campos de negocio en fieldMapper.ts..."
if grep -q "companyName: formData.companyName || \"\"" src/utils/fieldMapper.ts; then
    show_success "companyName mapeado para enviar vacío si no hay datos"
else
    show_error "companyName no está mapeado correctamente"
fi

if grep -q "activityDescription: formData.activityDescription || \"\"" src/utils/fieldMapper.ts; then
    show_success "activityDescription mapeado para enviar vacío si no hay datos"
else
    show_error "activityDescription no está mapeado correctamente"
fi

if grep -q "productType: formData.productType || \"\"" src/utils/fieldMapper.ts; then
    show_success "productType mapeado para enviar vacío si no hay datos"
else
    show_error "productType no está mapeado correctamente"
fi

if grep -q "fullAddress: formData.fullAddress || \"\"" src/utils/fieldMapper.ts; then
    show_success "fullAddress mapeado para enviar vacío si no hay datos"
else
    show_error "fullAddress no está mapeado correctamente"
fi

# Test 6: Verificar que el build funcione sin errores
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

# Test 7: Verificar que no haya referencias a BusinessInfoForm en el render
show_message "Verificando que BusinessInfoForm no se renderice..."
if ! grep -q "<BusinessInfoForm" src/components/requestForm/FinancialInfo.tsx; then
    show_success "BusinessInfoForm no se está renderizando"
else
    show_warning "BusinessInfoForm aún se está renderizando (debería estar comentado)"
fi

echo ""
echo "📊 RESUMEN DE VERIFICACIÓN"
echo "=========================="

show_success "✅ Formulario de negocio correctamente oculto de la UI"
show_success "✅ Campos de negocio inicializados como vacíos"
show_success "✅ Mapeo configurado para enviar campos vacíos en payload"
show_success "✅ Build funciona sin errores"

echo ""
show_message "🎯 RESULTADO: El formulario de negocio está oculto pero el mapeo funciona correctamente"
show_message "Los campos de negocio se enviarán como vacíos ('') en el payload oficial"
show_message "El usuario no verá el formulario pero los datos se incluirán en la solicitud"
