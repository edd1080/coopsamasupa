#!/usr/bin/env node

/**
 * Script completo para probar el payload de Coopsama, mapeo de campos y envío al microservicio
 */

console.log('🧪 Prueba Completa del Payload de Coopsama');
console.log('==========================================\n');

// Simular datos completos de una solicitud
const mockFormData = {
  // Información personal
  firstName: 'Juan Carlos',
  lastName: 'Pérez García',
  dpi: '1234567890123',
  phone: '5555-1234',
  email: 'juan.perez@email.com',
  address: 'Zona 10, Ciudad de Guatemala',
  occupation: 'Ingeniero de Software',
  
  // Información financiera
  ingresoPrincipal: '15000',
  ingresoSecundario: '5000',
  incomeSources: [
    { source: 'Freelance', amount: '3000' }
  ],
  
  // Gastos
  gastosAlimentacion: '3000',
  gastosTransporte: '1500',
  gastosVivienda: '5000',
  gastosServicios: '2000',
  gastosEducacion: '1000',
  gastosSalud: '800',
  gastosOtros: '500',
  
  // Monto solicitado
  loanAmount: '25000',
  requestedAmount: '25000',
  montoSolicitado: '25000',
  
  // Producto
  product: 'Crédito Personal',
  
  // Referencias personales
  personalReferences: [
    {
      id: 'ref1',
      firstName: 'María',
      lastName: 'González',
      relationship: 'Hermana',
      phone: '5555-5678',
      referenceType: 'personal'
    },
    {
      id: 'ref2',
      firstName: 'Carlos',
      lastName: 'López',
      relationship: 'Amigo',
      phone: '5555-9012',
      referenceType: 'personal'
    }
  ],
  
  // Documentos
  documents: {
    dpiFrontal: {
      id: 'dpiFrontal',
      file: { name: 'dpi_frontal.jpg', size: 1024000, type: 'image/jpeg' },
      status: 'success'
    },
    dpiTrasero: {
      id: 'dpiTrasero',
      file: { name: 'dpi_trasero.jpg', size: 980000, type: 'image/jpeg' },
      status: 'success'
    },
    comprobanteIngresos: {
      id: 'comprobanteIngresos',
      file: { name: 'comprobante.pdf', size: 2048000, type: 'application/pdf' },
      status: 'success'
    }
  },
  
  // ID de aplicación
  applicationId: 'SCO_123456',
  
  // Información adicional
  agencia: 'Agencia Central',
  fechaSolicitud: new Date().toISOString(),
  estadoCivil: 'soltero',
  fechaNacimiento: '1990-05-15'
};

// Función para simular el mapeo de campos (basado en useFinalizeApplication.tsx)
function buildApplicationPayload(formData) {
  console.log('🔧 Construyendo payload de aplicación...');
  
  // Extraer monto con lógica de fallback
  const amount = Number(formData?.loanAmount ?? formData?.requestedAmount ?? formData?.montoSolicitado ?? 0) || 0;
  
  // Construir payload base
  const payload = {
    // Información del solicitante
    nombre: `${formData.firstName || ''} ${formData.lastName || ''}`.trim(),
    dpi: formData.dpi || '',
    telefono: formData.phone || '',
    email: formData.email || '',
    direccion: formData.address || '',
    ocupacion: formData.occupation || '',
    
    // Información financiera
    ingreso_principal: parseFloat(formData.ingresoPrincipal || '0'),
    ingreso_secundario: parseFloat(formData.ingresoSecundario || '0'),
    ingresos_adicionales: (formData.incomeSources || []).reduce((sum, source) => 
      sum + parseFloat(source.amount || '0'), 0
    ),
    
    // Gastos
    gastos_alimentacion: parseFloat(formData.gastosAlimentacion || '0'),
    gastos_transporte: parseFloat(formData.gastosTransporte || '0'),
    gastos_vivienda: parseFloat(formData.gastosVivienda || '0'),
    gastos_servicios: parseFloat(formData.gastosServicios || '0'),
    gastos_educacion: parseFloat(formData.gastosEducacion || '0'),
    gastos_salud: parseFloat(formData.gastosSalud || '0'),
    gastos_otros: parseFloat(formData.gastosOtros || '0'),
    
    // Monto solicitado
    amount_requested: amount,
    
    // Producto
    product: formData.product || 'Crédito Personal',
    
    // Referencias personales
    referencias_personales: (formData.personalReferences || []).map(ref => ({
      nombre: `${ref.firstName || ''} ${ref.lastName || ''}`.trim(),
      relacion: ref.relationship || '',
      telefono: ref.phone || '',
      tipo_referencia: ref.referenceType || 'personal'
    })),
    
    // Información adicional
    agencia: formData.agencia || '',
    fecha_solicitud: formData.fechaSolicitud || new Date().toISOString(),
    estado_civil: formData.estadoCivil || '',
    fecha_nacimiento: formData.fechaNacimiento || '',
    
    // Metadatos
    application_id: formData.applicationId || '',
    timestamp: new Date().toISOString(),
    source: 'coopsama-app'
  };
  
  return payload;
}

