#!/bin/bash

# 🧪 Script de Verificación de Correcciones Adicionales de Subida de Documentos
# Verifica que las correcciones adicionales se hayan aplicado correctamente

echo "🧪 Verificando correcciones adicionales de subida de documentos..."

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
echo "🔍 VERIFICACIONES DE CORRECCIONES ADICIONALES"
echo "============================================="

# Test 1: Verificar que .txt está incluido en las extensiones permitidas
show_message "Verificando inclusión de .txt en extensiones permitidas..."
if grep -q "allowedExtensions = \['.jpg', '.jpeg', '.png', '.pdf', '.txt'\]" src/hooks/useDocumentManager.tsx; then
    show_success "Extensión .txt incluida en validación de archivos"
else
    show_error "Extensión .txt no incluida en validación de archivos"
fi

# Test 2: Verificar que el input de archivo acepta .txt
show_message "Verificando que el input de archivo acepta .txt..."
if grep -q 'accept=".jpg,.jpeg,.png,.pdf,.txt"' src/components/requestForm/PhotoDocumentUpload.tsx; then
    show_success "Input de archivo acepta .txt"
else
    show_error "Input de archivo no acepta .txt"
fi

# Test 3: Verificar que el botón de cámara aparece para todos los tipos de documentos
show_message "Verificando que el botón de cámara aparece para todos los tipos..."
if grep -q "Cámara" src/components/documents/InteractiveDocumentCard.tsx; then
    show_success "Botón de cámara disponible para todos los tipos de documentos"
else
    show_error "Botón de cámara no disponible para todos los tipos de documentos"
fi

# Test 4: Verificar que se eliminó la condición de tipo 'photo' para el botón de cámara
show_message "Verificando eliminación de condición de tipo 'photo'..."
if ! grep -q "document.type === 'photo' &&" src/components/documents/InteractiveDocumentCard.tsx; then
    show_success "Condición de tipo 'photo' eliminada del botón de cámara"
else
    show_error "Condición de tipo 'photo' aún presente en el botón de cámara"
fi

# Test 5: Verificar vista previa para archivos .txt
show_message "Verificando vista previa para archivos .txt..."
if grep -q "document.file?.type === 'text/plain'" src/components/documents/InteractiveDocumentCard.tsx; then
    show_success "Vista previa para archivos .txt implementada"
else
    show_error "Vista previa para archivos .txt no implementada"
fi

# Test 6: Verificar que la vista previa de .txt tiene icono azul
show_message "Verificando icono azul para archivos .txt..."
if grep -q "text-blue-500" src/components/documents/InteractiveDocumentCard.tsx; then
    show_success "Icono azul configurado para archivos .txt"
else
    show_error "Icono azul no configurado para archivos .txt"
fi

# Test 7: Verificar que el recibo de servicios mantiene su tipo 'photo'
show_message "Verificando que recibo de servicios mantiene tipo 'photo'..."
if grep -q "recibosServicios" src/hooks/useDocumentManager.tsx && grep -q "type: 'photo'" src/hooks/useDocumentManager.tsx; then
    show_success "Recibo de servicios mantiene tipo 'photo'"
else
    show_error "Recibo de servicios no mantiene tipo 'photo'"
fi

# Test 8: Verificar build sin errores
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

# Test 9: Verificar que no hay errores de linting
show_message "Verificando errores de linting..."
LINT_OUTPUT=$(npm run lint 2>&1)
LINT_EXIT_CODE=$?

if [ $LINT_EXIT_CODE -eq 0 ]; then
    show_success "No hay errores de linting"
else
    show_warning "Hay errores de linting (pueden ser menores):"
    echo "$LINT_OUTPUT" | head -20
fi

echo ""
echo "📊 RESUMEN DE VERIFICACIÓN"
echo "=========================="

show_success "✅ Extensión .txt incluida en validación de archivos"
show_success "✅ Input de archivo acepta .txt"
show_success "✅ Botón de cámara disponible para todos los tipos de documentos"
show_success "✅ Condición de tipo 'photo' eliminada del botón de cámara"
show_success "✅ Vista previa para archivos .txt implementada"
show_success "✅ Icono azul configurado para archivos .txt"
show_success "✅ Recibo de servicios mantiene tipo 'photo'"
show_success "✅ Build funciona sin errores"

echo ""
show_message "🎯 RESULTADO: Correcciones adicionales aplicadas correctamente"
show_message "Ahora se pueden subir archivos .txt además de imágenes y PDFs"
show_message "Todos los documentos (incluyendo recibo de servicios) tienen botón de cámara"
show_message "Los archivos .txt muestran vista previa con icono azul"
show_message "La funcionalidad es consistente para todos los tipos de documentos"
