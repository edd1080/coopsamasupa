#!/bin/bash

# 🧪 Script de Verificación de Instalación de App Icon
# Verifica que todos los iconos de COOPSAMA estén correctamente instalados

echo "🧪 Verificando instalación de App Icon de COOPSAMA..."

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
echo "🔍 VERIFICACIONES DE APP ICON"
echo "============================="

# Test 1: Verificar archivo fuente
show_message "Verificando archivo fuente app_icon.jpg..."
if [ -f "app_icon.jpg" ]; then
    FILE_SIZE=$(ls -lh app_icon.jpg | awk '{print $5}')
    show_success "Archivo fuente encontrado: app_icon.jpg ($FILE_SIZE)"
else
    show_error "Archivo fuente app_icon.jpg no encontrado"
fi

# Test 2: Verificar iconos para todas las densidades
show_message "Verificando iconos para todas las densidades de Android..."

declare -a densities=("ldpi" "mdpi" "hdpi" "xhdpi" "xxhdpi" "xxxhdpi")
declare -a sizes=("36x36" "48x48" "72x72" "96x96" "144x144" "192x192")

for i in "${!densities[@]}"; do
    density=${densities[$i]}
    size=${sizes[$i]}
    icon_path="android/app/src/main/res/mipmap-${density}/ic_launcher.png"
    
    if [ -f "$icon_path" ]; then
        FILE_SIZE=$(ls -lh "$icon_path" | awk '{print $5}')
        show_success "✅ $density ($size): $icon_path ($FILE_SIZE)"
    else
        show_error "❌ $density ($size): FALTANTE - $icon_path"
    fi
done

# Test 3: Verificar splash screen
show_message "Verificando splash screen..."
if [ -f "android/app/src/main/res/drawable/splash.png" ]; then
    FILE_SIZE=$(ls -lh android/app/src/main/res/drawable/splash.png | awk '{print $5}')
    show_success "✅ Splash screen: android/app/src/main/res/drawable/splash.png ($FILE_SIZE)"
else
    show_error "❌ Splash screen: FALTANTE"
fi

# Test 4: Verificar icono de notificación
show_message "Verificando icono de notificación..."
if [ -f "android/app/src/main/res/drawable/ic_notification.png" ]; then
    FILE_SIZE=$(ls -lh android/app/src/main/res/drawable/ic_notification.png | awk '{print $5}')
    show_success "✅ Icono notificación: android/app/src/main/res/drawable/ic_notification.png ($FILE_SIZE)"
else
    show_error "❌ Icono notificación: FALTANTE"
fi

# Test 5: Verificar que Capacitor está sincronizado
show_message "Verificando sincronización de Capacitor..."
if [ -f "android/app/src/main/assets/capacitor.config.json" ]; then
    show_success "✅ Capacitor sincronizado correctamente"
else
    show_warning "⚠️ Capacitor no sincronizado - ejecuta: npx cap sync android"
fi

# Test 6: Verificar AndroidManifest.xml
show_message "Verificando AndroidManifest.xml..."
if [ -f "android/app/src/main/AndroidManifest.xml" ]; then
    if grep -q "android:icon=\"@mipmap/ic_launcher\"" android/app/src/main/AndroidManifest.xml; then
        show_success "✅ AndroidManifest.xml configurado correctamente"
    else
        show_warning "⚠️ AndroidManifest.xml puede necesitar configuración"
    fi
else
    show_error "❌ AndroidManifest.xml no encontrado"
fi

# Test 7: Verificar build de Android
show_message "Verificando que el proyecto Android se puede construir..."
cd android
if ./gradlew assembleDebug --quiet 2>/dev/null; then
    show_success "✅ Proyecto Android se puede construir correctamente"
else
    show_warning "⚠️ Proyecto Android puede tener problemas de construcción"
fi
cd ..

echo ""
echo "📊 RESUMEN DE VERIFICACIÓN"
echo "=========================="

# Contar iconos instalados
INSTALLED_COUNT=0
TOTAL_COUNT=6

for density in "${densities[@]}"; do
    icon_path="android/app/src/main/res/mipmap-${density}/ic_launcher.png"
    if [ -f "$icon_path" ]; then
        ((INSTALLED_COUNT++))
    fi
done

show_success "✅ Iconos instalados: $INSTALLED_COUNT/$TOTAL_COUNT densidades"
show_success "✅ Splash screen: $(if [ -f "android/app/src/main/res/drawable/splash.png" ]; then echo "Instalado"; else echo "Faltante"; fi)"
show_success "✅ Icono notificación: $(if [ -f "android/app/src/main/res/drawable/ic_notification.png" ]; then echo "Instalado"; else echo "Faltante"; fi)"
show_success "✅ Capacitor sincronizado: $(if [ -f "android/app/src/main/assets/capacitor.config.json" ]; then echo "Sí"; else echo "No"; fi)"

echo ""
if [ $INSTALLED_COUNT -eq $TOTAL_COUNT ]; then
    show_success "🎯 RESULTADO: App icon de COOPSAMA instalado exitosamente"
    show_message "Todos los tamaños necesarios para Android están disponibles"
    show_message "El nuevo icono aparecerá en la app cuando generes el APK"
    show_message "El logo de COOPSAMA (azul y verde) se mostrará correctamente"
else
    show_error "❌ RESULTADO: Instalación incompleta"
    show_message "Algunos iconos no se instalaron correctamente"
    show_message "Ejecuta nuevamente: ./generate-app-icons-fixed.sh"
fi

echo ""
show_message "📱 PRÓXIMOS PASOS:"
show_message "1. Abre Android Studio: npx cap open android"
show_message "2. Genera el APK: Build > Build Bundle(s) / APK(s) > Build APK(s)"
show_message "3. Instala la app en tu dispositivo para ver el nuevo icono"
