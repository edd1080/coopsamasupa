#!/bin/bash

echo "🔍 Verificando iconos de la aplicación Android..."
echo "=================================================="

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: No se encontró package.json. Ejecuta este script desde la raíz del proyecto."
    exit 1
fi

echo "✅ Directorio del proyecto confirmado"

# Verificar iconos principales
echo "📱 Verificando iconos principales..."
total_icons=0
for density in hdpi mdpi xhdpi xxhdpi xxxhdpi; do
    if [ -f "android/app/src/main/res/mipmap-$density/ic_launcher.png" ]; then
        echo "✅ ic_launcher.png encontrado en mipmap-$density"
        ((total_icons++))
    else
        echo "❌ ic_launcher.png NO encontrado en mipmap-$density"
    fi
done

# Verificar iconos de fondo
echo ""
echo "🎨 Verificando iconos de fondo..."
total_backgrounds=0
for density in hdpi mdpi xhdpi xxhdpi xxxhdpi; do
    if [ -f "android/app/src/main/res/mipmap-$density/ic_launcher_background.png" ]; then
        echo "✅ ic_launcher_background.png encontrado en mipmap-$density"
        ((total_backgrounds++))
    else
        echo "❌ ic_launcher_background.png NO encontrado en mipmap-$density"
    fi
done

# Verificar iconos de primer plano
echo ""
echo "🖼️ Verificando iconos de primer plano..."
total_foregrounds=0
for density in hdpi mdpi xhdpi xxhdpi xxxhdpi; do
    if [ -f "android/app/src/main/res/mipmap-$density/ic_launcher_foreground.png" ]; then
        echo "✅ ic_launcher_foreground.png encontrado en mipmap-$density"
        ((total_foregrounds++))
    else
        echo "❌ ic_launcher_foreground.png NO encontrado en mipmap-$density"
    fi
done

# Verificar iconos monocromos
echo ""
echo "⚫ Verificando iconos monocromos..."
total_monochrome=0
for density in hdpi mdpi xhdpi xxhdpi xxxhdpi; do
    if [ -f "android/app/src/main/res/mipmap-$density/ic_launcher_monochrome.png" ]; then
        echo "✅ ic_launcher_monochrome.png encontrado en mipmap-$density"
        ((total_monochrome++))
    else
        echo "❌ ic_launcher_monochrome.png NO encontrado en mipmap-$density"
    fi
done

# Verificar archivo XML de configuración
echo ""
echo "⚙️ Verificando configuración XML..."
if [ -f "android/app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml" ]; then
    echo "✅ ic_launcher.xml encontrado en mipmap-anydpi-v26"
else
    echo "❌ ic_launcher.xml NO encontrado en mipmap-anydpi-v26"
fi

# Verificar backup
echo ""
echo "💾 Verificando backup..."
if [ -d "android/app/src/main/res-backup" ]; then
    echo "✅ Backup de iconos anteriores creado"
else
    echo "❌ Backup NO encontrado"
fi

echo ""
echo "📊 Resumen de verificación:"
echo "=================================================="
echo "• Iconos principales (ic_launcher.png): $total_icons/5"
echo "• Iconos de fondo (ic_launcher_background.png): $total_backgrounds/5"
echo "• Iconos de primer plano (ic_launcher_foreground.png): $total_foregrounds/5"
echo "• Iconos monocromos (ic_launcher_monochrome.png): $total_monochrome/5"
echo "• Archivo XML de configuración: $(if [ -f "android/app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml" ]; then echo "✅"; else echo "❌"; fi)"
echo "• Backup creado: $(if [ -d "android/app/src/main/res-backup" ]; then echo "✅"; else echo "❌"; fi)"

if [ $total_icons -eq 5 ] && [ $total_backgrounds -eq 5 ] && [ $total_foregrounds -eq 5 ] && [ $total_monochrome -eq 5 ]; then
    echo ""
    echo "🎉 ¡Todos los iconos se han actualizado correctamente!"
    echo ""
    echo "🚀 Próximos pasos:"
    echo "1. En Android Studio: Build > Clean Project"
    echo "2. Build > Rebuild Project"
    echo "3. Build > Build Bundle(s) / APK(s) > Build APK(s)"
    echo ""
    echo "💡 Los nuevos iconos aparecerán en el APK generado."
else
    echo ""
    echo "⚠️ Algunos iconos no se actualizaron correctamente."
    echo "💡 Ejecuta nuevamente: ./update-app-icons.sh"
fi
