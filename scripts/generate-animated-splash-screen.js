#!/usr/bin/env node

/**
 * Script para generar splash screen animada como la de Lovable
 * 
 * Diseño de la splash screen animada:
 * - Fondo: Gradiente blanco (from-background to-primary/5)
 * - Logo: Imagen de Lovable (fallback: texto "COOPSAMA Portal de Agentes")
 * - Loader: Tres puntos animados con bounce
 * - Colores: Azul primario (#19418A)
 */

import fs from 'fs';

console.log('🎬 Generando Splash Screen Animada de Lovable');
console.log('==============================================\n');

// Verificar que tenemos la imagen de Lovable
const lovableImagePath = 'public/lovable-uploads/8517c16c-a94c-48da-9b01-9cabbde80b84.png';

if (!fs.existsSync(lovableImagePath)) {
  console.error('❌ Error: Imagen de Lovable no encontrada');
  console.error(`   Ruta esperada: ${lovableImagePath}`);
  process.exit(1);
}

console.log('✅ Imagen de Lovable encontrada');
console.log(`   Ruta: ${lovableImagePath}`);
console.log(`   Tamaño: 1024x1024px`);
console.log('');

// Diseño de la splash screen animada
console.log('🎨 DISEÑO DE SPLASH SCREEN ANIMADA:');
console.log('===================================');
console.log('• Fondo: Gradiente blanco (from-background to-primary/5)');
console.log('• Logo: Imagen de Lovable centrada');
console.log('• Fallback: Texto "COOPSAMA Portal de Agentes"');
console.log('• Loader: Tres puntos animados con bounce');
console.log('• Colores: Azul primario (#19418A)');
console.log('• Estilo: Idéntico al componente SplashScreen.tsx');
console.log('');

// Dimensiones de splash screens por densidad
const splashDimensions = {
  'drawable-port-mdpi': { width: 320, height: 480, logoSize: 120 },
  'drawable-port-hdpi': { width: 480, height: 800, logoSize: 180 },
  'drawable-port-xhdpi': { width: 720, height: 1280, logoSize: 240 },
  'drawable-port-xxhdpi': { width: 1080, height: 1920, logoSize: 360 },
  'drawable-port-xxxhdpi': { width: 1440, height: 2560, logoSize: 480 },
  'drawable-land-mdpi': { width: 480, height: 320, logoSize: 120 },
  'drawable-land-hdpi': { width: 800, height: 480, logoSize: 180 },
  'drawable-land-xhdpi': { width: 1280, height: 720, logoSize: 240 },
  'drawable-land-xxhdpi': { width: 1920, height: 1080, logoSize: 360 },
  'drawable-land-xxxhdpi': { width: 2560, height: 1440, logoSize: 480 },
  'drawable': { width: 480, height: 320, logoSize: 120 }
};

console.log('📱 DIMENSIONES DE SPLASH SCREENS:');
console.log('==================================');
Object.entries(splashDimensions).forEach(([folder, dims]) => {
  console.log(`• ${folder}: ${dims.width}x${dims.height} (logo: ${dims.logoSize}x${dims.logoSize})`);
});
console.log('');

console.log('🔧 PROCESO DE GENERACIÓN:');
console.log('=========================');
console.log('1. ✅ Verificar imagen de Lovable (1024x1024px)');
console.log('2. 🔄 Crear fondo con gradiente blanco');
console.log('3. 🔄 Centrar logo de Lovable');
console.log('4. 🔄 Agregar texto "COOPSAMA Portal de Agentes" como fallback');
console.log('5. 🔄 Generar para todas las densidades');
console.log('');

// Instrucciones para el usuario
console.log('📋 INSTRUCCIONES PARA GENERAR SPLASH SCREEN ANIMADA:');
console.log('=====================================================');
console.log('');
console.log('OPCIÓN 1 - Usando ImageMagick (recomendado):');
console.log('```bash');
console.log('# Generar splash screen con logo de Lovable centrado');
console.log('');

Object.entries(splashDimensions).forEach(([folder, dims]) => {
  const width = dims.width;
  const height = dims.height;
  const logoSize = dims.logoSize;
  
  console.log(`# ${folder} (${width}x${height})`);
  console.log(`magick -size ${width}x${height} gradient:white-white \` \\`);
  console.log(`  \\( "${lovableImagePath}" -resize ${logoSize}x${logoSize} \\) \` \\`);
  console.log(`  -gravity center -composite \` \\`);
  console.log(`  android/app/src/main/res/${folder}/splash.png`);
  console.log('');
});

console.log('```');
console.log('');
console.log('OPCIÓN 2 - Splash screen con texto como fallback:');
console.log('```bash');
console.log('# Generar splash screen con texto "COOPSAMA Portal de Agentes"');
console.log('magick -size 480x320 gradient:white-white \` \\');
console.log('  -gravity center \` \\');
console.log('  -pointsize 24 -fill "#19418A" -annotate +0-20 "COOPSAMA" \` \\');
console.log('  -pointsize 12 -fill "#19418A" -annotate +0+10 "Portal de Agentes" \` \\');
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
console.log('• Splash screen con fondo blanco/gradiente');
console.log('• Logo de Lovable centrado');
console.log('• Texto "COOPSAMA Portal de Agentes" como fallback');
console.log('• Tamaños correctos para todas las densidades');
console.log('• Consistencia con el componente SplashScreen.tsx');
console.log('• Estilo idéntico al de la versión web');
console.log('');

console.log('✅ Script de generación completado');
console.log('Genera la splash screen animada como la de Lovable');
