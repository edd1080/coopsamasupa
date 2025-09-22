#!/usr/bin/env node

/**
 * Script simple para configurar Supabase Storage usando API REST
 */

const https = require('https');
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

// Extraer project reference de la URL
const projectRef = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];
if (!projectRef) {
  console.error('❌ Error: No se pudo extraer project reference de la URL');
  process.exit(1);
}

console.log(`🔧 Configurando Storage para proyecto: ${projectRef}`);

// Función para hacer requests a la API de Supabase
function makeRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, supabaseUrl);
    
    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Content-Type': 'application/json',
        'apikey': supabaseServiceKey
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

    console.log('🎉 ¡Configuración completada!');
    console.log('');
    console.log('📋 Próximos pasos:');
    console.log('1. Ve al Dashboard de Supabase');
    console.log('2. Ve a Storage > Policies');
    console.log('3. Verifica que las políticas estén creadas');
    console.log('4. Prueba subir un archivo desde la aplicación');
    
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
