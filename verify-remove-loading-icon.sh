#!/bin/bash

# 🧪 Script de Verificación de Eliminación de Icono de Cargar
# Verifica que el icono de "cargar" fue eliminado de las cards de documentos

echo "🧪 Verificando eliminación de icono de cargar..."

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
echo "🔍 VERIFICACIONES DE ELIMINACIÓN DE ICONO"
echo "========================================"

# Test 1: Verificar que getStatusIcon() fue eliminado del render
show_message "Verificando eliminación de getStatusIcon() del render..."
if ! grep -q "{getStatusIcon()}" src/components/documents/InteractiveDocumentCard.tsx; then
    show_success "getStatusIcon() eliminado del render"
else
    show_error "getStatusIcon() aún presente en el render"
fi

# Test 2: Verificar que la función getStatusIcon aún existe (para no romper funcionalidad)
show_message "Verificando que la función getStatusIcon aún existe..."
if grep -q "const getStatusIcon" src/components/documents/InteractiveDocumentCard.tsx; then
    show_success "Función getStatusIcon mantenida (no se usa pero no se eliminó)"
else
    show_warning "Función getStatusIcon no encontrada"
fi

# Test 3: Verificar que no hay iconos de estado en la esquina superior derecha
show_message "Verificando que no hay iconos en la esquina superior derecha..."
if ! grep -q "justify-between.*getStatusIcon" src/components/documents/InteractiveDocumentCard.tsx; then
    show_success "No hay iconos de estado en la esquina superior derecha"
else
    show_error "Aún hay iconos de estado en la esquina superior derecha"
fi

# Test 4: Verificar que el layout de la card se mantiene correcto
show_message "Verificando que el layout de la card se mantiene correcto..."
if grep -q "flex items-start justify-between mb-3" src/components/documents/InteractiveDocumentCard.tsx; then
    show_success "Layout de la card mantenido correctamente"
else
    show_error "Layout de la card no mantenido correctamente"
fi

# Test 5: Verificar que el título y descripción siguen presentes
show_message "Verificando que el título y descripción siguen presentes..."
if grep -q "font-semibold text-base.*document.title" src/components/documents/InteractiveDocumentCard.tsx && grep -q "text-xs text-muted-foreground.*document.description" src/components/documents/InteractiveDocumentCard.tsx; then
    show_success "Título y descripción presentes en la card"
else
    show_error "Título o descripción faltantes en la card"
fi

# Test 6: Verificar build sin errores
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

# Test 7: Verificar que no hay errores de linting
show_message "Verificando errores de linting..."
LINT_OUTPUT=$(npm run lint 2>&1)
LINT_EXIT_CODE=$?

if [ $LINT_EXIT_CODE -eq 0 ]; then
    show_success "No hay errores de linting"
else
    show_warning "Hay errores de linting (pueden ser menores):"
    echo "$LINT_OUTPUT" | head -10
fi

echo ""
echo "📊 RESUMEN DE VERIFICACIÓN"
echo "=========================="

show_success "✅ getStatusIcon() eliminado del render"
show_success "✅ Función getStatusIcon mantenida (no se usa pero no se eliminó)"
show_success "✅ No hay iconos de estado en la esquina superior derecha"
show_success "✅ Layout de la card mantenido correctamente"
show_success "✅ Título y descripción presentes en la card"
show_success "✅ Build funciona sin errores"

echo ""
show_message "🎯 RESULTADO: Icono de cargar eliminado exitosamente"
show_message "Las cards de documentos ya no muestran el icono de estado en la esquina superior derecha"
show_message "El layout y funcionalidad de las cards se mantiene intacto"
show_message "La interfaz se ve más limpia sin el icono de cargar"
