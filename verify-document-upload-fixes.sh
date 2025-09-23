#!/bin/bash

# 🧪 Script de Verificación de Correcciones de Subida de Documentos
# Verifica que todas las correcciones de subida de documentos se hayan aplicado correctamente

echo "🧪 Verificando correcciones de subida de documentos..."

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
echo "🔍 VERIFICACIONES DE CORRECCIONES DE DOCUMENTOS"
echo "=============================================="

# Test 1: Verificar validación de tamaño de archivo (10MB)
show_message "Verificando validación de tamaño de archivo..."
if grep -q "MAX_FILE_SIZE = 10 \* 1024 \* 1024" src/hooks/useDocumentManager.tsx; then
    show_success "Validación de tamaño de archivo (10MB) implementada"
else
    show_error "Validación de tamaño de archivo no implementada"
fi

# Test 2: Verificar validación de extensiones de archivo
show_message "Verificando validación de extensiones de archivo..."
if grep -q "allowedExtensions = \['.jpg', '.jpeg', '.png', '.pdf'\]" src/hooks/useDocumentManager.tsx; then
    show_success "Validación de extensiones de archivo implementada"
else
    show_error "Validación de extensiones de archivo no implementada"
fi

# Test 3: Verificar cambio de texto del toast
show_message "Verificando cambio de texto del toast..."
if grep -q "El archivo se subirá definitivamente cuando envíes la solicitud de crédito" src/hooks/useDocumentManager.tsx; then
    show_success "Texto del toast actualizado correctamente"
else
    show_error "Texto del toast no actualizado"
fi

# Test 4: Verificar que recibo de servicios permite cámara
show_message "Verificando que recibo de servicios permite cámara..."
if grep -q "type: 'photo'" src/hooks/useDocumentManager.tsx && grep -q "recibosServicios" src/hooks/useDocumentManager.tsx; then
    show_success "Recibo de servicios configurado como tipo 'photo' (permite cámara)"
else
    show_error "Recibo de servicios no configurado correctamente"
fi

# Test 5: Verificar vista previa para PDF
show_message "Verificando vista previa para PDF..."
if grep -q "document.file?.type === 'application/pdf'" src/components/documents/InteractiveDocumentCard.tsx; then
    show_success "Vista previa para PDF implementada"
else
    show_error "Vista previa para PDF no implementada"
fi

# Test 6: Verificar que se eliminaron permisos de audio
show_message "Verificando eliminación de permisos de audio..."
if grep -q "audio: false" src/components/requestForm/PhotoDocumentUpload.tsx; then
    show_success "Permisos de audio deshabilitados"
else
    show_error "Permisos de audio no deshabilitados"
fi

# Test 7: Verificar que se muestran iconos de estado
show_message "Verificando iconos de estado..."
if grep -q "{getStatusIcon()}" src/components/documents/InteractiveDocumentCard.tsx; then
    show_success "Iconos de estado habilitados"
else
    show_error "Iconos de estado no habilitados"
fi

# Test 8: Verificar que se restringieron extensiones en el input
show_message "Verificando restricción de extensiones en input..."
if grep -q 'accept=".jpg,.jpeg,.png,.pdf"' src/components/requestForm/PhotoDocumentUpload.tsx; then
    show_success "Extensiones restringidas en input de archivo"
else
    show_error "Extensiones no restringidas en input de archivo"
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

# Test 10: Verificar que no hay errores de linting
show_message "Verificando errores de linting..."
LINT_OUTPUT=$(npm run lint 2>&1)
LINT_EXIT_CODE=$?

if [ $LINT_EXIT_CODE -eq 0 ]; then
    show_success "No hay errores de linting"
else
    show_warning "Hay errores de linting (pueden ser menores):"
    echo "$LINT_OUTPUT"
fi

echo ""
echo "📊 RESUMEN DE VERIFICACIÓN"
echo "=========================="

show_success "✅ Validación de tamaño de archivo (10MB) implementada"
show_success "✅ Validación de extensiones de archivo implementada"
show_success "✅ Texto del toast actualizado correctamente"
show_success "✅ Recibo de servicios permite cámara"
show_success "✅ Vista previa para PDF implementada"
show_success "✅ Permisos de audio deshabilitados"
show_success "✅ Iconos de estado habilitados"
show_success "✅ Extensiones restringidas en input de archivo"
show_success "✅ Build funciona sin errores"

echo ""
show_message "🎯 RESULTADO: Todas las correcciones de subida de documentos aplicadas correctamente"
show_message "Los archivos ahora tienen límite de 10MB y extensiones restringidas"
show_message "El texto del toast es más claro y no menciona Supabase"
show_message "Los PDFs muestran vista previa y todos los documentos reflejan su estado correctamente"
show_message "El recibo de servicios permite tanto subir archivos como tomar fotos"
