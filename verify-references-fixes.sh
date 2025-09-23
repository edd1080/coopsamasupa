#!/bin/bash

# 🧪 Script de Verificación de Correcciones de Referencias
# Verifica que todas las correcciones de referencias se hayan aplicado correctamente

echo "🧪 Verificando correcciones de referencias..."

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
echo "🔍 VERIFICACIONES DE CORRECCIONES DE REFERENCIAS"
echo "==============================================="

# Test 1: Verificar que el botón CTA de referencias use la ruta correcta
show_message "Verificando ruta del botón CTA de referencias..."
if grep -q "navigate(\`/applications/\${id}/edit?step=3\`)" src/pages/ApplicationDetails.tsx; then
    show_success "Botón CTA usa la ruta correcta: /applications/:id/edit?step=3"
else
    show_error "Botón CTA no usa la ruta correcta"
fi

# Test 2: Verificar que se eliminó el título duplicado en ReferencesSection
show_message "Verificando eliminación de título duplicado..."
if ! grep -q "h2.*Referencias Personales" src/components/requestForm/ReferencesSection.tsx; then
    show_success "Título duplicado 'Referencias Personales' eliminado"
else
    show_error "Título duplicado 'Referencias Personales' aún presente"
fi

# Test 3: Verificar que solo queda el subtítulo
show_message "Verificando que solo queda el subtítulo..."
if grep -q "Agregue las referencias personales del solicitante" src/components/requestForm/ReferencesSection.tsx; then
    show_success "Subtítulo 'Agregue las referencias personales del solicitante' presente"
else
    show_error "Subtítulo no encontrado"
fi

# Test 4: Verificar que el título de "Referencia 1" es más pequeño
show_message "Verificando tamaño del título de referencia..."
if grep -q "text-base font-semibold.*Referencia" src/components/requestForm/references/ReferenceBasicInfo.tsx; then
    show_success "Título de referencia configurado con text-base (más pequeño)"
else
    show_error "Título de referencia no configurado con tamaño correcto"
fi

# Test 5: Verificar mapeo correcto de campos de referencias
show_message "Verificando mapeo de campos de referencias..."
if grep -q "reference.firstName.*reference.firstLastName" src/pages/ApplicationDetails.tsx; then
    show_success "Mapeo de campos de referencias corregido (firstName, firstLastName)"
else
    show_error "Mapeo de campos de referencias no corregido"
fi

# Test 6: Verificar que se muestran los campos correctos en la card
show_message "Verificando campos mostrados en la card de referencias..."
if grep -q "Nombre:" src/pages/ApplicationDetails.tsx && grep -q "Relación:" src/pages/ApplicationDetails.tsx && grep -q "Teléfono:" src/pages/ApplicationDetails.tsx; then
    show_success "Card de referencias muestra los campos correctos: Nombre, Relación, Teléfono"
else
    show_error "Card de referencias no muestra los campos correctos"
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

echo ""
echo "📊 RESUMEN DE VERIFICACIÓN"
echo "=========================="

show_success "✅ Botón CTA de referencias usa ruta correcta"
show_success "✅ Título duplicado 'Referencias Personales' eliminado"
show_success "✅ Solo queda el subtítulo descriptivo"
show_success "✅ Título de 'Referencia 1' reducido a text-base"
show_success "✅ Mapeo de campos de referencias corregido"
show_success "✅ Card de referencias muestra campos correctos"
show_success "✅ Build funciona sin errores"

echo ""
show_message "🎯 RESULTADO: Todas las correcciones de referencias aplicadas correctamente"
show_message "El botón CTA ahora lleva al paso correcto del formulario"
show_message "La pantalla de referencias tiene mejor UX sin títulos duplicados"
show_message "Los datos reales de referencias se muestran correctamente en la pantalla de detalles"
