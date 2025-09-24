#!/bin/bash

echo "🔧 Aplicando corrección final para el error de applicationId..."
echo "=================================================="

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: No se encontró package.json. Ejecuta este script desde la raíz del proyecto."
    exit 1
fi

echo "✅ Directorio del proyecto confirmado"

# Aplicar corrección al AndroidManifest.xml
echo "📱 Corrigiendo AndroidManifest.xml del módulo capacitor-android..."
if [ -f "node_modules/@capacitor/android/capacitor/src/main/AndroidManifest.xml" ]; then
    cat > node_modules/@capacitor/android/capacitor/src/main/AndroidManifest.xml << 'EOF'
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.getcapacitor.android">
    
    <application>
        <!-- Capacitor Bridge Activity -->
        <activity
            android:name="com.getcapacitor.BridgeActivity"
            android:theme="@style/AppTheme.NoActionBar"
            android:exported="false" />
    </application>
</manifest>
EOF
    echo "✅ AndroidManifest.xml corregido con aplicación completa"
else
    echo "❌ AndroidManifest.xml no encontrado"
    exit 1
fi

# Verificar que el archivo de parche está corregido
echo "🔧 Verificando archivo de parche..."
if grep -q "applicationId" android/capacitor-android-fix.gradle; then
    echo "❌ El archivo de parche aún contiene applicationId"
    echo "💡 Corrigiendo archivo de parche..."
    
    cat > android/capacitor-android-fix.gradle << 'EOF'
// Fix for capacitor-android R class generation
project(':capacitor-android') {
    afterEvaluate { project ->
        if (project.hasProperty('android')) {
            project.android {
                // Ensure R class is generated correctly
                sourceSets {
                    main {
                        manifest.srcFile '../node_modules/@capacitor/android/capacitor/src/main/AndroidManifest.xml'
                    }
                }
            }
        }
    }
}
EOF
    echo "✅ Archivo de parche corregido"
else
    echo "✅ Archivo de parche ya está correcto"
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
echo "🎉 ¡Corrección final aplicada exitosamente!"
echo "=================================================="
echo ""
echo "📝 Correcciones aplicadas:"
echo "1. ✅ AndroidManifest.xml del módulo capacitor-android corregido con aplicación completa"
echo "2. ✅ Archivo de parche corregido (sin applicationId)"
echo "3. ✅ Capacitor sincronizado correctamente"
echo ""
echo "🚀 Próximos pasos:"
echo "1. Abrir Android Studio"
echo "2. Abrir el proyecto: $(pwd)/android"
echo "3. Build > Clean Project"
echo "4. Build > Rebuild Project"
echo "5. Build > Build Bundle(s) / APK(s) > Build APK(s)"
echo ""
echo "💡 El error de 'Library projects cannot set applicationId' debería estar resuelto"
echo "   porque ahora el archivo de parche no intenta establecer applicationId en un proyecto de biblioteca."
