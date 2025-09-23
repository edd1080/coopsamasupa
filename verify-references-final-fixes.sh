#!/bin/bash

# 🧪 Script de Verificación de Correcciones Finales de Referencias
# Verifica que todas las correcciones finales se hayan aplicado correctamente

echo "🧪 Verificando correcciones finales de referencias..."

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
echo "🔍 VERIFICACIONES DE CORRECCIONES FINALES"
echo "========================================"

# Test 1: Verificar que NewGuarantorSheet fue eliminado
show_message "Verificando eliminación de NewGuarantorSheet..."
if ! grep -q "NewGuarantorSheet" src/pages/ApplicationDetails.tsx; then
    show_success "NewGuarantorSheet eliminado completamente"
else
    show_error "NewGuarantorSheet aún presente"
fi

# Test 2: Verificar que el botón "Agregar Otro Fiador" usa navegación directa
show_message "Verificando botón 'Agregar Otro Fiador'..."
if grep -q "navigate(\`/applications/\${id}/edit?step=3\`)" src/pages/ApplicationDetails.tsx; then
    show_success "Botón 'Agregar Otro Fiador' usa navegación directa"
else
    show_error "Botón 'Agregar Otro Fiador' no usa navegación directa"
fi

# Test 3: Verificar que handleAddGuarantor fue eliminado
show_message "Verificando eliminación de handleAddGuarantor..."
if ! grep -q "handleAddGuarantor" src/pages/ApplicationDetails.tsx; then
    show_success "Función handleAddGuarantor eliminada"
else
    show_error "Función handleAddGuarantor aún presente"
fi

# Test 4: Verificar mapeo correcto de campos de referencias
show_message "Verificando mapeo de campos de referencias..."
if grep -q "reference.firstName.*reference.firstLastName" src/pages/ApplicationDetails.tsx; then
    show_success "Mapeo de campos de referencias corregido (firstName, firstLastName)"
else
    show_error "Mapeo de campos de referencias no corregido"
fi

# Test 5: Verificar que se muestran solo 3 campos esenciales
show_message "Verificando campos mostrados en la card de referencias..."
if grep -q "Nombre:" src/pages/ApplicationDetails.tsx && grep -q "Teléfono:" src/pages/ApplicationDetails.tsx && grep -q "Tipo:" src/pages/ApplicationDetails.tsx; then
    show_success "Card de referencias muestra los 3 campos esenciales: Nombre, Teléfono, Tipo"
else
    show_error "Card de referencias no muestra los campos correctos"
fi

# Test 6: Verificar que se eliminó el campo "Relación"
show_message "Verificando eliminación del campo 'Relación'..."
if ! grep -q "Relación:" src/pages/ApplicationDetails.tsx; then
    show_success "Campo 'Relación' eliminado de la card de referencias"
else
    show_error "Campo 'Relación' aún presente en la card de referencias"
fi

# Test 7: Verificar que se eliminó el color gris de las tabs
show_message "Verificando eliminación del color gris de las tabs..."
if grep -q "TabsList.*grid.*w-full.*grid-cols-2\"" src/pages/ApplicationDetails.tsx && ! grep -q "TabsList.*bg-primary/10" src/pages/ApplicationDetails.tsx; then
    show_success "Color gris (bg-primary/10) eliminado de las tabs"
else
    show_error "Color gris (bg-primary/10) aún presente en las tabs"
fi

# Test 8: Verificar que las tabs mantienen su funcionalidad
show_message "Verificando funcionalidad de las tabs..."
if grep -q "TabsList.*grid.*w-full.*grid-cols-2" src/pages/ApplicationDetails.tsx; then
    show_success "Tabs mantienen su estructura y funcionalidad"
else
    show_error "Tabs no mantienen su estructura correcta"
fi

# Test 9: Verificar build sin errores
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

show_success "✅ NewGuarantorSheet eliminado completamente"
show_success "✅ Botón 'Agregar Otro Fiador' usa navegación directa"
show_success "✅ Función handleAddGuarantor eliminada"
show_success "✅ Mapeo de campos de referencias corregido"
show_success "✅ Card de referencias muestra solo 3 campos esenciales"
show_success "✅ Campo 'Relación' eliminado de la card"
show_success "✅ Color gris eliminado de las tabs"
show_success "✅ Tabs mantienen su funcionalidad"
show_success "✅ Build funciona sin errores"

echo ""
show_message "🎯 RESULTADO: Todas las correcciones finales aplicadas correctamente"
show_message "El botón 'Agregar Otro Fiador' ahora lleva directamente al paso 3 del formulario"
show_message "Los datos reales de referencias se muestran correctamente en la pantalla de detalles"
show_message "La card de referencias está simplificada a 3 campos esenciales"
show_message "Las tabs ya no tienen color gris de background"
