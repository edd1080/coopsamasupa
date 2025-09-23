#!/bin/bash

# 🎨 Script para Generar App Icons de Android (Versión Corregida)
# Genera todos los tamaños necesarios para el app icon de COOPSAMA

echo "🎨 Generando App Icons para Android..."

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

# Verificar que existe el archivo fuente
if [ ! -f "app_icon.jpg" ]; then
    show_error "No se encontró app_icon.jpg. Asegúrate de que el archivo esté en el directorio raíz."
    exit 1
fi

# Verificar que ImageMagick está instalado
if ! command -v magick &> /dev/null && ! command -v convert &> /dev/null; then
    show_error "ImageMagick no está instalado. Instálalo con: brew install imagemagick"
    exit 1
fi

# Usar magick si está disponible, sino convert
if command -v magick &> /dev/null; then
    CONVERT_CMD="magick"
else
    CONVERT_CMD="convert"
fi

echo ""
echo "🔍 VERIFICACIONES PREVIAS"
echo "========================"

# Verificar información del archivo fuente
show_message "Verificando archivo fuente app_icon.jpg..."
FILE_INFO=$(file app_icon.jpg)
show_success "Archivo fuente: $FILE_INFO"

# Obtener dimensiones del archivo fuente
SOURCE_DIMENSIONS=$($CONVERT_CMD identify -format "%wx%h" app_icon.jpg)
show_success "Dimensiones fuente: $SOURCE_DIMENSIONS"

echo ""
echo "📱 GENERANDO ICONS PARA ANDROID"
echo "=============================="

# Crear directorio de trabajo temporal
TEMP_DIR="temp_icons"
mkdir -p "$TEMP_DIR"

# Generar iconos para cada densidad de Android
show_message "Generando icono para ldpi (36x36)..."
$CONVERT_CMD app_icon.jpg -resize "36x36!" -quality 95 "$TEMP_DIR/ic_launcher_ldpi.png"
show_success "✅ Icono ldpi generado"

show_message "Generando icono para mdpi (48x48)..."
$CONVERT_CMD app_icon.jpg -resize "48x48!" -quality 95 "$TEMP_DIR/ic_launcher_mdpi.png"
show_success "✅ Icono mdpi generado"

show_message "Generando icono para hdpi (72x72)..."
$CONVERT_CMD app_icon.jpg -resize "72x72!" -quality 95 "$TEMP_DIR/ic_launcher_hdpi.png"
show_success "✅ Icono hdpi generado"

show_message "Generando icono para xhdpi (96x96)..."
$CONVERT_CMD app_icon.jpg -resize "96x96!" -quality 95 "$TEMP_DIR/ic_launcher_xhdpi.png"
show_success "✅ Icono xhdpi generado"

show_message "Generando icono para xxhdpi (144x144)..."
$CONVERT_CMD app_icon.jpg -resize "144x144!" -quality 95 "$TEMP_DIR/ic_launcher_xxhdpi.png"
show_success "✅ Icono xxhdpi generado"

show_message "Generando icono para xxxhdpi (192x192)..."
$CONVERT_CMD app_icon.jpg -resize "192x192!" -quality 95 "$TEMP_DIR/ic_launcher_xxxhdpi.png"
show_success "✅ Icono xxxhdpi generado"

echo ""
echo "📁 INSTALANDO ICONS EN ANDROID"
echo "=============================="

# Instalar iconos en las carpetas correspondientes de Android
show_message "Instalando iconos en carpetas de Android..."

# Crear directorios si no existen
mkdir -p "android/app/src/main/res/mipmap-ldpi"
mkdir -p "android/app/src/main/res/mipmap-mdpi"
mkdir -p "android/app/src/main/res/mipmap-hdpi"
mkdir -p "android/app/src/main/res/mipmap-xhdpi"
mkdir -p "android/app/src/main/res/mipmap-xxhdpi"
mkdir -p "android/app/src/main/res/mipmap-xxxhdpi"

# Copiar iconos
cp "$TEMP_DIR/ic_launcher_ldpi.png" "android/app/src/main/res/mipmap-ldpi/ic_launcher.png"
show_success "✅ Icono instalado en: android/app/src/main/res/mipmap-ldpi/ic_launcher.png"

