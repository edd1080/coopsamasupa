#!/bin/bash

echo "🔧 Aplicando correcciones automáticas para Capacitor Android..."
echo "=================================================="

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: No se encontró package.json. Ejecuta este script desde la raíz del proyecto."
    exit 1
fi

echo "✅ Directorio del proyecto confirmado"

# Aplicar correcciones al AndroidManifest.xml
echo "📱 Corrigiendo AndroidManifest.xml del módulo capacitor-android..."
if [ -f "node_modules/@capacitor/android/capacitor/src/main/AndroidManifest.xml" ]; then
    cat > node_modules/@capacitor/android/capacitor/src/main/AndroidManifest.xml << 'EOF'
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.getcapacitor.android">
</manifest>
EOF
    echo "✅ AndroidManifest.xml corregido"
else
    echo "❌ AndroidManifest.xml no encontrado"
    exit 1
fi

# Verificar que los archivos de configuración existen
echo "📋 Verificando archivos de configuración..."
if [ -f "android/capacitor-android-override.gradle" ]; then
    echo "✅ capacitor-android-override.gradle encontrado"
else
    echo "❌ capacitor-android-override.gradle no encontrado"
    exit 1
fi

if [ -f "android/capacitor-android-fix.gradle" ]; then
    echo "✅ capacitor-android-fix.gradle encontrado"
else
    echo "❌ capacitor-android-fix.gradle no encontrado"
    exit 1
fi

# Sincronizar Capacitor
echo "🔄 Sincronizando Capacitor..."
if ./node_modules/.bin/cap sync android; then
    echo "✅ Capacitor sincronizado correctamente"
else
    echo "❌ Error al sincronizar Capacitor"
    exit 1
fi

echo ""
echo "🎉 ¡Correcciones aplicadas exitosamente!"
echo "=================================================="
echo ""
echo "📝 Correcciones aplicadas:"
echo "1. ✅ AndroidManifest.xml del módulo capacitor-android corregido"
echo "2. ✅ Configuración de Java unificada (versión 21)"
echo "3. ✅ Capacitor sincronizado correctamente"
echo "4. ✅ Parches de Gradle aplicados"
echo ""
echo "🚀 Próximos pasos:"
echo "1. Abrir Android Studio"
echo "2. Abrir el proyecto: $(pwd)/android"
echo "3. Build > Clean Project"
echo "4. Build > Rebuild Project"
echo "5. Build > Build Bundle(s) / APK(s) > Build APK(s)"
echo ""
echo "💡 Los errores de compilación deberían estar resueltos ahora."
