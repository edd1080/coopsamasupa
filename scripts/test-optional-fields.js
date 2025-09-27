#!/usr/bin/env node

/**
 * Script de prueba para verificar que los campos opcionales ya no bloquean el envío
 */

console.log('🧪 Testing Optional Fields - No Longer Blocking Submission');
console.log('=' .repeat(60));

// Simular la función de validación actualizada
function validateFormData(formData) {
  const errors = [];
  const warnings = [];
  const criticalFields = [];
  const missingFields = [];

  console.log('🔍 Validating Coopsama payload before submission...');

  // 1. Validar campos de identificación personal (CRÍTICOS)
  const personalFields = {
    firstName: formData.firstName,
    firstLastName: formData.firstLastName,
    dpi: formData.dpi,
    birthDate: formData.birthDate,
    gender: formData.gender,
    occupation: formData.occupation,
    mobilePhone: formData.mobilePhone,
    email: formData.email
  };

  Object.entries(personalFields).forEach(([field, value]) => {
    if (!value || value === '' || value === null || value === undefined) {
      const fieldName = getFieldDisplayName(field);
      errors.push(`Campo obligatorio: ${fieldName}`);
      missingFields.push(field);
      criticalFields.push(field);
    }
  });

  // 2. Validar información de ubicación (CRÍTICOS)
  const locationFields = {
    residenceDepartment: formData.residenceDepartment,
    residenceMunicipality: formData.residenceMunicipality,
    address: formData.address
  };

  Object.entries(locationFields).forEach(([field, value]) => {
    if (!value || value === '' || value === null || value === undefined) {
      const fieldName = getFieldDisplayName(field);
      errors.push(`Campo obligatorio: ${fieldName}`);
      missingFields.push(field);
      criticalFields.push(field);
    }
  });

  // 3. Validar información del crédito (CRÍTICOS)
  const creditFields = {
    requestedAmount: formData.requestedAmount,
    termMonths: formData.termMonths,
    applicationType: formData.applicationType,
    sourceOfFunds: formData.sourceOfFunds
  };

  Object.entries(creditFields).forEach(([field, value]) => {
    if (!value || value === '' || value === null || value === undefined) {
      const fieldName = getFieldDisplayName(field);
      errors.push(`Campo obligatorio: ${fieldName}`);
      missingFields.push(field);
      criticalFields.push(field);
    }
  });

  // 4. Validar información financiera (CRÍTICOS)
  const financialFields = {
    ingresoPrincipal: formData.ingresoPrincipal,
    incomeSource: formData.incomeSource
  };

  Object.entries(financialFields).forEach(([field, value]) => {
    if (!value || value === '' || value === null || value === undefined) {
      const fieldName = getFieldDisplayName(field);
      errors.push(`Campo obligatorio: ${fieldName}`);
      missingFields.push(field);
      criticalFields.push(field);
    }
  });

  // 5. Validar referencias (CRÍTICAS - al menos 1)
  if (!formData.references || formData.references.length === 0) {
    errors.push('Debe agregar al menos una referencia personal');
    missingFields.push('references');
    criticalFields.push('references');
  }

  // 6. Validar campos opcionales (solo advertencias)
  const optionalFields = {
    maritalStatus: formData.maritalStatus,
    principalProject: formData.principalProject,
    dpiFrontal: formData.dpiFrontal,
    fotoSolicitante: formData.fotoSolicitante
  };

  Object.entries(optionalFields).forEach(([field, value]) => {
    if (!value || value === '' || value === null || value === undefined) {
      const fieldName = getFieldDisplayName(field);
      warnings.push(`Campo recomendado: ${fieldName} (opcional pero recomendado)`);
    }
  });

  // 7. Validaciones de formato y lógica
  if (formData.requestedAmount && (isNaN(Number(formData.requestedAmount)) || Number(formData.requestedAmount) <= 0)) {
    errors.push('El monto solicitado debe ser un número válido mayor a 0');
  }

  if (formData.termMonths && (isNaN(Number(formData.termMonths)) || Number(formData.termMonths) <= 0)) {
    errors.push('El plazo en meses debe ser un número válido mayor a 0');
  }

  if (formData.ingresoPrincipal && (isNaN(Number(formData.ingresoPrincipal)) || Number(formData.ingresoPrincipal) <= 0)) {
    errors.push('El ingreso principal debe ser un número válido mayor a 0');
  }

  // 8. Validar formato de DPI
  if (formData.dpi && !/^\d{4}\s?\d{5}\s?\d{4}$/.test(formData.dpi.replace(/\s/g, ''))) {
    warnings.push('El formato del DPI podría no ser correcto. Verifique que tenga 13 dígitos.');
  }

  // 9. Validar formato de email
  if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.push('El formato del email no es válido');
  }

  // 10. Validar formato de teléfono
  if (formData.mobilePhone && !/^\d{4}\s?\d{4}$/.test(formData.mobilePhone.replace(/\s/g, ''))) {
    warnings.push('El formato del teléfono móvil podría no ser correcto. Verifique que tenga 8 dígitos.');
  }

  const isValid = errors.length === 0;

  console.log('📊 Validation results:', {
    isValid,
    errorsCount: errors.length,
    warningsCount: warnings.length,
    criticalFieldsCount: criticalFields.length,
    missingFieldsCount: missingFields.length
  });

  return {
    isValid,
    errors,
    warnings,
    criticalFields,
    missingFields
  };
}

