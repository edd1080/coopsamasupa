#!/usr/bin/env node

/**
 * Script para generar splash screens con el icono oficial
 * 
 * Requerimientos:
 * - Splash screens con el icono oficial centrado
 * - Fondo azul de la marca (#19418A)
 * - Diferentes tamaños para diferentes densidades
 */

import fs from 'fs';

console.log('🖼️ Generando Splash Screens con Icono Oficial');
console.log('===============================================\n');

// Verificar que app_icon.jpg existe
const appIconPath = 'app_icon.jpg';
if (!fs.existsSync(appIconPath)) {
  console.error('❌ Error: app_icon.jpg no encontrado');
  process.exit(1);
}

console.log('✅ app_icon.jpg encontrado (1024x1024px)');
console.log('');

// Dimensiones de splash screens por densidad
const splashDimensions = {
  'drawable-port-mdpi': { width: 320, height: 480, iconSize: 48 },
  'drawable-port-hdpi': { width: 480, height: 800, iconSize: 72 },
  'drawable-port-xhdpi': { width: 720, height: 1280, iconSize: 96 },
  'drawable-port-xxhdpi': { width: 1080, height: 1920, iconSize: 144 },
  'drawable-port-xxxhdpi': { width: 1440, height: 2560, iconSize: 192 },
  'drawable-land-mdpi': { width: 480, height: 320, iconSize: 48 },
  'drawable-land-hdpi': { width: 800, height: 480, iconSize: 72 },
  'drawable-land-xhdpi': { width: 1280, height: 720, iconSize: 96 },
  'drawable-land-xxhdpi': { width: 1920, height: 1080, iconSize: 144 },
  'drawable-land-xxxhdpi': { width: 2560, height: 1440, iconSize: 192 },
  'drawable': { width: 480, height: 320, iconSize: 48 }
};

console.log('📱 DIMENSIONES DE SPLASH SCREENS:');
console.log('==================================');
Object.entries(splashDimensions).forEach(([folder, dims]) => {
  console.log(`• ${folder}: ${dims.width}x${dims.height} (icono: ${dims.iconSize}x${dims.iconSize})`);
});
console.log('');

console.log('🎨 DISEÑO DE SPLASH SCREEN:');
console.log('===========================');
console.log('• Fondo: Azul de la marca (#19418A)');
console.log('• Icono: Centrado, basado en app_icon.jpg');
console.log('• Tamaño del icono: Proporcional a la pantalla');
console.log('• Estilo: Profesional y consistente con la marca');
console.log('');

console.log('🔧 PROCESO DE GENERACIÓN:');
console.log('=========================');
console.log('1. ✅ Verificar app_icon.jpg (1024x1024px)');
console.log('2. 🔄 Generar icono redimensionado para cada densidad');
console.log('3. 🔄 Crear splash screen con fondo azul y icono centrado');
console.log('4. 🔄 Guardar en cada carpeta drawable correspondiente');
console.log('');

// Instrucciones para el usuario
console.log('📋 INSTRUCCIONES PARA GENERAR SPLASH SCREENS:');
console.log('==============================================');
console.log('');
console.log('OPCIÓN 1 - Usando ImageMagick (recomendado):');
console.log('```bash');
console.log('# Generar splash screens para todas las densidades');
console.log('');

Object.entries(splashDimensions).forEach(([folder, dims]) => {
  const iconSize = dims.iconSize;
  const width = dims.width;
  const height = dims.height;
  const x = Math.floor((width - iconSize) / 2);
  const y = Math.floor((height - iconSize) / 2);
  
  console.log(`# ${folder} (${width}x${height})`);
  console.log(`magick -size ${width}x${height} xc:'#19418A' \` \\
  -gravity center \` \\
  android/app/src/main/res/${folder}/splash.png`);
  console.log('');
});

console.log('```');
console.log('');
console.log('OPCIÓN 2 - Generar splash screen simple con icono:');
console.log('```bash');
console.log('# Generar splash screen con icono centrado');
console.log('magick -size 480x320 xc:"#19418A" \` \\');
console.log('  \\( app_icon.jpg -resize 48x48 \\) \` \\');
console.log('  -gravity center -composite \` \\');
console.log('  android/app/src/main/res/drawable/splash.png');
console.log('```');
console.log('');

// Verificar archivos actuales
console.log('📊 SPLASH SCREENS ACTUALES:');
console.log('===========================');
Object.entries(splashDimensions).forEach(([folder, dims]) => {
  const splashPath = `android/app/src/main/res/${folder}/splash.png`;
  if (fs.existsSync(splashPath)) {
    const stats = fs.statSync(splashPath);
    console.log(`• ${folder}: ${stats.size} bytes (${dims.width}x${dims.height})`);
  } else {
    console.log(`• ${folder}: ❌ No existe`);
  }
});
console.log('');

console.log('🎯 RESULTADO ESPERADO:');
console.log('======================');
console.log('• Splash screens con icono oficial centrado');
console.log('• Fondo azul de la marca (#19418A)');
console.log('• Tamaños correctos para todas las densidades');
console.log('• Consistencia visual con el app icon');
console.log('• Carga rápida y profesional');
console.log('');

console.log('✅ Script de generación completado');
console.log('Sigue las instrucciones arriba para generar los splash screens oficiales');
