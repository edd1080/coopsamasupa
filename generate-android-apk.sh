#!/bin/bash

echo "🚀 GENERADOR DE APK ANDROID - COOPSAMA APP"
echo "=========================================="

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para mostrar mensajes con color
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    print_error "No se encontró package.json. Ejecuta este script desde la raíz del proyecto."
    exit 1
fi

if [ ! -d "android" ]; then
    print_error "No se encontró el directorio android. Ejecuta 'npx cap add android' primero."
    exit 1
fi

print_status "Iniciando proceso de generación de APK..."

# Paso 1: Limpiar build anterior
print_status "1. Limpiando builds anteriores..."
if [ -d "dist" ]; then
    rm -rf dist
    print_success "Directorio dist limpiado"
fi

if [ -d "android/app/build" ]; then
    rm -rf android/app/build
    print_success "Build de Android limpiado"
fi

# Paso 2: Instalar dependencias
print_status "2. Verificando dependencias..."
if [ ! -d "node_modules" ]; then
    print_status "Instalando dependencias..."
    npm install --legacy-peer-deps
    if [ $? -eq 0 ]; then
        print_success "Dependencias instaladas"
    else
        print_error "Error instalando dependencias"
        exit 1
    fi
else
    print_success "Dependencias ya instaladas"
fi

# Paso 3: Build de la aplicación web
print_status "3. Construyendo aplicación web..."
npm run build
if [ $? -eq 0 ]; then
    print_success "Build web completado"
else
    print_error "Error en build web"
    exit 1
fi

# Paso 4: Sincronizar con Android
print_status "4. Sincronizando con Android..."
npx cap sync android
if [ $? -eq 0 ]; then
    print_success "Sincronización con Android completada"
else
    print_error "Error en sincronización con Android"
    exit 1
fi

# Paso 5: Generar APK Debug
print_status "5. Generando APK Debug..."
cd android
./gradlew assembleDebug
if [ $? -eq 0 ]; then
    print_success "APK Debug generado exitosamente"
else
    print_error "Error generando APK Debug"
    cd ..
    exit 1
fi

# Paso 6: Generar APK Release (si es posible)
print_status "6. Intentando generar APK Release..."
./gradlew assembleRelease
if [ $? -eq 0 ]; then
    print_success "APK Release generado exitosamente"
else
    print_warning "APK Release no generado (requiere configuración de firma)"
fi

cd ..

# Paso 7: Mostrar ubicación de APKs
print_status "7. Ubicación de APKs generados:"

if [ -f "android/app/build/outputs/apk/debug/app-debug.apk" ]; then
    DEBUG_SIZE=$(du -h android/app/build/outputs/apk/debug/app-debug.apk | cut -f1)
    print_success "APK Debug: android/app/build/outputs/apk/debug/app-debug.apk (${DEBUG_SIZE})"
else
    print_error "APK Debug no encontrado"
fi

if [ -f "android/app/build/outputs/apk/release/app-release.apk" ]; then
    RELEASE_SIZE=$(du -h android/app/build/outputs/apk/release/app-release.apk | cut -f1)
    print_success "APK Release: android/app/build/outputs/apk/release/app-release.apk (${RELEASE_SIZE})"
else
    print_warning "APK Release no disponible (requiere configuración de firma)"
fi

# Paso 8: Crear directorio de distribución
print_status "8. Creando directorio de distribución..."
mkdir -p dist-apk
cp android/app/build/outputs/apk/debug/app-debug.apk dist-apk/coopsama-app-debug.apk 2>/dev/null || true
cp android/app/build/outputs/apk/release/app-release.apk dist-apk/coopsama-app-release.apk 2>/dev/null || true

if [ -f "dist-apk/coopsama-app-debug.apk" ]; then
    print_success "APK copiado a: dist-apk/coopsama-app-debug.apk"
fi

if [ -f "dist-apk/coopsama-app-release.apk" ]; then
    print_success "APK copiado a: dist-apk/coopsama-app-release.apk"
fi

# Paso 9: Mostrar información del APK
print_status "9. Información del APK:"
if [ -f "android/app/build/outputs/apk/debug/app-debug.apk" ]; then
    echo "   📱 App ID: app.lovable.c018926e40254894ae52122f75906f16"
    echo "   📱 App Name: Coopsama App"
    echo "   📱 Version: 1.0 (1)"
    echo "   📱 Min SDK: 23 (Android 6.0+)"
    echo "   📱 Target SDK: 35 (Android 15)"
    echo "   📱 Tamaño: ${DEBUG_SIZE}"
fi

# Paso 10: Instrucciones de instalación
print_status "10. Instrucciones de instalación:"
echo ""
echo "   Para instalar el APK en un dispositivo Android:"
echo "   1. Habilita 'Orígenes desconocidos' en Configuración > Seguridad"
echo "   2. Transfiere el APK al dispositivo"
echo "   3. Abre el archivo APK desde el explorador de archivos"
echo "   4. Sigue las instrucciones de instalación"
echo ""
echo "   Para instalar desde línea de comandos:"
echo "   adb install dist-apk/coopsama-app-debug.apk"
echo ""

print_success "🎉 Proceso de generación de APK completado exitosamente!"
print_status "📱 Los APKs están listos para distribución"
