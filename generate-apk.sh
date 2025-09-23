#!/bin/bash

# 📱 Script para Generar APK de Coopsama
# Este script automatiza el proceso de generación del APK

echo "🚀 Iniciando generación de APK para Coopsama..."

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

# Paso 1: Build de la aplicación web
show_message "Paso 1: Generando build de producción..."
npm run build
if [ $? -eq 0 ]; then
    show_success "Build de producción completado"
else
    show_error "Error en el build de producción"
    exit 1
fi

# Paso 2: Sincronizar con Capacitor
show_message "Paso 2: Sincronizando con Capacitor..."
npx cap sync android
if [ $? -eq 0 ]; then
    show_success "Sincronización con Android completada"
else
    show_error "Error en la sincronización con Android"
    exit 1
fi

# Paso 3: Generar APK usando Gradle
show_message "Paso 3: Generando APK con Gradle..."
cd android

# Limpiar build anterior
./gradlew clean

# Generar APK de debug
show_message "Generando APK de debug..."
./gradlew assembleDebug

if [ $? -eq 0 ]; then
    show_success "APK de debug generado exitosamente"
    
    # Buscar el APK generado
    APK_PATH=$(find . -name "*.apk" -path "*/debug/*" | head -1)
    if [ -n "$APK_PATH" ]; then
        show_success "APK encontrado en: $APK_PATH"
        show_message "Tamaño del APK: $(du -h "$APK_PATH" | cut -f1)"
    else
        show_warning "No se pudo encontrar el APK generado"
    fi
else
    show_error "Error al generar APK de debug"
    exit 1
fi

# Generar APK de release (opcional)
read -p "¿Deseas generar también el APK de release? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    show_message "Generando APK de release..."
    ./gradlew assembleRelease
    
    if [ $? -eq 0 ]; then
        show_success "APK de release generado exitosamente"
        
        # Buscar el APK de release
        RELEASE_APK_PATH=$(find . -name "*.apk" -path "*/release/*" | head -1)
        if [ -n "$RELEASE_APK_PATH" ]; then
            show_success "APK de release encontrado en: $RELEASE_APK_PATH"
            show_message "Tamaño del APK: $(du -h "$RELEASE_APK_PATH" | cut -f1)"
        else
            show_warning "No se pudo encontrar el APK de release generado"
        fi
    else
        show_error "Error al generar APK de release"
    fi
fi

cd ..

show_success "🎉 Proceso completado!"
show_message "Los APKs se encuentran en: android/app/build/outputs/apk/"
show_message "Para instalar en un dispositivo: adb install <ruta-del-apk>"
