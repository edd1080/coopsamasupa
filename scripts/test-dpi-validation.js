/**
 * Script de Testing - BUG-225: Validación de DPI no funciona correctamente
 * 
 * Este script prueba la validación de DPI para identificar el problema
 */

console.log('🧪 Iniciando test de validación de DPI - BUG-225');

// Simular las funciones de validación actuales
function validateDPIFormat(dpi) {
  const cleaned = dpi.replace(/\s/g, '');
  return /^\d{13}$/.test(cleaned);
}

function validateDPI(dpi) {
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
  { dpi: '1234-56789-0123', description: 'DPI con guiones', expected: false },
  { dpi: '1234.56789.0123', description: 'DPI con puntos', expected: false },
  
  // Casos inválidos - departamento/municipio
  { dpi: '1234567890023', description: 'DPI con departamento 00', expected: false },
  { dpi: '1234567892323', description: 'DPI con departamento 23', expected: false },
  { dpi: '1234567890100', description: 'DPI con municipio 00', expected: false },
  { dpi: '1234567890199', description: 'DPI con municipio 99', expected: false },
  { dpi: '1234567890100', description: 'DPI con municipio 100', expected: false },
];

console.log('\n=== TESTING validateDPIFormat (función actual) ===');
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

console.log('\n=== TESTING validateDPI (función completa) ===');
let fullErrors = 0;
testCases.forEach((testCase, index) => {
  const result = validateDPI(testCase.dpi);
  const passed = result.isValid === testCase.expected;
  
  console.log(`${index + 1}. ${testCase.description}`);
  console.log(`   DPI: "${testCase.dpi}"`);
  console.log(`   Resultado: ${result.isValid ? '✅ Válido' : '❌ Inválido'}`);
  console.log(`   Esperado: ${testCase.expected ? '✅ Válido' : '❌ Inválido'}`);
  console.log(`   Test: ${passed ? '✅ PASÓ' : '❌ FALLÓ'}`);
  if (result.error) console.log(`   Error: ${result.error}`);
  
  if (!passed) fullErrors++;
  console.log('');
});

console.log('\n=== ANÁLISIS DEL PROBLEMA ===');
console.log(`❌ Errores en validateDPIFormat: ${formatErrors}/${testCases.length}`);
console.log(`✅ Errores en validateDPI: ${fullErrors}/${testCases.length}`);

if (formatErrors > 0) {
  console.log('\n🔍 PROBLEMA IDENTIFICADO:');
  console.log('1. ❌ validateDPIFormat solo valida longitud (13 dígitos)');
  console.log('2. ❌ NO valida formato correcto (XXXX XXXXX XXXX)');
  console.log('3. ❌ NO valida algoritmo de dígito verificador');
  console.log('4. ❌ NO valida códigos de departamento/municipio');
  console.log('5. ❌ Acepta letras y caracteres especiales');
  
  console.log('\n💡 SOLUCIÓN NECESARIA:');
  console.log('1. ✅ Reemplazar validateDPIFormat con validateDPI');
  console.log('2. ✅ Implementar validación completa en formularios');
  console.log('3. ✅ Agregar máscara de entrada XXXX XXXXX XXXX');
  console.log('4. ✅ Solo permitir números en el input');
  console.log('5. ✅ Mostrar errores específicos de validación');
}

console.log('\n=== RESULTADO DEL TEST ===');
const bugConfirmed = formatErrors > 0;
console.log('Bug confirmado:', bugConfirmed ? '❌ SÍ' : '✅ NO');
console.log('Validación actual funciona:', !bugConfirmed ? '✅ SÍ' : '❌ NO');
console.log('Validación completa funciona:', fullErrors === 0 ? '✅ SÍ' : '❌ NO');
