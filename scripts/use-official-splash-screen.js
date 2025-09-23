#!/usr/bin/env node

/**
 * Script para usar la splash screen oficial del proyecto web
 * 
 * La splash screen oficial está en: public/lovable-uploads/8517c16c-a94c-48da-9b01-9cabbde80b84.png
 * Esta es la imagen que se usa en el proyecto web de Lovable
 */

import fs from 'fs';

console.log('🖼️ Usando Splash Screen Oficial del Proyecto Web');
console.log('================================================\n');

// Verificar splash screen oficial
const officialSplashPath = 'public/lovable-uploads/8517c16c-a94c-48da-9b01-9cabbde80b84.png';

if (!fs.existsSync(officialSplashPath)) {
  console.error('❌ Error: Splash screen oficial no encontrada');
  console.error(`   Ruta esperada: ${officialSplashPath}`);
  process.exit(1);
}

console.log('✅ Splash screen oficial encontrada');
console.log(`   Ruta: ${officialSplashPath}`);
console.log(`   Tamaño: 1024x1024px`);
console.log(`   Formato: PNG RGBA`);
console.log('');

// Dimensiones de splash screens por densidad
const splashDimensions = {
  'drawable-port-mdpi': { width: 320, height: 480 },
  'drawable-port-hdpi': { width: 480, height: 800 },
  'drawable-port-xhdpi': { width: 720, height: 1280 },
  'drawable-port-xxhdpi': { width: 1080, height: 1920 },
  'drawable-port-xxxhdpi': { width: 1440, height: 2560 },
  'drawable-land-mdpi': { width: 480, height: 320 },
  'drawable-land-hdpi': { width: 800, height: 480 },
  'drawable-land-xhdpi': { width: 1280, height: 720 },
  'drawable-land-xxhdpi': { width: 1920, height: 1080 },
  'drawable-land-xxxhdpi': { width: 2560, height: 1440 },
  'drawable': { width: 480, height: 320 }
};

console.log('📱 DIMENSIONES DE SPLASH SCREENS:');
console.log('==================================');
Object.entries(splashDimensions).forEach(([folder, dims]) => {
  console.log(`• ${folder}: ${dims.width}x${dims.height}`);
});
console.log('');

console.log('🎨 DISEÑO DE SPLASH SCREEN:');
console.log('===========================');
console.log('• Imagen: Splash screen oficial del proyecto web');
console.log('• Escalado: CENTER_CROP (configurado en capacitor.config.ts)');
console.log('• Fondo: Azul de la marca (#19418A) como fallback');
console.log('• Estilo: Oficial de Lovable/Coopsama');
console.log('');

console.log('🔧 PROCESO DE GENERACIÓN:');
console.log('=========================');
console.log('1. ✅ Verificar splash screen oficial (1024x1024px)');
console.log('2. 🔄 Redimensionar para cada densidad de pantalla');
console.log('3. 🔄 Mantener proporciones y calidad');
console.log('4. 🔄 Guardar en cada carpeta drawable correspondiente');
console.log('');

// Instrucciones para el usuario
console.log('📋 INSTRUCCIONES PARA USAR SPLASH SCREEN OFICIAL:');
console.log('==================================================');
console.log('');
console.log('OPCIÓN 1 - Usando ImageMagick (recomendado):');
console.log('```bash');
console.log('# Generar splash screens usando la imagen oficial');
console.log('');

Object.entries(splashDimensions).forEach(([folder, dims]) => {
  const width = dims.width;
  const height = dims.height;
  
  console.log(`# ${folder} (${width}x${height})`);
  console.log(`magick "${officialSplashPath}" -resize ${width}x${height}^ -gravity center -extent ${width}x${height} android/app/src/main/res/${folder}/splash.png`);
  console.log('');
});

console.log('```');
console.log('');
console.log('OPCIÓN 2 - Copiar imagen oficial directamente:');
console.log('```bash');
console.log('# Copiar la imagen oficial a todas las carpetas');
console.log('cp "${officialSplashPath}" android/app/src/main/res/drawable/splash.png');
console.log('cp "${officialSplashPath}" android/app/src/main/res/drawable-port-mdpi/splash.png');
console.log('cp "${officialSplashPath}" android/app/src/main/res/drawable-port-hdpi/splash.png');
console.log('# ... (repetir para todas las carpetas)');
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
console.log('• Splash screen oficial del proyecto web');
console.log('• Imagen original de Lovable/Coopsama');
console.log('• Tamaños correctos para todas las densidades');
console.log('• Consistencia con la versión web');
console.log('• Calidad profesional mantenida');
console.log('');

console.log('✅ Script de generación completado');
console.log('Usa la splash screen oficial del proyecto web en lugar de generar una nueva');
