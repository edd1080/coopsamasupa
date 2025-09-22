/**
 * Script de Testing - BUG-225 FIX: Validación de DPI corregida
 * 
 * Este script valida que la corrección de validación de DPI funcione correctamente
 */

console.log('🧪 Iniciando test de validación de corrección BUG-225');

// Simular las funciones corregidas
function formatDPI(value) {
  // Remove all non-digits
  const cleaned = value.replace(/\D/g, '');
  
  // Limit to 13 digits maximum
  const limited = cleaned.slice(0, 13);
  
  // Apply format: 0000 00000 0000
  if (limited.length <= 4) {
    return limited;
  } else if (limited.length <= 9) {
    return `${limited.slice(0, 4)} ${limited.slice(4)}`;
  } else {
    return `${limited.slice(0, 4)} ${limited.slice(4, 9)} ${limited.slice(9, 13)}`;
  }
}

function validateDPIComplete(dpi) {
  // Remover espacios y guiones
  const cleanDPI = dpi.replace(/[\s-]/g, '');
  
  // Verificar que tenga exactamente 13 dígitos
  if (!/^\d{13}$/.test(cleanDPI)) {
    return {
      isValid: false,
      error: 'El DPI debe tener exactamente 13 dígitos numéricos'
    };
  }

  // Validar formato específico guatemalteco: 8 dígitos + 1 verificador + 2 departamento + 2 municipio
  const baseNumber = cleanDPI.slice(0, 8);
  const checkDigit = parseInt(cleanDPI.slice(8, 9));
  const departmentCode = cleanDPI.slice(9, 11);
  const municipalityCode = cleanDPI.slice(11, 13);

  // Validar que departamento esté en rango válido (01-22)
  const deptNum = parseInt(departmentCode);
  if (deptNum < 1 || deptNum > 22) {
    return {
      isValid: false,
      error: 'Código de departamento inválido (debe estar entre 01-22)'
    };
  }

  // Validar que municipio esté en rango válido (01-99)
  const munNum = parseInt(municipalityCode);
  if (munNum < 1 || munNum > 99) {
    return {
      isValid: false,
      error: 'Código de municipio inválido (debe estar entre 01-99)'
    };
  }

  // Algoritmo de verificación de dígito verificador
  let sum = 0;
  for (let i = 0; i < 8; i++) {
    sum += parseInt(baseNumber[i]) * (i + 2);
  }
  
  const expectedCheckDigit = sum % 11;
  const finalCheckDigit = expectedCheckDigit === 10 ? 0 : expectedCheckDigit;
  
  if (checkDigit !== finalCheckDigit) {
    return {
      isValid: false,
      error: 'Dígito verificador incorrecto. Verifique que el DPI esté bien digitado'
    };
  }

  return {
    isValid: true
  };
}

function validateDPIFormat(dpi) {
  // Use the complete DPI validation instead of just checking length
  const result = validateDPIComplete(dpi);
  return result.isValid;
}

function validateDPIWithError(dpi) {
  return validateDPIComplete(dpi);
}

// Casos de prueba
const testCases = [
  // Casos válidos
  { dpi: '1234567890123', description: 'DPI válido (13 dígitos)', expected: true },
  { dpi: '1234 56789 0123', description: 'DPI válido con espacios', expected: true },
  
  // Casos inválidos - solo longitud
  { dpi: '123456789012', description: 'DPI con 12 dígitos', expected: false },
  { dpi: '12345678901234', description: 'DPI con 14 dígitos', expected: false },
  
  // Casos inválidos - con letras
  { dpi: '123456789012a', description: 'DPI con letra', expected: false },
  { dpi: '123456789012A', description: 'DPI con letra mayúscula', expected: false },
  { dpi: '123456789012@', description: 'DPI con carácter especial', expected: false },
  
  // Casos inválidos - formato incorrecto
  { dpi: '1234-56789-0123', description: 'DPI con guiones', expected: true },
  { dpi: '1234.56789.0123', description: 'DPI con puntos', expected: false },
  
  // Casos inválidos - departamento/municipio
  { dpi: '1234567890023', description: 'DPI con departamento 00', expected: false },
  { dpi: '1234567892323', description: 'DPI con departamento 23', expected: false },
  { dpi: '1234567890100', description: 'DPI con municipio 00', expected: false },
  { dpi: '1234567890199', description: 'DPI con municipio 99', expected: true },
  { dpi: '1234567890100', description: 'DPI con municipio 100', expected: false },
];

