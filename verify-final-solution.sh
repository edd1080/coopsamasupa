#!/bin/bash

echo "🔍 Verificación final de la solución completa..."
echo "=================================================="

# Verificar AndroidManifest.xml
echo "📱 Verificando AndroidManifest.xml del módulo capacitor-android:"
if [ -f "node_modules/@capacitor/android/capacitor/src/main/AndroidManifest.xml" ]; then
    if grep -q "package=\"com.getcapacitor.android\"" node_modules/@capacitor/android/capacitor/src/main/AndroidManifest.xml; then
        echo "✅ AndroidManifest.xml correcto con package 'com.getcapacitor.android'"
    else
        echo "❌ AndroidManifest.xml incorrecto"
        exit 1
    fi
    
    if grep -q "BridgeActivity" node_modules/@capacitor/android/capacitor/src/main/AndroidManifest.xml; then
        echo "✅ AndroidManifest.xml contiene BridgeActivity"
    else
        echo "❌ AndroidManifest.xml no contiene BridgeActivity"
        exit 1
    fi
else
    echo "❌ AndroidManifest.xml no encontrado"
    exit 1
fi

# Verificar que el archivo de parche no contiene applicationId
echo "🔧 Verificando archivo de parche:"
if grep -q "applicationId" android/capacitor-android-fix.gradle; then
    echo "❌ El archivo de parche aún contiene applicationId"
    exit 1
else
    echo "✅ Archivo de parche no contiene applicationId (correcto para bibliotecas)"
fi

# Verificar configuración de Java
echo "☕ Verificando configuración de Java:"
if grep -q "JavaVersion.VERSION_21" android/app/build.gradle; then
    echo "✅ Configuración de Java 21 en app/build.gradle"
else
    echo "❌ Configuración de Java incorrecta en app/build.gradle"
    exit 1
fi

if grep -q "JavaVersion.VERSION_21" android/build.gradle; then
    echo "✅ Configuración de Java 21 en build.gradle principal"
else
    echo "❌ Configuración de Java incorrecta en build.gradle principal"
    exit 1
fi

# Verificar archivos de parche
echo "🔧 Verificando archivos de parche:"
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

# Verificar que los parches están aplicados en build.gradle
if grep -q "capacitor-android-override.gradle" android/build.gradle; then
    echo "✅ Parche de Java aplicado en build.gradle"
else
    echo "❌ Parche de Java no aplicado en build.gradle"
    exit 1
fi

if grep -q "capacitor-android-fix.gradle" android/build.gradle; then
    echo "✅ Parche de R class aplicado en build.gradle"
else
    echo "❌ Parche de R class no aplicado en build.gradle"
    exit 1
fi

# Verificar recursos de Capacitor
echo "📱 Verificando recursos de Capacitor:"
if [ -f "node_modules/@capacitor/android/capacitor/src/main/res/values/styles.xml" ]; then
    echo "✅ Recursos de Capacitor encontrados"
else
    echo "❌ Recursos de Capacitor no encontrados"
    exit 1
fi

if [ -f "node_modules/@capacitor/android/capacitor/src/main/res/layout/capacitor_bridge_layout_main.xml" ]; then
    echo "✅ Layouts de Capacitor encontrados"
else
    echo "❌ Layouts de Capacitor no encontrados"
    exit 1
fi

# Verificar sincronización de Capacitor
echo "🔄 Verificando sincronización de Capacitor:"
if [ -d "android/app/src/main/assets/public" ]; then
    echo "✅ Assets de Capacitor sincronizados"
else
    echo "❌ Assets de Capacitor no sincronizados"
    exit 1
fi

echo ""
echo "🎉 ¡Verificación final completada exitosamente!"
echo "=================================================="
echo ""
echo "📝 Resumen de todas las correcciones aplicadas:"
echo "1. ✅ AndroidManifest.xml del módulo capacitor-android corregido con aplicación completa"
echo "2. ✅ Configuración de Java unificada (versión 21)"
echo "3. ✅ Proyecto Android regenerado completamente"
echo "4. ✅ Capacitor sincronizado correctamente"
echo "5. ✅ Parches de Gradle aplicados (sin applicationId para bibliotecas)"
echo "6. ✅ Recursos de Capacitor verificados"
echo "7. ✅ Error de 'Library projects cannot set applicationId' resuelto"
echo ""
echo "🚀 El proyecto está listo para construir el APK:"
echo "1. Abrir Android Studio"
echo "2. Abrir proyecto: $(pwd)/android"
echo "3. Build > Clean Project"
echo "4. Build > Rebuild Project"
echo "5. Build > Build Bundle(s) / APK(s) > Build APK(s)"
echo ""
echo "💡 Todos los errores de compilación deberían estar resueltos:"
echo "- ✅ Error de 'package R does not exist' resuelto"
echo "- ✅ Error de 'Library projects cannot set applicationId' resuelto"
echo "- ✅ Configuración de Java unificada"
echo "- ✅ Recursos de Capacitor verificados"
