#!/usr/bin/env node

/**
 * Script completo para probar todo el flujo de Coopsama
 * Incluye: payload, validación, casos edge, integración y reporte final
 */

console.log('🧪 PRUEBA COMPLETA DEL SISTEMA COOPSAMA');
console.log('=======================================\n');

// Importar funciones de los otros scripts
const { buildApplicationPayload, validatePayload, analyzeFieldMapping } = require('./test-coopsama-payload.js');
const { runEdgeCaseTests } = require('./test-coopsama-edge-cases.js');
const { simulateCoopsamaSubmission, analyzeResponse } = require('./test-coopsama-integration.js');

// Función para ejecutar todas las pruebas
async function runCompleteTest() {
  console.log('🚀 Iniciando suite completa de pruebas...\n');
  
  const results = {
    payloadTest: null,
    edgeCaseTest: null,
    integrationTest: null,
    summary: {
      totalTests: 0,
      passed: 0,
      failed: 0,
      warnings: 0
    }
  };
  
  try {
    // 1. Prueba de payload básico
    console.log('📋 PRUEBA 1: Payload Básico');
    console.log('===========================');
    const mockData = {
      firstName: 'Juan Carlos',
      lastName: 'Pérez García',
      dpi: '1234567890123',
      phone: '5555-1234',
      email: 'juan.perez@email.com',
      loanAmount: '25000',
      applicationId: 'SCO_123456'
    };
    
    const payload = buildApplicationPayload(mockData);
    const validation = validatePayload(payload);
    const mapping = analyzeFieldMapping(mockData, payload);
    
    results.payloadTest = {
      success: validation.errors.length === 0,
      errors: validation.errors,
      warnings: validation.warnings,
      fieldsMapped: Object.keys(payload).length
    };
    
    console.log(`✅ Payload construido: ${results.payloadTest.fieldsMapped} campos`);
    console.log(`✅ Validación: ${validation.errors.length} errores, ${validation.warnings.length} advertencias`);
    console.log('');
    
    // 2. Prueba de casos edge
    console.log('📋 PRUEBA 2: Casos Edge');
    console.log('========================');
    const edgeResults = await runEdgeCaseTests();
    results.edgeCaseTest = edgeResults;
    console.log('');
    
    // 3. Prueba de integración
    console.log('📋 PRUEBA 3: Integración Completa');
    console.log('=================================');
    const integrationData = {
      firstName: 'María Elena',
      lastName: 'Rodríguez Martínez',
      dpi: '1234567890123',
      phone: '5555-9876',
      email: 'maria.rodriguez@email.com',
      loanAmount: '35000',
      applicationId: 'SCO_789012',
      personalReferences: [
        { firstName: 'Carlos', lastName: 'Rodríguez', relationship: 'Esposo', phone: '5555-1111', referenceType: 'personal' },
        { firstName: 'Ana', lastName: 'García', relationship: 'Hermana', phone: '5555-2222', referenceType: 'personal' }
      ]
    };
    
    const integrationPayload = buildApplicationPayload(integrationData);
    const integrationResponse = await simulateCoopsamaSubmission(integrationPayload);
    const integrationAnalysis = analyzeResponse(integrationResponse);
    
    results.integrationTest = {
      success: integrationAnalysis.status === 'success',
      response: integrationAnalysis,
      payloadFields: Object.keys(integrationPayload).length
    };
    
    console.log(`✅ Integración: ${integrationAnalysis.status}`);
    console.log('');
    
    // 4. Generar reporte final
    console.log('📋 REPORTE FINAL');
    console.log('================');
    generateFinalReport(results);
    
  } catch (error) {
    console.error('❌ Error durante las pruebas:', error.message);
    results.summary.failed++;
  }
  
  return results;
}

