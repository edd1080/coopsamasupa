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

  const normalizedSearch = normalizeCatalogString(searchValue);
  
  // Exact match first
  const exactMatch = catalog.find(item => 
    normalizeCatalogString(item.value) === normalizedSearch
  );
  
  if (exactMatch) return exactMatch;
  
  // Partial match
  const partialMatch = catalog.find(item => 
    normalizeCatalogString(item.value).includes(normalizedSearch) ||
    normalizedSearch.includes(normalizeCatalogString(item.value))
  );
  
  return partialMatch || null;
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
export { 
  destinationGroups, 
  destinationsByGroup, 
  destinationCategories,
  getDestinationsByGroup,
  getCategoriesByDestination 
} from './destinationGroups';