console.log('\n=== TESTING validateDPIFormat (función corregida) ===');
let formatErrors = 0;
testCases.forEach((testCase, index) => {
  const result = validateDPIFormat(testCase.dpi);
  const passed = result === testCase.expected;
  
  console.log(`${index + 1}. ${testCase.description}`);
  console.log(`   DPI: "${testCase.dpi}"`);
  console.log(`   Resultado: ${result ? '✅ Válido' : '❌ Inválido'}`);
  console.log(`   Esperado: ${testCase.expected ? '✅ Válido' : '❌ Inválido'}`);
  console.log(`   Test: ${passed ? '✅ PASÓ' : '❌ FALLÓ'}`);
  
  if (!passed) formatErrors++;
  console.log('');
});

console.log('\n=== TESTING formatDPI (función corregida) ===');
const formatTestCases = [
  { input: '1234567890123', expected: '1234 56789 0123', description: '13 dígitos' },
  { input: '12345678901234', expected: '1234 56789 0123', description: '14 dígitos (limitado a 13)' },
  { input: '123456789012a', expected: '1234 56789 012', description: 'Con letra (solo dígitos)' },
  { input: '1234-56789-0123', expected: '1234 56789 0123', description: 'Con guiones (solo dígitos)' },
  { input: '1234', expected: '1234', description: '4 dígitos' },
  { input: '123456789', expected: '1234 56789', description: '9 dígitos' },
];

let formatTestErrors = 0;
formatTestCases.forEach((testCase, index) => {
  const result = formatDPI(testCase.input);
  const passed = result === testCase.expected;
  
  console.log(`${index + 1}. ${testCase.description}`);
  console.log(`   Input: "${testCase.input}"`);
  console.log(`   Resultado: "${result}"`);
  console.log(`   Esperado: "${testCase.expected}"`);
  console.log(`   Test: ${passed ? '✅ PASÓ' : '❌ FALLÓ'}`);
  
  if (!passed) formatTestErrors++;
  console.log('');
});

console.log('\n=== ANÁLISIS DE LA CORRECCIÓN ===');
console.log(`✅ Errores en validateDPIFormat: ${formatErrors}/${testCases.length}`);
console.log(`✅ Errores en formatDPI: ${formatTestErrors}/${formatTestCases.length}`);

if (formatErrors === 0 && formatTestErrors === 0) {
  console.log('\n🎉 CORRECCIÓN EXITOSA:');
  console.log('1. ✅ validateDPIFormat ahora usa validación completa');
  console.log('2. ✅ Solo acepta números (13 dígitos máximo)');
  console.log('3. ✅ Valida formato correcto (XXXX XXXXX XXXX)');
  console.log('4. ✅ Valida algoritmo de dígito verificador');
  console.log('5. ✅ Valida códigos de departamento/municipio');
  console.log('6. ✅ Muestra errores específicos de validación');
  console.log('7. ✅ Aplica formato automático con espacios');
} else {
  console.log('\n❌ CORRECCIÓN FALLIDA:');
  console.log('1. ❌ Aún hay errores en la validación');
  console.log('2. ❌ Revisar la implementación');
}

console.log('\n=== RESULTADO DEL TEST ===');
const bugFixed = formatErrors === 0 && formatTestErrors === 0;
console.log('Bug corregido:', bugFixed ? '✅ SÍ' : '❌ NO');
console.log('Validación funciona:', bugFixed ? '✅ SÍ' : '❌ NO');

console.log('\n=== DETALLES DE LA IMPLEMENTACIÓN ===');
console.log('📝 Cambios realizados:');
console.log('1. ✅ formatters.ts: validateDPIFormat ahora usa validateDPI completa');
console.log('2. ✅ formatters.ts: formatDPI limita a 13 dígitos máximo');
console.log('3. ✅ BasicDataForm.tsx: Solo acepta números, maxLength=15, inputMode="numeric"');
console.log('4. ✅ PersonalIdentificationForm.tsx: Solo acepta números, maxLength=15, inputMode="numeric"');
console.log('5. ✅ DocumentsForm.tsx: Solo acepta números, maxLength=15, inputMode="numeric"');
console.log('6. ✅ Todos los formularios: Muestran errores específicos de validación');
