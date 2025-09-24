#!/bin/bash

echo "🔧 Construyendo APK usando Android Studio..."
echo "=================================================="

# Verificar que Android Studio esté instalado
if ! command -v studio &> /dev/null; then
    echo "❌ Android Studio no encontrado en PATH"
    echo "💡 Instrucciones alternativas:"
    echo "1. Abrir Android Studio manualmente"
    echo "2. Abrir el proyecto: $(pwd)/android"
    echo "3. Sincronizar Gradle: File > Sync Project with Gradle Files"
    echo "4. Construir APK: Build > Build Bundle(s) / APK(s) > Build APK(s)"
    exit 1
fi

echo "✅ Android Studio encontrado"

# Abrir el proyecto en Android Studio
echo "📱 Abriendo proyecto en Android Studio..."
studio "$(pwd)/android" &

echo "⏳ Esperando a que Android Studio se abra..."
sleep 10

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
echo "   - Asegúrate de tener Java 17 instalado"
echo "   - Revisa que todas las dependencias estén sincronizadas"
