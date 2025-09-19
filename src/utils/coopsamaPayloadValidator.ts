import { CoopsamaPayload } from './fieldMapper';
import { 
  departments, 
  municipalities, 
  genders, 
  civilStatuses, 
  ethnicities, 
  educationLevels, 
  officialProfessions,
  officialOccupations,
  agencies,
  productTypes,
  destinationGroups,
  destinationsByGroup,
  destinationCategories,
  housingTypes,
  residentialStabilities,
  workStabilities,
  capitalAmortizations,
  interestAmortizations,
  memberTypes,
  requestTypes,
  fundsOrigins,
  projectTypes,
  paymentMethods,
  incomeSourceTypes,
  referenceTypes,
  referenceRatings,
  creditRecordTypes
} from '@/data/catalogs';

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  catalogIssues: string[];
  completeness: number;
  summary: {
    totalFields: number;
    completedFields: number;
    missingCritical: string[];
    invalidCatalogs: string[];
  };
}

interface CatalogValidation {
  field: string;
  value: string;
  catalog: string;
  isValid: boolean;
  suggestion?: string;
}

/**
 * Comprehensive validator for Coopsama payload
 * Validates structure, catalogs, required fields, and data integrity
 */
export function validateCoopsamaPayload(payload: CoopsamaPayload): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const catalogIssues: string[] = [];
  
  // Critical fields that must be present and valid
  const criticalFields = [
    'process.profile.personalDocument.firstName',
    'process.profile.personalDocument.firstLastName',
    'process.profile.personalDocument.documentNumber',
    'process.profile.personalDocument.gender.id',
    'process.profile.personalDocument.maritalStatus.id',
    'process.profile.personalDocument.ethnicity.id',
    'process.profile.personalDocument.birthDate',
    'process.profile.address.department.id',
    'process.profile.address.municipality.id',
    'process.profile.contact.cellphone',
    'process.credit.amountRequested',
    'process.credit.destination.group.id',
    'process.credit.destination.destination.id',
    'process.credit.destination.category.id'
  ];

  // Validate catalog fields - Access through data.process path
  const catalogValidations: CatalogValidation[] = [
    { field: 'gender', value: payload.data.process.profile.personalDocument.gender.id, catalog: 'genders', isValid: false },
    { field: 'maritalStatus', value: payload.data.process.profile.personalDocument.maritalStatus.id, catalog: 'civilStatuses', isValid: false },
    { field: 'ethnicity', value: payload.data.process.profile.personData.ethnicity.id, catalog: 'ethnicities', isValid: false },
    { field: 'educationLevel', value: payload.data.process.profile.personData.academicDegree.id, catalog: 'educationLevels', isValid: false },
    { field: 'profession', value: payload.data.process.profile.personalDocument.academicTitle.id, catalog: 'officialProfessions', isValid: false },
    { field: 'occupation', value: payload.data.process.profile.personalDocument.occupation.id, catalog: 'officialOccupations', isValid: false },
    { field: 'department', value: payload.data.process.profile.personalDocument.personalDocumentAddress.state.id, catalog: 'departments', isValid: false },
    { field: 'municipality', value: payload.data.process.profile.personalDocument.personalDocumentAddress.county.id, catalog: 'municipalities', isValid: false },
    { field: 'agency', value: payload.data.process.profile.productDetail.idAgency.toString(), catalog: 'agencies', isValid: false },
    { field: 'memberType', value: payload.data.process.profile.productDetail.partnerType.id, catalog: 'memberTypes', isValid: false },
    { field: 'productType', value: payload.data.process.profile.productDetail.idTypeProduct.toString(), catalog: 'productTypes', isValid: false },
    { field: 'destinationGroup', value: payload.data.process.profile.productDetail.fundsDestination.destinationCategory.id, catalog: 'destinationGroups', isValid: false },
    { field: 'destination', value: payload.data.process.profile.productDetail.fundsDestination.destinationCategory.id, catalog: 'destinationsByGroup', isValid: false },
    { field: 'category', value: payload.data.process.profile.productDetail.fundsDestination.destinationCategory.id, catalog: 'destinationCategories', isValid: false }
  ];

  // Validate each catalog field
  catalogValidations.forEach(validation => {
    const catalog = getCatalogByName(validation.catalog);
    if (!catalog) {
      catalogIssues.push(`Catalog ${validation.catalog} not found`);
      return;
    }

    const isValid = catalog.some((item: any) => item.id === validation.value);
    validation.isValid = isValid;

    if (!isValid && validation.value) {
      const suggestion = findClosestMatch(validation.value, catalog);
      catalogIssues.push(`Invalid ${validation.field}: "${validation.value}" not found in ${validation.catalog}${suggestion ? ` (did you mean "${suggestion.value}"?)` : ''}`);
    }
  });

  // Validate hierarchical relationships
  validateHierarchicalRelationships(payload, catalogIssues);

  // Check required fields
  const missingCritical: string[] = [];
  criticalFields.forEach(fieldPath => {
    const value = getNestedValue(payload, fieldPath);
    if (!value || value === '' || value === '0') {
      missingCritical.push(fieldPath);
    }
  });

  // Validate conditional fields (spouse info if married)
  if (payload.data.process.profile.personalDocument.maritalStatus.id === '2') { // CASADO
    const spouseFields = [
      'process.profile.spouse.firstName',
      'process.profile.spouse.firstLastName',
      'process.profile.spouse.documentNumber'
    ];
    
    spouseFields.forEach(fieldPath => {
      const value = getNestedValue(payload, fieldPath);
      if (!value) {
        warnings.push(`Spouse information required when marital status is "CASADO": ${fieldPath}`);
      }
    });
  }

  // Calculate completeness
  const totalFields = Object.keys(flattenObject(payload)).length;
  const completedFields = Object.values(flattenObject(payload)).filter(value => 
    value !== null && value !== undefined && value !== '' && value !== '0'
  ).length;
  
  const completeness = Math.round((completedFields / totalFields) * 100);

  // Validate arrays
  if (payload.data.process.profile.income && payload.data.process.profile.income.length === 0) {
    warnings.push('No income sources defined');
  }

  if (payload.data.process.profile.expense && payload.data.process.profile.expense.length === 0) {
    warnings.push('No expenses defined');
  }

  if (payload.data.process.profile.reference && payload.data.process.profile.reference.length < 2) {
    warnings.push('At least 2 references are recommended');
  }

  // Final validation
  const isValid = errors.length === 0 && catalogIssues.length === 0 && missingCritical.length === 0;

  return {
    isValid,
    errors,
    warnings,
    catalogIssues,
    completeness,
    summary: {
      totalFields,
      completedFields,
      missingCritical,
      invalidCatalogs: catalogValidations.filter(v => !v.isValid).map(v => v.field)
    }
  };
}

