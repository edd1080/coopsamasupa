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
  searchValue: string
): T | null => {
  if (!searchValue) return null;

  // 1. EXACT MATCH - No transformation
  const exactMatch = catalog.find(item => item.value === searchValue);
  if (exactMatch) return exactMatch;
  
  // 2. CASE-INSENSITIVE EXACT MATCH
  const caseMatch = catalog.find(item => 
    item.value.toLowerCase() === searchValue.toLowerCase()
  );
  if (caseMatch) return caseMatch;
  
  // 3. NORMALIZED MATCH - Only as last resort
  const normalizedSearch = normalizeCatalogString(searchValue);
  const normalizedMatch = catalog.find(item => 
    normalizeCatalogString(item.value) === normalizedSearch
  );
  
  return normalizedMatch || null;
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