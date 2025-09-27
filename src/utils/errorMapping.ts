/**
 * Mapeo de códigos de error de Coopsama a descripciones específicas
 * Basado en la documentación de códigos de error Erx001-Erx010
 */

export interface CoopsamaError {
  code: string;
  description: string;
  category: string;
  action: string;
}

export const COOPSAMA_ERRORS: Record<string, CoopsamaError> = {
  'Erx001': {
    code: 'Erx001',
    description: 'Error en el guardado del plan de pagos',
    category: 'Plan de Pagos',
    action: 'Verifique la información del plan de pagos, incluyendo montos, plazos y frecuencia de pago'
  },
  'Erx002': {
    code: 'Erx002',
    description: 'Error en el guardado del análisis financiero',
    category: 'Análisis Financiero',
    action: 'Revise los datos financieros, ingresos, gastos y estado patrimonial'
  },
  'Erx003': {
    code: 'Erx003',
    description: 'Error en alguno de los registros de las fuentes de ingreso',
    category: 'Fuentes de Ingreso',
    action: 'Verifique las fuentes de ingreso y sus montos correspondientes'
  },
  'Erx004': {
    code: 'Erx004',
    description: 'Error en la información adicional',
    category: 'Información Adicional',
    action: 'Complete correctamente los campos de información adicional requeridos'
  },
  'Erx005': {
    code: 'Erx005',
    description: 'Error en el guardado de la solicitud de crédito',
    category: 'Solicitud de Crédito',
    action: 'Verifique los datos principales de la solicitud de crédito'
  },
  'Erx006': {
    code: 'Erx006',
    description: 'Error en el guardado del balance patrimonial',
    category: 'Balance Patrimonial',
    action: 'Revise los activos, pasivos y patrimonio neto'
  },
  'Erx007': {
    code: 'Erx007',
    description: 'Error en la calificación del asociado',
    category: 'Calificación',
    action: 'Verifique la información de calificación crediticia del asociado'
  },
  'Erx008': {
    code: 'Erx008',
    description: 'Error al guardar las referencias personales y comerciales',
    category: 'Referencias',
    action: 'Complete correctamente las referencias personales y comerciales'
  },
  'Erx009': {
    code: 'Erx009',
    description: 'Error al guardar el plan de inversión',
    category: 'Plan de Inversión',
    action: 'Revise la información del plan de inversión y destino de los fondos'
  },
  'Erx010': {
    code: 'Erx010',
    description: 'Error al guardar la información del cliente',
    category: 'Información del Cliente',
    action: 'Verifique los datos personales y de contacto del cliente'
  }
};

/**
 * Extrae el código de error Erx del mensaje de Coopsama
 */
export function extractErrorCode(message: string): string | null {
  const match = message.match(/Erx\d{3}/);
  return match ? match[0] : null;
}

/**
 * Obtiene la información completa del error basada en el código
 */
export function getErrorInfo(message: string): CoopsamaError | null {
  const errorCode = extractErrorCode(message);
  if (!errorCode) return null;
  
  return COOPSAMA_ERRORS[errorCode] || {
    code: errorCode,
    description: 'Error desconocido de Coopsama',
    category: 'Error',
    action: 'Contacte al administrador del sistema'
  };
}

/**
 * Formatea el mensaje de error para mostrar al usuario
 */
export function formatErrorMessage(message: string): string {
  const errorInfo = getErrorInfo(message);
  if (!errorInfo) return message;
  
  return `${errorInfo.description} (${errorInfo.code})`;
}

/**
 * Obtiene la acción recomendada para el usuario
 */
export function getRecommendedAction(message: string): string {
  const errorInfo = getErrorInfo(message);
  return errorInfo?.action || 'Revise la información ingresada y vuelva a intentar';
}