/**
 * Get catalog by name for validation
 */
function getCatalogByName(catalogName: string) {
  const catalogs: Record<string, any> = {
    'genders': genders,
    'civilStatuses': civilStatuses,
    'ethnicities': ethnicities,
    'educationLevels': educationLevels,
    'officialProfessions': officialProfessions,
    'officialOccupations': officialOccupations,
    'departments': departments,
    'municipalities': municipalities,
    'agencies': agencies,
    'memberTypes': memberTypes,
    'productTypes': productTypes,
    'destinationGroups': destinationGroups,
    'destinationsByGroup': destinationsByGroup,
    'destinationCategories': destinationCategories,
    'housingTypes': housingTypes,
    'residentialStabilities': residentialStabilities,
    'workStabilities': workStabilities,
    'capitalAmortizations': capitalAmortizations,
    'interestAmortizations': interestAmortizations,
    'requestTypes': requestTypes,
    'fundsOrigins': fundsOrigins,
    'projectTypes': projectTypes,
    'paymentMethods': paymentMethods,
    'incomeSourceTypes': incomeSourceTypes,
    'referenceTypes': referenceTypes,
    'referenceRatings': referenceRatings,
    'creditRecordTypes': creditRecordTypes
  };

  return catalogs[catalogName];
}

/**
 * Find closest match in catalog for suggestions
 */
