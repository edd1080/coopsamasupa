#!/usr/bin/env node

/**
 * Script para probar la funcionalidad de búsqueda y ordenamiento de solicitudes
 */

// Simular datos de solicitudes para probar la funcionalidad
const mockApplications = [
  {
    id: '1',
    applicationId: 'SCO_965776',
    clientName: 'Juan Carlos Pérez García',
    dpi: '1234567890123',
    product: 'Crédito Personal',
    amount: '50000',
    status: 'pending',
    date: '2025-09-21',
    progress: 3,
    stage: 'Información Financiera',
    timestamp: new Date('2025-09-21T10:00:00').getTime()
  },
  {
    id: '2',
    applicationId: 'SCO_965777',
    clientName: 'María Elena Rodríguez',
    dpi: '9876543210987',
    product: 'Crédito Personal',
    amount: '75000',
    status: 'approved',
    date: '2025-09-20',
    progress: 6,
    stage: 'Completado',
    timestamp: new Date('2025-09-20T15:30:00').getTime()
  },
  {
    id: '3',
    applicationId: 'SCO_965778',
    clientName: 'Carlos Alberto López',
    dpi: '4567891234567',
    product: 'Crédito Personal',
    amount: '30000',
    status: 'draft',
    date: '2025-09-19',
    progress: 2,
    stage: 'Información Laboral',
    timestamp: new Date('2025-09-19T09:15:00').getTime()
  },
  {
    id: '4',
    applicationId: 'SCO_965779',
    clientName: 'Ana Sofía Martínez',
    dpi: '7891234567890',
    product: 'Crédito Personal',
    amount: '60000',
    status: 'reviewing',
    date: '2025-09-18',
    progress: 5,
    stage: 'Documentos e Imágenes',
    timestamp: new Date('2025-09-18T14:45:00').getTime()
  },
  {
    id: '5',
    applicationId: 'SCO_965780',
    clientName: 'Roberto José González',
    dpi: '3216549873210',
    product: 'Crédito Personal',
    amount: '40000',
    status: 'error',
    date: '2025-09-17',
    progress: 4,
    stage: 'Referencias Personales',
    timestamp: new Date('2025-09-17T11:20:00').getTime()
  }
];

// Función para normalizar texto (remover acentos)
function normalizeText(text) {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

// Función de búsqueda (simula la lógica implementada)
function searchApplications(applications, searchTerm) {
  if (!searchTerm.trim()) return applications;

  const searchNormalized = normalizeText(searchTerm.trim());
  
  return applications.filter(app => {
    // Buscar por nombre del cliente
    const nameMatch = normalizeText(app.clientName).includes(searchNormalized);
    
    // Buscar por DPI
    const dpiMatch = app.dpi && normalizeText(app.dpi).includes(searchNormalized);
    
    // Buscar por número de solicitud (SCO_XXXXXX)
    const applicationIdMatch = app.applicationId && 
      normalizeText(app.applicationId).includes(searchNormalized);
    
    return nameMatch || dpiMatch || applicationIdMatch;
  });
}

// Función de ordenamiento (simula la lógica implementada)
function sortApplications(applications) {
  return applications.sort((a, b) => b.timestamp - a.timestamp);
}

async function testApplicationsSearch() {
  console.log('🧪 Probando funcionalidad de búsqueda y ordenamiento de solicitudes...');
  
  try {
    // 1. Probar ordenamiento (más recientes primero)
    console.log('\n📅 Probando ordenamiento (más recientes primero)...');
    const sortedApplications = sortApplications([...mockApplications]);
    
    console.log('✅ Aplicaciones ordenadas por fecha:');
    sortedApplications.forEach((app, index) => {
      const date = new Date(app.timestamp).toLocaleString();
      console.log(`  ${index + 1}. ${app.clientName} - ${app.applicationId} - ${date}`);
    });
    
    // Verificar que está ordenado correctamente (más recientes primero)
    const isSorted = sortedApplications.every((app, index) => {
      if (index === 0) return true;
      return app.timestamp <= sortedApplications[index - 1].timestamp;
    });
    
    console.log(`✅ Ordenamiento correcto: ${isSorted ? 'SÍ' : 'NO'}`);
    
    // 2. Probar búsqueda por nombre
    console.log('\n🔍 Probando búsqueda por nombre...');
    const nameSearchResults = searchApplications(sortedApplications, 'Juan');
    console.log(`✅ Resultados para "Juan": ${nameSearchResults.length}`);
    nameSearchResults.forEach(app => {
      console.log(`  - ${app.clientName} (${app.applicationId})`);
    });
    
    // 3. Probar búsqueda por DPI
    console.log('\n🔍 Probando búsqueda por DPI...');
    const dpiSearchResults = searchApplications(sortedApplications, '1234');
    console.log(`✅ Resultados para "1234": ${dpiSearchResults.length}`);
    dpiSearchResults.forEach(app => {
      console.log(`  - ${app.clientName} - DPI: ${app.dpi}`);
    });
    
    // 4. Probar búsqueda por número de solicitud
    console.log('\n🔍 Probando búsqueda por número de solicitud...');
    const idSearchResults = searchApplications(sortedApplications, 'SCO_965777');
    console.log(`✅ Resultados para "SCO_965777": ${idSearchResults.length}`);
    idSearchResults.forEach(app => {
      console.log(`  - ${app.clientName} - ${app.applicationId}`);
    });
    
    // 5. Probar búsqueda parcial
    console.log('\n🔍 Probando búsqueda parcial...');
    const partialSearchResults = searchApplications(sortedApplications, '9657');
    console.log(`✅ Resultados para "9657": ${partialSearchResults.length}`);
    partialSearchResults.forEach(app => {
      console.log(`  - ${app.clientName} - ${app.applicationId}`);
    });
    
    // 6. Probar búsqueda sin resultados
    console.log('\n🔍 Probando búsqueda sin resultados...');
    const noResults = searchApplications(sortedApplications, 'xyz123');
    console.log(`✅ Resultados para "xyz123": ${noResults.length} (esperado: 0)`);
    
    // 7. Probar búsqueda case-insensitive
    console.log('\n🔍 Probando búsqueda case-insensitive...');
    const caseInsensitiveResults = searchApplications(sortedApplications, 'maria');
    console.log(`✅ Resultados para "maria": ${caseInsensitiveResults.length}`);
    caseInsensitiveResults.forEach(app => {
      console.log(`  - ${app.clientName} - ${app.applicationId}`);
    });
    
    // Verificar que todas las pruebas pasaron
    const allTestsPassed = 
      isSorted && 
      nameSearchResults.length === 1 &&
      dpiSearchResults.length === 3 && // "1234" encuentra 3 DPIs que contienen "1234"
      idSearchResults.length === 1 &&
      partialSearchResults.length === 5 && // "9657" encuentra todos los IDs que contienen "9657"
      noResults.length === 0 &&
      caseInsensitiveResults.length === 1;
    
    if (allTestsPassed) {
      console.log('\n🎉 ¡Todas las pruebas de búsqueda y ordenamiento pasaron exitosamente!');
      return true;
    } else {
      console.log('\n❌ Algunas pruebas fallaron');
      return false;
    }

  } catch (error) {
    console.error('❌ Error durante las pruebas:', error);
    return false;
  }
}

// Ejecutar las pruebas
testApplicationsSearch()
  .then(success => {
    if (success) {
      console.log('\n✅ Pruebas de funcionalidad completadas exitosamente');
    } else {
      console.log('\n❌ Las pruebas fallaron');
    }
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('❌ Error fatal:', error);
    process.exit(1);
  });
