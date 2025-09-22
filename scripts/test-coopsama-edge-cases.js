#!/usr/bin/env node

/**
 * Script para probar casos edge y escenarios de error del payload de Coopsama
 */

console.log('🧪 Prueba de Casos Edge y Escenarios de Error');
console.log('============================================\n');

// Función para construir payload (reutilizada del script anterior)
function buildApplicationPayload(formData) {
  const amount = Number(formData?.loanAmount ?? formData?.requestedAmount ?? formData?.montoSolicitado ?? 0) || 0;
  
  const payload = {
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
  
  return payload;
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

// Casos de prueba
const testCases = [
  {
    name: 'Caso 1: Datos Mínimos Válidos',
    description: 'Solo campos requeridos',
    data: {
      firstName: 'Juan',
      lastName: 'Pérez',
      dpi: '1234567890123',
      phone: '5555-1234',
      loanAmount: '10000',
      applicationId: 'SCO_123456'
    }
  },
  {
    name: 'Caso 2: Datos Incompletos (Error)',
    description: 'Faltan campos requeridos',
    data: {
      firstName: 'Juan',
      // lastName faltante
      // dpi faltante
      phone: '5555-1234',
      loanAmount: '10000',
      applicationId: 'SCO_123456'
    }
  },
  {
    name: 'Caso 3: Monto Inválido (Error)',
    description: 'Monto solicitado inválido',
    data: {
      firstName: 'Juan',
      lastName: 'Pérez',
      dpi: '1234567890123',
      phone: '5555-1234',
      loanAmount: '0', // Monto inválido
      applicationId: 'SCO_123456'
    }
  },
  {
    name: 'Caso 4: ID de Aplicación Inválido (Error)',
    description: 'ID de aplicación sin formato SCO_',
    data: {
      firstName: 'Juan',
      lastName: 'Pérez',
      dpi: '1234567890123',
      phone: '5555-1234',
      loanAmount: '10000',
      applicationId: 'INVALID_ID' // ID inválido
    }
  },
  {
    name: 'Caso 5: Datos con Caracteres Especiales',
    description: 'Nombres con acentos y caracteres especiales',
    data: {
      firstName: 'José María',
      lastName: 'González-Pérez',
      dpi: '1234567890123',
      phone: '5555-1234',
      loanAmount: '15000',
      applicationId: 'SCO_123456',
      email: 'josé.maría@email.com',
      address: 'Zona 10, Ciudad de Guatemala'
    }
  },
  {
    name: 'Caso 6: Múltiples Fuentes de Monto',
    description: 'Verificar lógica de fallback para monto',
    data: {
      firstName: 'Juan',
      lastName: 'Pérez',
      dpi: '1234567890123',
      phone: '5555-1234',
      // loanAmount faltante
      requestedAmount: '20000', // Debería usar este
      montoSolicitado: '25000', // No debería usar este
      applicationId: 'SCO_123456'
    }
  },
  {
    name: 'Caso 7: Referencias Vacías',
    description: 'Sin referencias personales',
    data: {
      firstName: 'Juan',
      lastName: 'Pérez',
      dpi: '1234567890123',
      phone: '5555-1234',
      loanAmount: '10000',
      applicationId: 'SCO_123456',
      personalReferences: [] // Array vacío
    }
  },
  {
    name: 'Caso 8: Datos con Valores Nulos/Undefined',
    description: 'Manejo de valores nulos y undefined',
    data: {
      firstName: 'Juan',
      lastName: 'Pérez',
      dpi: '1234567890123',
      phone: '5555-1234',
      loanAmount: '10000',
      applicationId: 'SCO_123456',
      email: null,
      address: undefined,
      occupation: '',
      incomeSources: null
    }
  }
];

// Función para ejecutar un caso de prueba
function runTestCase(testCase) {
  console.log(`\n📋 ${testCase.name}`);
  console.log('='.repeat(testCase.name.length + 4));
  console.log(`📝 ${testCase.description}`);
  console.log('');
  
  try {
    // Construir payload
    const payload = buildApplicationPayload(testCase.data);
    console.log('🔧 Payload construido:');
    console.log(JSON.stringify(payload, null, 2));
    console.log('');
    
    // Validar payload
    const validation = validatePayload(payload);
    console.log('✅ Validación:');
    if (validation.errors.length > 0) {
      console.log('❌ Errores:');
      validation.errors.forEach(error => console.log(`  - ${error}`));
    } else {
      console.log('✅ Sin errores críticos');
    }
    
    if (validation.warnings.length > 0) {
      console.log('⚠️ Advertencias:');
      validation.warnings.forEach(warning => console.log(`  - ${warning}`));
    }
    
    // Análisis específico
    console.log('\n🔍 Análisis específico:');
    console.log(`- Campos mapeados: ${Object.keys(payload).length}`);
    console.log(`- Nombre completo: "${payload.nombre}"`);
    console.log(`- DPI: "${payload.dpi}"`);
    console.log(`- Teléfono: "${payload.telefono}"`);
    console.log(`- Monto solicitado: Q${payload.amount_requested.toLocaleString()}`);
    console.log(`- Referencias: ${payload.referencias_personales.length}`);
    console.log(`- Application ID: "${payload.application_id}"`);
    
    // Verificar lógica de fallback para monto
    if (testCase.data.loanAmount && testCase.data.requestedAmount && testCase.data.montoSolicitado) {
      console.log('\n💰 Verificación de lógica de fallback:');
      console.log(`- loanAmount: ${testCase.data.loanAmount}`);
      console.log(`- requestedAmount: ${testCase.data.requestedAmount}`);
      console.log(`- montoSolicitado: ${testCase.data.montoSolicitado}`);
      console.log(`- Monto final usado: ${payload.amount_requested}`);
      console.log(`- Lógica correcta: ${payload.amount_requested == testCase.data.loanAmount ? '✅' : '❌'}`);
    }
    
    return {
      success: validation.errors.length === 0,
      errors: validation.errors,
      warnings: validation.warnings,
      payload
    };
    
  } catch (error) {
    console.error('❌ Error durante la prueba:', error.message);
    return {
      success: false,
      errors: [error.message],
      warnings: [],
      payload: null
    };
  }
}

// Función principal
async function runEdgeCaseTests() {
  console.log('🚀 Iniciando pruebas de casos edge...\n');
  
  const results = [];
  
  for (const testCase of testCases) {
    const result = runTestCase(testCase);
    results.push({
      name: testCase.name,
      success: result.success,
      errors: result.errors,
      warnings: result.warnings
    });
  }
  
  // Resumen final
  console.log('\n📊 RESUMEN FINAL');
  console.log('================');
  
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(`✅ Casos exitosos: ${successful}/${results.length}`);
  console.log(`❌ Casos fallidos: ${failed}/${results.length}`);
  
  console.log('\n📋 Detalle por caso:');
  results.forEach(result => {
    const status = result.success ? '✅' : '❌';
    console.log(`${status} ${result.name}`);
    if (!result.success) {
      result.errors.forEach(error => console.log(`    - ${error}`));
    }
  });
  
  console.log('\n🎯 RECOMENDACIONES:');
  console.log('===================');
  
  if (failed > 0) {
    console.log('⚠️ Se encontraron casos que requieren atención:');
    results.filter(r => !r.success).forEach(result => {
      console.log(`- ${result.name}: ${result.errors.join(', ')}`);
    });
  } else {
    console.log('✅ Todos los casos edge fueron manejados correctamente');
  }
  
  console.log('\n🔧 Mejoras sugeridas:');
  console.log('- Implementar validación más robusta para caracteres especiales');
  console.log('- Agregar sanitización de datos de entrada');
  console.log('- Mejorar manejo de valores nulos/undefined');
  console.log('- Implementar logging detallado para debugging');
  
  console.log('\n🎉 Pruebas de casos edge completadas!');
}

// Ejecutar las pruebas
runEdgeCaseTests();
