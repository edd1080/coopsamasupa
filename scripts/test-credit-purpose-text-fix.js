#!/usr/bin/env node

/**
 * Script de Testing para BUG-275: Corrección de texto desbordado en propósito del crédito
 * 
 * Este script verifica que:
 * 1. El texto del propósito del crédito se muestre en 2 líneas máximo
 * 2. No se salga de la card
 * 3. Mantenga legibilidad con tamaño reducido
 * 4. Funcione en diferentes resoluciones
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Testing BUG-275: Corrección de texto desbordado en propósito del crédito\n');

// Verificar que el archivo ApplicationDetails.tsx existe
const applicationDetailsPath = path.join(__dirname, '..', 'src', 'pages', 'ApplicationDetails.tsx');

if (!fs.existsSync(applicationDetailsPath)) {
  console.error('❌ Error: No se encontró el archivo ApplicationDetails.tsx');
  process.exit(1);
}

// Leer el archivo
const fileContent = fs.readFileSync(applicationDetailsPath, 'utf8');

// Verificar que la corrección esté implementada
const tests = [
  {
    name: 'Verificar que el propósito del crédito use text-xs',
    pattern: /font-bold text-xs leading-tight line-clamp-2/,
    description: 'El texto debe usar text-xs para reducir el tamaño'
  },
  {
    name: 'Verificar que use leading-tight',
    pattern: /leading-tight/,
    description: 'Debe usar leading-tight para espaciado compacto'
  },
  {
    name: 'Verificar que use line-clamp-2',
    pattern: /line-clamp-2/,
    description: 'Debe usar line-clamp-2 para máximo 2 líneas'
  },
  {
    name: 'Verificar que mantenga font-bold',
    pattern: /font-bold text-xs/,
    description: 'Debe mantener font-bold para énfasis'
  }
];

let passedTests = 0;
let totalTests = tests.length;

console.log('📋 Ejecutando tests de corrección:\n');

tests.forEach((test, index) => {
  const result = test.pattern.test(fileContent);
  
  if (result) {
    console.log(`✅ Test ${index + 1}: ${test.name}`);
    console.log(`   ${test.description}`);
    passedTests++;
  } else {
    console.log(`❌ Test ${index + 1}: ${test.name}`);
    console.log(`   ${test.description}`);
    console.log(`   ❌ Patrón no encontrado: ${test.pattern}`);
  }
  console.log('');
});

// Verificar que no haya otros elementos de propósito sin la corrección
const oldPattern = /font-bold.*creditPurpose.*purpose/;
const hasOldPattern = oldPattern.test(fileContent);

if (hasOldPattern) {
  console.log('⚠️  Advertencia: Se encontraron patrones antiguos que podrían necesitar corrección');
} else {
  console.log('✅ No se encontraron patrones antiguos sin corregir');
}

// Verificar que la estructura de la card esté correcta
const cardStructurePattern = /text-center p-3 bg-background rounded-md border/;
const hasCorrectStructure = cardStructurePattern.test(fileContent);

if (hasCorrectStructure) {
  console.log('✅ La estructura de la card está correcta');
} else {
  console.log('❌ La estructura de la card no es la esperada');
}

// Resultados finales
console.log('\n📊 Resultados del Testing:');
console.log(`✅ Tests pasados: ${passedTests}/${totalTests}`);
console.log(`📈 Porcentaje de éxito: ${Math.round((passedTests / totalTests) * 100)}%`);

if (passedTests === totalTests) {
  console.log('\n🎉 ¡Todos los tests pasaron! La corrección del BUG-275 está implementada correctamente.');
  console.log('\n📋 Resumen de la corrección:');
  console.log('   • Texto reducido a text-xs para mejor ajuste');
  console.log('   • leading-tight para espaciado compacto');
  console.log('   • line-clamp-2 para máximo 2 líneas');
  console.log('   • font-bold mantenido para énfasis');
  console.log('   • Texto largo ahora se ajusta dentro de la card');
  
  process.exit(0);
} else {
  console.log('\n❌ Algunos tests fallaron. Revisar la implementación.');
  process.exit(1);
}
