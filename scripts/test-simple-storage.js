#!/usr/bin/env node

/**
 * Script simple para probar Storage
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fsgzurbqrxjrjipghkcz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzZ3p1cmJxcnhqcmppcGdoa2N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0MzY3MjksImV4cCI6MjA3MzAxMjcyOX0.8d8QH8XEV4ghyfsAcWHREM1jSniAjpjz4zTvimnhjoU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSimpleStorage() {
  console.log('🧪 Probando Storage de forma simple...');
  
  try {
    // 1. Verificar buckets
    console.log('📦 Verificando buckets...');
    const { data: buckets, error: bucketsError } = await supabase
      .storage
      .listBuckets();

    if (bucketsError) {
      console.error('❌ Error obteniendo buckets:', bucketsError);
      return false;
    }

    console.log('✅ Buckets encontrados:', buckets.map(b => b.name).join(', '));

    const documentsBucket = buckets.find(bucket => bucket.name === 'documents');
    if (!documentsBucket) {
      console.error('❌ Bucket "documents" no encontrado');
      return false;
    }

    console.log('✅ Bucket "documents" configurado correctamente');
    console.log('📋 Configuración:', {
      public: documentsBucket.public,
      file_size_limit: documentsBucket.file_size_limit,
      allowed_mime_types: documentsBucket.allowed_mime_types
    });

    // 2. Probar listado de archivos
    console.log('📁 Probando listado de archivos...');
    const { data: files, error: filesError } = await supabase.storage
      .from('documents')
      .list('', { limit: 10 });

    if (filesError) {
      console.error('❌ Error listando archivos:', filesError);
    } else {
      console.log('✅ Listado de archivos exitoso');
      console.log(`📊 Archivos encontrados: ${files.length}`);
    }

    // 3. Probar subida de archivo de texto simple
    console.log('📤 Probando subida de archivo...');
    
    const testContent = 'Test file for storage verification';
    const testFile = new File([testContent], 'test-storage.txt', { type: 'text/plain' });
    const testPath = `test-${Date.now()}/test-storage.txt`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(testPath, testFile);

    if (uploadError) {
      console.error('❌ Error en subida:', uploadError);
      
      if (uploadError.message.includes('row-level security policy')) {
        console.log('💡 Problema: Políticas RLS');
        console.log('🔧 Solución: Las políticas están configuradas pero puede haber conflicto');
      } else if (uploadError.message.includes('signature verification')) {
        console.log('💡 Problema: Autenticación');
        console.log('🔧 Solución: Necesitas estar autenticado para subir archivos');
      } else if (uploadError.message.includes('invalid_mime_type')) {
        console.log('💡 Problema: Tipo de archivo no permitido');
        console.log('🔧 Solución: El bucket solo acepta imágenes y PDFs');
      }
      
      return false;
    }

    console.log('✅ Archivo subido exitosamente:', uploadData);
    
    // 4. Obtener URL pública
    const { data: { publicUrl } } = supabase.storage
      .from('documents')
      .getPublicUrl(testPath);
    
    console.log('🔗 URL pública:', publicUrl);
    
    // 5. Limpiar
    const { error: deleteError } = await supabase.storage
      .from('documents')
      .remove([testPath]);
    
    if (deleteError) {
      console.warn('⚠️ No se pudo eliminar:', deleteError);
    } else {
      console.log('🧹 Archivo eliminado');
    }
    
    return true;

  } catch (error) {
    console.error('❌ Error general:', error);
    return false;
  }
}

// Ejecutar
testSimpleStorage()
  .then(success => {
    if (success) {
      console.log('🎉 ¡Storage funcionando!');
      console.log('✅ La app debería poder subir fotos correctamente');
    } else {
      console.log('🔧 Hay problemas que resolver');
    }
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('❌ Error fatal:', error);
    process.exit(1);
  });