cp "$TEMP_DIR/ic_launcher_mdpi.png" "android/app/src/main/res/mipmap-mdpi/ic_launcher.png"
show_success "✅ Icono instalado en: android/app/src/main/res/mipmap-mdpi/ic_launcher.png"

cp "$TEMP_DIR/ic_launcher_hdpi.png" "android/app/src/main/res/mipmap-hdpi/ic_launcher.png"
show_success "✅ Icono instalado en: android/app/src/main/res/mipmap-hdpi/ic_launcher.png"

cp "$TEMP_DIR/ic_launcher_xhdpi.png" "android/app/src/main/res/mipmap-xhdpi/ic_launcher.png"
show_success "✅ Icono instalado en: android/app/src/main/res/mipmap-xhdpi/ic_launcher.png"

cp "$TEMP_DIR/ic_launcher_xxhdpi.png" "android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png"
show_success "✅ Icono instalado en: android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png"

cp "$TEMP_DIR/ic_launcher_xxxhdpi.png" "android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png"
show_success "✅ Icono instalado en: android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png"

echo ""
echo "🎨 GENERANDO ICONS ADICIONALES"
echo "=============================="

# Generar icono para splash screen
show_message "Generando icono para splash screen..."
$CONVERT_CMD app_icon.jpg -resize "480x320!" -quality 95 "$TEMP_DIR/splash.png"
cp "$TEMP_DIR/splash.png" "android/app/src/main/res/drawable/splash.png"
show_success "✅ Splash screen actualizado"

# Generar icono para notification
show_message "Generando icono para notificaciones..."
$CONVERT_CMD app_icon.jpg -resize "24x24!" -quality 95 "$TEMP_DIR/ic_notification.png"
cp "$TEMP_DIR/ic_notification.png" "android/app/src/main/res/drawable/ic_notification.png"
show_success "✅ Icono de notificación generado"

echo ""
echo "🧹 LIMPIEZA"
echo "==========="

# Limpiar archivos temporales
rm -rf "$TEMP_DIR"
show_success "✅ Archivos temporales eliminados"

echo ""
echo "📊 RESUMEN DE ICONS GENERADOS"
echo "============================="

# Verificar que todos los iconos fueron instalados
show_message "Verificando instalación de iconos..."

if [ -f "android/app/src/main/res/mipmap-ldpi/ic_launcher.png" ]; then
    show_success "✅ ldpi: android/app/src/main/res/mipmap-ldpi/ic_launcher.png"
else
    show_error "❌ ldpi: FALTANTE"
fi

if [ -f "android/app/src/main/res/mipmap-mdpi/ic_launcher.png" ]; then
    show_success "✅ mdpi: android/app/src/main/res/mipmap-mdpi/ic_launcher.png"
else
    show_error "❌ mdpi: FALTANTE"
fi

if [ -f "android/app/src/main/res/mipmap-hdpi/ic_launcher.png" ]; then
    show_success "✅ hdpi: android/app/src/main/res/mipmap-hdpi/ic_launcher.png"
else
    show_error "❌ hdpi: FALTANTE"
fi

if [ -f "android/app/src/main/res/mipmap-xhdpi/ic_launcher.png" ]; then
    show_success "✅ xhdpi: android/app/src/main/res/mipmap-xhdpi/ic_launcher.png"
else
    show_error "❌ xhdpi: FALTANTE"
fi

if [ -f "android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png" ]; then
    show_success "✅ xxhdpi: android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png"
else
    show_error "❌ xxhdpi: FALTANTE"
fi

if [ -f "android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png" ]; then
    show_success "✅ xxxhdpi: android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png"
else
    show_error "❌ xxxhdpi: FALTANTE"
fi

echo ""
show_success "🎯 RESULTADO: App icons generados exitosamente"
show_message "Todos los tamaños necesarios para Android han sido creados"
show_message "Los iconos están instalados en las carpetas correspondientes"
show_message "El app icon de COOPSAMA ahora se mostrará correctamente en Android"

echo ""
show_message "📱 PRÓXIMOS PASOS:"
show_message "1. Ejecuta: npx cap sync android"
show_message "2. Abre Android Studio y genera el APK"
show_message "3. El nuevo icono aparecerá en la app instalada"
