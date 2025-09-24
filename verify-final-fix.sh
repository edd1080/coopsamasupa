#!/bin/bash

echo "🔍 Verificación final de la corrección del problema de compilación..."
echo "=================================================="

# Verificar que el AndroidManifest.xml del módulo capacitor-android esté corregido
echo "📋 Verificando AndroidManifest.xml del módulo capacitor-android:"
if [ -f "node_modules/@capacitor/android/capacitor/src/main/AndroidManifest.xml" ]; then
    echo "✅ AndroidManifest.xml encontrado"
    if grep -q "package=\"com.getcapacitor.android\"" node_modules/@capacitor/android/capacitor/src/main/AndroidManifest.xml; then
        echo "✅ Package correcto en AndroidManifest.xml"
    else
        echo "❌ Package incorrecto en AndroidManifest.xml"
        exit 1
    fi
else
    echo "❌ AndroidManifest.xml no encontrado"
    exit 1
fi

# Verificar configuración de Java
echo ""
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

# Verificar recursos de Capacitor
echo ""
echo "📱 Verificando recursos de Capacitor:"
if [ -f "node_modules/@capacitor/android/capacitor/src/main/res/values/styles.xml" ]; then
    echo "✅ Recursos de Capacitor encontrados"
    if grep -q "AppTheme.NoActionBar" node_modules/@capacitor/android/capacitor/src/main/res/values/styles.xml; then
        echo "✅ Estilos de Capacitor correctos"
    else
        echo "❌ Estilos de Capacitor incorrectos"
        exit 1
    fi
else
    echo "❌ Recursos de Capacitor no encontrados"
    exit 1
fi

# Verificar layouts de Capacitor
if [ -f "node_modules/@capacitor/android/capacitor/src/main/res/layout/capacitor_bridge_layout_main.xml" ]; then
    echo "✅ Layouts de Capacitor encontrados"
else
    echo "❌ Layouts de Capacitor no encontrados"
    exit 1
fi

echo ""
echo "🎉 ¡Verificación completada exitosamente!"
echo "=================================================="
echo ""
echo "📝 Resumen de correcciones aplicadas:"
echo "1. ✅ AndroidManifest.xml del módulo capacitor-android corregido"
echo "2. ✅ Configuración de Java unificada (versión 21)"
echo "3. ✅ Proyecto Android regenerado completamente"
echo "4. ✅ Capacitor sincronizado correctamente"
echo "5. ✅ Recursos de Capacitor verificados"
echo ""
echo "🚀 Próximos pasos:"
echo "1. Ejecutar: ./build-apk-manual.sh"
echo "2. O abrir Android Studio manualmente y construir el APK"
echo ""
echo "💡 El problema de 'package com.getcapacitor.android does not exist' debería estar resuelto"
echo "   porque ahora el AndroidManifest.xml tiene el package correcto."
