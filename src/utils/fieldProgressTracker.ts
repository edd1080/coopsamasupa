/**
 * Sistema de progreso basado en campos completados
 * Bug-272: Calcular progreso como (Campos Completados / Total de Campos) × 100
 */

// Mapeo completo de todos los campos del formulario por sección
export const formFieldsMap = {
  // Sección 1: Identificación Personal (PersonalIdentificationForm)
  identification: {
    // Datos básicos
    firstName: { type: 'text', required: true, weight: 1 },
    secondName: { type: 'text', required: false, weight: 1 },
    thirdName: { type: 'text', required: false, weight: 1 },
    firstLastName: { type: 'text', required: true, weight: 1 },
    secondLastName: { type: 'text', required: false, weight: 1 },
    marriedLastName: { type: 'text', required: false, weight: 1 },
    dpi: { type: 'text', required: true, weight: 1 },
    nit: { type: 'text', required: false, weight: 1 },
    dpiExtendedIn: { type: 'date', required: false, weight: 1 },
    cua: { type: 'text', required: false, weight: 1 },
    
    // Información demográfica y discapacidad
    birthDate: { type: 'date', required: true, weight: 1 },
    age: { type: 'number', required: false, weight: 1 },
    dependents: { type: 'number', required: false, weight: 1 },
    ethnicity: { type: 'select', required: false, weight: 1 },
    educationLevel: { type: 'select', required: false, weight: 1 },
    profession: { type: 'text', required: false, weight: 1 },
    occupation: { type: 'text', required: false, weight: 1 },
    hasDisability: { type: 'checkbox', required: false, weight: 1 },
    disabilityDescription: { type: 'textarea', required: false, weight: 1 },
    
    // Información del cónyuge
    spouseFirstName: { type: 'text', required: false, weight: 1 },
    spouseSecondName: { type: 'text', required: false, weight: 1 },
    spouseFirstLastName: { type: 'text', required: false, weight: 1 },
    spouseSecondLastName: { type: 'text', required: false, weight: 1 },
    spouseWorkplace: { type: 'text', required: false, weight: 1 },
    spouseJobStability: { type: 'select', required: false, weight: 1 },
    spouseMobilePhone: { type: 'text', required: false, weight: 1 },
    spouseBirthDate: { type: 'date', required: false, weight: 1 },
    
    // Contacto y vivienda
    mobilePhone: { type: 'text', required: true, weight: 1 },
    homePhone: { type: 'text', required: false, weight: 1 },
    email: { type: 'email', required: true, weight: 1 },
    address: { type: 'textarea', required: true, weight: 1 },
    addressReference: { type: 'text', required: false, weight: 1 },
    geolocation: { type: 'object', required: false, weight: 1 },
    residenceDepartment: { type: 'select', required: true, weight: 1 },
    residenceMunicipality: { type: 'select', required: true, weight: 1 },
    housingType: { type: 'select', required: false, weight: 1 },
    residenceStability: { type: 'select', required: false, weight: 1 }
  },

  // Sección 2: Información del Crédito (CreditInfoForm)
  credit: {
    creditPurpose: { type: 'select', required: true, weight: 1 },
    requestedAmount: { type: 'number', required: true, weight: 1 },
    termMonths: { type: 'number', required: true, weight: 1 },
    capitalPayment: { type: 'number', required: false, weight: 1 },
    interestPayment: { type: 'number', required: false, weight: 1 },
    paymentPlan: { type: 'select', required: false, weight: 1 },
    capitalAmortization: { type: 'select', required: false, weight: 1 },
    memberType: { type: 'select', required: false, weight: 1 },
    interestRate: { type: 'number', required: false, weight: 1 },
    interestAmortization: { type: 'select', required: false, weight: 1 },
    applicationType: { type: 'select', required: true, weight: 1 },
    obtainedCreditsCount: { type: 'number', required: false, weight: 1 },
    fundsOrigin: { type: 'text', required: false, weight: 1 },
    characterObservations: { type: 'textarea', required: false, weight: 1 },
    
    // Destino del crédito
    investmentPlaceDepartment: { type: 'select', required: false, weight: 1 },
    investmentPlaceMunicipality: { type: 'select', required: false, weight: 1 },
    destinationGroup: { type: 'select', required: false, weight: 1 },
    creditDestination: { type: 'select', required: false, weight: 1 },
    destinationCategory: { type: 'select', required: false, weight: 1 },
    sowingLatitude: { type: 'number', required: false, weight: 1 },
    sowingLongitude: { type: 'number', required: false, weight: 1 },
    destinationDescription: { type: 'textarea', required: false, weight: 1 },
    destinationObservations: { type: 'textarea', required: false, weight: 1 },
    sourceTypes: { type: 'text', required: false, weight: 1 },
    sourceQuantity: { type: 'number', required: false, weight: 1 },
    sourceObservations: { type: 'textarea', required: false, weight: 1 }
  },

  // Sección 3: Análisis Financiero (FinancialAnalysis)
  finances: {
    // Fuentes de ingreso
    incomeSource: { type: 'select', required: false, weight: 1 },
    ingresoPrincipal: { type: 'number', required: true, weight: 1 },
    ingresoSecundario: { type: 'number', required: false, weight: 1 },
    comentarioIngreso: { type: 'textarea', required: false, weight: 1 },
    incomeSources: { type: 'array', required: false, weight: 1 },
    
    // Gastos
    alimentacion: { type: 'number', required: false, weight: 1 },
    vestuario: { type: 'number', required: false, weight: 1 },
    serviciosBasicos: { type: 'number', required: false, weight: 1 },
    educacion: { type: 'number', required: false, weight: 1 },
    vivienda: { type: 'number', required: false, weight: 1 },
    transporte: { type: 'number', required: false, weight: 1 },
    compromisos: { type: 'number', required: false, weight: 1 },
    gastosFinancieros: { type: 'number', required: false, weight: 1 },
    descuentosPlanilla: { type: 'number', required: false, weight: 1 },
    otros: { type: 'number', required: false, weight: 1 },
    cuotaSolicitada: { type: 'number', required: false, weight: 1 },
    
    // Estado patrimonial
    efectivoSaldoBancos: { type: 'number', required: false, weight: 1 },
    cuentasPorCobrar: { type: 'number', required: false, weight: 1 },
    mercaderias: { type: 'number', required: false, weight: 1 },
    bienesMuebles: { type: 'number', required: false, weight: 1 },
    vehiculos: { type: 'number', required: false, weight: 1 },
    bienesInmuebles: { type: 'number', required: false, weight: 1 },
    otrosActivos: { type: 'number', required: false, weight: 1 },
    cuentasPorPagar: { type: 'number', required: false, weight: 1 },
    deudasCortoPlazo: { type: 'number', required: false, weight: 1 },
    prestamosLargoPlazo: { type: 'number', required: false, weight: 1 },
    montoSolicitado: { type: 'number', required: false, weight: 1 }
  },

  // Sección 4: Información del Negocio (BusinessInfoForm)
  business: {
    companyName: { type: 'text', required: false, weight: 1 },
    activityDescription: { type: 'textarea', required: false, weight: 1 },
    productType: { type: 'text', required: false, weight: 1 },
    fullAddress: { type: 'textarea', required: false, weight: 1 }
  },

  // Sección 5: Referencias Personales (ReferenceBasicInfo)
  references: {
    // Cada referencia tiene estos campos (se multiplican por cantidad de referencias)
    referenceType: { type: 'select', required: false, weight: 1 },
    firstName: { type: 'text', required: false, weight: 1 },
    secondName: { type: 'text', required: false, weight: 1 },
    firstLastName: { type: 'text', required: false, weight: 1 },
    secondLastName: { type: 'text', required: false, weight: 1 },
    fullName: { type: 'text', required: false, weight: 1 },
    mobile: { type: 'text', required: false, weight: 1 },
    relationship: { type: 'text', required: false, weight: 1 },
    address: { type: 'textarea', required: false, weight: 1 },
    score: { type: 'select', required: false, weight: 1 },
    comments: { type: 'textarea', required: false, weight: 1 }
  },

  // Sección 6: Documentos (DocumentsSection)
  documents: {
    dpiFrontal: { type: 'file', required: false, weight: 1 },
    dpiTrasero: { type: 'file', required: false, weight: 1 },
    fotoSolicitante: { type: 'file', required: false, weight: 1 },
    location: { type: 'object', required: false, weight: 1 }
  },

  // Sección 7: Consentimientos (ConsentSection)
  consent: {
    termsAccepted: { type: 'checkbox', required: true, weight: 1 },
    dataProcessingAccepted: { type: 'checkbox', required: true, weight: 1 },
    creditCheckAccepted: { type: 'checkbox', required: true, weight: 1 }
  }
};

