#!/usr/bin/env node

/**
 * Script para probar la subida de archivos de metadata
 * Simula la funcionalidad implementada en useFinalizeApplication
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fsgzurbqrxjrjipghkcz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzZ3p1cmJxcnhqcmppcGdoa2N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0MzY3MjksImV4cCI6MjA3MzAxMjcyOX0.8d8QH8XEV4ghyfsAcWHREM1jSniAjpjz4zTvimnhjoU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testMetadataUpload() {
  console.log('🧪 Probando subida de archivo de metadata...');
  
  try {
    // Simular datos de una solicitud
    const applicationId = 'SCO_' + Math.floor(100000 + Math.random() * 900000);
    const userEmail = 'test@example.com';
    const formData = {
      firstName: 'Juan Carlos',
      lastName: 'Pérez García',
      phone: '5555-1234',
      address: 'Zona 10, Guatemala',
      occupation: 'Ingeniero',
      loanAmount: 50000
    };

    // Crear estructura de carpeta: {applicationId}_{userEmail}
    const folderName = `${applicationId}_${userEmail.replace('@', '_at_').replace(/[^a-zA-Z0-9_-]/g, '_')}`;
    
    console.log(`📁 Estructura de carpeta: ${folderName}`);

    // Crear contenido del archivo de metadata
    const metadataContent = `SOLICITUD DE CRÉDITO - METADATA
=====================================

ID de Solicitud: ${applicationId}
Email del Agente: ${userEmail}
Fecha de Envío: ${new Date().toLocaleDateString('es-GT')}
Hora de Envío: ${new Date().toLocaleTimeString('es-GT')}
Nombre Completo del Solicitante: ${formData.firstName} ${formData.lastName}
Monto Solicitado: Q${formData.loanAmount.toLocaleString('es-GT')}
Estado: pending

DOCUMENTOS ADJUNTOS:
===================
- cedula_front: cedula_front-1234567890.jpg
- cedula_back: cedula_back-1234567890.jpg
- comprobante_ingresos: comprobante_ingresos-1234567890.pdf

INFORMACIÓN ADICIONAL:
=====================
Teléfono: ${formData.phone}
Dirección: ${formData.address}
Ocupación: ${formData.occupation}

Generado automáticamente el ${new Date().toISOString()}
`;

    // Crear archivo de metadata
    const metadataFile = new File([metadataContent], 'solicitud_metadata.txt', { 
      type: 'text/plain' 
    });

    // Subir archivo de metadata
    const metadataPath = `${folderName}/solicitud_metadata.txt`;
    console.log(`📄 Subiendo archivo de metadata: ${metadataPath}`);

    const { data: metadataUploadData, error: metadataError } = await supabase.storage
      .from('documents')
      .upload(metadataPath, metadataFile, { upsert: true });

    if (metadataError) {
      console.error('❌ Error subiendo metadata:', metadataError);
      
      if (metadataError.message.includes('invalid_mime_type')) {
        console.log('💡 El bucket no acepta archivos .txt aún');
        console.log('🔧 Ejecuta el SQL en scripts/update-bucket-config.sql');
      }
      
      return false;
    }

    console.log('✅ Archivo de metadata subido exitosamente:', metadataUploadData);

    // Obtener URL pública
    const { data: { publicUrl } } = supabase.storage
      .from('documents')
      .getPublicUrl(metadataPath);
    
    console.log('🔗 URL pública del metadata:', publicUrl);

    // Simular subida de imagen de prueba
    console.log('📸 Simulando subida de imagen...');
    
    const testImageContent = 'Test image content';
    const testImageFile = new File([testImageContent], 'test-image.jpg', { 
      type: 'image/jpeg' 
    });
    
    const imagePath = `${folderName}/cedula_front-${Date.now()}.jpg`;
    
    const { data: imageUploadData, error: imageError } = await supabase.storage
      .from('documents')
      .upload(imagePath, testImageFile, { upsert: true });

    if (imageError) {
      console.error('❌ Error subiendo imagen:', imageError);
    } else {
      console.log('✅ Imagen subida exitosamente:', imageUploadData);
    }

    // Listar archivos en la carpeta
    console.log('📁 Listando archivos en la carpeta...');
    const { data: files, error: listError } = await supabase.storage
      .from('documents')
      .list(folderName);

    if (listError) {
      console.error('❌ Error listando archivos:', listError);
    } else {
      console.log('📋 Archivos en la carpeta:');
      files.forEach(file => {
        console.log(`  - ${file.name} (${file.metadata?.size || 'N/A'} bytes)`);
      });
    }

    // Limpiar archivos de prueba
    console.log('🧹 Limpiando archivos de prueba...');
    const { error: deleteError } = await supabase.storage
      .from('documents')
      .remove([metadataPath, imagePath]);
    
    if (deleteError) {
      console.warn('⚠️ No se pudieron eliminar los archivos de prueba:', deleteError);
    } else {
      console.log('✅ Archivos de prueba eliminados');
    }

    return true;

  } catch (error) {
    console.error('❌ Error general:', error);
    return false;
  }
}

// Ejecutar la prueba
testMetadataUpload()
  .then(success => {
    if (success) {
      console.log('🎉 ¡Funcionalidad de metadata funcionando correctamente!');
      console.log('✅ La app ahora creará archivos .txt con información de la solicitud');
    } else {
      console.log('🔧 Hay problemas que resolver');
    }
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('❌ Error fatal:', error);
    process.exit(1);
  });
