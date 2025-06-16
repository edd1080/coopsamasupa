
// Input validation and sanitization utilities
import DOMPurify from 'dompurify';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Sanitize HTML content to prevent XSS
export const sanitizeHtml = (input: string): string => {
  if (typeof window !== 'undefined') {
    return DOMPurify.sanitize(input, { 
      ALLOWED_TAGS: [], 
      ALLOWED_ATTR: [] 
    });
  }
  // Fallback for server-side rendering
  return input.replace(/<[^>]*>/g, '');
};

// Validate and sanitize text input
export const validateTextInput = (
  value: string, 
  fieldName: string, 
  minLength: number = 1, 
  maxLength: number = 255
): ValidationResult => {
  const errors: string[] = [];
  
  if (!value || value.trim().length === 0) {
    errors.push(`${fieldName} es requerido`);
  } else {
    const sanitized = sanitizeHtml(value.trim());
    if (sanitized.length < minLength) {
      errors.push(`${fieldName} debe tener al menos ${minLength} caracteres`);
    }
    if (sanitized.length > maxLength) {
      errors.push(`${fieldName} no puede exceder ${maxLength} caracteres`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Enhanced DPI validation
export const validateDPI = (dpi: string): ValidationResult => {
  const errors: string[] = [];
  const sanitizedDPI = sanitizeHtml(dpi.trim());
  
  if (!sanitizedDPI) {
    errors.push('DPI es requerido');
  } else if (!/^\d{13}$/.test(sanitizedDPI)) {
    errors.push('DPI debe contener exactamente 13 dígitos numéricos');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Enhanced phone validation
export const validatePhone = (phone: string): ValidationResult => {
  const errors: string[] = [];
  const sanitizedPhone = sanitizeHtml(phone.trim());
  
  if (!sanitizedPhone) {
    errors.push('Teléfono es requerido');
  } else if (!/^[0-9+\-\s()]{8,15}$/.test(sanitizedPhone)) {
    errors.push('Formato de teléfono inválido (8-15 caracteres, solo números y símbolos +, -, (), espacios)');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Email validation
export const validateEmail = (email: string): ValidationResult => {
  const errors: string[] = [];
  const sanitizedEmail = sanitizeHtml(email.trim().toLowerCase());
  
  if (!sanitizedEmail) {
    errors.push('Email es requerido');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sanitizedEmail)) {
    errors.push('Formato de email inválido');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Numeric validation
export const validateNumeric = (
  value: string | number, 
  fieldName: string, 
  min?: number, 
  max?: number
): ValidationResult => {
  const errors: string[] = [];
  const numValue = typeof value === 'string' ? parseFloat(sanitizeHtml(value)) : value;
  
  if (isNaN(numValue)) {
    errors.push(`${fieldName} debe ser un número válido`);
  } else {
    if (min !== undefined && numValue < min) {
      errors.push(`${fieldName} debe ser mayor o igual a ${min}`);
    }
    if (max !== undefined && numValue > max) {
      errors.push(`${fieldName} debe ser menor o igual a ${max}`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Sanitize object data recursively
export const sanitizeObjectData = (obj: any): any => {
  if (obj === null || obj === undefined) return obj;
  
  if (typeof obj === 'string') {
    return sanitizeHtml(obj);
  }
  
  if (Array.isArray(obj)) {
    return obj.map(sanitizeObjectData);
  }
  
  if (typeof obj === 'object') {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      sanitized[key] = sanitizeObjectData(value);
    }
    return sanitized;
  }
  
  return obj;
};
