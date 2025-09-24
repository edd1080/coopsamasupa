#!/bin/bash

echo "🗑️ Eliminando iconos redondos (round) de la aplicación Android..."
echo "=================================================="

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: No se encontró package.json. Ejecuta este script desde la raíz del proyecto."
    exit 1
fi

echo "✅ Directorio del proyecto confirmado"

# Crear backup de los iconos round antes de eliminarlos
echo "💾 Creando backup de los iconos round..."
mkdir -p android/app/src/main/res-round-backup
for density in hdpi mdpi xhdpi xxhdpi xxxhdpi; do
    if [ -f "android/app/src/main/res/mipmap-$density/ic_launcher_round.png" ]; then
        cp "android/app/src/main/res/mipmap-$density/ic_launcher_round.png" "android/app/src/main/res-round-backup/"
        echo "✅ Backup creado para ic_launcher_round.png en mipmap-$density"
    fi
done

# Eliminar iconos round
echo ""
echo "🗑️ Eliminando iconos round..."
total_removed=0
for density in hdpi mdpi xhdpi xxhdpi xxxhdpi; do
    if [ -f "android/app/src/main/res/mipmap-$density/ic_launcher_round.png" ]; then
        rm "android/app/src/main/res/mipmap-$density/ic_launcher_round.png"
        echo "✅ ic_launcher_round.png eliminado de mipmap-$density"
        ((total_removed++))
    else
        echo "ℹ️ ic_launcher_round.png no encontrado en mipmap-$density"
    fi
done

# Verificar que se eliminaron correctamente
echo ""
echo "🔍 Verificando eliminación..."
remaining_round=0
for density in hdpi mdpi xhdpi xxhdpi xxxhdpi; do
    if [ -f "android/app/src/main/res/mipmap-$density/ic_launcher_round.png" ]; then
        echo "❌ ic_launcher_round.png aún existe en mipmap-$density"
        ((remaining_round++))
    else
        echo "✅ ic_launcher_round.png eliminado de mipmap-$density"
    fi
done

echo ""
echo "📊 Resumen de eliminación:"
echo "=================================================="
echo "• Iconos round eliminados: $total_removed"
echo "• Iconos round restantes: $remaining_round"
echo "• Backup creado en: android/app/src/main/res-round-backup"

if [ $remaining_round -eq 0 ]; then
    echo ""
    echo "🎉 ¡Todos los iconos round se han eliminado exitosamente!"
    echo ""
    echo "💡 Información importante:"
    echo "• Los iconos round son opcionales en Android"
    echo "• Android usará automáticamente ic_launcher.png como fallback"
    echo "• Esto NO afectará el funcionamiento de la aplicación"
    echo "• Los iconos se mostrarán cuadrados en dispositivos que soportan iconos adaptativos"
    echo ""
    echo "🚀 Próximos pasos:"
    echo "1. En Android Studio: Build > Clean Project"
    echo "2. Build > Generate App Bundles or APKs > Build APK(s)"
    echo ""
    echo "🔄 Si necesitas restaurar los iconos round:"
    echo "   Los backups están en: android/app/src/main/res-round-backup"
else
    echo ""
    echo "⚠️ Algunos iconos round no se eliminaron correctamente."
    echo "💡 Verifica manualmente los archivos restantes."
fi
