#!/bin/bash

# 🎨 Script para Generar App Icons de Android
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
if ! command -v convert &> /dev/null; then
    show_error "ImageMagick no está instalado. Instálalo con: brew install imagemagick"
    exit 1
fi

echo ""
echo "🔍 VERIFICACIONES PREVIAS"
echo "========================"

# Verificar información del archivo fuente
show_message "Verificando archivo fuente app_icon.jpg..."
FILE_INFO=$(file app_icon.jpg)
show_success "Archivo fuente: $FILE_INFO"

# Obtener dimensiones del archivo fuente
SOURCE_DIMENSIONS=$(identify -format "%wx%h" app_icon.jpg)
show_success "Dimensiones fuente: $SOURCE_DIMENSIONS"

echo ""
echo "📱 GENERANDO ICONS PARA ANDROID"
echo "=============================="

# Crear directorio de trabajo temporal
TEMP_DIR="temp_icons"
mkdir -p "$TEMP_DIR"

# Definir tamaños necesarios para Android
declare -A ANDROID_SIZES=(
    ["ldpi"]="36x36"
    ["mdpi"]="48x48"
    ["hdpi"]="72x72"
    ["xhdpi"]="96x96"
    ["xxhdpi"]="144x144"
    ["xxxhdpi"]="192x192"
)

# Generar iconos para cada densidad
for density in "${!ANDROID_SIZES[@]}"; do
    size=${ANDROID_SIZES[$density]}
    show_message "Generando icono para $density ($size)..."
    
    # Crear el icono redimensionado
    convert app_icon.jpg -resize "${size}!" -quality 95 "$TEMP_DIR/ic_launcher_${density}.png"
    
    if [ $? -eq 0 ]; then
        show_success "✅ Icono $density generado: $TEMP_DIR/ic_launcher_${density}.png"
    else
        show_error "❌ Error generando icono $density"
    fi
done

echo ""
echo "📁 INSTALANDO ICONS EN ANDROID"
echo "=============================="

# Instalar iconos en las carpetas correspondientes de Android
for density in "${!ANDROID_SIZES[@]}"; do
    target_dir="android/app/src/main/res/mipmap-${density}"
    
    # Crear directorio si no existe
    mkdir -p "$target_dir"
    
    # Copiar icono
    cp "$TEMP_DIR/ic_launcher_${density}.png" "$target_dir/ic_launcher.png"
    
    if [ $? -eq 0 ]; then
        show_success "✅ Icono instalado en: $target_dir/ic_launcher.png"
    else
        show_error "❌ Error instalando icono en $target_dir"
    fi
done

echo ""
echo "🎨 GENERANDO ICONS ADICIONALES"
echo "=============================="

# Generar icono para splash screen (si es necesario)
show_message "Generando icono para splash screen..."
convert app_icon.jpg -resize "480x320!" -quality 95 "$TEMP_DIR/splash.png"
cp "$TEMP_DIR/splash.png" "android/app/src/main/res/drawable/splash.png"
show_success "✅ Splash screen actualizado"

# Generar icono para notification (si es necesario)
show_message "Generando icono para notificaciones..."
convert app_icon.jpg -resize "24x24!" -quality 95 "$TEMP_DIR/ic_notification.png"
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
for density in "${!ANDROID_SIZES[@]}"; do
    target_file="android/app/src/main/res/mipmap-${density}/ic_launcher.png"
    if [ -f "$target_file" ]; then
        show_success "✅ $density: $target_file"
    else
        show_error "❌ $density: FALTANTE"
    fi
done

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
