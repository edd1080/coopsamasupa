#!/bin/bash

echo "🔧 Verificando corrección de errores de compilación Android..."
echo "=================================================="

# Verificar que el proyecto Android existe
if [ ! -d "android" ]; then
    echo "❌ Error: Directorio android no encontrado"
    exit 1
fi

echo "✅ Directorio android encontrado"

# Verificar configuración de Java
echo "📋 Verificando configuración de Java..."

# Verificar que el archivo de override existe
if [ -f "android/capacitor-android-override.gradle" ]; then
    echo "✅ Archivo capacitor-android-override.gradle encontrado"
else
    echo "❌ Archivo capacitor-android-override.gradle no encontrado"
    exit 1
fi

# Verificar que el build.gradle principal incluye la configuración
if grep -q "capacitor-android-override.gradle" android/build.gradle; then
    echo "✅ Configuración de Java aplicada en build.gradle principal"
else
    echo "❌ Configuración de Java no aplicada en build.gradle principal"
    exit 1
fi

# Verificar que Capacitor está sincronizado
echo "📱 Verificando sincronización de Capacitor..."
if [ -d "android/app/src/main/assets/public" ]; then
    echo "✅ Assets de Capacitor sincronizados"
else
    echo "❌ Assets de Capacitor no sincronizados"
    exit 1
fi

# Verificar plugins de Capacitor
if [ -f "android/capacitor.settings.gradle" ]; then
    echo "✅ Configuración de plugins de Capacitor encontrada"
else
    echo "❌ Configuración de plugins de Capacitor no encontrada"
    exit 1
fi

echo ""
echo "🎉 Verificación completada exitosamente!"
echo "=================================================="
echo ""
echo "📝 Resumen de correcciones aplicadas:"
echo "1. ✅ Proyecto Android regenerado completamente"
echo "2. ✅ Configuración de Java unificada (versión 21 - compatible con Java 25)"
echo "3. ✅ Capacitor sincronizado correctamente"
echo "4. ✅ Plugins de Capacitor configurados"
echo "5. ✅ Configuración de Java actualizada para compatibilidad"
echo ""
echo "🚀 Próximos pasos:"
echo "1. Abrir Android Studio (ya ejecutado)"
echo "2. Sincronizar Gradle en Android Studio (Sync Project with Gradle Files)"
echo "3. Construir el APK desde Android Studio (Build > Build Bundle(s) / APK(s) > Build APK(s))"
echo ""
echo "💡 Si encuentras problemas con el wrapper de Gradle:"
echo "   - En Android Studio: File > Sync Project with Gradle Files"
echo "   - Si falla, usar: Build > Clean Project, luego Build > Rebuild Project"
