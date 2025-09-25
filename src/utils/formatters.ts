
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

// Import the complete DPI validation function
import { validateDPI as validateDPIComplete } from './dpiValidation';

export const validateDPIFormat = (dpi: string): boolean => {
  // Use the complete DPI validation instead of just checking length
  const result = validateDPIComplete(dpi);
  return result.isValid;
};

// Export the complete validation function for error messages
export const validateDPIWithError = (dpi: string): { isValid: boolean; error?: string } => {
  return validateDPIComplete(dpi);
};

export const validatePhoneFormat = (phone: string): boolean => {
  const cleaned = phone.replace(/\s/g, '');
  return /^\d{8}$/.test(cleaned);
};

// Utility functions for numeric input normalization
export const normalizeIntegerInput = (value: string): string => {
  // Remove all non-digit characters
  return value.replace(/\D/g, '');
};

export const normalizeDecimalInput = (value: string): string => {
  // Allow only digits and one decimal point
  const cleaned = value.replace(/[^\d.]/g, '');
  const parts = cleaned.split('.');
  if (parts.length > 2) {
    return parts[0] + '.' + parts.slice(1).join('');
  }
  return cleaned;
};

export const formatCurrencyWithSymbol = (value: string | number): string => {
  const numValue = typeof value === 'string' ? parseFloat(value) || 0 : value;
  return `Q${numValue.toLocaleString('es-GT', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
};

/**
 * Convierte valores de select con guiones bajos a texto legible
 * @param value - Valor del select (ej: "expansion_negocio")
 * @returns Texto legible (ej: "Expansión de Negocio")
 */
export const formatSelectValue = (value: string): string => {
  if (!value || typeof value !== 'string') {
    return value || '';
  }

  // Mapeo específico para valores conocidos
  const valueMap: Record<string, string> = {
    // Propósitos de crédito
    'capital_trabajo': 'Capital de Trabajo',
    'expansion_negocio': 'Expansión de Negocio',
    'maquinaria_equipo': 'Maquinaria y Equipo',
    
    // Departamentos
    'alta_verapaz': 'Alta Verapaz',
    'baja_verapaz': 'Baja Verapaz',
    'el_progreso': 'El Progreso',
    'san_marcos': 'San Marcos',
    'santa_rosa': 'Santa Rosa',
    
    // Estabilidad laboral
    'menor_1': 'Menor a 1 año',
    '1_2': '1 a 2 años',
    '2_3': '2 a 3 años',
    'mayor_3': 'Mayor a 3 años',
    
    // Grupos de destino
    'grupo_consumo': 'Grupo Consumo',
    'grupo_microcredito': 'Grupo MicroCrédito',
    'grupo_productivo': 'Grupo Productivo',
    'grupo_vivienda': 'Grupo Vivienda',
    
    // Destinos específicos
    'tarjeta_credito': 'Tarjeta de Crédito',
    'pecuario_avicola': 'Pecuario/Avícola',
    'costo_produccion': 'Costo de Producción',
    'activos_fijos': 'Activos Fijos',
    'construccion_mejoras': 'Construcción y Mejoras',
    'gastos_personales': 'Gastos Personales',
    'consolidacion_deuda': 'Consolidación de Deuda',
    'compra_vehiculo': 'Compra de Vehículo',
    'compra_venta': 'Compra-Venta',
    'crianza_engorde': 'Crianza y Engorde',
    'materia_prima_insumos': 'Materia Prima e Insumos',
    'produccion_agropecuarios': 'Producción Agropecuarios',
    'comercializacion_agropecuarios': 'Comercialización Agropecuarios',
    'comercializacion_forestales': 'Comercialización Forestales',
    
    // Formas de pago
    'al_vencimiento': 'Al Vencimiento',
    'fondo_revolvente/1': 'Fondo Revolvente',
    
    // Estabilidad laboral cónyuge
    'menos_1_año': 'Menos de 1 año',
    '1_año': '1 año',
    '2_años': '2 años',
    '3_años': '3 años',
    '5_años': '5 años',
    'mas_5_años': 'Más de 5 años',
    
    // Tipos de trabajo
    'part_time': 'Empleado Tiempo Parcial',
    'self_employed': 'Trabajador Independiente',
    'business_owner': 'Dueño de Negocio',
    
    // Actividades económicas
    'real_estate': 'Actividades Inmobiliarias',
    'other_services': 'Otras Actividades de Servicios'
  };

  // Si existe en el mapeo, devolver el valor mapeado
  if (valueMap[value]) {
    return valueMap[value];
  }

  // Si no está en el mapeo, convertir guiones bajos a espacios y capitalizar
  return value
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
};
