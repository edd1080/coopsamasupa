#!/usr/bin/env node

/**
 * Script para configurar políticas RLS de Supabase Storage
 * Este script configura las políticas necesarias para permitir subida de documentos
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Faltan variables de entorno');
  console.error('Necesitas configurar:');
  console.error('- VITE_SUPABASE_URL');
  console.error('- SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Crear cliente con service role key para bypass de RLS
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function fixStorageRLS() {
  console.log('🔧 Configurando políticas RLS para Supabase Storage...');

  try {
    // 1. Verificar si el bucket existe
    console.log('📦 Verificando bucket "documents"...');
    const { data: buckets, error: bucketsError } = await supabase
      .from('storage.buckets')
      .select('*')
      .eq('name', 'documents');

    if (bucketsError) {
      console.error('❌ Error verificando buckets:', bucketsError);
      return false;
    }

    if (buckets.length === 0) {
      console.log('📦 Creando bucket "documents"...');
      const { data: bucketData, error: bucketError } = await supabase
        .from('storage.buckets')
        .insert({
          id: 'documents',
          name: 'documents',
          public: true,
          file_size_limit: 52428800, // 50MB
          allowed_mime_types: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf']
        });

      if (bucketError) {
        console.error('❌ Error creando bucket:', bucketError);
        return false;
      }
      console.log('✅ Bucket "documents" creado');
    } else {
      console.log('✅ Bucket "documents" ya existe');
    }

    // 2. Configurar políticas RLS usando SQL directo
    console.log('🔐 Configurando políticas RLS...');
    
    const policies = [
      {
        name: 'Users can upload documents',
        sql: `CREATE POLICY "Users can upload documents" ON storage.objects
              FOR INSERT WITH CHECK (
                bucket_id = 'documents' 
                AND auth.role() = 'authenticated'
                AND auth.uid()::text = (storage.foldername(name))[1]
              )`
      },
      {
        name: 'Users can view their own documents',
        sql: `CREATE POLICY "Users can view their own documents" ON storage.objects
              FOR SELECT USING (
                bucket_id = 'documents' 
                AND auth.role() = 'authenticated'
                AND auth.uid()::text = (storage.foldername(name))[1]
              )`
      },
      {
        name: 'Users can update their own documents',
        sql: `CREATE POLICY "Users can update their own documents" ON storage.objects
              FOR UPDATE USING (
                bucket_id = 'documents' 
                AND auth.role() = 'authenticated'
                AND auth.uid()::text = (storage.foldername(name))[1]
              )`
      },
      {
        name: 'Users can delete their own documents',
        sql: `CREATE POLICY "Users can delete their own documents" ON storage.objects
              FOR DELETE USING (
                bucket_id = 'documents' 
                AND auth.role() = 'authenticated'
                AND auth.uid()::text = (storage.foldername(name))[1]
              )`
      }
    ];

    for (const policy of policies) {
      try {
        console.log(`🔐 Creando política: ${policy.name}`);
        const { error } = await supabase.rpc('exec_sql', { sql: policy.sql });
        
        if (error) {
          // Si la política ya existe, ignorar el error
          if (error.message.includes('already exists')) {
            console.log(`✅ Política "${policy.name}" ya existe`);
          } else {
            console.error(`❌ Error creando política "${policy.name}":`, error);
          }
        } else {
          console.log(`✅ Política "${policy.name}" creada`);
        }
      } catch (err) {
        console.error(`❌ Error ejecutando política "${policy.name}":`, err);
      }
    }

    // 3. Verificar políticas creadas
    console.log('🔍 Verificando políticas creadas...');
    const { data: policiesData, error: policiesError } = await supabase
      .from('pg_policies')
      .select('policyname, cmd, qual')
      .eq('tablename', 'objects')
      .eq('schemaname', 'storage');

    if (policiesError) {
      console.error('❌ Error verificando políticas:', policiesError);
    } else {
      console.log('📋 Políticas encontradas:');
      policiesData.forEach(policy => {
        console.log(`  - ${policy.policyname} (${policy.cmd})`);
      });
    }

    // 4. Probar subida de archivo de prueba
    console.log('🧪 Probando subida de archivo...');
    
    // Crear un archivo de prueba
    const testContent = 'Test file for RLS verification';
    const testFile = new File([testContent], 'test-rls.txt', { type: 'text/plain' });
    
    const testPath = `test-${Date.now()}/test-rls.txt`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(testPath, testFile);

    if (uploadError) {
      console.error('❌ Error en prueba de subida:', uploadError);
      return false;
    }

    console.log('✅ Prueba de subida exitosa:', uploadData);

    // Limpiar archivo de prueba
    await supabase.storage
      .from('documents')
      .remove([testPath]);

    console.log('🧹 Archivo de prueba eliminado');

    console.log('🎉 ¡Configuración de RLS completada exitosamente!');
    return true;

  } catch (error) {
    console.error('❌ Error general:', error);
    return false;
  }
}

// Ejecutar el script
if (require.main === module) {
  fixStorageRLS()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('❌ Error fatal:', error);
      process.exit(1);
    });
}

module.exports = { fixStorageRLS };