/**
 * Valida si un campo está completado
 * @param field - Nombre del campo
 * @param value - Valor del campo
 * @param fieldConfig - Configuración del campo
 * @returns true si el campo está completado
 */
const isFieldCompleted = (field: string, value: any, fieldConfig: any): boolean => {
  if (!fieldConfig) return false;
  
  // VALIDACIÓN ESTRICTA: Solo contar campos que realmente tienen datos válidos del usuario
  
  // Si está vacío, nulo o undefined, no está completado
  if (!value || value === '' || value === null || value === undefined) {
    return false;
  }
  
  // Validaciones específicas por tipo
  switch (fieldConfig.type) {
    case 'email':
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    case 'text':
    case 'textarea':
      return value.toString().trim().length > 0;
    case 'number':
      const numValue = Number(value);
      return !isNaN(numValue) && numValue > 0;
    case 'date':
      return value && !isNaN(new Date(value).getTime()) && value !== '';
    case 'checkbox':
      return value === true;
    case 'select':
      return value && value !== '' && value !== '0';
    case 'file':
      return value && (value.status === 'complete' || value.url || value.name);
    case 'object':
      return value && Object.keys(value).length > 0;
    case 'array':
      return Array.isArray(value) && value.length > 0;
    default:
      return !!value;
  }
};

