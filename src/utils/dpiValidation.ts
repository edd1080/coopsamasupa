
export const validateDPI = (dpi: string): { isValid: boolean; error?: string } => {
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
};

export const formatDPI = (dpi: string): string => {
  const cleanDPI = dpi.replace(/[\s-]/g, '');
  if (cleanDPI.length <= 4) return cleanDPI;
  if (cleanDPI.length <= 12) {
    return `${cleanDPI.slice(0, 4)} ${cleanDPI.slice(4, 9)} ${cleanDPI.slice(9)}`;
  }
  return `${cleanDPI.slice(0, 4)} ${cleanDPI.slice(4, 9)} ${cleanDPI.slice(9, 13)}`;
};

export const validatePhone = (phone: string): { isValid: boolean; error?: string } => {
  const cleanPhone = phone.replace(/[\s-]/g, '');
  
  if (!/^\d{8}$/.test(cleanPhone)) {
    return {
      isValid: false,
      error: 'El teléfono debe tener exactamente 8 dígitos'
    };
  }

  return {
    isValid: true
  };
};
