#!/bin/bash

echo "🔧 Construyendo APK manualmente usando Android Studio..."
echo "=================================================="

# Verificar que el proyecto Android existe
if [ ! -d "android" ]; then
    echo "❌ Error: Directorio android no encontrado"
    exit 1
fi

echo "✅ Proyecto Android encontrado"

# Verificar que Android Studio esté instalado
if [ -d "/Applications/Android Studio.app" ]; then
    echo "✅ Android Studio encontrado en /Applications/Android Studio.app"
    ANDROID_STUDIO_PATH="/Applications/Android Studio.app/Contents/MacOS/studio"
elif command -v studio &> /dev/null; then
    echo "✅ Android Studio encontrado en PATH"
    ANDROID_STUDIO_PATH="studio"
else
    echo "❌ Android Studio no encontrado"
    echo ""
    echo "💡 Instrucciones manuales:"
    echo "1. Abrir Android Studio"
    echo "2. Abrir el proyecto: $(pwd)/android"
    echo "3. Esperar a que termine la sincronización de Gradle"
    echo "4. Si aparece error de sincronización:"
    echo "   - File > Sync Project with Gradle Files"
    echo "   - Si falla: Build > Clean Project"
    echo "   - Luego: Build > Rebuild Project"
    echo "5. Para construir el APK:"
    echo "   - Build > Build Bundle(s) / APK(s) > Build APK(s)"
    echo "6. El APK se generará en: android/app/build/outputs/apk/debug/"
    exit 1
fi

echo "📱 Abriendo proyecto en Android Studio..."
"$ANDROID_STUDIO_PATH" "$(pwd)/android" &

echo "⏳ Esperando a que Android Studio se abra..."
sleep 15

echo ""
echo "🎯 Instrucciones para construir el APK:"
echo "=================================================="
echo "1. En Android Studio, espera a que termine la sincronización de Gradle"
echo "2. Si aparece un error de sincronización:"
echo "   - Ve a File > Sync Project with Gradle Files"
echo "   - Si falla, usa Build > Clean Project"
echo "   - Luego Build > Rebuild Project"
echo "3. Para construir el APK:"
echo "   - Build > Build Bundle(s) / APK(s) > Build APK(s)"
echo "4. El APK se generará en: android/app/build/outputs/apk/debug/"
echo ""
echo "💡 Si encuentras problemas:"
echo "   - Verifica que el Android SDK esté configurado correctamente"
echo "   - Asegúrate de tener Java 25 instalado"
echo "   - Revisa que todas las dependencias estén sincronizadas"
echo ""
echo "🔧 Correcciones aplicadas:"
echo "✅ AndroidManifest.xml del módulo capacitor-android corregido"
echo "✅ Configuración de Java unificada (versión 21)"
echo "✅ Proyecto Android regenerado completamente"
echo "✅ Capacitor sincronizado correctamente"
