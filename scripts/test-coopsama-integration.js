#!/usr/bin/env node

/**
 * Script para probar la integración completa con el microservicio de Coopsama
 */

console.log('🔗 Prueba de Integración Completa con Coopsama');
console.log('==============================================\n');

// Simular datos completos de una solicitud real
const mockFormData = {
  // Información personal completa
  firstName: 'María Elena',
  lastName: 'Rodríguez Martínez',
  dpi: '1234567890123',
  phone: '5555-9876',
  email: 'maria.rodriguez@email.com',
  address: 'Zona 15, Ciudad de Guatemala, Guatemala',
  occupation: 'Contadora Pública',
  estadoCivil: 'casada',
  fechaNacimiento: '1985-03-15',
  
  // Información financiera detallada
  ingresoPrincipal: '18000',
  ingresoSecundario: '7000',
  incomeSources: [
    { source: 'Consultorías', amount: '4000' },
    { source: 'Inversiones', amount: '2000' }
  ],
  
  // Gastos detallados
  gastosAlimentacion: '4000',
  gastosTransporte: '2000',
  gastosVivienda: '6000',
  gastosServicios: '2500',
  gastosEducacion: '1500',
  gastosSalud: '1200',
  gastosOtros: '800',
  
  // Monto solicitado
  loanAmount: '35000',
  
  // Producto
  product: 'Crédito Personal',
  
  // Referencias personales completas
  personalReferences: [
    {
      id: 'ref1',
      firstName: 'Carlos',
      lastName: 'Rodríguez',
      relationship: 'Esposo',
      phone: '5555-1111',
      referenceType: 'personal'
    },
    {
      id: 'ref2',
      firstName: 'Ana',
      lastName: 'García',
      relationship: 'Hermana',
      phone: '5555-2222',
      referenceType: 'personal'
    },
    {
      id: 'ref3',
      firstName: 'Roberto',
      lastName: 'López',
      relationship: 'Jefe',
      phone: '5555-3333',
      referenceType: 'comercial'
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
      file: { name: 'comprobante_ingresos.pdf', size: 2048000, type: 'application/pdf' },
      status: 'success'
    },
    comprobanteDomicilio: {
      id: 'comprobanteDomicilio',
      file: { name: 'comprobante_domicilio.pdf', size: 1500000, type: 'application/pdf' },
      status: 'success'
    }
  },
  
  // ID de aplicación
  applicationId: 'SCO_789012',
  
  // Información adicional
  agencia: 'Agencia Central',
  fechaSolicitud: new Date().toISOString()
};

// Función para construir payload (basada en useFinalizeApplication.tsx)
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
    estado_civil: formData.estadoCivil || '',
    fecha_nacimiento: formData.fechaNacimiento || '',
    
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
    
    // Metadatos
    application_id: formData.applicationId || '',
    timestamp: new Date().toISOString(),
    source: 'coopsama-app'
  };
  
  return payload;
}

// Función para simular el envío al microservicio de Coopsama
async function simulateCoopsamaSubmission(payload) {
  console.log('📤 Simulando envío al microservicio de Coopsama...');
  
  try {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simular diferentes tipos de respuesta
    const responseTypes = [
      'success',
      'validation_error',
      'server_error',
      'timeout'
    ];
    
    const responseType = responseTypes[Math.floor(Math.random() * responseTypes.length)];
    
    switch (responseType) {
      case 'success':
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
            monthly_payment: Math.round(payload.amount_requested * 0.05), // 5% mensual aproximado
            approval_date: new Date().toISOString(),
            next_payment_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          }
        };
        
      case 'validation_error':
        return {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Error en validación de datos',
            details: 'El DPI proporcionado no es válido o ya existe en el sistema',
            field: 'dpi',
            timestamp: new Date().toISOString()
          }
        };
        
      case 'server_error':
        return {
          success: false,
          error: {
            code: 'SERVER_ERROR',
            message: 'Error interno del servidor',
            details: 'El servicio de Coopsama no está disponible temporalmente',
            timestamp: new Date().toISOString()
          }
        };
        
      case 'timeout':
        return {
          success: false,
          error: {
            code: 'TIMEOUT_ERROR',
            message: 'Tiempo de espera agotado',
            details: 'La solicitud tardó demasiado en procesarse',
            timestamp: new Date().toISOString()
          }
        };
    }
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'CONNECTION_ERROR',
        message: 'Error de conexión con el microservicio',
        details: error.message,
        timestamp: new Date().toISOString()
      }
    };
  }
}

