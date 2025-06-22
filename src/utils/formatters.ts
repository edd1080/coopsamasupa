
// Utility functions for formatting and validation

export const formatCurrency = (value: string | number): string => {
  const numValue = typeof value === 'string' ? parseFloat(value) || 0 : value;
  return numValue.toLocaleString('es-GT', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

export const parseCurrency = (formattedValue: string): string => {
  // Remove commas and return clean number string
  return formattedValue.replace(/,/g, '');
};

export const formatDPI = (value: string): string => {
  // Remove all non-digits
  const cleaned = value.replace(/\D/g, '');
  
  // Apply format: 0000 00000 0000
  if (cleaned.length <= 4) {
    return cleaned;
  } else if (cleaned.length <= 9) {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4)}`;
  } else {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 9)} ${cleaned.slice(9, 13)}`;
  }
};

export const formatPhone = (value: string): string => {
  // Remove all non-digits
  const cleaned = value.replace(/\D/g, '');
  
  // Apply format: 0000 0000
  if (cleaned.length <= 4) {
    return cleaned;
  } else {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 8)}`;
  }
};

export const validateDPIFormat = (dpi: string): boolean => {
  const cleaned = dpi.replace(/\s/g, '');
  return /^\d{13}$/.test(cleaned);
};

export const validatePhoneFormat = (phone: string): boolean => {
  const cleaned = phone.replace(/\s/g, '');
  return /^\d{8}$/.test(cleaned);
};
