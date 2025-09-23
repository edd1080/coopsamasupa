#!/bin/bash

# 🧪 Script de Verificación Completa del Sistema
# Ejecuta todas las verificaciones y genera un reporte completo

echo "🧪 Iniciando verificación completa del sistema..."

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

# Variables para el reporte
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0
WARNINGS=0

# Función para ejecutar test
run_test() {
    local test_name="$1"
    local test_command="$2"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    show_message "Ejecutando: $test_name"
    
    if eval "$test_command" > /dev/null 2>&1; then
        show_success "✅ $test_name - PASSED"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        return 0
    else
        show_error "❌ $test_name - FAILED"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        return 1
    fi
}

# Función para verificar warning
check_warning() {
    local test_name="$1"
    local test_command="$2"
    
    if eval "$test_command" > /dev/null 2>&1; then
        show_warning "⚠️  $test_name - WARNING"
        WARNINGS=$((WARNINGS + 1))
    fi
}

echo "=========================================="
echo "🧪 VERIFICACIÓN COMPLETA DEL SISTEMA"
echo "=========================================="

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    show_error "No se encontró package.json. Asegúrate de estar en el directorio raíz del proyecto."
    exit 1
fi

echo ""
echo "📋 VERIFICACIONES BÁSICAS"
echo "=========================="

# Test 1: Dependencias de Capacitor
run_test "Dependencias de Capacitor" "npm list @capacitor/core @capacitor/cli @capacitor/android"

# Test 2: Build de producción
run_test "Build de producción" "npm run build"

# Test 3: Sincronización con Capacitor
run_test "Sincronización con Capacitor" "npx cap sync android"

# Test 4: Proyecto Android existe
run_test "Proyecto Android existe" "[ -d 'android' ] && [ -f 'android/app/build.gradle' ]"

echo ""
echo "🔧 VERIFICACIONES DE CÓDIGO"
echo "============================"

# Test 5: Campo sco_id removido de tipos
run_test "Campo sco_id removido de tipos" "! grep -q 'sco_id' src/integrations/supabase/types.ts"

# Test 6: Campo sco_id removido de useFinalizeApplication
run_test "Campo sco_id removido de useFinalizeApplication" "! grep -q 'sco_id' src/hooks/useFinalizeApplication.tsx"

# Test 7: Campo sco_id removido de coopsama-integration
run_test "Campo sco_id removido de coopsama-integration" "! grep -q 'sco_id' supabase/functions/coopsama-integration/index.ts"

# Test 8: spouseBirthDate configurado para null
run_test "spouseBirthDate configurado para null" "grep -q 'spouseBirthDate.*null' src/utils/fieldMapper.ts"

# Test 9: Migración de sco_id eliminada
run_test "Migración de sco_id eliminada" "[ ! -f 'supabase/migrations/20250120000000_add_sco_id_to_applications.sql' ]"

echo ""
echo "📱 VERIFICACIONES DE ANDROID"
echo "============================="

# Test 10: Configuración de Capacitor
run_test "Configuración de Capacitor" "[ -f 'capacitor.config.ts' ]"

# Test 11: Plugin de cámara instalado
run_test "Plugin de cámara instalado" "grep -q '@capacitor/camera' package.json"

# Test 12: Plugin de splash screen instalado
run_test "Plugin de splash screen instalado" "grep -q '@capacitor/splash-screen' package.json"

# Test 13: Plugin de status bar instalado
run_test "Plugin de status bar instalado" "grep -q '@capacitor/status-bar' package.json"

echo ""
echo "⚠️  VERIFICACIONES DE WARNINGS"
echo "==============================="

# Warning 1: Verificar que no haya referencias a sco_id en el build
check_warning "Referencias a sco_id en build" "npm run build 2>&1 | grep -q 'sco_id'"

# Warning 2: Verificar tamaño del build
BUILD_SIZE=$(du -sh dist 2>/dev/null | cut -f1)
if [ -n "$BUILD_SIZE" ]; then
    show_message "Tamaño del build: $BUILD_SIZE"
fi

echo ""
echo "📊 REPORTE FINAL"
echo "================="
echo "Total de tests: $TOTAL_TESTS"
echo "✅ Tests pasados: $PASSED_TESTS"
echo "❌ Tests fallidos: $FAILED_TESTS"
echo "⚠️  Warnings: $WARNINGS"

if [ $FAILED_TESTS -eq 0 ]; then
    show_success "🎉 ¡TODOS LOS TESTS PASARON!"
    show_message "El sistema está listo para generar APK"
    echo ""
    echo "🚀 PRÓXIMOS PASOS:"
    echo "1. Ejecutar: ./generate-apk.sh"
    echo "2. Instalar APK en dispositivo"
    echo "3. Probar funcionalidad de envío de solicitudes"
    exit 0
else
    show_error "❌ ALGUNOS TESTS FALLARON"
    show_message "Revisa los errores antes de continuar"
    exit 1
fi
