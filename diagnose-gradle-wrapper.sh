#!/bin/bash

echo "🔍 Diagnóstico del problema del wrapper de Gradle..."
echo "=================================================="

# Verificar archivos del wrapper
echo "📋 Verificando archivos del wrapper de Gradle:"

if [ -f "android/gradlew" ]; then
    echo "✅ gradlew encontrado"
    ls -la android/gradlew
else
    echo "❌ gradlew no encontrado"
fi

if [ -f "android/gradle/wrapper/gradle-wrapper.jar" ]; then
    echo "✅ gradle-wrapper.jar encontrado"
    ls -la android/gradle/wrapper/gradle-wrapper.jar
else
    echo "❌ gradle-wrapper.jar no encontrado"
fi

if [ -f "android/gradle/wrapper/gradle-wrapper.properties" ]; then
    echo "✅ gradle-wrapper.properties encontrado"
    cat android/gradle/wrapper/gradle-wrapper.properties
else
    echo "❌ gradle-wrapper.properties no encontrado"
fi

echo ""
echo "🔧 Verificando permisos:"
if [ -x "android/gradlew" ]; then
    echo "✅ gradlew es ejecutable"
else
    echo "❌ gradlew no es ejecutable"
    echo "💡 Ejecutando: chmod +x android/gradlew"
    chmod +x android/gradlew
fi

echo ""
echo "☕ Verificando Java:"
if command -v java &> /dev/null; then
    echo "✅ Java encontrado:"
    java -version
else
    echo "❌ Java no encontrado en PATH"
fi

if [ -n "$JAVA_HOME" ]; then
    echo "✅ JAVA_HOME configurado: $JAVA_HOME"
else
    echo "❌ JAVA_HOME no configurado"
fi

echo ""
echo "📱 Verificando configuración de Capacitor:"
if [ -f "android/capacitor.settings.gradle" ]; then
    echo "✅ capacitor.settings.gradle encontrado"
    echo "Contenido:"
    cat android/capacitor.settings.gradle
else
    echo "❌ capacitor.settings.gradle no encontrado"
fi

echo ""
echo "🔧 Intentando regenerar el wrapper de Gradle..."
cd android

# Intentar usar gradle directamente si está disponible
if command -v gradle &> /dev/null; then
    echo "✅ Gradle encontrado en sistema, regenerando wrapper..."
    gradle wrapper --gradle-version=8.11.1
else
    echo "❌ Gradle no encontrado en sistema"
    echo "💡 Descargando wrapper manualmente..."
    
    # Descargar el wrapper correcto
    curl -L https://github.com/gradle/gradle/raw/v8.11.1/gradle/wrapper/gradle-wrapper.jar -o gradle/wrapper/gradle-wrapper.jar
    
    if [ $? -eq 0 ]; then
        echo "✅ gradle-wrapper.jar descargado exitosamente"
    else
        echo "❌ Error al descargar gradle-wrapper.jar"
    fi
fi

cd ..

echo ""
echo "🧪 Probando el wrapper regenerado..."
cd android
if ./gradlew --version; then
    echo "✅ Wrapper de Gradle funcionando correctamente"
else
    echo "❌ Wrapper de Gradle aún tiene problemas"
    echo ""
    echo "💡 Soluciones alternativas:"
    echo "1. Usar Android Studio directamente"
    echo "2. Instalar Gradle en el sistema: brew install gradle"
    echo "3. Usar el script build-apk-android-studio.sh"
fi

cd ..
