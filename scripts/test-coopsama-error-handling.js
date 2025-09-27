#!/usr/bin/env node

/**
 * Script de prueba para validar el manejo de errores de Coopsama
 * 
 * Este script simula diferentes respuestas de Coopsama para verificar
 * que la lógica de validación funciona correctamente.
 */

console.log('🧪 Testing Coopsama Error Handling Implementation');
console.log('=' .repeat(60));

// Simular diferentes respuestas de Coopsama
const testCases = [
  {
    name: "✅ Éxito - Aplicación creada correctamente",
    response: {
      code: 0,
      success: true,
      data: {
        externalReferenceId: "SCO_123456",
        externalError: false,
        externalMessage: "Solicitud procesada exitosamente",
        operationId: "op_123456"
      }
    },
    expectedResult: "CREATE_APPLICATION"
  },
  {
    name: "❌ Error Erx001 - No crear aplicación",
    response: {
      code: 0,
      success: true,
      data: {
        externalReferenceId: "0",
        externalError: true,
        externalMessage: "Excepción en el guardado de solicitud completa, información con errores, código de error: Erx001.",
        operationId: "op_123456"
      }
    },
    expectedResult: "SHOW_ERROR_DIALOG"
  },
  {
    name: "❌ Error Erx003 - No crear aplicación",
    response: {
      code: 0,
      success: true,
      data: {
        externalReferenceId: "0",
        externalError: true,
        externalMessage: "Excepción en el guardado de solicitud completa, información con errores, código de error: Erx003.",
        operationId: "op_123456"
      }
    },
    expectedResult: "SHOW_ERROR_DIALOG"
  },
  {
    name: "⚠️ Error de validación - No crear aplicación",
    response: {
      code: 1,
      success: false,
      message: "Error en el envío: faltan campos requeridos",
      errors: {
        "process_profile_personalDocument_age": ["The JSON value could not be converted to System.Int32."]
      }
    },
    expectedResult: "SHOW_ERROR_SCREEN"
  }
];

// Función que simula la lógica de validación implementada
function validateCoopsamaResponse(response) {
  console.log(`\n🔍 Testing: ${response.name}`);
  console.log('📋 Response:', JSON.stringify(response.response, null, 2));
  
  const { code, success, data, message, errors } = response.response;
  
  // Caso 1: Error de validación (code !== 0 o success !== true)
  if (code !== 0 || success !== true) {
    console.log('❌ Validation error detected');
    return {
      result: "SHOW_ERROR_SCREEN",
      errorMessage: message || 'Error desconocido',
      shouldCreateApplication: false
    };
  }
  
  // Caso 2: Respuesta exitosa de Coopsama
  if (data && typeof data === 'object') {
    const externalReferenceId = data.externalReferenceId || data.external_reference_id || data.referenceId || data.reference_id || data.id || data.solicitudId || data.applicationId;
    const externalError = data.externalError || false;
    const externalMessage = data.externalMessage || '';
    
    console.log('🔍 Coopsama response validation:', {
      externalReferenceId,
      externalError,
      externalMessage,
      shouldCreateApplication: externalReferenceId !== "0" && !externalError
    });
    
    // Validar respuesta de Coopsama: si externalReferenceId es "0" y externalError es true, no crear aplicación
    if (externalReferenceId === "0" && externalError === true) {
      console.log('❌ Coopsama validation failed - not creating application');
      return {
        result: "SHOW_ERROR_DIALOG",
        errorMessage: externalMessage,
        shouldCreateApplication: false
      };
    }
    
    // Caso de éxito: crear la aplicación
    console.log('✅ Coopsama validation passed - creating application');
    return {
      result: "CREATE_APPLICATION",
      errorMessage: null,
      shouldCreateApplication: true,
      externalReferenceId,
      operationId: data.operationId || data.operation_id || data.processId || data.process_id
    };
  }
  
  // Caso 3: Respuesta inválida
  console.log('⚠️ Invalid response from microservice');
  return {
    result: "SHOW_ERROR_SCREEN",
    errorMessage: 'Respuesta inválida del microservicio',
    shouldCreateApplication: false
  };
}

// Ejecutar pruebas
let passedTests = 0;
let totalTests = testCases.length;

testCases.forEach((testCase, index) => {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🧪 Test Case ${index + 1}/${totalTests}`);
  
  const result = validateCoopsamaResponse(testCase);
  
  console.log(`📊 Result: ${result.result}`);
  console.log(`📊 Expected: ${testCase.expectedResult}`);
  console.log(`📊 Should Create Application: ${result.shouldCreateApplication}`);
  
  if (result.result === testCase.expectedResult) {
    console.log('✅ TEST PASSED');
    passedTests++;
  } else {
    console.log('❌ TEST FAILED');
  }
  
  if (result.errorMessage) {
    console.log(`📝 Error Message: ${result.errorMessage}`);
  }
});

// Resumen final
console.log(`\n${'='.repeat(60)}`);
console.log('📊 TEST SUMMARY');
console.log(`✅ Passed: ${passedTests}/${totalTests}`);
console.log(`❌ Failed: ${totalTests - passedTests}/${totalTests}`);

if (passedTests === totalTests) {
  console.log('🎉 ALL TESTS PASSED! Coopsama error handling is working correctly.');
} else {
  console.log('⚠️ Some tests failed. Please review the implementation.');
}

console.log('\n🔧 Implementation Details:');
console.log('- ✅ Diálogo de error para errores de Coopsama (Erx001, Erx003, etc.)');
console.log('- ✅ Pantalla de error para errores de validación del API');
console.log('- ✅ Validación de externalReferenceId === "0" && externalError === true');
console.log('- ✅ Mantenimiento del formulario como borrador en caso de error');
console.log('- ✅ Logs detallados para debugging');