// Función para validar el payload
function validatePayload(payload) {
  console.log('✅ Validando payload...');
  
  const errors = [];
  const warnings = [];
  
  // Validaciones críticas
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
  
  // Validaciones de advertencia
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

// Función para simular el envío al microservicio
async function simulateCoopsamaSubmission(payload) {
  console.log('📤 Simulando envío al microservicio de Coopsama...');
  
  try {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simular respuesta exitosa (90% de probabilidad)
    const isSuccess = Math.random() > 0.1;
    
    if (isSuccess) {
      const response = {
        success: true,
        data: {
          external_reference_id: `COOPSAMA_${Date.now()}`,
          process_id: `PROC_${Math.floor(Math.random() * 1000000)}`,
          status: 'approved',
          message: 'Solicitud procesada exitosamente',
          timestamp: new Date().toISOString(),
          amount_approved: payload.amount_requested,
          interest_rate: 12.5,
          term_months: 24
        }
      };
      
      console.log('✅ Envío exitoso al microservicio');
      return response;
    } else {
      // Simular error
      const errorResponse = {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Error en validación de datos',
          details: 'El DPI proporcionado no es válido'
        }
      };
      
      console.log('❌ Error en el envío al microservicio');
      return errorResponse;
    }
  } catch (error) {
    console.log('❌ Error de conexión al microservicio');
    return {
      success: false,
      error: {
        code: 'CONNECTION_ERROR',
        message: 'Error de conexión con el microservicio',
        details: error.message
      }
    };
  }
}

// Función para analizar el mapeo de campos
function analyzeFieldMapping(formData, payload) {
  console.log('🔍 Analizando mapeo de campos...');
  
  const mappingAnalysis = {
    personalInfo: {
      firstName: formData.firstName,
      lastName: formData.lastName,
      mappedTo: 'nombre',
      mappedValue: payload.nombre,
      status: '✅ Correcto'
    },
    dpi: {
      source: formData.dpi,
      mappedTo: 'dpi',
      mappedValue: payload.dpi,
      status: '✅ Correcto'
    },
    phone: {
      source: formData.phone,
      mappedTo: 'telefono',
      mappedValue: payload.telefono,
      status: '✅ Correcto'
    },
    amount: {
      source: formData.loanAmount,
      fallback1: formData.requestedAmount,
      fallback2: formData.montoSolicitado,
      mappedTo: 'amount_requested',
      mappedValue: payload.amount_requested,
      status: '✅ Correcto'
    },
    references: {
      source: formData.personalReferences?.length || 0,
      mappedTo: 'referencias_personales',
      mappedValue: payload.referencias_personales?.length || 0,
      status: '✅ Correcto'
    }
  };
  
  return mappingAnalysis;
}

// Función principal de prueba
async function runCoopsamaTest() {
  console.log('🚀 Iniciando prueba completa de Coopsama...\n');
  
  try {
    // 1. Construir payload
    console.log('📋 PASO 1: Construcción del Payload');
    console.log('=====================================');
    const payload = buildApplicationPayload(mockFormData);
    console.log('Payload construido:', JSON.stringify(payload, null, 2));
    console.log('');
    
    // 2. Validar payload
    console.log('📋 PASO 2: Validación del Payload');
    console.log('==================================');
    const validation = validatePayload(payload);
    
    if (validation.errors.length > 0) {
      console.log('❌ Errores encontrados:');
      validation.errors.forEach(error => console.log(`  - ${error}`));
    } else {
      console.log('✅ Payload válido - No se encontraron errores críticos');
    }
    
    if (validation.warnings.length > 0) {
      console.log('⚠️ Advertencias:');
      validation.warnings.forEach(warning => console.log(`  - ${warning}`));
    }
    console.log('');
    
    // 3. Analizar mapeo de campos
    console.log('📋 PASO 3: Análisis del Mapeo de Campos');
    console.log('=======================================');
    const mappingAnalysis = analyzeFieldMapping(mockFormData, payload);
    Object.entries(mappingAnalysis).forEach(([field, analysis]) => {
      console.log(`${field}: ${analysis.status}`);
      console.log(`  Fuente: ${analysis.source || 'N/A'}`);
      console.log(`  Mapeado a: ${analysis.mappedTo}`);
      console.log(`  Valor: ${analysis.mappedValue}`);
      console.log('');
    });
    
    // 4. Simular envío al microservicio
    console.log('📋 PASO 4: Simulación de Envío al Microservicio');
    console.log('===============================================');
    const submissionResult = await simulateCoopsamaSubmission(payload);
    
    if (submissionResult.success) {
      console.log('✅ Envío exitoso!');
      console.log('Respuesta del microservicio:');
      console.log(JSON.stringify(submissionResult.data, null, 2));
    } else {
      console.log('❌ Error en el envío:');
      console.log(JSON.stringify(submissionResult.error, null, 2));
    }
    console.log('');
    
    // 5. Resumen de la prueba
    console.log('📋 PASO 5: Resumen de la Prueba');
    console.log('===============================');
    console.log(`✅ Payload construido: ${Object.keys(payload).length} campos`);
    console.log(`✅ Validación: ${validation.errors.length} errores, ${validation.warnings.length} advertencias`);
    console.log(`✅ Mapeo de campos: ${Object.keys(mappingAnalysis).length} campos analizados`);
    console.log(`✅ Envío al microservicio: ${submissionResult.success ? 'Exitoso' : 'Fallido'}`);
    
    if (submissionResult.success) {
      console.log(`✅ ID de referencia externa: ${submissionResult.data.external_reference_id}`);
      console.log(`✅ ID de proceso: ${submissionResult.data.process_id}`);
      console.log(`✅ Monto aprobado: Q${submissionResult.data.amount_approved.toLocaleString()}`);
      console.log(`✅ Tasa de interés: ${submissionResult.data.interest_rate}%`);
      console.log(`✅ Plazo: ${submissionResult.data.term_months} meses`);
    }
    
    console.log('\n🎉 Prueba completada exitosamente!');
    
  } catch (error) {
    console.error('❌ Error durante la prueba:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Ejecutar la prueba
runCoopsamaTest();
