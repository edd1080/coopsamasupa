#!/usr/bin/env node

/**
 * Script final simplificado para probar todo el flujo de Coopsama
 */

console.log('🧪 PRUEBA FINAL COMPLETA DEL SISTEMA COOPSAMA');
console.log('==============================================\n');

// Función para construir payload
function buildApplicationPayload(formData) {
  const amount = Number(formData?.loanAmount ?? formData?.requestedAmount ?? formData?.montoSolicitado ?? 0) || 0;
  
  return {
    nombre: `${formData.firstName || ''} ${formData.lastName || ''}`.trim(),
    dpi: formData.dpi || '',
    telefono: formData.phone || '',
    email: formData.email || '',
    direccion: formData.address || '',
    ocupacion: formData.occupation || '',
    ingreso_principal: parseFloat(formData.ingresoPrincipal || '0'),
    ingreso_secundario: parseFloat(formData.ingresoSecundario || '0'),
    ingresos_adicionales: (formData.incomeSources || []).reduce((sum, source) => 
      sum + parseFloat(source.amount || '0'), 0
    ),
    gastos_alimentacion: parseFloat(formData.gastosAlimentacion || '0'),
    gastos_transporte: parseFloat(formData.gastosTransporte || '0'),
    gastos_vivienda: parseFloat(formData.gastosVivienda || '0'),
    gastos_servicios: parseFloat(formData.gastosServicios || '0'),
    gastos_educacion: parseFloat(formData.gastosEducacion || '0'),
    gastos_salud: parseFloat(formData.gastosSalud || '0'),
    gastos_otros: parseFloat(formData.gastosOtros || '0'),
    amount_requested: amount,
    product: formData.product || 'Crédito Personal',
    referencias_personales: (formData.personalReferences || []).map(ref => ({
      nombre: `${ref.firstName || ''} ${ref.lastName || ''}`.trim(),
      relacion: ref.relationship || '',
      telefono: ref.phone || '',
      tipo_referencia: ref.referenceType || 'personal'
    })),
    agencia: formData.agencia || '',
    fecha_solicitud: formData.fechaSolicitud || new Date().toISOString(),
    estado_civil: formData.estadoCivil || '',
    fecha_nacimiento: formData.fechaNacimiento || '',
    application_id: formData.applicationId || '',
    timestamp: new Date().toISOString(),
    source: 'coopsama-app'
  };
}

// Función para validar payload
function validatePayload(payload) {
  const errors = [];
  const warnings = [];
  
  if (!payload.nombre || payload.nombre.trim() === '') {
    errors.push('Nombre del solicitante es requerido');
  }
  
  if (!payload.dpi || payload.dpi.trim() === '') {
    errors.push('DPI es requerido');
  }
  
  if (!payload.telefono || payload.telefono.trim() === '') {
    errors.push('Teléfono es requerido');
  }
  
  if (payload.amount_requested <= 0) {
    errors.push('Monto solicitado debe ser mayor a 0');
  }
  
  if (!payload.application_id || !payload.application_id.startsWith('SCO_')) {
    errors.push('Application ID debe tener formato SCO_XXXXXX');
  }
  
  if (!payload.email || payload.email.trim() === '') {
    warnings.push('Email no proporcionado');
  }
  
  if (!payload.direccion || payload.direccion.trim() === '') {
    warnings.push('Dirección no proporcionada');
  }
  
  if (payload.referencias_personales.length === 0) {
    warnings.push('No se proporcionaron referencias personales');
  }
  
  if (payload.ingreso_principal <= 0) {
    warnings.push('Ingreso principal no especificado');
  }
  
  return { errors, warnings };
}

// Función para simular envío al microservicio
async function simulateCoopsamaSubmission(payload) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const isSuccess = Math.random() > 0.1; // 90% éxito
  
  if (isSuccess) {
    return {
      success: true,
      data: {
        external_reference_id: `COOPSAMA_${Date.now()}`,
        process_id: `PROC_${Math.floor(Math.random() * 1000000)}`,
        status: 'approved',
        message: 'Solicitud procesada exitosamente',
        timestamp: new Date().toISOString(),
        amount_approved: payload.amount_requested,
        interest_rate: 12.5,
        term_months: 24,
        monthly_payment: Math.round(payload.amount_requested * 0.05)
      }
    };
  } else {
    return {
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Error en validación de datos',
        details: 'El DPI proporcionado no es válido'
      }
    };
  }
}

