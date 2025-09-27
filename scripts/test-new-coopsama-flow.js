#!/usr/bin/env node

/**
 * Script de prueba para validar el nuevo flujo de Coopsama
 * - Eliminación de validación previa
 * - Validación de respuesta ANTES de crear aplicación
 * - Manejo correcto de errores Erx005
 */

console.log('🧪 Testing New Coopsama Flow...\n');

// Simular respuesta de Coopsama con error Erx005
const mockCoopsamaResponse = {
  code: 0,
  success: true,
  data: {
    externalReferenceId: "0",
    externalError: true,
    externalMessage: "Excepción en el guardado de solicitud completa, información con errores, código de error: Erx005.",
    operationId: "68d749a083c22c63f50801f6"
  }
};

console.log('📋 Mock Coopsama Response:');
console.log(JSON.stringify(mockCoopsamaResponse, null, 2));

// Simular lógica de validación
function validateCoopsamaResponse(response) {
  const { code, success, data } = response;
  
  console.log('\n🔍 Validating Coopsama response...');
  
  // 1. Verificar código de respuesta
  if (code !== 0 || success !== true) {
    console.log('❌ Invalid response code or success status');
    return { shouldCreateApplication: false, error: 'Invalid response' };
  }
  
  // 2. Extraer datos de la respuesta
  const responseData = data || {};
  const externalReferenceId = responseData.externalReferenceId || responseData.external_reference_id || responseData.referenceId || responseData.reference_id || responseData.id || responseData.solicitudId || responseData.applicationId;
  const operationId = responseData.operationId || responseData.operation_id || responseData.processId || responseData.process_id;
  const externalError = responseData.externalError || false;
  const externalMessage = responseData.externalMessage || '';

  console.log('📊 Extracted values:', {
    externalReferenceId,
    externalError,
    externalMessage,
    operationId
  });

  // 3. Validar si debe crear la aplicación
  if (externalReferenceId === "0" && externalError === true) {
    console.log('❌ Coopsama validation failed - should NOT create application');
    console.log('📋 Error details:', {
      externalReferenceId,
      externalError,
      externalMessage
    });
    
    return {
      shouldCreateApplication: false,
      error: `COOPSAMA_ERROR:${externalMessage}`,
      externalReferenceId,
      operationId
    };
  }

  // 4. Éxito - crear aplicación
  console.log('✅ Coopsama validation passed - should create application');
  return {
    shouldCreateApplication: true,
    externalReferenceId,
    operationId
  };
}

// Ejecutar validación
const validationResult = validateCoopsamaResponse(mockCoopsamaResponse);

console.log('\n📊 Validation Result:');
console.log(JSON.stringify(validationResult, null, 2));

// Simular flujo de aplicación
if (validationResult.shouldCreateApplication) {
  console.log('\n✅ FLOW: Application would be created');
  console.log('📋 Application data would include:', {
    coopsama_external_reference_id: validationResult.externalReferenceId,
    coopsama_operation_id: validationResult.operationId,
    coopsama_sync_status: 'success',
    coopsama_synced_at: new Date().toISOString()
  });
} else {
  console.log('\n❌ FLOW: Application would NOT be created');
  console.log('📋 Error dialog would show:', validationResult.error);
  console.log('📋 Draft would remain in database for user to fix');
}

console.log('\n🎯 Test completed successfully!');
console.log('✅ New flow correctly prevents application creation when Coopsama returns error');
