#!/bin/bash

echo "🔍 Verificando corrección de imports de Capacitor..."
echo "=================================================="

# Verificar que los imports se cambiaron correctamente
echo "📋 Verificando imports en Bridge.java:"
if grep -q "import com.getcapacitor.R;" node_modules/@capacitor/android/capacitor/src/main/java/com/getcapacitor/Bridge.java; then
    echo "✅ Import corregido en Bridge.java"
else
    echo "❌ Import incorrecto en Bridge.java"
    exit 1
fi

echo "📋 Verificando imports en BridgeActivity.java:"
if grep -q "import com.getcapacitor.R;" node_modules/@capacitor/android/capacitor/src/main/java/com/getcapacitor/BridgeActivity.java; then
    echo "✅ Import corregido en BridgeActivity.java"
else
    echo "❌ Import incorrecto en BridgeActivity.java"
    exit 1
fi

# Verificar AndroidManifest.xml
echo "📋 Verificando AndroidManifest.xml:"
if grep -q "package=\"com.getcapacitor\"" node_modules/@capacitor/android/capacitor/src/main/AndroidManifest.xml; then
    echo "✅ Package correcto en AndroidManifest.xml"
else
    echo "❌ Package incorrecto en AndroidManifest.xml"
    exit 1
fi

# Verificar build.gradle
echo "📋 Verificando build.gradle:"
if grep -q "namespace \"com.getcapacitor\"" node_modules/@capacitor/android/capacitor/build.gradle; then
    echo "✅ Namespace correcto en build.gradle"
else
    echo "❌ Namespace incorrecto en build.gradle"
    exit 1
fi

echo ""
echo "🎉 ¡Verificación completada exitosamente!"
echo "=================================================="
echo ""
echo "📝 Correcciones aplicadas:"
echo "1. ✅ Imports cambiados de 'com.getcapacitor.android.R' a 'com.getcapacitor.R'"
echo "2. ✅ AndroidManifest.xml actualizado con package 'com.getcapacitor'"
echo "3. ✅ build.gradle actualizado con namespace 'com.getcapacitor'"
echo ""
echo "🚀 Próximos pasos:"
echo "1. Limpiar el proyecto en Android Studio: Build > Clean Project"
echo "2. Reconstruir el proyecto: Build > Rebuild Project"
echo "3. Construir el APK: Build > Build Bundle(s) / APK(s) > Build APK(s)"
echo ""
echo "💡 Los errores de 'package com.getcapacitor.android does not exist' deberían estar resueltos"
echo "   porque ahora todos los imports usan el paquete correcto 'com.getcapacitor'."