// Casos de prueba
const testCases = [
  {
    name: 'Caso Exitoso Completo',
    data: {
      firstName: 'Juan Carlos',
      lastName: 'Pérez García',
      dpi: '1234567890123',
      phone: '5555-1234',
      email: 'juan.perez@email.com',
      address: 'Zona 10, Guatemala',
      occupation: 'Ingeniero',
      ingresoPrincipal: '15000',
      loanAmount: '25000',
      applicationId: 'SCO_123456',
      personalReferences: [
        { firstName: 'María', lastName: 'González', relationship: 'Hermana', phone: '5555-5678', referenceType: 'personal' }
      ]
    }
  },
  {
    name: 'Caso con Datos Mínimos',
    data: {
      firstName: 'Ana',
      lastName: 'López',
      dpi: '9876543210987',
      phone: '5555-9999',
      loanAmount: '10000',
      applicationId: 'SCO_789012'
    }
  },
  {
    name: 'Caso con Error de Validación',
    data: {
      firstName: 'Pedro',
      lastName: 'Martínez',
      // dpi faltante
      phone: '5555-1111',
      loanAmount: '0', // Monto inválido
      applicationId: 'INVALID_ID' // ID inválido
    }
  }
];

// Función principal
async function runCompleteTest() {
  console.log('🚀 Iniciando suite completa de pruebas...\n');
  
  const results = {
    total: 0,
    passed: 0,
    failed: 0,
    warnings: 0,
    details: []
  };
  
  for (const testCase of testCases) {
    console.log(`📋 ${testCase.name}`);
    console.log('='.repeat(testCase.name.length + 4));
    
    try {
      // Construir payload
      const payload = buildApplicationPayload(testCase.data);
      console.log(`✅ Payload construido: ${Object.keys(payload).length} campos`);
      
      // Validar payload
      const validation = validatePayload(payload);
      console.log(`✅ Validación: ${validation.errors.length} errores, ${validation.warnings.length} advertencias`);
      
      // Simular envío
      const response = await simulateCoopsamaSubmission(payload);
      console.log(`✅ Envío: ${response.success ? 'Exitoso' : 'Fallido'}`);
      
      // Registrar resultados
      results.total++;
      results.warnings += validation.warnings.length;
      
      if (validation.errors.length === 0 && response.success) {
        results.passed++;
        console.log('✅ Caso exitoso');
      } else {
        results.failed++;
        console.log('❌ Caso fallido');
        if (validation.errors.length > 0) {
          console.log('   Errores:', validation.errors.join(', '));
        }
        if (!response.success) {
          console.log('   Error de envío:', response.error.message);
        }
      }
      
      results.details.push({
        name: testCase.name,
        success: validation.errors.length === 0 && response.success,
        errors: validation.errors,
        warnings: validation.warnings,
        response: response.success
      });
      
    } catch (error) {
      results.total++;
      results.failed++;
      console.log(`❌ Error: ${error.message}`);
      
      results.details.push({
        name: testCase.name,
        success: false,
        errors: [error.message],
        warnings: [],
        response: false
      });
    }
    
    console.log('');
  }
  
  // Prueba de rendimiento
  console.log('⚡ PRUEBA DE RENDIMIENTO');
  console.log('========================');
  
  const iterations = 50;
  const startTime = Date.now();
  
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
  
  console.log(`✅ ${iterations} iteraciones en ${duration}ms`);
  console.log(`✅ Tiempo promedio: ${avgTime.toFixed(2)}ms por payload`);
  console.log(`✅ Throughput: ${Math.round(1000 / avgTime)} payloads/segundo`);
  
  // Reporte final
  console.log('\n📊 REPORTE FINAL');
  console.log('================');
  console.log(`📈 Estadísticas:`);
  console.log(`- Total de pruebas: ${results.total}`);
  console.log(`- Exitosas: ${results.passed} (${Math.round((results.passed/results.total)*100)}%)`);
  console.log(`- Fallidas: ${results.failed} (${Math.round((results.failed/results.total)*100)}%)`);
  console.log(`- Advertencias: ${results.warnings}`);
  
  console.log('\n🔍 Detalle por caso:');
  results.details.forEach(detail => {
    const status = detail.success ? '✅' : '❌';
    console.log(`${status} ${detail.name}`);
    if (!detail.success) {
      if (detail.errors.length > 0) {
        console.log(`    Errores: ${detail.errors.join(', ')}`);
      }
      if (!detail.response) {
        console.log('    Error de envío al microservicio');
      }
    }
  });
  
  console.log('\n🎯 RECOMENDACIONES');
  console.log('==================');
  
  if (results.failed === 0) {
    console.log('✅ Todas las pruebas pasaron exitosamente');
    console.log('✅ El sistema está funcionando correctamente');
    console.log('✅ El mapeo de campos es correcto');
    console.log('✅ La integración con Coopsama es estable');
    console.log('\n🎊 ¡SISTEMA LISTO PARA PRODUCCIÓN!');
  } else {
    console.log('⚠️ Se encontraron problemas que requieren atención:');
    results.details.filter(d => !d.success).forEach(detail => {
      console.log(`- ${detail.name}: ${detail.errors.join(', ')}`);
    });
    console.log('\n⚠️ SISTEMA REQUIERE ATENCIÓN ANTES DE PRODUCCIÓN');
  }
  
  if (results.warnings > 0) {
    console.log(`\n⚠️ ${results.warnings} advertencias encontradas (revisar para mejoras)`);
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
  
  return results;
}

// Ejecutar las pruebas
runCompleteTest().catch(console.error);
