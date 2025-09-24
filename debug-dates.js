// Script para debuggear fechas
console.log('🔍 Debugging date values...');

// Simular valores que podrían estar llegando desde la base de datos
const testDates = [
  null,
  undefined,
  '',
  'null',
  'undefined',
  '2025-01-23T10:30:00.000Z',
  '2025-01-23',
  '2025-01-23 10:30:00',
  'invalid-date',
  new Date(),
  new Date('2025-01-23T10:30:00.000Z'),
  new Date('invalid')
];

// Función corregida
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

console.log('\n📅 Testing date formatting:');
testDates.forEach((date, index) => {
  const result = formatDateToGuatemalan(date);
  console.log(`${index + 1}. Input: ${JSON.stringify(date)} -> Output: ${result}`);
});

console.log('\n🔍 Checking what might be causing "Fecha inválida":');
testDates.forEach((date, index) => {
  if (date) {
    const dateObj = new Date(date);
    const isValid = !isNaN(dateObj.getTime());
    console.log(`${index + 1}. ${JSON.stringify(date)} -> isValid: ${isValid}, getTime(): ${dateObj.getTime()}`);
  }
});
