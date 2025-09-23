#!/bin/bash

echo "🚀 GENERACIÓN RÁPIDA DE APK - COOPSAMA"
echo "====================================="

# Limpiar y construir
echo "📦 Construyendo aplicación..."
npm run build

# Sincronizar con Android
echo "🔄 Sincronizando con Android..."
npx cap sync android

# Generar APK Debug
echo "🔨 Generando APK Debug..."
cd android
./gradlew assembleDebug

# Mostrar resultado
echo ""
echo "✅ APK generado exitosamente!"
echo "📱 Ubicación: android/app/build/outputs/apk/debug/app-debug.apk"

# Crear directorio de distribución
cd ..
mkdir -p dist-apk
cp android/app/build/outputs/apk/debug/app-debug.apk dist-apk/coopsama-app-debug.apk

echo "📁 Copiado a: dist-apk/coopsama-app-debug.apk"
echo ""
echo "🎯 Para instalar: adb install dist-apk/coopsama-app-debug.apk"
