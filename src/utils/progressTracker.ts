/**
 * Sistema robusto de seguimiento de progreso basado en campos completados
 * Bug-272: Calcular progreso como (Campos Completados / Total de Campos) × 100
 */

import { calculateFieldProgress, getFieldProgressPercentage } from './fieldProgressTracker';

// Mapeo de campos a secciones del formulario
export const fieldToSectionMap: Record<string, { section: string; step: number; weight: number }> = {
  // Sección 1: Identificación y Contacto (step 0-1)
  'firstName': { section: 'identification', step: 0, weight: 1 },
  'lastName': { section: 'identification', step: 0, weight: 1 },
  'fullName': { section: 'identification', step: 0, weight: 1 },
  'dpi': { section: 'identification', step: 0, weight: 1 },
  'nit': { section: 'identification', step: 0, weight: 1 },
  'cua': { section: 'identification', step: 0, weight: 1 },
  'dpiExtendedIn': { section: 'identification', step: 0, weight: 1 },
  'mobilePhone': { section: 'identification', step: 1, weight: 1 },
  'email': { section: 'identification', step: 1, weight: 1 },
  'address': { section: 'identification', step: 1, weight: 1 },
  'agency': { section: 'identification', step: 0, weight: 1 },
  'residenceDepartment': { section: 'identification', step: 1, weight: 1 },
  'residenceMunicipality': { section: 'identification', step: 1, weight: 1 },

  // Sección 2: Información del Crédito (step 1)
  'requestedAmount': { section: 'credit', step: 1, weight: 1 },
  'loanAmount': { section: 'credit', step: 1, weight: 1 },
  'montoSolicitado': { section: 'credit', step: 1, weight: 1 },
  'termMonths': { section: 'credit', step: 1, weight: 1 },
  'applicationType': { section: 'credit', step: 1, weight: 1 },
  'creditPurpose': { section: 'credit', step: 1, weight: 1 },
  'investmentPlaceDepartment': { section: 'credit', step: 1, weight: 1 },
  'investmentPlaceMunicipality': { section: 'credit', step: 1, weight: 1 },

  // Sección 3: Finanzas y Patrimonio (step 2)
  'ingresoPrincipal': { section: 'finances', step: 2, weight: 1 },
  'rentExpense': { section: 'finances', step: 2, weight: 1 },
  'foodExpense': { section: 'finances', step: 2, weight: 1 },
  'transportExpense': { section: 'finances', step: 2, weight: 1 },
  'servicesExpense': { section: 'finances', step: 2, weight: 1 },
  'educationExpense': { section: 'finances', step: 2, weight: 1 },
  'healthExpense': { section: 'finances', step: 2, weight: 1 },
  'otherExpense': { section: 'finances', step: 2, weight: 1 },
  'collateral': { section: 'finances', step: 2, weight: 1 },

  // Sección 4: Referencias Personales (step 3)
  'references': { section: 'references', step: 3, weight: 1 },

  // Sección 5: Documentos (step 4)
  'documents': { section: 'documents', step: 4, weight: 1 },
  'dpiFrontal': { section: 'documents', step: 4, weight: 1 },
  'dpiTrasero': { section: 'documents', step: 4, weight: 1 },
  'fotoSolicitante': { section: 'documents', step: 4, weight: 1 },
  'location': { section: 'documents', step: 4, weight: 1 },

  // Sección 6: Revisión Final (step 5)
  'termsAccepted': { section: 'review', step: 5, weight: 1 },
  'dataProcessingAccepted': { section: 'review', step: 5, weight: 1 },
  'creditCheckAccepted': { section: 'review', step: 5, weight: 1 }
};

// Configuración de secciones del formulario
export const formSections = [
  { id: 'identification', name: 'Identificación y Contacto', step: 0, maxStep: 1 },
  { id: 'credit', name: 'Información del Crédito', step: 1, maxStep: 2 },
  { id: 'finances', name: 'Finanzas y Patrimonio', step: 2, maxStep: 3 },
  { id: 'references', name: 'Referencias Personales', step: 3, maxStep: 4 },
  { id: 'documents', name: 'Documentos', step: 4, maxStep: 5 },
  { id: 'review', name: 'Revisión Final', step: 5, maxStep: 6 }
];

/**
 * Calcula el progreso basado en el último campo editado
 * @param lastEditedField - El último campo que fue editado
 * @param formData - Los datos actuales del formulario
 * @returns Objeto con información del progreso
 */
export const calculateProgressFromLastEdit = (
  lastEditedField: string, 
  formData: any
): { progressStep: number; progressPercentage: number; currentSection: string } => {
  
  // Obtener información del campo editado
  const fieldInfo = fieldToSectionMap[lastEditedField];
  
  if (!fieldInfo) {
    // Si no encontramos el campo, usar progreso mínimo
    return {
      progressStep: 1,
      progressPercentage: Math.round((1 / 6) * 100),
      currentSection: 'identification'
    };
  }

  // Calcular el progreso basado en la sección del último campo editado
  const progressStep = fieldInfo.step + 1; // +1 porque los steps van de 0-5 pero progress_step va de 1-6
  const progressPercentage = Math.round((progressStep / 6) * 100);
  
  return {
    progressStep,
    progressPercentage,
    currentSection: fieldInfo.section
  };
};