const getFieldDisplayName = (field) => {
  const fieldNames = {
    firstName: 'Nombres',
    firstLastName: 'Primer Apellido',
    dpi: 'DPI',
    birthDate: 'Fecha de Nacimiento',
    gender: 'Género',
    maritalStatus: 'Estado Civil',
    occupation: 'Ocupación',
    mobilePhone: 'Teléfono Móvil',
    email: 'Email',
    residenceDepartment: 'Departamento de Residencia',
    residenceMunicipality: 'Municipio de Residencia',
    address: 'Dirección',
    requestedAmount: 'Monto Solicitado',
    termMonths: 'Plazo en Meses',
    applicationType: 'Tipo de Solicitud',
    sourceOfFunds: 'Origen de los Fondos',
    principalProject: 'Proyecto Principal',
    ingresoPrincipal: 'Ingreso Principal',
    incomeSource: 'Fuente de Ingreso',
    references: 'Referencias Personales',
    dpiFrontal: 'DPI Frontal',
    fotoSolicitante: 'Foto del Solicitante'
  };

  return fieldNames[field] || field;
};

// Casos de prueba
const testCases = [
  {
    name: "✅ Formulario Completo - Sin Campos Opcionales",
    description: "Formulario con todos los campos críticos pero sin los opcionales",
    formData: {
      // Campos críticos
      firstName: "Juan",
      firstLastName: "Pérez",
      dpi: "1234 56789 0101",
      birthDate: "1990-01-01",
      gender: "MASCULINO",
      occupation: "INGENIERO",
      mobilePhone: "1234 5678",
      email: "juan@email.com",
      residenceDepartment: "GUATEMALA",
      residenceMunicipality: "GUATEMALA",
      address: "Zona 10, Ciudad",
      requestedAmount: "50000",
      termMonths: "24",
      applicationType: "NUEVO",
      sourceOfFunds: "Propios",
      ingresoPrincipal: "8000",
      incomeSource: "NOMINAL",
      references: [{ name: "María García", phone: "9876 5432" }],
      // Campos opcionales vacíos (antes bloqueaban)
      maritalStatus: "",
      principalProject: "",
      dpiFrontal: "",
      fotoSolicitante: ""
    },
    expectedResult: "VALID_WITH_WARNINGS"
  },
  {
    name: "❌ Formulario con Campos Críticos Faltantes",
    description: "Formulario sin algunos campos críticos (debe fallar)",
    formData: {
      firstName: "Juan",
      // firstLastName faltante
      dpi: "1234 56789 0101",
      // birthDate faltante
      gender: "MASCULINO",
      occupation: "INGENIERO",
      mobilePhone: "1234 5678",
      email: "juan@email.com",
      residenceDepartment: "GUATEMALA",
      residenceMunicipality: "GUATEMALA",
      address: "Zona 10, Ciudad",
      requestedAmount: "50000",
      termMonths: "24",
      applicationType: "NUEVO",
      sourceOfFunds: "Propios",
      ingresoPrincipal: "8000",
      incomeSource: "NOMINAL",
      references: [{ name: "María García", phone: "9876 5432" }]
    },
    expectedResult: "INVALID"
  }
];

// Ejecutar pruebas
let passedTests = 0;
let totalTests = testCases.length;

testCases.forEach((testCase, index) => {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🧪 Test Case ${index + 1}/${totalTests}`);
  console.log(`📋 ${testCase.name}`);
  console.log(`📝 ${testCase.description}`);
  
  const result = validateFormData(testCase.formData);
  
  console.log(`📊 Result: ${result.isValid ? 'VALID' : 'INVALID'}`);
  console.log(`📊 Expected: ${testCase.expectedResult}`);
  console.log(`📊 Errors: ${result.errors.length}`);
  console.log(`📊 Warnings: ${result.warnings.length}`);
  
  let testPassed = false;
  
  if (testCase.expectedResult === "VALID_WITH_WARNINGS" && result.isValid && result.warnings.length > 0) {
    testPassed = true;
  } else if (testCase.expectedResult === "INVALID" && !result.isValid) {
    testPassed = true;
  }
  
  if (testPassed) {
    console.log('✅ TEST PASSED');
    passedTests++;
  } else {
    console.log('❌ TEST FAILED');
  }
  
  if (result.errors.length > 0) {
    console.log('📝 Errors:');
    result.errors.forEach((error, i) => {
      console.log(`   ${i + 1}. ${error}`);
    });
  }
  
  if (result.warnings.length > 0) {
    console.log('⚠️ Warnings:');
    result.warnings.forEach((warning, i) => {
      console.log(`   ${i + 1}. ${warning}`);
    });
  }
});

// Resumen final
console.log(`\n${'='.repeat(60)}`);
console.log('📊 TEST SUMMARY');
console.log(`✅ Passed: ${passedTests}/${totalTests}`);
console.log(`❌ Failed: ${totalTests - passedTests}/${totalTests}`);

if (passedTests === totalTests) {
  console.log('🎉 ALL TESTS PASSED! Optional fields no longer block submission.');
} else {
  console.log('⚠️ Some tests failed. Please review the implementation.');
}

console.log('\n🔧 Changes Made:');
console.log('- ✅ maritalStatus: CRÍTICO → OPCIONAL (solo advertencia)');
console.log('- ✅ principalProject: CRÍTICO → OPCIONAL (solo advertencia)');
console.log('- ✅ dpiFrontal: CRÍTICO → OPCIONAL (solo advertencia)');
console.log('- ✅ fotoSolicitante: CRÍTICO → OPCIONAL (solo advertencia)');

console.log('\n📋 Fields Still Critical:');
console.log('- firstName, firstLastName, dpi, birthDate, gender, occupation');
console.log('- mobilePhone, email, residenceDepartment, residenceMunicipality, address');
console.log('- requestedAmount, termMonths, applicationType, sourceOfFunds');
console.log('- ingresoPrincipal, incomeSource, references (at least 1)');
