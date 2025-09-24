// Script para debuggear fechas desde la base de datos
console.log('🔍 Debugging database date fields...');

// Simular datos que podrían estar llegando desde Supabase
const mockApplications = [
  {
    id: '1',
    created_at: '2025-01-23T10:30:00.000Z',
    updated_at: '2025-01-23T11:00:00.000Z',
    client_name: 'Juan Pérez',
    status: 'draft'
  },
  {
    id: '2',
    created_at: null, // Este es el problema
    updated_at: '2025-01-23T12:00:00.000Z',
    client_name: 'María García',
    status: 'submitted'
  },
  {
    id: '3',
    created_at: undefined, // Este también es problema
    updated_at: null,
    client_name: 'Carlos López',
    status: 'draft'
  },
  {
    id: '4',
    // created_at no existe en el objeto
    updated_at: undefined,
    client_name: 'Ana Martínez',
    status: 'submitted'
  }
];

const mockDrafts = [
  {
    id: 'draft1',
    updated_at: '2025-01-23T15:45:00.000Z',
    client_name: 'Pedro Sánchez',
    last_step: 3
  },
  {
    id: 'draft2',
    updated_at: null, // Este es el problema
    client_name: 'Laura Rodríguez',
    last_step: 5
  }
];

// Función de formato corregida
const formatDateToGuatemalan = (date) => {
  try {
    // Handle null, undefined, or empty values
    if (date === null || date === undefined || date === '' || date === 'null' || date === 'undefined') {
      return 'Sin fecha';
    }
    
    const dateObj = new Date(date);
    
    // Check if the date is valid (not NaN) and not epoch time (1970-01-01)
    if (isNaN(dateObj.getTime()) || dateObj.getTime() === 0) {
      return 'Sin fecha';
    }
    
    // Force Guatemala format DD/MM/YYYY
    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObj.getFullYear();
    
    return `${day}/${month}/${year}`;
  } catch (error) {
    return 'Sin fecha';
  }
};

console.log('\n📅 Testing applications with fallback:');
mockApplications.forEach((app, index) => {
  const fallbackDate = app.created_at || app.updated_at || new Date().toISOString();
  const formattedDate = formatDateToGuatemalan(fallbackDate);
  console.log(`${index + 1}. ${app.client_name} - created_at: ${JSON.stringify(app.created_at)}, updated_at: ${JSON.stringify(app.updated_at)} -> fallback: ${fallbackDate} -> ${formattedDate}`);
});

console.log('\n📅 Testing drafts with fallback:');
mockDrafts.forEach((draft, index) => {
  const fallbackDate = draft.updated_at || draft.created_at || new Date().toISOString();
  const formattedDate = formatDateToGuatemalan(fallbackDate);
  console.log(`${index + 1}. ${draft.client_name} - updated_at: ${JSON.stringify(draft.updated_at)}, created_at: ${JSON.stringify(draft.created_at)} -> fallback: ${fallbackDate} -> ${formattedDate}`);
});

console.log('\n🔍 Problema identificado:');
console.log('- Los campos created_at y updated_at están llegando como null desde la base de datos');
console.log('- Esto significa que hay un problema con la estructura de la base de datos');
console.log('- Necesitamos verificar si estos campos existen en las tablas');
console.log('- O si hay un problema con la consulta SQL');
