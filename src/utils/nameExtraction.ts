
/**
 * Extracts the first name from a full name string
 * @param fullName - The complete name string
 * @returns The first name only
 */
export const getFirstName = (fullName: string): string => {
  if (!fullName || typeof fullName !== 'string') {
    return '';
  }

  const nameParts = fullName.trim().split(/\s+/);
  return nameParts.length > 0 ? nameParts[0] : '';
};

/**
 * Extracts detailed information from application data
 * @param application - The application object
 * @returns Extracted detailed information
 */
export const extractApplicationDetails = (application: any) => {
  const draftData = application?.draft_data || {};
  
  return {
    // Personal information
    personalInfo: {
      fullName: draftData.personalInfo?.nombres || application?.client_name || '',
      dpi: draftData.personalInfo?.dpi || '',
      phone: draftData.personalInfo?.telefono || '',
      email: draftData.personalInfo?.email || '',
      birthDate: draftData.personalInfo?.fechaNacimiento || '',
      civilStatus: draftData.personalInfo?.estadoCivil || '',
    },
    
    // Financial information
    financialInfo: {
      monthlyIncome: draftData.financialInfo?.ingresosMensuales || 0,
      monthlyExpenses: draftData.financialInfo?.gastosMensuales || 0,
      assets: draftData.financialInfo?.patrimonio || 0,
      liabilities: draftData.financialInfo?.pasivos || 0,
    },
    
    // Business information
    businessInfo: {
      businessName: draftData.businessInfo?.nombreNegocio || '',
      businessType: draftData.businessInfo?.tipoNegocio || '',
      businessAddress: draftData.businessInfo?.direccionNegocio || '',
      yearsInBusiness: draftData.businessInfo?.anosEnNegocio || 0,
    },
    
    // Application metadata
    metadata: {
      agentId: application?.agent_id || '',
      productType: application?.product || '',
      requestedAmount: application?.amount_requested || 0,
      currentStage: application?.current_stage || '',
      progressStep: application?.progress_step || 0,
      lastStep: application?.last_step || 0,
      lastSubStep: application?.last_sub_step || 0,
    }
  };
};