/**
 * Calcula el progreso basado en el análisis de todos los campos llenos
 * @param formData - Los datos actuales del formulario
 * @returns Objeto con información del progreso
 */
export const calculateProgressFromDataAnalysis = (formData: any): { progressStep: number; progressPercentage: number; currentSection: string } => {
  
  // Analizar qué secciones tienen datos
  const sectionProgress: Record<string, boolean> = {};
  
  // Verificar sección de identificación
  sectionProgress.identification = !!(
    formData.firstName || formData.lastName || formData.fullName || 
    formData.dpi || formData.mobilePhone || formData.email
  );
  
  // Verificar sección de crédito
  sectionProgress.credit = !!(
    formData.requestedAmount || formData.loanAmount || formData.montoSolicitado ||
    formData.termMonths || formData.applicationType
  );
  
  // Verificar sección de finanzas
  sectionProgress.finances = !!(
    formData.ingresoPrincipal || formData.rentExpense || formData.foodExpense ||
    formData.transportExpense || formData.servicesExpense || formData.collateral
  );
  
  // Verificar sección de referencias
  sectionProgress.references = !!(formData.references && formData.references.length > 0);
  
  // Verificar sección de documentos
  sectionProgress.documents = !!(
    formData.documents || formData.dpiFrontal || formData.dpiTrasero || 
    formData.fotoSolicitante || formData.location
  );
  
  // Verificar sección de revisión
  sectionProgress.review = !!(
    formData.termsAccepted || formData.dataProcessingAccepted || formData.creditCheckAccepted
  );
  
  // Encontrar la última sección con datos
  let lastCompletedSection = 'identification';
  let progressStep = 1;
  
  for (const section of formSections) {
    if (sectionProgress[section.id]) {
      lastCompletedSection = section.id;
      progressStep = section.step + 1;
    }
  }
  
  const progressPercentage = Math.round((progressStep / 6) * 100);
  
  return {
    progressStep,
    progressPercentage,
    currentSection: lastCompletedSection
  };
};

/**
 * Función principal para calcular el progreso de manera robusta
 * @param lastEditedField - El último campo editado (opcional, para logs)
 * @param formData - Los datos actuales del formulario
 * @returns Objeto con información del progreso
 */
export const calculateRobustProgress = (
  lastEditedField?: string, 
  formData?: any
): { progressStep: number; progressPercentage: number; currentSection: string } => {
  
  if (!formData) {
    return {
      progressStep: 1,
      progressPercentage: 0,
      currentSection: 'identification'
    };
  }

  // Calcular progreso basado en campos completados
  const fieldProgress = calculateFieldProgress(formData);
  
  // Determinar la sección actual basada en el progreso
  let currentSection = 'identification';
  if (fieldProgress.progressPercentage >= 100) {
    currentSection = 'review';
  } else if (fieldProgress.progressPercentage >= 83) {
    currentSection = 'documents';
  } else if (fieldProgress.progressPercentage >= 67) {
    currentSection = 'references';
  } else if (fieldProgress.progressPercentage >= 50) {
    currentSection = 'finances';
  } else if (fieldProgress.progressPercentage >= 33) {
    currentSection = 'credit';
  } else if (fieldProgress.progressPercentage >= 17) {
    currentSection = 'identification';
  }
  
  // Convertir porcentaje a progressStep (1-6)
  const progressStep = Math.max(1, Math.min(6, Math.ceil(fieldProgress.progressPercentage / 16.67)));
  
  return {
    progressStep,
    progressPercentage: fieldProgress.progressPercentage,
    currentSection
  };
};

/**
 * Obtiene el nombre de la sección actual para mostrar al usuario
 * @param sectionId - ID de la sección
 * @returns Nombre legible de la sección
 */
export const getSectionDisplayName = (sectionId: string): string => {
  const section = formSections.find(s => s.id === sectionId);
  return section ? section.name : 'Identificación y Contacto';
};

/**
 * Obtiene el progreso para mostrar en las cards de aplicaciones
 * @param progressStep - El progress_step de la base de datos (para compatibilidad)
 * @param formData - Los datos del formulario (opcional, para cálculo preciso)
 * @returns Porcentaje de progreso (0-100)
 */
export const getCardProgressPercentage = (progressStep: number, formData?: any): number => {
  // Si tenemos formData, usar el cálculo preciso por campos
  if (formData) {
    return getFieldProgressPercentage(formData);
  }
  
  // Para aplicaciones enviadas sin draft_data, usar progressStep como aproximación
  // Esto es mejor que mostrar 0% para aplicaciones completadas
  const clampedStep = Math.max(1, Math.min(6, progressStep));
  return Math.round((clampedStep / 6) * 100);
};
