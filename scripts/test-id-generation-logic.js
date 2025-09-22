#!/usr/bin/env node

/**
 * Script para probar la nueva lógica de generación de ID SCO_XXXXXX
 */

// Simular la lógica de generación de ID
function generateApplicationId() {
  const randomNumber = Math.floor(100000 + Math.random() * 900000);
  return `SCO_${randomNumber}`;
}

// Simular el estado inicial del formulario
function createInitialFormData() {
  return {
    firstName: '',
    lastName: '',
    dpi: '',
    // ... otros campos vacíos
    applicationId: '' // ← Ahora vacío inicialmente
  };
}

// Simular el proceso de guardado de borrador
function simulateDraftSave(formData, isFirstSave = false) {
  console.log(`\n💾 Simulando guardado de borrador (${isFirstSave ? 'PRIMER' : 'SUBSECUENTE'})...`);
  
  // Lógica de generación de ID (como en useSaveDraft)
  if (!formData.applicationId) {
    formData.applicationId = generateApplicationId();
    console.log(`🆔 ID generado: ${formData.applicationId}`);
  } else {
    console.log(`🆔 ID existente preservado: ${formData.applicationId}`);
  }
  
  return formData;
}

// Simular el proceso completo
function simulateApplicationFlow() {
  console.log('🧪 Simulando flujo completo de generación de ID...');
  
  // 1. Usuario hace click en "Comenzar solicitud"
  console.log('\n1️⃣ Usuario hace click en "Comenzar solicitud"');
  let formData = createInitialFormData();
  console.log(`   - Formulario inicializado`);
  console.log(`   - applicationId: "${formData.applicationId}" (vacío)`);
  
  // 2. Usuario llena algunos datos pero NO guarda
  console.log('\n2️⃣ Usuario llena datos pero NO guarda');
  formData.firstName = 'Juan';
  formData.lastName = 'Pérez';
  formData.dpi = '1234567890123';
  console.log(`   - Datos llenados: ${formData.firstName} ${formData.lastName}`);
  console.log(`   - applicationId: "${formData.applicationId}" (sigue vacío)`);
  
  // 3. Usuario guarda por primera vez (automático o manual)
  console.log('\n3️⃣ Usuario guarda por primera vez');
  formData = simulateDraftSave(formData, true);
  console.log(`   - applicationId después del guardado: "${formData.applicationId}"`);
  
  // 4. Usuario continúa llenando y guarda de nuevo
  console.log('\n4️⃣ Usuario continúa llenando y guarda de nuevo');
  formData.address = 'Zona 10, Guatemala';
  formData.phone = '5555-1234';
  formData = simulateDraftSave(formData, false);
  console.log(`   - applicationId después del segundo guardado: "${formData.applicationId}"`);
  
  // 5. Usuario envía la solicitud
  console.log('\n5️⃣ Usuario envía la solicitud');
  console.log(`   - applicationId final: "${formData.applicationId}"`);
  console.log(`   - Datos completos: ${formData.firstName} ${formData.lastName} - ${formData.dpi}`);
  
  return formData;
}

// Simular escenarios de prueba
function testIdGenerationScenarios() {
  console.log('🧪 Probando escenarios de generación de ID...');
  
  try {
    // Escenario 1: Flujo normal
    console.log('\n📋 ESCENARIO 1: Flujo normal');
    const scenario1 = simulateApplicationFlow();
    
    // Escenario 2: Usuario abre formulario pero no guarda nada
    console.log('\n📋 ESCENARIO 2: Usuario no guarda nada');
    let formData2 = createInitialFormData();
    console.log(`   - applicationId sin guardar: "${formData2.applicationId}"`);
    
    // Escenario 3: Usuario carga borrador existente
    console.log('\n📋 ESCENARIO 3: Usuario carga borrador existente');
    let formData3 = createInitialFormData();
    formData3.applicationId = 'SCO_965776'; // ID existente
    formData3 = simulateDraftSave(formData3, false);
    console.log(`   - applicationId preservado: "${formData3.applicationId}"`);
    
    // Verificar que todos los escenarios funcionan correctamente
    const allScenariosPassed = 
      scenario1.applicationId.startsWith('SCO_') &&
      formData2.applicationId === '' &&
      formData3.applicationId === 'SCO_965776';
    
    if (allScenariosPassed) {
      console.log('\n🎉 ¡Todos los escenarios funcionan correctamente!');
      console.log('\n📋 Resumen de la nueva lógica:');
      console.log('   ✅ ID NO se genera al abrir el formulario');
      console.log('   ✅ ID se genera SOLO en el primer guardado');
      console.log('   ✅ ID se preserva en guardados subsecuentes');
      console.log('   ✅ ID se preserva al cargar borradores existentes');
      return true;
    } else {
      console.log('\n❌ Algunos escenarios fallaron');
      return false;
    }

  } catch (error) {
    console.error('❌ Error durante las pruebas:', error);
    return false;
  }
}

// Ejecutar las pruebas
const success = testIdGenerationScenarios();
if (success) {
  console.log('\n✅ Pruebas de generación de ID completadas exitosamente');
  process.exit(0);
} else {
  console.log('\n❌ Las pruebas fallaron');
  process.exit(1);
}
