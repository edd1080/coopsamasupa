#!/bin/bash

# 🧪 Script de Verificación de Funcionalidad de la App
# Verifica que la aplicación funcione correctamente después de los cambios

echo "🧪 Iniciando verificación de funcionalidad de la app..."

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

# Paso 1: Verificar dependencias
show_message "Paso 1: Verificando dependencias..."
npm list @capacitor/core @capacitor/cli @capacitor/android > /dev/null 2>&1
if [ $? -eq 0 ]; then
    show_success "Dependencias de Capacitor OK"
else
    show_error "Error en dependencias de Capacitor"
    exit 1
fi

# Paso 2: Verificar build de producción
show_message "Paso 2: Verificando build de producción..."
npm run build > /dev/null 2>&1
if [ $? -eq 0 ]; then
    show_success "Build de producción OK"
    
    # Verificar que se creó la carpeta dist
    if [ -d "dist" ]; then
        show_success "Carpeta dist creada correctamente"
        show_message "Tamaño del build: $(du -sh dist | cut -f1)"
    else
        show_error "No se encontró la carpeta dist"
        exit 1
    fi
else
    show_error "Error en el build de producción"
    exit 1
fi

# Paso 3: Verificar sincronización con Capacitor
show_message "Paso 3: Verificando sincronización con Capacitor..."
npx cap sync android > /dev/null 2>&1
if [ $? -eq 0 ]; then
    show_success "Sincronización con Android OK"
else
    show_error "Error en sincronización con Android"
    exit 1
fi

# Paso 4: Verificar proyecto Android
show_message "Paso 4: Verificando proyecto Android..."
if [ -d "android" ] && [ -f "android/app/build.gradle" ]; then
    show_success "Proyecto Android OK"
else
    show_error "Proyecto Android no encontrado o corrupto"
    exit 1
fi

# Paso 5: Verificar archivos críticos
show_message "Paso 5: Verificando archivos críticos..."

# Verificar que no exista campo sco_id en tipos
if ! grep -q "sco_id" src/integrations/supabase/types.ts; then
    show_success "Campo sco_id removido de tipos TypeScript"
else
    show_warning "Campo sco_id aún presente en tipos TypeScript"
fi

# Verificar que spouseBirthDate retorne null
if grep -q "spouseBirthDate.*null" src/utils/fieldMapper.ts; then
    show_success "spouseBirthDate configurado para retornar null"
else
    show_warning "spouseBirthDate no configurado correctamente"
fi

# Verificar que no exista migración de sco_id
if [ ! -f "supabase/migrations/20250120000000_add_sco_id_to_applications.sql" ]; then
    show_success "Migración de sco_id eliminada"
else
    show_warning "Migración de sco_id aún existe"
fi

# Paso 6: Verificar configuración de Capacitor
show_message "Paso 6: Verificando configuración de Capacitor..."
if [ -f "capacitor.config.ts" ]; then
    show_success "Configuración de Capacitor encontrada"
    
    # Verificar appId
    if grep -q "appId.*lovable" capacitor.config.ts; then
        show_success "AppId configurado correctamente"
    else
        show_warning "AppId no configurado correctamente"
    fi
else
    show_error "Configuración de Capacitor no encontrada"
    exit 1
fi

# Paso 7: Verificar plugins de Capacitor
show_message "Paso 7: Verificando plugins de Capacitor..."
if grep -q "@capacitor/camera" package.json; then
    show_success "Plugin de cámara instalado"
else
    show_warning "Plugin de cámara no encontrado"
fi

if grep -q "@capacitor/splash-screen" package.json; then
    show_success "Plugin de splash screen instalado"
else
    show_warning "Plugin de splash screen no encontrado"
fi

show_success "🎉 Verificación completada!"
show_message "La aplicación está lista para generar APK"
show_message "Ejecuta './generate-apk.sh' para generar el APK"
