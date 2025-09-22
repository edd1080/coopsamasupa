#!/bin/bash

# Script para generar iconos de Android desde SVG
# Basado en el logo de Coopsama

SVG_FILE="coopsama-logo.svg"
BASE_DIR="android/app/src/main/res"

# Crear directorios si no existen
mkdir -p "$BASE_DIR/mipmap-mdpi"
mkdir -p "$BASE_DIR/mipmap-hdpi"
mkdir -p "$BASE_DIR/mipmap-xhdpi"
mkdir -p "$BASE_DIR/mipmap-xxhdpi"
mkdir -p "$BASE_DIR/mipmap-xxxhdpi"
mkdir -p "$BASE_DIR/mipmap-anydpi-v26"

echo "Generando iconos de Android desde $SVG_FILE..."

# Generar iconos en diferentes resoluciones
# MDPI (48x48)
convert "$SVG_FILE" -resize 48x48 "$BASE_DIR/mipmap-mdpi/ic_launcher.png"
convert "$SVG_FILE" -resize 48x48 "$BASE_DIR/mipmap-mdpi/ic_launcher_round.png"
convert "$SVG_FILE" -resize 48x48 "$BASE_DIR/mipmap-mdpi/ic_launcher_foreground.png"

# HDPI (72x72)
convert "$SVG_FILE" -resize 72x72 "$BASE_DIR/mipmap-hdpi/ic_launcher.png"
convert "$SVG_FILE" -resize 72x72 "$BASE_DIR/mipmap-hdpi/ic_launcher_round.png"
convert "$SVG_FILE" -resize 72x72 "$BASE_DIR/mipmap-hdpi/ic_launcher_foreground.png"

# XHDPI (96x96)
convert "$SVG_FILE" -resize 96x96 "$BASE_DIR/mipmap-xhdpi/ic_launcher.png"
convert "$SVG_FILE" -resize 96x96 "$BASE_DIR/mipmap-xhdpi/ic_launcher_round.png"
convert "$SVG_FILE" -resize 96x96 "$BASE_DIR/mipmap-xhdpi/ic_launcher_foreground.png"

# XXHDPI (144x144)
convert "$SVG_FILE" -resize 144x144 "$BASE_DIR/mipmap-xxhdpi/ic_launcher.png"
convert "$SVG_FILE" -resize 144x144 "$BASE_DIR/mipmap-xxhdpi/ic_launcher_round.png"
convert "$SVG_FILE" -resize 144x144 "$BASE_DIR/mipmap-xxhdpi/ic_launcher_foreground.png"

# XXXHDPI (192x192)
convert "$SVG_FILE" -resize 192x192 "$BASE_DIR/mipmap-xxxhdpi/ic_launcher.png"
convert "$SVG_FILE" -resize 192x192 "$BASE_DIR/mipmap-xxxhdpi/ic_launcher_round.png"
convert "$SVG_FILE" -resize 192x192 "$BASE_DIR/mipmap-xxxhdpi/ic_launcher_foreground.png"

echo "Iconos generados exitosamente!"
echo "Ubicaciones:"
echo "- MDPI: $BASE_DIR/mipmap-mdpi/"
echo "- HDPI: $BASE_DIR/mipmap-hdpi/"
echo "- XHDPI: $BASE_DIR/mipmap-xhdpi/"
echo "- XXHDPI: $BASE_DIR/mipmap-xxhdpi/"
echo "- XXXHDPI: $BASE_DIR/mipmap-xxxhdpi/"
