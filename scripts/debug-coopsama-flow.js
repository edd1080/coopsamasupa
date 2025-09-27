#!/usr/bin/env node

/**
 * Script de debug para identificar por qué la aplicación se crea a pesar del error Erx001
 */

console.log('🔍 Debugging Coopsama Flow Issue...\n');

// Simular la respuesta de Coopsama que está causando el problema
const mockCoopsamaResponse = {
  code: 0,
  success: true,
  data: {
    operationId: "68d74d6683c22c63f50801f8",
    externalReferenceId: "0",
    externalMessage: "Excepción en el guardado de solicitud completa, información con errores, código de error: Erx001.",
    externalError: true
  }
};

console.log('📋 Mock Coopsama Response (from logs):');
console.log(JSON.stringify(mockCoopsamaResponse, null, 2));

// Simular la lógica de validación CORREGIDA
function simulateCorrectedValidation(response) {
  console.log('\n🔍 Simulating CORRECTED validation logic...');
  
  const { code, success, data } = response;
  
  // 1. El microservicio siempre devuelve 200, pero el error real está en los datos
  console.log('🔍 Microservicio devolvió 200 - verificando datos internos...');
  
  // 2. Extraer datos de la respuesta (el microservicio siempre devuelve data.data)
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

  // 3. Validar si debe crear la aplicación (LÓGICA CORREGIDA)
  if (externalReferenceId === "0" && externalError === true) {
    console.log('❌ Coopsama validation failed - should NOT create application');
    console.log('📋 Error details:', {
      externalReferenceId,
      externalError,
      externalMessage
    });
    
    console.log('🚨 THROWING ERROR TO PREVENT APPLICATION CREATION');
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
console.log('\n🧪 Testing CORRECTED validation logic...');
const validationResult = simulateCorrectedValidation(mockCoopsamaResponse);

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

console.log('\n🔍 Possible Issues:');
console.log('1. Multiple function calls - check if useFinalizeApplication is called multiple times');
console.log('2. Error not propagating - check if try/catch is swallowing the error');
console.log('3. Race condition - check if application is created before validation');
console.log('4. Log message confusion - "successful" might be from microservice, not frontend');

console.log('\n🎯 Next Steps:');
console.log('1. Add more console.log statements to track the flow');
console.log('2. Check if the error is being caught and handled elsewhere');
console.log('3. Verify that the application creation is not happening in parallel');
console.log('4. Check the microservice logs to see if it\'s logging "successful" incorrectly');
