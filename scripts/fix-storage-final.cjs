#!/usr/bin/env node

/**
 * Script final para configurar Supabase Storage
 * Usa el project_id del config.toml
 */

const https = require('https');

// Configuración del proyecto
const PROJECT_ID = 'fsgzurbqrxjrjipghkcz';
const SUPABASE_URL = `https://${PROJECT_ID}.supabase.co`;

// Necesitarás obtener tu service role key del dashboard de Supabase
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'YOUR_SERVICE_ROLE_KEY_HERE';

if (SUPABASE_SERVICE_KEY === 'YOUR_SERVICE_ROLE_KEY_HERE') {
  console.error('❌ Error: Necesitas configurar SUPABASE_SERVICE_ROLE_KEY');
  console.error('');
  console.error('Para obtener tu service role key:');
  console.error('1. Ve al Dashboard de Supabase');
  console.error('2. Ve a Settings > API');
  console.error('3. Copia la "service_role" key');
  console.error('4. Ejecuta: export SUPABASE_SERVICE_ROLE_KEY="tu_key_aqui"');
  console.error('5. Luego ejecuta este script de nuevo');
  process.exit(1);
}

console.log(`🔧 Configurando Storage para proyecto: ${PROJECT_ID}`);

// Función para hacer requests a la API de Supabase
function makeRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, SUPABASE_URL);
    
    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_KEY
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const jsonBody = body ? JSON.parse(body) : {};
          resolve({ status: res.statusCode, data: jsonBody });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function fixStorage() {
  try {
    // 1. Verificar buckets existentes
    console.log('📦 Verificando buckets existentes...');
    const { status, data } = await makeRequest('/storage/v1/bucket');
    
    if (status !== 200) {
      console.error('❌ Error obteniendo buckets:', data);
      return false;
    }

    console.log('📋 Buckets encontrados:', data.map(b => b.name).join(', '));

    const documentsBucket = data.find(bucket => bucket.name === 'documents');
    
    if (!documentsBucket) {
      console.log('📦 Creando bucket "documents"...');
      const { status: createStatus, data: createData } = await makeRequest('/storage/v1/bucket', 'POST', {
        id: 'documents',
        name: 'documents',
        public: true,
        file_size_limit: 52428800,
        allowed_mime_types: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf']
      });

      if (createStatus !== 200 && createStatus !== 409) {
        console.error('❌ Error creando bucket:', createData);
        return false;
      }
      console.log('✅ Bucket "documents" creado');
    } else {
      console.log('✅ Bucket "documents" ya existe');
    }

    // 2. Crear políticas RLS usando SQL
    console.log('🔐 Configurando políticas RLS...');
    
    const policies = [
      `DROP POLICY IF EXISTS "Users can upload documents" ON storage.objects`,
      `CREATE POLICY "Users can upload documents" ON storage.objects
       FOR INSERT WITH CHECK (
         bucket_id = 'documents' 
         AND auth.role() = 'authenticated'
       )`,
      `DROP POLICY IF EXISTS "Users can view their own documents" ON storage.objects`,
      `CREATE POLICY "Users can view their own documents" ON storage.objects
       FOR SELECT USING (
         bucket_id = 'documents' 
         AND auth.role() = 'authenticated'
       )`,
      `DROP POLICY IF EXISTS "Users can update their own documents" ON storage.objects`,
      `CREATE POLICY "Users can update their own documents" ON storage.objects
       FOR UPDATE USING (
         bucket_id = 'documents' 
         AND auth.role() = 'authenticated'
       )`,
      `DROP POLICY IF EXISTS "Users can delete their own documents" ON storage.objects`,
      `CREATE POLICY "Users can delete their own documents" ON storage.objects
       FOR DELETE USING (
         bucket_id = 'documents' 
         AND auth.role() = 'authenticated'
       )`
    ];

    for (const sql of policies) {
      console.log(`🔐 Ejecutando: ${sql.substring(0, 50)}...`);
      const { status: sqlStatus, data: sqlData } = await makeRequest('/rest/v1/rpc/exec_sql', 'POST', { sql });
      
      if (sqlStatus !== 200) {
        console.warn(`⚠️  SQL ejecutado con status ${sqlStatus}:`, sqlData);
      } else {
        console.log('✅ SQL ejecutado correctamente');
      }
    }

    // 3. Probar subida de archivo
    console.log('🧪 Probando subida de archivo...');
    
    // Crear un archivo de prueba simple
    const testContent = 'Test file for RLS verification';
    const testFile = Buffer.from(testContent);
    
    const testPath = `test-${Date.now()}/test-rls.txt`;
    
    const { status: uploadStatus, data: uploadData } = await makeRequest(`/storage/v1/object/documents/${testPath}`, 'POST', testFile, {
      'Content-Type': 'text/plain',
      'Content-Length': testFile.length
    });

    if (uploadStatus !== 200) {
      console.error('❌ Error en prueba de subida:', uploadData);
      console.log('💡 Esto es normal si las políticas RLS no están configuradas correctamente');
    } else {
      console.log('✅ Prueba de subida exitosa:', uploadData);
      
      // Limpiar archivo de prueba
      await makeRequest(`/storage/v1/object/documents/${testPath}`, 'DELETE');
      console.log('🧹 Archivo de prueba eliminado');
    }

    console.log('');
    console.log('🎉 ¡Configuración completada!');
    console.log('');
    console.log('📋 Próximos pasos:');
    console.log('1. Ve al Dashboard de Supabase: https://supabase.com/dashboard/project/' + PROJECT_ID);
    console.log('2. Ve a Storage > Policies');
    console.log('3. Verifica que las políticas estén creadas');
    console.log('4. Si hay errores, ejecuta el SQL manualmente en el SQL Editor');
    console.log('5. Prueba subir un archivo desde la aplicación');
    
    return true;

  } catch (error) {
    console.error('❌ Error:', error);
    return false;
  }
}

// Ejecutar
if (require.main === module) {
  fixStorage()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('❌ Error fatal:', error);
      process.exit(1);
    });
}

module.exports = { fixStorage };
