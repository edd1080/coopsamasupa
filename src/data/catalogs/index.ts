// Utility functions for catalog operations
export const normalizeCatalogString = (str: string): string => {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^a-z0-9\s]/g, "") // Remove special chars
    .trim();
};

export const findCatalogMatch = <T extends { id: string; value: string }>(
  catalog: T[],
  searchValue: any
): T | null => {
  if (!searchValue) return null;

  // Convert to string safely
  const stringValue = typeof searchValue === 'string' ? searchValue : String(searchValue);

  // 1. EXACT MATCH - No transformation
  const exactMatch = catalog.find(item => item.value === stringValue);
  if (exactMatch) return exactMatch;
  
  // 2. CASE-INSENSITIVE EXACT MATCH
  const caseMatch = catalog.find(item => 
    item.value.toLowerCase() === stringValue.toLowerCase()
  );
  if (caseMatch) return caseMatch;
  
  // 3. NORMALIZED MATCH - Only as last resort
  const normalizedSearch = normalizeCatalogString(stringValue);
  const normalizedMatch = catalog.find(item => 
    normalizeCatalogString(item.value) === normalizedSearch
  );
  
  return normalizedMatch || null;
};

// Función ultra-simple de mapeo de catálogos
export const mapToCatalog = <T extends { id: string; value: string }>(
  catalog: T[], 
  appValue: any, 
  fallbackId = "1"
): { id: string; value: string } => {
  console.log('🔍 Mapeo de catálogo:', { 
    catalogName: catalog[0]?.value || 'unknown',
    inputValue: appValue, 
    inputType: typeof appValue,
    catalogItems: catalog.map(c => ({ id: c.id, value: c.value }))
  });

  // Si no hay valor, devolver fallback con valor vacío
  if (appValue == null || appValue === "") {
    console.log('❌ Valor nulo o vacío, usando fallback');
    return { id: fallbackId, value: "" };
  }
  
  const stringValue = String(appValue).trim();
  
  // Buscar por ID exacto primero (más común en formularios)
  const byId = catalog.find(item => item.id === stringValue);
  if (byId) {
    console.log('✅ Encontrado por ID:', byId);
    return { id: byId.id, value: byId.value };
  }
  
  // Buscar por valor exacto
  const byValue = catalog.find(item => item.value === stringValue);
  if (byValue) {
    console.log('✅ Encontrado por valor:', byValue);
    return { id: byValue.id, value: byValue.value };
  }
  
  // Buscar case-insensitive
  const byValueCI = catalog.find(item => 
    item.value.toLowerCase() === stringValue.toLowerCase()
  );
  if (byValueCI) {
    console.log('✅ Encontrado case-insensitive:', byValueCI);
    return { id: byValueCI.id, value: byValueCI.value };
  }
  
  // Si no encuentra nada, mantener el valor original con fallback ID
  console.log('⚠️ No encontrado, manteniendo valor original:', stringValue);
  return { id: fallbackId, value: stringValue || "" };
};

// Re-export all catalogs
export { departments } from './departments';
export { municipalities, getMunicipalitiesByDepartment } from './municipalities';
export { genders } from './gender';
export { civilStatuses } from './civilStatus';
export { ethnicities } from './ethnicity';
export { educationLevels } from './educationLevel';
export { officialProfessions } from './professions';
export { officialOccupations } from './occupations';
export { agencies, findAgencyByName, getAgencyById } from './agencies';
export { productTypes, mapCreditTypeToProductType, getProductTypeById } from './productTypes';
export { 
  destinationGroups, 
  destinationsByGroup, 
  destinationCategories,
  getDestinationsByGroup,
  getCategoriesByDestination 
} from './destinationGroups';

// New Coopsama catalogs
export { housingTypes, getHousingTypeById } from './housingTypes';
export { residentialStabilities, getResidentialStabilityById } from './residentialStability';
export { workStabilities, getWorkStabilityById } from './workStability';
export { capitalAmortizations, getCapitalAmortizationById } from './capitalAmortization';
export { interestAmortizations, getInterestAmortizationById } from './interestAmortization';
export { memberTypes, getMemberTypeById } from './memberTypes';
export { requestTypes, getRequestTypeById } from './requestTypes';
export { fundsOrigins, getFundsOriginById } from './fundsOrigin';
export { projectTypes, getProjectTypeById } from './projectTypes';
export { paymentMethods, getPaymentMethodById } from './paymentMethods';
export { incomeSourceTypes, getIncomeSourceTypeById } from './incomeSourceTypes';
export { referenceTypes, getReferenceTypeById } from './referenceTypes';
export { referenceRatings, getReferenceRatingById } from './referenceRatings';
export { creditRecordTypes, getCreditRecordTypeById } from './creditRecordTypes';