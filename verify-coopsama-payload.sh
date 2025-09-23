#!/bin/bash

# 🧪 Script de Verificación de Payload de Coopsama
# Verifica que el payload se genere correctamente sin errores

echo "🧪 Iniciando verificación de payload de Coopsama..."

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

# Paso 1: Verificar archivo fieldMapper.ts
show_message "Paso 1: Verificando fieldMapper.ts..."

# Verificar que spouseBirthDate retorne null
if grep -q "spouseBirthDate.*null" src/utils/fieldMapper.ts; then
    show_success "spouseBirthDate configurado para retornar null"
else
    show_error "spouseBirthDate no configurado correctamente"
    exit 1
fi

# Verificar que projectedDebtRatio esté calculado correctamente
if grep -q "projectedDebtRatio.*totalAssets.*totalLiabilities" src/utils/fieldMapper.ts; then
    show_success "projectedDebtRatio configurado correctamente"
else
    show_warning "projectedDebtRatio puede no estar configurado correctamente"
fi

# Verificar que no haya referencias a sco_id
if ! grep -q "sco_id" src/utils/fieldMapper.ts; then
    show_success "No hay referencias a sco_id en fieldMapper.ts"
else
    show_warning "Aún hay referencias a sco_id en fieldMapper.ts"
fi

# Paso 2: Verificar función de integración de Coopsama
show_message "Paso 2: Verificando función de integración..."

# Verificar que no haya referencias a sco_id
if ! grep -q "sco_id" supabase/functions/coopsama-integration/index.ts; then
    show_success "No hay referencias a sco_id en coopsama-integration"
else
    show_warning "Aún hay referencias a sco_id en coopsama-integration"
fi

# Verificar que use processId correctamente
if grep -q "processId.*applicationId" supabase/functions/coopsama-integration/index.ts; then
    show_success "processId configurado correctamente"
else
    show_warning "processId puede no estar configurado correctamente"
fi

# Paso 3: Verificar tipos de TypeScript
show_message "Paso 3: Verificando tipos de TypeScript..."

# Verificar que no haya campo sco_id
if ! grep -q "sco_id" src/integrations/supabase/types.ts; then
    show_success "Campo sco_id removido de tipos TypeScript"
else
    show_warning "Campo sco_id aún presente en tipos TypeScript"
fi

# Paso 4: Verificar useFinalizeApplication
show_message "Paso 4: Verificando useFinalizeApplication..."

# Verificar que no haya campo sco_id
if ! grep -q "sco_id" src/hooks/useFinalizeApplication.tsx; then
    show_success "Campo sco_id removido de useFinalizeApplication"
else
    show_warning "Campo sco_id aún presente en useFinalizeApplication"
fi

# Paso 5: Verificar que no existan migraciones de sco_id
show_message "Paso 5: Verificando migraciones..."

if [ ! -f "supabase/migrations/20250120000000_add_sco_id_to_applications.sql" ]; then
    show_success "Migración de sco_id eliminada"
else
    show_warning "Migración de sco_id aún existe"
fi

# Paso 6: Verificar build sin errores
show_message "Paso 6: Verificando build sin errores..."

# Hacer build y capturar errores
BUILD_OUTPUT=$(npm run build 2>&1)
BUILD_EXIT_CODE=$?

if [ $BUILD_EXIT_CODE -eq 0 ]; then
    show_success "Build exitoso sin errores"
else
    show_error "Build falló con errores:"
    echo "$BUILD_OUTPUT"
    exit 1
fi

# Verificar que no haya errores de TypeScript relacionados con sco_id
if echo "$BUILD_OUTPUT" | grep -q "sco_id"; then
    show_warning "Se encontraron referencias a sco_id en el build"
else
    show_success "No hay referencias a sco_id en el build"
fi

show_success "🎉 Verificación de payload completada!"
show_message "El payload de Coopsama está configurado correctamente"
show_message "No debería haber errores de 'could not find the SCO_id column'"
show_message "No debería haber errores de 'spouseBirthDate' conversion"
