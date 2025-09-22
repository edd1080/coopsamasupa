#!/usr/bin/env node

/**
 * Script para probar Storage desde la perspectiva de la aplicación
 * Simula el comportamiento real de la app con autenticación
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fsgzurbqrxjrjipghkcz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzZ3p1cmJxcnhqcmppcGdoa2N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0MzY3MjksImV4cCI6MjA3MzAxMjcyOX0.8d8QH8XEV4ghyfsAcWHREM1jSniAjpjz4zTvimnhjoU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testAppStorage() {
  console.log('🧪 Probando Storage desde la perspectiva de la aplicación...');
  
  try {
    // 1. Verificar que el bucket existe
    console.log('📦 Verificando bucket "documents"...');
    const { data: buckets, error: bucketsError } = await supabase
      .storage
      .listBuckets();

    if (bucketsError) {
      console.error('❌ Error obteniendo buckets:', bucketsError);
      return false;
    }

    const documentsBucket = buckets.find(bucket => bucket.name === 'documents');
    if (!documentsBucket) {
      console.error('❌ Bucket "documents" no encontrado');
      return false;
    }

    console.log('✅ Bucket "documents" encontrado:', {
      name: documentsBucket.name,
      public: documentsBucket.public,
      file_size_limit: documentsBucket.file_size_limit,
      allowed_mime_types: documentsBucket.allowed_mime_types
    });

    // 2. Probar subida de archivo de imagen (simulando foto)
    console.log('📸 Probando subida de imagen...');
    
    // Crear un archivo de imagen de prueba usando canvas
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');
    
    // Dibujar algo simple
    ctx.fillStyle = '#4F46E5';
    ctx.fillRect(0, 0, 100, 100);
    ctx.fillStyle = 'white';
    ctx.font = '16px Arial';
    ctx.fillText('TEST', 30, 55);
    
    // Convertir a blob
    const blob = await new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/png');
    });
    
    const testFile = new File([blob], 'test-image.png', { type: 'image/png' });
    const testPath = `test-${Date.now()}/test-image.png`;
    
    console.log(`📤 Subiendo imagen: ${testPath}`);
    console.log(`📊 Tamaño del archivo: ${testFile.size} bytes`);
    console.log(`📋 Tipo MIME: ${testFile.type}`);
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(testPath, testFile);

    if (uploadError) {
      console.error('❌ Error en subida:', uploadError);
      
      if (uploadError.message.includes('row-level security policy')) {
        console.log('💡 El problema es de políticas RLS');
      } else if (uploadError.message.includes('signature verification')) {
        console.log('💡 El problema es de autenticación');
      } else if (uploadError.message.includes('invalid_mime_type')) {
        console.log('💡 El problema es de tipo de archivo');
      }
      
      return false;
    }

    console.log('✅ Imagen subida exitosamente:', uploadData);
    
    // 3. Obtener URL pública
    const { data: { publicUrl } } = supabase.storage
      .from('documents')
      .getPublicUrl(testPath);
    
    console.log('🔗 URL pública:', publicUrl);
    
    // 4. Limpiar archivo de prueba
    console.log('🧹 Eliminando archivo de prueba...');
    const { error: deleteError } = await supabase.storage
      .from('documents')
      .remove([testPath]);
    
    if (deleteError) {
      console.warn('⚠️ No se pudo eliminar el archivo de prueba:', deleteError);
    } else {
      console.log('✅ Archivo de prueba eliminado');
    }
    
    return true;

  } catch (error) {
    console.error('❌ Error general:', error);
    return false;
  }
}

// Ejecutar la prueba
testAppStorage()
  .then(success => {
    if (success) {
      console.log('🎉 ¡Storage funcionando correctamente!');
      console.log('✅ La funcionalidad de subida de fotos debería funcionar en la app');
    } else {
      console.log('🔧 Hay problemas con la configuración de Storage');
    }
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('❌ Error fatal:', error);
    process.exit(1);
  });
