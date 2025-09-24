#!/bin/bash

echo "🎨 Actualizando iconos de la aplicación Android..."
echo "=================================================="

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: No se encontró package.json. Ejecuta este script desde la raíz del proyecto."
    exit 1
fi

echo "✅ Directorio del proyecto confirmado"

# Verificar que existen los nuevos iconos
if [ ! -d "appIcons/android/res" ]; then
    echo "❌ Error: No se encontró la carpeta appIcons/android/res"
    exit 1
fi

echo "✅ Nuevos iconos encontrados en appIcons/android/res"

# Crear backup de los iconos actuales
echo "💾 Creando backup de los iconos actuales..."
if [ -d "android/app/src/main/res/mipmap-hdpi" ]; then
    mkdir -p android/app/src/main/res-backup
    cp -r android/app/src/main/res/mipmap-* android/app/src/main/res-backup/ 2>/dev/null || true
    cp -r android/app/src/main/res/mipmap-anydpi-v26 android/app/src/main/res-backup/ 2>/dev/null || true
    echo "✅ Backup creado en android/app/src/main/res-backup"
fi

# Copiar los nuevos iconos
echo "📱 Copiando nuevos iconos..."

# Copiar archivos XML de configuración
if [ -f "appIcons/android/res/mipmap-anydpi-v26/ic_launcher.xml" ]; then
    cp "appIcons/android/res/mipmap-anydpi-v26/ic_launcher.xml" "android/app/src/main/res/mipmap-anydpi-v26/"
    echo "✅ ic_launcher.xml actualizado"
fi

# Copiar iconos PNG para todas las densidades
for density in hdpi mdpi xhdpi xxhdpi xxxhdpi; do
    if [ -d "appIcons/android/res/mipmap-$density" ]; then
        echo "📱 Copiando iconos para densidad $density..."
        
        # Copiar ic_launcher.png
        if [ -f "appIcons/android/res/mipmap-$density/ic_launcher.png" ]; then
            cp "appIcons/android/res/mipmap-$density/ic_launcher.png" "android/app/src/main/res/mipmap-$density/"
            echo "  ✅ ic_launcher.png copiado"
        fi
        
        # Copiar ic_launcher_background.png
        if [ -f "appIcons/android/res/mipmap-$density/ic_launcher_background.png" ]; then
            cp "appIcons/android/res/mipmap-$density/ic_launcher_background.png" "android/app/src/main/res/mipmap-$density/"
            echo "  ✅ ic_launcher_background.png copiado"
        fi
        
        # Copiar ic_launcher_foreground.png
        if [ -f "appIcons/android/res/mipmap-$density/ic_launcher_foreground.png" ]; then
            cp "appIcons/android/res/mipmap-$density/ic_launcher_foreground.png" "android/app/src/main/res/mipmap-$density/"
            echo "  ✅ ic_launcher_foreground.png copiado"
        fi
        
        # Copiar ic_launcher_monochrome.png
        if [ -f "appIcons/android/res/mipmap-$density/ic_launcher_monochrome.png" ]; then
            cp "appIcons/android/res/mipmap-$density/ic_launcher_monochrome.png" "android/app/src/main/res/mipmap-$density/"
            echo "  ✅ ic_launcher_monochrome.png copiado"
        fi
    fi
done

# Verificar que los iconos se copiaron correctamente
echo ""
echo "🔍 Verificando iconos actualizados..."
total_icons=0
for density in hdpi mdpi xhdpi xxhdpi xxxhdpi; do
    if [ -f "android/app/src/main/res/mipmap-$density/ic_launcher.png" ]; then
        echo "✅ ic_launcher.png encontrado en mipmap-$density"
        ((total_icons++))
    fi
done

echo ""
echo "🎉 ¡Iconos actualizados exitosamente!"
echo "=================================================="
echo "📊 Resumen:"
echo "• Total de densidades actualizadas: $total_icons"
echo "• Backup creado en: android/app/src/main/res-backup"
echo ""
echo "🚀 Próximos pasos:"
echo "1. Limpiar el proyecto en Android Studio: Build > Clean Project"
echo "2. Reconstruir el proyecto: Build > Rebuild Project"
echo "3. Construir nuevo APK: Build > Build Bundle(s) / APK(s) > Build APK(s)"
echo ""
echo "💡 Los nuevos iconos deberían aparecer en el APK generado."