/**
 * Calcula el progreso basado en campos completados
 * @param formData - Datos del formulario
 * @returns Objeto con información del progreso
 */
export const calculateFieldProgress = (formData: any): {
  totalFields: number;
  completedFields: number;
  progressPercentage: number;
  sectionProgress: Record<string, { total: number; completed: number; percentage: number }>;
} => {
  let totalFields = 0;
  let completedFields = 0;
  const sectionProgress: Record<string, { total: number; completed: number; percentage: number }> = {};

  // Procesar cada sección
  Object.entries(formFieldsMap).forEach(([sectionName, fields]) => {
    let sectionTotal = 0;
    let sectionCompleted = 0;

    Object.entries(fields).forEach(([fieldName, fieldConfig]) => {
      if (sectionName === 'references') {
        // Para referencias, contar cada referencia individualmente
        const references = formData.references || [];
        references.forEach((reference: any, index: number) => {
          sectionTotal += fieldConfig.weight;
          if (isFieldCompleted(fieldName, reference[fieldName], fieldConfig)) {
            sectionCompleted += fieldConfig.weight;
          }
        });
      } else {
        // Para otros campos, contar normalmente
        sectionTotal += fieldConfig.weight;
        if (isFieldCompleted(fieldName, formData[fieldName], fieldConfig)) {
          sectionCompleted += fieldConfig.weight;
        }
      }
    });

    sectionProgress[sectionName] = {
      total: sectionTotal,
      completed: sectionCompleted,
      percentage: sectionTotal > 0 ? Math.round((sectionCompleted / sectionTotal) * 100) : 0
    };

    totalFields += sectionTotal;
    completedFields += sectionCompleted;
  });

  const progressPercentage = totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0;

  return {
    totalFields,
    completedFields,
    progressPercentage,
    sectionProgress
  };
};

/**
 * Obtiene el progreso para mostrar en las cards de aplicaciones
 * @param formData - Datos del formulario
 * @returns Porcentaje de progreso (0-100)
 */
export const getFieldProgressPercentage = (formData: any): number => {
  const progress = calculateFieldProgress(formData);
  return progress.progressPercentage;
};

/**
 * Obtiene información detallada del progreso por sección
 * @param formData - Datos del formulario
 * @returns Información detallada del progreso
 */
export const getDetailedProgress = (formData: any) => {
  const progress = calculateFieldProgress(formData);
  
  return {
    overall: {
      total: progress.totalFields,
      completed: progress.completedFields,
      percentage: progress.progressPercentage
    },
    sections: progress.sectionProgress,
    summary: Object.entries(progress.sectionProgress).map(([section, data]) => ({
      section,
      ...data,
      status: data.percentage === 100 ? 'complete' : data.percentage > 0 ? 'partial' : 'empty'
    }))
  };
};
