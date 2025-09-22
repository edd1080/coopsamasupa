#!/usr/bin/env node

/**
 * Script para automatizar la generación de APK con Capacitor
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('📱 Generador Automático de APK - Coopsama App');
console.log('==============================================\n');

// Función para ejecutar comandos
function runCommand(command, description) {
  console.log(`🔄 ${description}...`);
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${description} completado\n`);
    return true;
  } catch (error) {
    console.error(`❌ Error en ${description}:`, error.message);
    return false;
  }
}

// Función para verificar si un archivo/directorio existe
function exists(path) {
  return fs.existsSync(path);
}

// Función principal
async function generateAPK() {
  console.log('🚀 Iniciando proceso de generación de APK...\n');

  // Paso 1: Verificar prerrequisitos
  console.log('📋 PASO 1: Verificando prerrequisitos');
  console.log('=====================================');

  // Verificar Node.js
  try {
    const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
    console.log(`✅ Node.js: ${nodeVersion}`);
  } catch (error) {
    console.error('❌ Node.js no está instalado');
    return false;
  }

  // Verificar npm
  try {
    const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
    console.log(`✅ npm: ${npmVersion}`);
  } catch (error) {
    console.error('❌ npm no está disponible');
    return false;
  }

  // Verificar Capacitor CLI
  try {
    const capVersion = execSync('npx cap --version', { encoding: 'utf8' }).trim();
    console.log(`✅ Capacitor CLI: ${capVersion}`);
  } catch (error) {
    console.error('❌ Capacitor CLI no está disponible');
    return false;
  }

  console.log('');

  // Paso 2: Build de la aplicación
  console.log('📋 PASO 2: Generando build de producción');
  console.log('========================================');

  if (!runCommand('npm run build', 'Build de la aplicación')) {
    console.error('❌ Falló el build de la aplicación');
    return false;
  }

  // Verificar que se creó la carpeta dist
  if (!exists('dist')) {
    console.error('❌ No se encontró la carpeta dist/');
    return false;
  }
  console.log('✅ Carpeta dist/ creada correctamente\n');

  // Paso 3: Agregar plataforma Android si no existe
  console.log('📋 PASO 3: Configurando plataforma Android');
  console.log('==========================================');

  if (!exists('android')) {
    console.log('🔄 Agregando plataforma Android...');
    if (!runCommand('npx cap add android', 'Agregar plataforma Android')) {
      console.error('❌ Falló al agregar la plataforma Android');
      return false;
    }
  } else {
    console.log('✅ Plataforma Android ya existe');
  }

  // Paso 4: Sincronizar con Capacitor
  console.log('\n📋 PASO 4: Sincronizando con Capacitor');
  console.log('======================================');

  if (!runCommand('npx cap sync android', 'Sincronización con Android')) {
    console.error('❌ Falló la sincronización con Android');
    return false;
  }

  // Verificar que se creó la carpeta android
  if (!exists('android')) {
    console.error('❌ No se encontró la carpeta android/');
    return false;
  }
  console.log('✅ Carpeta android/ creada correctamente\n');

  // Paso 5: Verificar configuración
  console.log('\n📋 PASO 5: Verificando configuración');
  console.log('====================================');

  // Verificar capacitor.config.ts
  if (exists('capacitor.config.ts')) {
    console.log('✅ capacitor.config.ts encontrado');
  } else {
    console.error('❌ capacitor.config.ts no encontrado');
    return false;
  }

  // Verificar package.json
  if (exists('package.json')) {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const hasCapacitor = packageJson.dependencies && 
      (packageJson.dependencies['@capacitor/core'] || packageJson.dependencies['@capacitor/android']);
    
    if (hasCapacitor) {
      console.log('✅ Dependencias de Capacitor encontradas');
    } else {
      console.error('❌ Dependencias de Capacitor no encontradas');
      return false;
    }
  }

  console.log('');

  // Paso 6: Instrucciones para Android Studio
  console.log('📋 PASO 6: Instrucciones para Android Studio');
  console.log('============================================');

  console.log('🔧 Para completar la generación del APK:');
  console.log('');
  console.log('1. 📱 Instalar Android Studio (si no está instalado)');
  console.log('   - Descargar desde: https://developer.android.com/studio');
  console.log('   - Instalar Android SDK');
  console.log('');
  console.log('2. 🚀 Abrir proyecto en Android Studio:');
  console.log('   npx cap open android');
  console.log('');
  console.log('3. 🔨 Generar APK desde Android Studio:');
  console.log('   - Build > Build Bundle(s) / APK(s) > Build APK(s)');
  console.log('   - APK se generará en: android/app/build/outputs/apk/');
  console.log('');
  console.log('4. 🏃‍♂️ Alternativa rápida (si Android Studio está configurado):');
  console.log('   npx cap run android');
  console.log('');

  // Paso 7: Información adicional
  console.log('📋 PASO 7: Información adicional');
  console.log('===============================');

  console.log('📊 Configuración actual:');
  console.log(`   - App ID: app.lovable.c018926e40254894ae52122f75906f16`);
  console.log(`   - App Name: coopsamasupa`);
  console.log(`   - Web Directory: dist`);
  console.log(`   - Tema: #19418A (Azul Coopsama)`);
  console.log('');

  console.log('🔧 Funcionalidades nativas configuradas:');
  console.log('   - ✅ Cámara para documentos');
  console.log('   - ✅ Status Bar personalizada');
  console.log('   - ✅ Splash Screen personalizada');
  console.log('   - ✅ PWA offline');
  console.log('');

  console.log('📱 Tamaño estimado del APK:');
  console.log('   - Base: ~15-25 MB');
  console.log('   - Optimizado: ~10-15 MB');
  console.log('');

  console.log('🎯 ¡Proceso de preparación completado!');
  console.log('=====================================');
  console.log('✅ Build de la aplicación: Completado');
  console.log('✅ Sincronización con Capacitor: Completado');
  console.log('✅ Proyecto Android: Listo');
  console.log('');
  console.log('🚀 Próximo paso: Abrir en Android Studio y generar APK');
  console.log('   Comando: npx cap open android');

  return true;
}

// Ejecutar el script
generateAPK().catch(console.error);