// Función para generar reporte final
function generateFinalReport(results) {
  console.log('\n📊 RESUMEN EJECUTIVO');
  console.log('====================');
  
  // Calcular estadísticas
  let totalTests = 0;
  let passed = 0;
  let failed = 0;
  let warnings = 0;
  
  if (results.payloadTest) {
    totalTests++;
    if (results.payloadTest.success) passed++;
    else failed++;
    warnings += results.payloadTest.warnings.length;
  }
  
  if (results.edgeCaseTest) {
    totalTests += results.edgeCaseTest.length;
    results.edgeCaseTest.forEach(test => {
      if (test.success) passed++;
      else failed++;
      warnings += test.warnings.length;
    });
  }
  
  if (results.integrationTest) {
    totalTests++;
    if (results.integrationTest.success) passed++;
    else failed++;
  }
  
  console.log(`📈 Estadísticas Generales:`);
  console.log(`- Total de pruebas: ${totalTests}`);
  console.log(`- Exitosas: ${passed} (${Math.round((passed/totalTests)*100)}%)`);
  console.log(`- Fallidas: ${failed} (${Math.round((failed/totalTests)*100)}%)`);
  console.log(`- Advertencias: ${warnings}`);
  
  console.log('\n🔍 ANÁLISIS DETALLADO');
  console.log('====================');
  
  // Análisis del payload
  if (results.payloadTest) {
    console.log('\n📋 Payload Básico:');
    console.log(`- Estado: ${results.payloadTest.success ? '✅ Exitoso' : '❌ Fallido'}`);
    console.log(`- Campos mapeados: ${results.payloadTest.fieldsMapped}`);
    console.log(`- Errores: ${results.payloadTest.errors.length}`);
    console.log(`- Advertencias: ${results.payloadTest.warnings.length}`);
  }
  
  // Análisis de casos edge
  if (results.edgeCaseTest) {
    console.log('\n📋 Casos Edge:');
    const edgePassed = results.edgeCaseTest.filter(t => t.success).length;
    const edgeFailed = results.edgeCaseTest.filter(t => !t.success).length;
    console.log(`- Exitosos: ${edgePassed}/${results.edgeCaseTest.length}`);
    console.log(`- Fallidos: ${edgeFailed}/${results.edgeCaseTest.length}`);
    
    if (edgeFailed > 0) {
      console.log('  Casos fallidos:');
      results.edgeCaseTest.filter(t => !t.success).forEach(test => {
        console.log(`    - ${test.name}: ${test.errors.join(', ')}`);
      });
    }
  }
  
  // Análisis de integración
  if (results.integrationTest) {
    console.log('\n📋 Integración:');
    console.log(`- Estado: ${results.integrationTest.success ? '✅ Exitoso' : '❌ Fallido'}`);
    console.log(`- Campos del payload: ${results.integrationTest.payloadFields}`);
    if (results.integrationTest.response.status === 'success') {
      console.log(`- ID de referencia: ${results.integrationTest.response.data.external_reference_id}`);
      console.log(`- Monto aprobado: Q${results.integrationTest.response.data.amount_approved.toLocaleString()}`);
    } else {
      console.log(`- Error: ${results.integrationTest.response.message}`);
    }
  }
  
  console.log('\n🎯 RECOMENDACIONES');
  console.log('==================');
  
  if (failed === 0) {
    console.log('✅ Todas las pruebas pasaron exitosamente');
    console.log('✅ El sistema está funcionando correctamente');
    console.log('✅ El mapeo de campos es correcto');
    console.log('✅ La integración con Coopsama es estable');
  } else {
    console.log('⚠️ Se encontraron problemas que requieren atención:');
    if (results.payloadTest && !results.payloadTest.success) {
      console.log('- Revisar construcción del payload');
    }
    if (results.edgeCaseTest && results.edgeCaseTest.some(t => !t.success)) {
      console.log('- Mejorar manejo de casos edge');
    }
    if (results.integrationTest && !results.integrationTest.success) {
      console.log('- Revisar integración con microservicio');
    }
  }
  
  if (warnings > 0) {
    console.log(`- ${warnings} advertencias encontradas (revisar para mejoras)`);
  }
  
  console.log('\n🔧 MEJORAS SUGERIDAS');
  console.log('===================');
  console.log('- Implementar logging detallado para debugging');
  console.log('- Agregar métricas de rendimiento');
  console.log('- Implementar retry automático para fallos de red');
  console.log('- Agregar validación de datos más robusta');
  console.log('- Implementar monitoreo en tiempo real');
  
  console.log('\n🎉 PRUEBAS COMPLETADAS');
  console.log('=====================');
  console.log(`✅ ${passed}/${totalTests} pruebas exitosas`);
  console.log(`⚠️ ${warnings} advertencias`);
  console.log(`❌ ${failed} fallos`);
  
  if (failed === 0) {
    console.log('\n🎊 ¡SISTEMA LISTO PARA PRODUCCIÓN!');
  } else {
    console.log('\n⚠️ SISTEMA REQUIERE ATENCIÓN ANTES DE PRODUCCIÓN');
  }
}

// Función para ejecutar pruebas de rendimiento
async function runPerformanceTest() {
  console.log('\n⚡ PRUEBA DE RENDIMIENTO');
  console.log('========================');
  
  const iterations = 100;
  const startTime = Date.now();
  
  console.log(`Ejecutando ${iterations} iteraciones de construcción de payload...`);
  
  for (let i = 0; i < iterations; i++) {
    const mockData = {
      firstName: `Usuario${i}`,
      lastName: `Prueba${i}`,
      dpi: `1234567890${i.toString().padStart(3, '0')}`,
      phone: `5555-${i.toString().padStart(4, '0')}`,
      loanAmount: (10000 + i * 100).toString(),
      applicationId: `SCO_${i.toString().padStart(6, '0')}`
    };
    
    const payload = buildApplicationPayload(mockData);
    const validation = validatePayload(payload);
  }
  
  const endTime = Date.now();
  const duration = endTime - startTime;
  const avgTime = duration / iterations;
  
  console.log(`✅ Tiempo total: ${duration}ms`);
  console.log(`✅ Tiempo promedio por payload: ${avgTime.toFixed(2)}ms`);
  console.log(`✅ Throughput: ${Math.round(1000 / avgTime)} payloads/segundo`);
  
  if (avgTime < 10) {
    console.log('✅ Rendimiento excelente');
  } else if (avgTime < 50) {
    console.log('✅ Rendimiento bueno');
  } else {
    console.log('⚠️ Rendimiento requiere optimización');
  }
}

// Función principal
async function main() {
  try {
    // Ejecutar pruebas principales
    const results = await runCompleteTest();
    
    // Ejecutar prueba de rendimiento
    await runPerformanceTest();
    
    console.log('\n🏁 TODAS LAS PRUEBAS COMPLETADAS');
    console.log('================================');
    
  } catch (error) {
    console.error('❌ Error fatal durante las pruebas:', error.message);
    process.exit(1);
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main();
}

module.exports = {
  runCompleteTest,
  runPerformanceTest,
  generateFinalReport
};
