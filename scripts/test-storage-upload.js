#!/usr/bin/env node

/**
 * Script para probar la subida de archivos a Supabase Storage
 * Este script simula lo que hace la aplicación
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fsgzurbqrxjrjipghkcz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzZ3p1cmJxcnhqcmppcGdoa2N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0MzY3MjksImV4cCI6MjA3MzAxMjcyOX0.8d8QH8XEV4ghyfsAcWHREM1jSniAjpjz4zTvimnhjoU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testStorageUpload() {
  console.log('🧪 Probando subida de archivo a Supabase Storage...');
  
  try {
    // Crear un archivo de prueba
    const testContent = 'Test file for storage verification';
    const testFile = new File([testContent], 'test-storage.txt', { type: 'text/plain' });
    
    const testPath = `test-${Date.now()}/test-storage.txt`;
    
    console.log(`📤 Subiendo archivo: ${testPath}`);
    
    const { data, error } = await supabase.storage
      .from('documents')
      .upload(testPath, testFile);

    if (error) {
      console.error('❌ Error en subida:', error);
      
      if (error.message.includes('row-level security policy')) {
        console.log('💡 Solución: Necesitas configurar las políticas RLS');
        console.log('1. Ve al Dashboard de Supabase');
        console.log('2. Ve a Storage > Policies');
        console.log('3. Ejecuta el SQL en scripts/storage-rls-policies.sql');
      }
      
      return false;
    }

    console.log('✅ Archivo subido exitosamente:', data);
    
    // Limpiar archivo de prueba
    const { error: deleteError } = await supabase.storage
      .from('documents')
      .remove([testPath]);
    
    if (deleteError) {
      console.warn('⚠️ No se pudo eliminar el archivo de prueba:', deleteError);
    } else {
      console.log('🧹 Archivo de prueba eliminado');
    }
    
    return true;

  } catch (error) {
    console.error('❌ Error general:', error);
    return false;
  }
}

// Ejecutar la prueba
testStorageUpload()
  .then(success => {
    if (success) {
      console.log('🎉 ¡Storage funcionando correctamente!');
    } else {
      console.log('🔧 Necesitas configurar las políticas RLS');
    }
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('❌ Error fatal:', error);
    process.exit(1);
  });
