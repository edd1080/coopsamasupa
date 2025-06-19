
// Mapeo de campos específicos a su ubicación exacta en el formulario
export const fieldNavigationMap = {
  // Identification section fields
  'fullName': { section: 'identification', step: 0, field: 'firstName' },
  'firstName': { section: 'identification', step: 0, field: 'firstName' },
  'lastName': { section: 'identification', step: 0, field: 'lastName' },
  'dpi': { section: 'identification', step: 0, field: 'dpi' },
  'nit': { section: 'identification', step: 0, field: 'nit' },
  'cua': { section: 'identification', step: 0, field: 'cua' },
  'cif': { section: 'identification', step: 0, field: 'cif' },
  'dpiExtendedIn': { section: 'identification', step: 0, field: 'dpiExtendedIn' },
  'mobilePhone': { section: 'identification', step: 1, field: 'mobilePhone' },
  'email': { section: 'identification', step: 1, field: 'email' },
  'address': { section: 'identification', step: 1, field: 'address' },
  'agency': { section: 'identification', step: 2, field: 'agency' },
  
  // Financial section fields
  'ingresoPrincipal': { section: 'finances', step: 0, field: 'ingresoPrincipal' },
  'rentExpense': { section: 'finances', step: 0, field: 'rentExpense' },
  'foodExpense': { section: 'finances', step: 0, field: 'foodExpense' },
  'transportExpense': { section: 'finances', step: 0, field: 'transportExpense' },
  'servicesExpense': { section: 'finances', step: 0, field: 'servicesExpense' },
  'educationExpense': { section: 'finances', step: 0, field: 'educationExpense' },
  'healthExpense': { section: 'finances', step: 0, field: 'healthExpense' },
  'otherExpense': { section: 'finances', step: 0, field: 'otherExpense' },
  
  // Business section fields
  'occupation': { section: 'business', step: 0, field: 'occupation' },
  'companyName': { section: 'business', step: 0, field: 'companyName' },
  'businessName': { section: 'business', step: 0, field: 'businessName' },
  'experienceYears': { section: 'business', step: 0, field: 'experienceYears' },
  
  // Credit info fields
  'requestedAmount': { section: 'identification', step: 2, field: 'requestedAmount' },
  'termMonths': { section: 'identification', step: 2, field: 'termMonths' },
  'creditType': { section: 'identification', step: 2, field: 'creditType' },
  'creditPurpose': { section: 'identification', step: 2, field: 'creditPurpose' }
};

export const getFieldNavigation = (fieldName: string) => {
  return fieldNavigationMap[fieldName as keyof typeof fieldNavigationMap] || null;
};
