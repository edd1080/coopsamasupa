#!/bin/bash

echo "🔍 Verificando restauración de iconos de aplicación..."
echo "=================================================="

# Verificar que existen todas las densidades de iconos
echo "📋 Verificando densidades de iconos..."
densities=("ldpi" "mdpi" "hdpi" "xhdpi" "xxhdpi" "xxxhdpi")
all_densities_ok=true

for density in "${densities[@]}"; do
    if [ -d "android/app/src/main/res/mipmap-${density}" ]; then
        echo "✅ mipmap-${density} existe"
        
        # Verificar iconos principales
        if [ -f "android/app/src/main/res/mipmap-${density}/ic_launcher.png" ]; then
            echo "  ✅ ic_launcher.png presente"
        else
            echo "  ❌ ic_launcher.png faltante"
            all_densities_ok=false
        fi
        
        # Verificar iconos de adaptive (excepto ldpi que no los tiene)
        if [ "$density" != "ldpi" ]; then
            if [ -f "android/app/src/main/res/mipmap-${density}/ic_launcher_background.png" ]; then
                echo "  ✅ ic_launcher_background.png presente"
            else
                echo "  ❌ ic_launcher_background.png faltante"
                all_densities_ok=false
            fi
            
            if [ -f "android/app/src/main/res/mipmap-${density}/ic_launcher_foreground.png" ]; then
                echo "  ✅ ic_launcher_foreground.png presente"
            else
                echo "  ❌ ic_launcher_foreground.png faltante"
                all_densities_ok=false
            fi
            
            if [ -f "android/app/src/main/res/mipmap-${density}/ic_launcher_monochrome.png" ]; then
                echo "  ✅ ic_launcher_monochrome.png presente"
            else
                echo "  ❌ ic_launcher_monochrome.png faltante"
                all_densities_ok=false
            fi
        fi
    else
        echo "❌ mipmap-${density} faltante"
        all_densities_ok=false
    fi
done

if [ "$all_densities_ok" = true ]; then
    echo "✅ Todas las densidades de iconos están presentes"
else
    echo "❌ Faltan algunas densidades de iconos"
    exit 1
fi

# Verificar configuración de adaptive icon
echo "📋 Verificando configuración de adaptive icon..."
if [ -f "android/app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml" ]; then
    echo "✅ ic_launcher.xml presente"
    
    # Verificar contenido del XML
    if grep -q "ic_launcher_background" android/app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml; then
        echo "✅ Configuración de background correcta"
    else
        echo "❌ Configuración de background incorrecta"
        exit 1
    fi
    
    if grep -q "ic_launcher_foreground" android/app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml; then
        echo "✅ Configuración de foreground correcta"
    else
        echo "❌ Configuración de foreground incorrecta"
        exit 1
    fi
    
    if grep -q "ic_launcher_monochrome" android/app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml; then
        echo "✅ Configuración de monochrome correcta"
    else
        echo "❌ Configuración de monochrome incorrecta"
        exit 1
    fi
else
    echo "❌ ic_launcher.xml faltante"
    exit 1
fi

# Verificar icono redondo
echo "📋 Verificando icono redondo..."
if [ -f "android/app/src/main/res/mipmap-anydpi-v26/ic_launcher_round.xml" ]; then
    echo "✅ ic_launcher_round.xml presente"
else
    echo "❌ ic_launcher_round.xml faltante"
    exit 1
fi

# Contar total de iconos
total_icons=$(find android/app/src/main/res/mipmap-* -name "ic_launcher*.png" | wc -l)
echo "📊 Total de iconos instalados: $total_icons"

echo ""
echo "🎉 Verificación completada exitosamente!"
echo "📱 Todos los iconos de aplicación han sido restaurados correctamente"
echo ""
echo "📋 Iconos restaurados:"
echo "  - ic_launcher.png (todas las densidades)"
echo "  - ic_launcher_background.png (adaptive icon)"
echo "  - ic_launcher_foreground.png (adaptive icon)"
echo "  - ic_launcher_monochrome.png (adaptive icon)"
echo "  - ic_launcher_round.png (icono redondo)"
echo "  - Configuración XML de adaptive icon"
echo ""
echo "🧪 Para probar:"
echo "  1. Compila la aplicación Android"
echo "  2. Instala en un dispositivo"
echo "  3. Verifica que el icono de Coopsama aparece correctamente"
echo "  4. Verifica que el adaptive icon funciona en Android 8+"