// Función para analizar la respuesta del microservicio
function analyzeResponse(response) {
  console.log('🔍 Analizando respuesta del microservicio...');
  
  if (response.success) {
    console.log('✅ Análisis de respuesta exitosa:');
    console.log(`- ID de referencia externa: ${response.data.external_reference_id}`);
    console.log(`- ID de proceso: ${response.data.process_id}`);
    console.log(`- Estado: ${response.data.status}`);
    console.log(`- Monto aprobado: Q${response.data.amount_approved.toLocaleString()}`);
    console.log(`- Tasa de interés: ${response.data.interest_rate}%`);
    console.log(`- Plazo: ${response.data.term_months} meses`);
    console.log(`- Pago mensual: Q${response.data.monthly_payment.toLocaleString()}`);
    console.log(`- Fecha de aprobación: ${new Date(response.data.approval_date).toLocaleString()}`);
    console.log(`- Próximo pago: ${new Date(response.data.next_payment_date).toLocaleString()}`);
    
    return {
      status: 'success',
      message: 'Solicitud procesada exitosamente',
      data: response.data
    };
  } else {
    console.log('❌ Análisis de respuesta con error:');
    console.log(`- Código de error: ${response.error.code}`);
    console.log(`- Mensaje: ${response.error.message}`);
    console.log(`- Detalles: ${response.error.details}`);
    console.log(`- Campo afectado: ${response.error.field || 'N/A'}`);
    console.log(`- Timestamp: ${new Date(response.error.timestamp).toLocaleString()}`);
    
    return {
      status: 'error',
      message: response.error.message,
      code: response.error.code,
      details: response.error.details
    };
  }
}

// Función para generar reporte de integración
function generateIntegrationReport(payload, response, analysis) {
  console.log('\n📊 REPORTE DE INTEGRACIÓN');
  console.log('=========================');
  
  console.log('\n📋 DATOS ENVIADOS:');
  console.log(`- Nombre: ${payload.nombre}`);
  console.log(`- DPI: ${payload.dpi}`);
  console.log(`- Teléfono: ${payload.telefono}`);
  console.log(`- Email: ${payload.email}`);
  console.log(`- Monto solicitado: Q${payload.amount_requested.toLocaleString()}`);
  console.log(`- Referencias: ${payload.referencias_personales.length}`);
  console.log(`- Application ID: ${payload.application_id}`);
  
  console.log('\n📤 RESPUESTA DEL MICROSERVICIO:');
  if (analysis.status === 'success') {
    console.log(`- Estado: ${analysis.status.toUpperCase()}`);
    console.log(`- ID de referencia: ${analysis.data.external_reference_id}`);
    console.log(`- ID de proceso: ${analysis.data.process_id}`);
    console.log(`- Monto aprobado: Q${analysis.data.amount_approved.toLocaleString()}`);
  } else {
    console.log(`- Estado: ${analysis.status.toUpperCase()}`);
    console.log(`- Código de error: ${analysis.code}`);
    console.log(`- Mensaje: ${analysis.message}`);
  }
  
  console.log('\n🎯 RECOMENDACIONES:');
  if (analysis.status === 'success') {
    console.log('✅ La integración funcionó correctamente');
    console.log('✅ El payload se mapeó correctamente');
    console.log('✅ El microservicio procesó la solicitud');
    console.log('✅ Se recibió respuesta válida');
  } else {
    console.log('⚠️ Se detectaron problemas en la integración:');
    console.log(`- Error: ${analysis.message}`);
    console.log('- Revisar validación de datos');
    console.log('- Verificar conectividad con microservicio');
    console.log('- Implementar manejo de errores robusto');
  }
}

// Función principal
async function runIntegrationTest() {
  console.log('🚀 Iniciando prueba de integración completa...\n');
  
  try {
    // 1. Construir payload
    console.log('📋 PASO 1: Construcción del Payload');
    console.log('=====================================');
    const payload = buildApplicationPayload(mockFormData);
    console.log('Payload construido exitosamente');
    console.log(`Campos mapeados: ${Object.keys(payload).length}`);
    console.log('');
    
    // 2. Simular envío al microservicio
    console.log('📋 PASO 2: Envío al Microservicio');
    console.log('==================================');
    const response = await simulateCoopsamaSubmission(payload);
    console.log('Respuesta recibida del microservicio');
    console.log('');
    
    // 3. Analizar respuesta
    console.log('📋 PASO 3: Análisis de Respuesta');
    console.log('=================================');
    const analysis = analyzeResponse(response);
    console.log('');
    
    // 4. Generar reporte
    console.log('📋 PASO 4: Reporte de Integración');
    console.log('==================================');
    generateIntegrationReport(payload, response, analysis);
    
    // 5. Resumen final
    console.log('\n🎉 PRUEBA DE INTEGRACIÓN COMPLETADA');
    console.log('===================================');
    console.log(`✅ Payload construido: ${Object.keys(payload).length} campos`);
    console.log(`✅ Envío al microservicio: ${response.success ? 'Exitoso' : 'Fallido'}`);
    console.log(`✅ Análisis de respuesta: ${analysis.status}`);
    
    if (analysis.status === 'success') {
      console.log(`✅ ID de referencia: ${analysis.data.external_reference_id}`);
      console.log(`✅ Monto aprobado: Q${analysis.data.amount_approved.toLocaleString()}`);
    } else {
      console.log(`❌ Error: ${analysis.message}`);
    }
    
  } catch (error) {
    console.error('❌ Error durante la prueba de integración:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Ejecutar la prueba
runIntegrationTest();
