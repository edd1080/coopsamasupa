/**
 * Calcula el progreso basado en la lógica de ReviewSection.tsx
 * Esta función replica exactamente el cálculo que se muestra en la sección de revisión
 * @param formData - Los datos del formulario
 * @returns Porcentaje de progreso (0-100)
 */
export const getReviewSectionProgress = (formData: any): number => {
  if (!formData) return 0;
  
  // Contar campos que tienen valores (no vacíos, null o undefined)
  const allFields = Object.keys(formData).filter(key => 
    formData[key] && 
    formData[key] !== '' && 
    formData[key] !== null && 
    formData[key] !== undefined
  );
  
  // Estimar total basado en las secciones principales del formulario
  const estimatedTotalFields = 50;
  
  const completionPercentage = Math.min((allFields.length / estimatedTotalFields) * 100, 100);
  
  return Math.round(completionPercentage);
};

/**
 * Obtiene información detallada del progreso basado en ReviewSection
 * @param formData - Los datos del formulario
 * @returns Objeto con información detallada del progreso
 */
export const getReviewSectionProgressDetails = (formData: any): {
  percentage: number;
  completed: number;
  total: number;
} => {
  if (!formData) {
    return {
      percentage: 0,
      completed: 0,
      total: 50
    };
  }
  
  // Contar campos que tienen valores (no vacíos, null o undefined)
  const allFields = Object.keys(formData).filter(key => 
    formData[key] && 
    formData[key] !== '' && 
    formData[key] !== null && 
    formData[key] !== undefined
  );
  
  // Estimar total basado en las secciones principales del formulario
  const estimatedTotalFields = 50;
  
  const completionPercentage = Math.min((allFields.length / estimatedTotalFields) * 100, 100);
  
  return {
    percentage: Math.round(completionPercentage),
    completed: allFields.length,
    total: estimatedTotalFields
  };
};
