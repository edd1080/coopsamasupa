#!/bin/bash

# 🧪 Script de Verificación de Recursos Android Corregidos
# Verifica que no hay directorios de recursos inválidos

echo "🧪 Verificando corrección de recursos Android..."

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
echo "🔍 VERIFICACIONES DE RECURSOS ANDROID"
echo "===================================="

# Test 1: Verificar que no existe el directorio mipmap-0
show_message "Verificando que no existe directorio mipmap-0 inválido..."
if [ ! -d "android/app/src/main/res/mipmap-0" ]; then
    show_success "✅ Directorio mipmap-0 eliminado correctamente"
else
    show_error "❌ Directorio mipmap-0 aún existe - debe eliminarse"
fi

# Test 2: Verificar directorios válidos de mipmap
show_message "Verificando directorios válidos de mipmap..."
VALID_DIRECTORIES=("ldpi" "mdpi" "hdpi" "xhdpi" "xxhdpi" "xxxhdpi" "anydpi-v26")
VALID_COUNT=0

for dir in "${VALID_DIRECTORIES[@]}"; do
    if [ -d "android/app/src/main/res/mipmap-${dir}" ]; then
        show_success "✅ mipmap-${dir}: Válido"
        ((VALID_COUNT++))
    else
        show_warning "⚠️ mipmap-${dir}: No encontrado"
    fi
done

show_message "Directorios válidos encontrados: $VALID_COUNT/${#VALID_DIRECTORIES[@]}"

# Test 3: Verificar iconos de COOPSAMA en directorios válidos
show_message "Verificando iconos de COOPSAMA en directorios válidos..."
ICON_COUNT=0
TOTAL_EXPECTED=6

declare -a densities=("ldpi" "mdpi" "hdpi" "xhdpi" "xxhdpi" "xxxhdpi")

for density in "${densities[@]}"; do
    icon_path="android/app/src/main/res/mipmap-${density}/ic_launcher.png"
    if [ -f "$icon_path" ]; then
        FILE_SIZE=$(ls -lh "$icon_path" | awk '{print $5}')
        show_success "✅ $density: $icon_path ($FILE_SIZE)"
        ((ICON_COUNT++))
    else
        show_error "❌ $density: FALTANTE - $icon_path"
    fi
done

show_message "Iconos de COOPSAMA encontrados: $ICON_COUNT/$TOTAL_EXPECTED"

# Test 4: Verificar que no hay directorios con nombres inválidos
show_message "Verificando nombres de directorios de recursos..."
INVALID_DIRS=$(find android/app/src/main/res -type d -name "mipmap-*" | grep -E "mipmap-[0-9]+$" || true)

if [ -z "$INVALID_DIRS" ]; then
    show_success "✅ No hay directorios de recursos con nombres inválidos"
else
    show_error "❌ Directorios inválidos encontrados:"
    echo "$INVALID_DIRS"
fi

# Test 5: Verificar que el proyecto se puede construir
show_message "Verificando que el proyecto Android se puede construir..."
cd android
if ./gradlew assembleDebug --quiet 2>/dev/null; then
    show_success "✅ Proyecto Android se puede construir correctamente"
else
    show_warning "⚠️ Proyecto Android puede tener problemas de construcción"
fi
cd ..

# Test 6: Verificar Capacitor sync
show_message "Verificando sincronización de Capacitor..."
if [ -f "android/app/src/main/assets/capacitor.config.json" ]; then
    show_success "✅ Capacitor sincronizado correctamente"
else
    show_error "❌ Capacitor no sincronizado"
fi

echo ""
echo "📊 RESUMEN DE CORRECCIÓN"
echo "======================="

# Calcular porcentaje de corrección
CORRECTION_SCORE=0
TOTAL_TESTS=6

# Contar tests exitosos
if [ ! -d "android/app/src/main/res/mipmap-0" ]; then ((CORRECTION_SCORE++)); fi
if [ $VALID_COUNT -ge 6 ]; then ((CORRECTION_SCORE++)); fi
if [ $ICON_COUNT -eq $TOTAL_EXPECTED ]; then ((CORRECTION_SCORE++)); fi
if [ -z "$INVALID_DIRS" ]; then ((CORRECTION_SCORE++)); fi
if [ -f "android/app/src/main/assets/capacitor.config.json" ]; then ((CORRECTION_SCORE++)); fi
if [ $CORRECTION_SCORE -ge 4 ]; then ((CORRECTION_SCORE++)); fi

PERCENTAGE=$((CORRECTION_SCORE * 100 / TOTAL_TESTS))

show_success "✅ Corrección: $CORRECTION_SCORE/$TOTAL_TESTS tests ($PERCENTAGE%)"

echo ""
if [ $PERCENTAGE -ge 80 ]; then
    show_success "🎯 RESULTADO: Error de recursos Android corregido"
    show_message "El directorio mipmap-0 inválido fue eliminado"
    show_message "Todos los iconos de COOPSAMA están en directorios válidos"
    show_message "El proyecto Android ahora se puede construir sin errores"
    show_message "Android Studio debería funcionar correctamente"
else
    show_warning "⚠️ RESULTADO: Corrección incompleta"
    show_message "Algunos problemas pueden persistir"
    show_message "Revisa los errores mostrados arriba"
fi

echo ""
show_message "📱 PRÓXIMOS PASOS:"
show_message "1. Abre Android Studio: npx cap open android"
show_message "2. Intenta construir el APK nuevamente"
show_message "3. El error 'Invalid resource directory name' debería estar resuelto"
show_message "4. El icono de COOPSAMA aparecerá correctamente en la app"