function findClosestMatch(value: string, catalog: any[]): any | null {
  if (!value || !catalog) return null;
  
  const normalizedValue = value.toLowerCase();
  
  // First try exact match (case insensitive)
  let match = catalog.find(item => item.value.toLowerCase() === normalizedValue);
  if (match) return match;
  
  // Then try partial match
  match = catalog.find(item => 
    item.value.toLowerCase().includes(normalizedValue) || 
    normalizedValue.includes(item.value.toLowerCase())
  );
  
  return match || null;
}

/**
 * Validate hierarchical relationships between catalogs
 */
function validateHierarchicalRelationships(payload: CoopsamaPayload, issues: string[]) {
  // Validate Department -> Municipality relationship
  const departmentId = payload.data.process.profile.personalDocument.personalDocumentAddress.state.id;
  const municipalityId = payload.data.process.profile.personalDocument.personalDocumentAddress.county.id;
  
  if (departmentId && municipalityId) {
    const municipality = municipalities.find(m => m.id === municipalityId);
    if (municipality && municipality.departmentId !== departmentId) {
      issues.push(`Municipality ${municipalityId} does not belong to department ${departmentId}`);
    }
  }

  // Validate Group -> Destination -> Category relationship  
  // Note: In current payload structure, these are mapped to destinationCategory
  const categoryId = payload.data.process.profile.productDetail.fundsDestination.destinationCategory.id;
  const groupId = "1"; // Would need to be determined from form data
  const destinationId = "1"; // Would need to be determined from form data

  if (groupId && destinationId) {
    const destination = destinationsByGroup.find(d => d.id === destinationId);
    if (destination && destination.groupId !== groupId) {
      issues.push(`Destination ${destinationId} does not belong to group ${groupId}`);
    }
  }

  if (destinationId && categoryId) {
    const category = destinationCategories.find(c => c.id === categoryId);
    if (category && category.destinationId !== destinationId) {
      issues.push(`Category ${categoryId} does not belong to destination ${destinationId}`);
    }
  }
}

/**
 * Get nested object value by path
 */
function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : null;
  }, obj);
}

/**
 * Flatten nested object for field counting
 */
function flattenObject(obj: any, prefix = ''): Record<string, any> {
  let flattened: Record<string, any> = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = prefix ? `${prefix}.${key}` : key;
      
      if (obj[key] !== null && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
        Object.assign(flattened, flattenObject(obj[key], newKey));
      } else {
        flattened[newKey] = obj[key];
      }
    }
  }

  return flattened;
}

/**
 * Debug function to log payload validation results
 */
export function debugCoopsamaPayload(payload: CoopsamaPayload, formData: any) {
  console.group('🔍 COOPSAMA PAYLOAD VALIDATION');
  
  const validation = validateCoopsamaPayload(payload);
  
  console.log('📊 Summary:', validation.summary);
  console.log('✅ Valid:', validation.isValid);
  console.log('📈 Completeness:', `${validation.completeness}%`);
  
  if (validation.errors.length > 0) {
    console.error('❌ Errors:', validation.errors);
  }
  
  if (validation.catalogIssues.length > 0) {
    console.warn('📚 Catalog Issues:', validation.catalogIssues);
  }
  
  if (validation.warnings.length > 0) {
    console.warn('⚠️ Warnings:', validation.warnings);
  }
  
  console.log('🗂️ Original Form Data:', formData);
  console.log('📦 Generated Payload:', payload);
  
  console.groupEnd();
  
  return validation;
}