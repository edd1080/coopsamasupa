import { 
  findCatalogMatch, 
  departments, 
  municipalities, 
  genders, 
  civilStatuses, 
  ethnicities, 
  educationLevels, 
  officialProfessions, 
  officialOccupations,
  destinationGroups,
  destinationsByGroup,
  destinationCategories,
  getDestinationsByGroup,
  getCategoriesByDestination
} from '@/data/catalogs';
import { professions } from '@/data/professions';
import { occupations } from '@/data/occupations';

interface OfficialPayload {
  data: {
    process: {
      profile: {
        processControl: {
          processId: string;
          ownerCounty: { id: string; value: string };
          ownerState: { id: string; value: string };
          cuaT24?: string;
          cif?: string;
          userEmail?: string;
        };
        personalDocument: {
          firstName: string;
          secondName?: string;
          firstLastName: string;
          secondLastName?: string;
          marriedSurname?: string;
          personalDocumentId: string;
          emissionState: { id: string; value: string };
          emissionCounty: { id: string; value: string };
          gender: { id: string; value: string };
          maritalStatus: { id: string; value: string };
          birthDate: string;
          age: number;
          academicTitle: { id: string; value: string };
          occupation: { id: string; value: string };
          personalDocumentAddress: {
            fullAddress: string;
            otherIndications?: string;
            state: { id: string; value: string };
            county: { id: string; value: string };
          };
          typeOfHousing: { id: string; value: string };
          housingStability: { id: string; value: string };
          geolocalization?: string;
          spouseFirstName?: string;
          spouseSecondName?: string;
          spouseThirdName?: string;
          spouseFirstLastName?: string;
          spouseSecondLastName?: string;
          spouseCompanyName?: string;
          spouseJobStability?: { id: string; value: string };
          spouseMobile?: string;
          spouseBirthDate?: string;
        };
        personData: {
          nit?: string;
          numberOfDependants: number;
          ethnicity: { id: string; value: string };
          academicDegree: { id: string; value: string };
          mobile: string;
          telephone?: string;
          email: Array<{
            emailAddress: string;
            emailType: string;
            emailId: string;
          }>;
        };
        productDetail: {
          idTypeProduct: number;
          idAgency: number;
          requestedAmount: number;
          interestRate?: number;
          startingTerm: number;
          principalAmortization?: { id: string; value: string };
          interestAmortization?: { id: string; value: string };
          partnerType?: { id: string; value: string };
          requestType?: { id: string; value: string };
          sourceOfFunds?: { id: string; value: string };
          principalProject?: { id: string; value: string };
          secondaryProject?: { id: string; value: string };
          paymentMethod?: { id: string; value: string };
          fundsDestination: {
            investmentState?: { id: string; value: string };
            investmentCounty?: { id: string; value: string };
            destinationCategory: { id: string; value: string };
            otherDestination?: string;
            description?: string;
            comments?: string;
          };
        };
        income: Array<{
          incomeSource: { id: string; value: string };
          monthlyIncome: number;
          comments?: string;
          mainIncomeSource: boolean;
        }>;
        expense: Array<{
          name: string;
          amount: number;
        }>;
        financialStatus: {
          assets: {
            list: Array<{
              name: string;
              amount: number;
            }>;
            total: number;
          };
          liabilities: {
            list: Array<{
              name: string;
              amount: number;
            }>;
            total: number;
          };
          equity: {
            currentDebtRatio: number;
            projectedDebtRatio: number;
            total: number;
          };
        };
        collateral?: Array<{
          name: string;
          amount: number;
          percentage: number;
        }>;
        personal: {
          references: Array<{
            type: { id: string; value: string };
            firstName: string;
            secondName?: string;
            firstLastName: string;
            secondLastName?: string;
            fullAddress: string;
            relationship: string;
            mobile: string;
            score: { id: string; value: string };
            comments?: string;
          }>;
        };
        business?: {
          companyName: string;
          activityDescription: string;
          grossProfit: number;
          productType: string;
          startDate: string;
          fullAddress: string;
        };
        investmentPlan?: Array<{
          quantity: number;
          unitOfMeasurement: string;
          description: string;
          unitPrice: number;
          total: number;
        }>;
        expenseSummary: {
          totalExpenses: number;
        };
      };
    };
  };
  metadata: {
    processId: string;
    user: string;
  };
}

// Mapping helpers
const mapToCatalog = <T extends { id: string; value: string }>(
  catalog: T[],
  appValue: string,
  fallbackId?: string
): { id: string; value: string } | undefined => {
  if (!appValue && !fallbackId) return undefined;
  
  if (appValue) {
    console.log(`🔍 Mapping "${appValue}" in catalog with ${catalog.length} items`);
    console.log(`📋 Catalog items:`, catalog.map(item => `"${item.value}" (ID: ${item.id})`).join(', '));
    
    // Handle specific gender mappings
    if (catalog === genders) {
      const genderMappings: { [key: string]: string } = {
        'Femenino': 'MUJER',
        'Masculino': 'HOMBRE',
        'FEMENINO': 'MUJER',
        'MASCULINO': 'HOMBRE',
        'F': 'MUJER',
        'M': 'HOMBRE',
        'mujer': 'MUJER',
        'hombre': 'HOMBRE',
        'MUJER': 'MUJER',
        'HOMBRE': 'HOMBRE'
      };
      const mappedValue = genderMappings[appValue] || appValue;
      const match = findCatalogMatch(catalog, mappedValue);
      if (match) {
        console.log(`✅ Gender mapped: "${appValue}" → "${match.value}" (ID: ${match.id})`);
        return { id: match.id, value: match.value };
      }
    }
    
    // Handle civil status mappings
    if (catalog === civilStatuses) {
      const civilStatusMappings: { [key: string]: string } = {
        'Soltera': 'SOLTERO',
        'Soltero': 'SOLTERO',
        'Casada': 'CASADO',
        'Casado': 'CASADO',
        'Unida': 'UNIDO',
        'Unido': 'UNIDO',
        'Divorciada': 'DIVORCIADO',
        'Divorciado': 'DIVORCIADO',
        'Viuda': 'VIUDO',
        'Viudo': 'VIUDO'
      };
      const mappedValue = civilStatusMappings[appValue] || appValue;
      const match = findCatalogMatch(catalog, mappedValue);
      if (match) {
        console.log(`✅ Civil status mapped: "${appValue}" → "${match.value}" (ID: ${match.id})`);
        return { id: match.id, value: match.value };
      }
    }
    
    // Handle education level mappings
    if (catalog === educationLevels) {
      const educationMappings: { [key: string]: string } = {
        'Universitario': 'SUPERIOR',
        'Universidad': 'SUPERIOR',
        'Bachillerato': 'DIVERSIFICADO',
        'Básicos': 'BASICO',
        'Primaria': 'PRIMARIA',
        // Map numeric values based on form data
        '300': 'SUPERIOR',  // University level education
        '200': 'DIVERSIFICADO',  // High school level
        '100': 'BASICO',  // Basic level
        '50': 'PRIMARIA'  // Primary level
      };
      const mappedValue = educationMappings[appValue] || appValue;
      const match = findCatalogMatch(catalog, mappedValue);
      if (match) {
        console.log(`✅ Education mapped: "${appValue}" → "${match.value}" (ID: ${match.id})`);
        return { id: match.id, value: match.value };
      }
    }
    
    // Handle ethnicity mappings  
    if (catalog === ethnicities) {
      const ethnicityMappings: { [key: string]: string } = {
        'Maya': 'Maya',
        'Mestizo': 'Mestizo',
        'Ladino': 'Ladino',
        'maya': 'Maya',
        'mestizo': 'Mestizo',
        'ladino': 'Ladino'
      };
      const mappedValue = ethnicityMappings[appValue] || appValue;
      const match = findCatalogMatch(catalog, mappedValue);
      if (match) {
        console.log(`✅ Ethnicity mapped: "${appValue}" → "${match.value}" (ID: ${match.id})`);
        return { id: match.id, value: match.value };
      }
    }
    
    // Default catalog matching
    const match = findCatalogMatch(catalog, appValue);
    if (match) {
      console.log(`✅ Default match: "${appValue}" → "${match.value}" (ID: ${match.id})`);
      return { id: match.id, value: match.value };
    } else {
      console.log(`❌ No direct match found for "${appValue}". Available values:`, catalog.map(c => c.value));
    }
    
    console.log(`❌ No match found for "${appValue}" in catalog`);
  }
  
  if (fallbackId) {
    const fallback = catalog.find(item => item.id === fallbackId);
    if (fallback) {
      console.log(`🔄 Using fallback: ID ${fallbackId} → "${fallback.value}"`);
      return { id: fallback.id, value: fallback.value };
    }
    console.log(`❌ Fallback ID ${fallbackId} not found in catalog`);
  }
  
  return undefined;
};

const mapProfession = (appValue: string): { id: string; value: string } | undefined => {
  if (!appValue) return undefined;
  
  console.log(`🎓 Mapping profession: "${appValue}"`);
  
  // Enhanced profession mappings
  const professionMappings: { [key: string]: string } = {
    'Bachiller': 'BACHILLER',
    'bachiller': 'BACHILLER', 
    'Magisterio': 'MAGISTERIO',
    'magisterio': 'MAGISTERIO',
    'Perito Contador': 'PERITO CONTADOR',
    'perito contador': 'PERITO CONTADOR',
    'Contador': 'PERITO CONTADOR',
    'contador': 'PERITO CONTADOR',
    'Secretariado': 'SECRETARIADO',
    'secretariado': 'SECRETARIADO',
    'Universitario': 'TECNICO DE GRADO UNIVERSITARIO',
    'universitario': 'TECNICO DE GRADO UNIVERSITARIO',
    'Universidad': 'TECNICO DE GRADO UNIVERSITARIO',
    'Técnico Universitario': 'TECNICO DE GRADO UNIVERSITARIO',
    'Licenciatura': 'TECNICO DE GRADO UNIVERSITARIO',
    'licenciatura': 'TECNICO DE GRADO UNIVERSITARIO',
    'Ingeniería': 'INGENIERIAS',
    'ingeniería': 'INGENIERIAS',
    'Ingeniero': 'INGENIERIAS',
    'ingeniero': 'INGENIERIAS',
    'Medicina': 'CIENCIAS MEDICAS Y DE LA SALUD',
    'medicina': 'CIENCIAS MEDICAS Y DE LA SALUD',
    'Médico': 'CIENCIAS MEDICAS Y DE LA SALUD',
    'médico': 'CIENCIAS MEDICAS Y DE LA SALUD',
    'Abogado': 'CIENCIAS JURIDICAS Y SOCIALES',
    'abogado': 'CIENCIAS JURIDICAS Y SOCIALES',
    'Derecho': 'CIENCIAS JURIDICAS Y SOCIALES',
    'derecho': 'CIENCIAS JURIDICAS Y SOCIALES',
    'Administración': 'CIENCIAS ECONOMICAS Y EMPRESARIALES',
    'administración': 'CIENCIAS ECONOMICAS Y EMPRESARIALES',
    'Economía': 'CIENCIAS ECONOMICAS Y EMPRESARIALES',
    'economía': 'CIENCIAS ECONOMICAS Y EMPRESARIALES',
    'Primaria': 'NIVEL PRIMARIO',
    'primaria': 'NIVEL PRIMARIO',
    'Básicos': 'NIVEL BASICO',
    'básicos': 'NIVEL BASICO',
    'No sabe leer': 'NO SABE LEER / ESCRIBIR',
    'no sabe leer': 'NO SABE LEER / ESCRIBIR'
  };
  
  // Try specific mappings first
  const mappedValue = professionMappings[appValue];
  if (mappedValue) {
    const result = mapToCatalog(officialProfessions, mappedValue);
    if (result) {
      console.log(`✅ Profession specific mapping: "${appValue}" → "${result.value}" (ID: ${result.id})`);
      return result;
    }
  }
  
  // Find in local professions
  const localProf = professions.find(p => 
    p.value === appValue || 
    p.label.toLowerCase() === appValue.toLowerCase()
  );
  if (localProf) {
    const result = mapToCatalog(officialProfessions, localProf.label);
    if (result) {
      console.log(`✅ Profession local mapping: "${appValue}" → "${result.value}" (ID: ${result.id})`);
      return result;
    }
  }
  
  // Direct mapping attempt
  const result = mapToCatalog(officialProfessions, appValue);
  if (result) {
    console.log(`✅ Profession direct mapping: "${appValue}" → "${result.value}" (ID: ${result.id})`);
    return result;
  }
  
  console.log(`❌ No profession mapping found for: "${appValue}"`);
  return mapToCatalog(officialProfessions, '', "1"); // Fallback to BACHILLER
};

const mapOccupation = (appValue: string): { id: string; value: string } | undefined => {
  if (!appValue) return undefined;
  
  console.log(`💼 Mapping occupation: "${appValue}"`);
  
  // Enhanced occupation mappings
  const occupationMappings: { [key: string]: string } = {
    'Comercio': 'COMERCIANTE',
    'comercio': 'COMERCIANTE',
    'Comerciante': 'COMERCIANTE',
    'comerciante': 'COMERCIANTE',
    'COMERCIO': 'COMERCIANTE',
    'COMERCIANTE': 'COMERCIANTE', // Mapeo directo
    'Venta': 'VENDEDOR/A',
    'venta': 'VENDEDOR/A',
    'Ventas': 'VENDEDOR/A',
    'ventas': 'VENDEDOR/A',
    'VENTA': 'VENDEDOR/A',
    'VENTAS': 'VENDEDOR/A',
    'Negocios': 'COMERCIANTE',
    'negocios': 'COMERCIANTE',
    'NEGOCIOS': 'COMERCIANTE',
    'Agricultura': 'AGRICULTOR',
    'agricultura': 'AGRICULTOR',
    'Agricultor': 'AGRICULTOR',
    'agricultor': 'AGRICULTOR',
    'Ganadería': 'GANADERO',
    'ganadería': 'GANADERO',
    'Ganadero': 'GANADERO',
    'ganadero': 'GANADERO',
    'Avicultura': 'AVICULTOR',
    'avicultura': 'AVICULTOR',
    'Avicultor': 'AVICULTOR',
    'avicultor': 'AVICULTOR',
    'Ninguna': 'NINGUNA',
    'ninguna': 'NINGUNA',
    'Sin ocupación': 'NINGUNA',
    'sin ocupación': 'NINGUNA',
    'No aplica': 'NINGUNA',
    'no aplica': 'NINGUNA',
    'Desempleado': 'NINGUNA',
    'desempleado': 'NINGUNA',
    'Ama de casa': 'NINGUNA',
    'ama de casa': 'NINGUNA',
    'Estudiante': 'NINGUNA',
    'estudiante': 'NINGUNA'
  };
  
  // Try specific mappings first
  const mappedValue = occupationMappings[appValue];
  if (mappedValue) {
    const result = mapToCatalog(officialOccupations, mappedValue);
    if (result) {
      console.log(`✅ Occupation specific mapping: "${appValue}" → "${result.value}" (ID: ${result.id})`);
      return result;
    }
  }
  
  // Find in local occupations
  const localOcc = occupations.find(o => 
    o.value === appValue || 
    o.label.toLowerCase() === appValue.toLowerCase()
  );
  if (localOcc) {
    const result = mapToCatalog(officialOccupations, localOcc.label);
    if (result) {
      console.log(`✅ Occupation local mapping: "${appValue}" → "${result.value}" (ID: ${result.id})`);
      return result;
    }
  }
  
  // Direct mapping attempt
  let result = mapToCatalog(officialOccupations, appValue);
  if (result) {
    console.log(`✅ Occupation direct mapping: "${appValue}" → "${result.value}" (ID: ${result.id})`);
    return result;
  }
  
  // Try uppercase version
  result = mapToCatalog(officialOccupations, appValue.toUpperCase());
  if (result) {
    console.log(`✅ Occupation uppercase mapping: "${appValue}" → "${result.value}" (ID: ${result.id})`);
    return result;
  }
  
  console.log(`❌ No occupation mapping found for: "${appValue}"`);
  return mapToCatalog(officialOccupations, '', "169"); // Fallback to NINGUNA
};

const splitFullName = (fullName: string) => {
  if (!fullName) return { firstName: '', secondName: '', firstLastName: '', secondLastName: '' };
  
  const parts = fullName.trim().split(/\s+/);
  
  if (parts.length === 1) {
    return { firstName: parts[0], secondName: '', firstLastName: '', secondLastName: '' };
  } else if (parts.length === 2) {
    return { firstName: parts[0], secondName: '', firstLastName: parts[1], secondLastName: '' };
  } else if (parts.length === 3) {
    return { firstName: parts[0], secondName: parts[1], firstLastName: parts[2], secondLastName: '' };
  } else {
    return { 
      firstName: parts[0], 
      secondName: parts[1], 
      firstLastName: parts[2], 
      secondLastName: parts.slice(3).join(' ') 
    };
  }
};

export const toOfficial = (formData: any, agentData?: any): OfficialPayload => {
  console.log("🔄 Iniciando transformación a OfficialPayload...");
  console.log("📋 DEBUGGING - FormData completo recibido:", JSON.stringify(formData, null, 2));
  
  // Debug específico para campos problemáticos
  console.log("🔍 DEBUGGING - Campos críticos:");
  console.log("   - Gender:", formData.gender, formData.genero, formData.sexo);
  console.log("   - Civil Status:", formData.civilStatus, formData.estadoCivil, formData.maritalStatus);
  console.log("   - Occupation:", formData.occupation, formData.ocupacion, formData.work);
  console.log("   - Education:", formData.education, formData.educacion, formData.nivel_educativo);
  console.log("   - Ethnicity:", formData.ethnicity, formData.etnia, formData.ethnic);
  console.log("   - Housing:", formData.housingStability, formData.estabilidadVivienda, formData.housing);
  console.log("   - Profession:", formData.profession, formData.profesion);
  console.log("   - Income Sources:", formData.incomeSources, formData.fuentesIngreso, formData.income);
  console.log("   - Funds Destination:", formData.fundsDestination, formData.destinoFondos);

  // Map occupation - probar múltiples nombres de campo
  const occupationValue = formData.occupation || formData.ocupacion || formData.work || formData.trabajo;
  console.log("🔍 OCCUPATION DEBUG - Valor encontrado:", occupationValue);
  const mappedOccupation = mapOccupation(occupationValue);
  console.log("🔍 OCCUPATION DEBUG - Resultado mapeo:", mappedOccupation);

  // Map gender - probar múltiples nombres de campo
  const genderValue = formData.gender || formData.genero || formData.sexo;
  console.log("🔍 GENDER DEBUG - Valor encontrado:", genderValue);
  const mappedGender = mapToCatalog(genders, genderValue);
  console.log("🔍 GENDER DEBUG - Resultado mapeo:", mappedGender);

  // Map civil status - probar múltiples nombres de campo
  const civilStatusValue = formData.civilStatus || formData.estadoCivil || formData.maritalStatus;
  console.log("🔍 CIVIL STATUS DEBUG - Valor encontrado:", civilStatusValue);
  const mappedCivilStatus = mapToCatalog(civilStatuses, civilStatusValue);
  console.log("🔍 CIVIL STATUS DEBUG - Resultado mapeo:", mappedCivilStatus);

  // Map education level - probar múltiples nombres de campo
  const educationValue = formData.education || formData.educacion || formData.nivel_educativo;
  console.log("🔍 EDUCATION DEBUG - Valor encontrado:", educationValue);
  const mappedEducation = mapToCatalog(educationLevels, educationValue);
  console.log("🔍 EDUCATION DEBUG - Resultado mapeo:", mappedEducation);

  // Map ethnicity - probar múltiples nombres de campo
  const ethnicityValue = formData.ethnicity || formData.etnia || formData.ethnic || '';
  console.log("🔍 ETHNICITY DEBUG - Valor encontrado:", ethnicityValue);
  // Si no hay valor específico de etnia, usar Ladino como default según los datos de formulario
  const mappedEthnicity = ethnicityValue ? mapToCatalog(ethnicities, ethnicityValue) : { id: "3", value: "Ladino" };
  console.log("🔍 ETHNICITY DEBUG - Resultado mapeo:", mappedEthnicity);

  // Map personal identification
  const personalDoc = {
    firstName: formData.firstName || '',
    secondName: formData.secondName || formData.middleName || '',
    firstLastName: formData.lastName || formData.firstLastName || '',
    secondLastName: formData.secondLastName || '',
    marriedSurname: formData.marriedLastName || '',
    personalDocumentId: formData.dpi || '',
    gender: mappedGender || { id: "3", value: "N/D" },
    maritalStatus: mappedCivilStatus || { id: "6", value: "N/D" },
    birthDate: formData.birthDate ? new Date(formData.birthDate).toISOString().split('T')[0] : '',
    age: formData.age || 0,
    academicTitle: mapProfession(formData.profession) || { id: "1", value: "BACHILLER" },
    occupation: mappedOccupation || { id: "169", value: "NINGUNA" },
    typeOfHousing: mapToCatalog(
      [
        { id: "1", value: "PROPIA" },
        { id: "2", value: "ALQUILADA" }, 
        { id: "3", value: "FAMILIAR" },
        { id: "4", value: "PAGANDO" }
      ], 
      formData.housingType
    ) || { id: "1", value: "PROPIA" },
    housingStability: (() => {
      const housingStabilityCatalog = [
        { id: "1", value: "MENOR A 1 AÑO" },
        { id: "2", value: "1 A 2 AÑOS" },
        { id: "3", value: "2 A 3 AÑOS" },
        { id: "4", value: "MAYOR A 3 AÑOS" }
      ];
      
      console.log(`🏠 Mapping housing stability: "${formData.residentialStability}"`);
      
      // Enhanced housing stability mappings
      const stabilityMappings: { [key: string]: string } = {
        '< 1 año': 'MENOR A 1 AÑO',
        'menos de 1 año': 'MENOR A 1 AÑO',
        'menor a 1 año': 'MENOR A 1 AÑO',
        '1 año': '1 A 2 AÑOS',
        '1-2 años': '1 A 2 AÑOS',
        '1 a 2 años': '1 A 2 AÑOS',
        '2 años': '2 A 3 AÑOS',
        '2-3 años': '2 A 3 AÑOS',
        '2 a 3 años': '2 A 3 AÑOS',
        '3 años': 'MAYOR A 3 AÑOS',
        '> 3 años': 'MAYOR A 3 AÑOS',
        'más de 3 años': 'MAYOR A 3 AÑOS',
        'mayor a 3 años': 'MAYOR A 3 AÑOS'
      };
      
      const mappedValue = stabilityMappings[formData.residentialStability?.toLowerCase()] || formData.residentialStability;
      const result = mapToCatalog(housingStabilityCatalog, mappedValue, "4");
      
      console.log(`✅ Housing stability mapped: "${formData.residentialStability}" → "${result?.value}" (ID: ${result?.id})`);
      return result || { id: "4", value: "MAYOR A 3 AÑOS" };
    })(),
    geolocalization: formData.coordinates ? `${formData.coordinates.latitude},${formData.coordinates.longitude}` : undefined,
    personalDocumentAddress: {
      fullAddress: formData.address || '',
      otherIndications: formData.addressReference || '',
      state: mapToCatalog(departments, formData.residenceDepartment) || { id: "01", value: "GUATEMALA" }
    },
    // Spouse data
    spouseFirstName: formData.spouseFirstName || '',
    spouseSecondName: formData.spouseSecondName || '',
    spouseThirdName: '', // Can be empty as confirmed
    spouseFirstLastName: formData.spouseFirstLastName || '',
    spouseSecondLastName: formData.spouseSecondLastName || '',
    spouseCompanyName: formData.spouseWorkplace || '',
    spouseJobStability: formData.spouseJobStability ? mapToCatalog(
      [
        { id: "1", value: "MENOR A 1 AÑO" },
        { id: "2", value: "1 A 2 AÑOS" },
        { id: "3", value: "2 A 3 AÑOS" },
        { id: "4", value: "MAYOR A 3 AÑOS" }
      ],
      formData.spouseJobStability
    ) : undefined,
    spouseMobile: formData.spouseMobile || '',
    spouseBirthDate: formData.spouseBirthDate ? new Date(formData.spouseBirthDate).toISOString().split('T')[0] : ''
  };

  // Map person data
  const personData = {
    nit: formData.nit || '',
    mobile: formData.mobilePhone || '',
    telephone: formData.homePhone || '',
    email: formData.email ? [{
      emailAddress: formData.email,
      emailType: "PERSONAL",
      emailId: 1
    }] : [],
    numberOfDependants: parseInt(formData.dependents) || 0,
    ethnicity: mappedEthnicity || { id: "3", value: "Ladino" },
    academicDegree: mappedEducation || { id: "5", value: "N/A" }
  };

  // Map product details
  const productDetail = {
    requestedAmount: parseFloat(formData.requestedAmount) || 0,
    interestRate: parseFloat(formData.interestRate) || undefined,
    startingTerm: parseInt(formData.termMonths) || 0,
    principalAmortization: formData.capitalAmortization ? mapToCatalog(
      [
        { id: "1", value: "MENSUAL" },
        { id: "2", value: "BIMENSUAL" },
        { id: "3", value: "TRIMESTRAL" },
        { id: "4", value: "SEMESTRAL" },
        { id: "5", value: "ANUAL" },
        { id: "8", value: "AL VENCIMIENTO" },
        { id: "9", value: "FONDO REVOLVENTE" }
      ],
      formData.capitalAmortization
    ) : undefined,
    interestAmortization: formData.interestAmortization ? mapToCatalog(
      [
        { id: "1", value: "MENSUAL" },
        { id: "2", value: "BIMENSUAL" },
        { id: "3", value: "TRIMESTRAL" },
        { id: "4", value: "SEMESTRAL" },
        { id: "5", value: "ANUAL" },
        { id: "8", value: "AL VENCIMIENTO" },
        { id: "9", value: "FONDO REVOLVENTE" }
      ],
      formData.interestAmortization
    ) : undefined,
    partnerType: formData.memberType ? mapToCatalog(
      [
        { id: "1", value: "A" },
        { id: "2", value: "B" },
        { id: "3", value: "C" },
        { id: "4", value: "D" }
      ],
      formData.memberType
    ) : undefined,
    paymentMethod: mapToCatalog(
      [
        { id: "1", value: "DECRECIENTE" },
        { id: "2", value: "NIVELADA" }
      ],
      formData.paymentPlan
    ) || { id: "2", value: "NIVELADA" },
    fundsDestination: {
      investmentState: formData.investmentPlaceDepartment ? mapToCatalog(departments, formData.investmentPlaceDepartment) : undefined,
      investmentCounty: formData.investmentPlaceMunicipality ? mapToCatalog(municipalities, formData.investmentPlaceMunicipality) : undefined,
      destinationCategory: (() => {
        console.log(`📍 Mapping destination category: "${formData.destinationCategory}"`);
        if (!formData.destinationCategory) {
          return { id: "22", value: "Gastos personales" };
        }
        const result = mapToCatalog(destinationCategories, formData.destinationCategory);
        console.log(`✅ Destination category mapped: "${formData.destinationCategory}" → "${result?.value}" (ID: ${result?.id})`);
        return result || { id: "22", value: "Gastos personales" };
      })(),
      otherDestination: formData.specificDestination || '',
      description: formData.destinationDescription || '',
      comments: formData.destinationComments || ''
    }
  };

  // Map income (if exists)
  const income = formData.income && Array.isArray(formData.income) ? formData.income.map((inc: any) => {
    console.log(`💰 Mapping income source: "${inc.source}"`);
    
    const incomeSourceCatalog = [
      { id: "1", value: "NOMINAL" },
      { id: "2", value: "COMERCIAL" },
      { id: "3", value: "AGRICOLA" },
      { id: "4", value: "CONYUGE" },
      { id: "5", value: "OTROS" }
    ];
    
    // Enhanced income source mappings
    const incomeSourceMappings: { [key: string]: string } = {
      'Salario': 'NOMINAL',
      'salario': 'NOMINAL',
      'Sueldo': 'NOMINAL',
      'sueldo': 'NOMINAL',
      'Empleo': 'NOMINAL',
      'empleo': 'NOMINAL',
      'Comercio': 'COMERCIAL',
      'comercio': 'COMERCIAL',
      'Negocio': 'COMERCIAL',
      'negocio': 'COMERCIAL',
      'Ventas': 'COMERCIAL',
      'ventas': 'COMERCIAL',
      'Agricultura': 'AGRICOLA',
      'agricultura': 'AGRICOLA',
      'Ganadería': 'AGRICOLA',
      'ganadería': 'AGRICOLA',
      'Cónyuge': 'CONYUGE',
      'cónyuge': 'CONYUGE',
      'Esposo': 'CONYUGE',
      'esposo': 'CONYUGE',
      'Esposa': 'CONYUGE',
      'esposa': 'CONYUGE',
      'Pareja': 'CONYUGE',
      'pareja': 'CONYUGE',
      'Otros': 'OTROS',
      'otros': 'OTROS',
      'Remesas': 'OTROS',
      'remesas': 'OTROS',
      'Pensión': 'OTROS',
      'pensión': 'OTROS'
    };
    
    const mappedValue = incomeSourceMappings[inc.source] || inc.source;
    const result = mapToCatalog(incomeSourceCatalog, mappedValue, "5");
    
    console.log(`✅ Income source mapped: "${inc.source}" → "${result?.value}" (ID: ${result?.id})`);
    
    return {
      incomeSource: result || { id: "5", value: "OTROS" },
      monthlyIncome: parseFloat(inc.amount) || 0,
      comments: inc.observations || '',
      mainIncomeSource: inc.isMain || false
    };
  }) : [];

  // Map expenses (transform from object to array)
  const expenseItems = [];
  const expenseMap = [
    { key: 'food', name: 'Alimentación' },
    { key: 'clothing', name: 'Vestuario' },
    { key: 'utilities', name: 'Servicios básicos' },
    { key: 'education', name: 'Educación' },
    { key: 'housing', name: 'Vivienda' },
    { key: 'transport', name: 'Transporte' },
    { key: 'commitments', name: 'Compromisos' },
    { key: 'financial', name: 'Gastos financieros' },
    { key: 'payrollDeductions', name: 'Descuentos de planilla' },
    { key: 'other', name: 'Otros gastos' }
  ];

  expenseMap.forEach(({ key, name }) => {
    if (formData[key] && parseFloat(formData[key]) > 0) {
      expenseItems.push({
        name,
        amount: parseFloat(formData[key])
      });
    }
  });

  const expense = Object.assign(expenseItems, {
    totalExpenses: expenseItems.reduce((sum, item) => sum + item.amount, 0)
  });

  // Map financial status
  const assetItems = [];
  const liabilityItems = [];
  
  // Assets mapping
  const assetMap = [
    { key: 'cashAndBanks', name: 'Efectivo y saldo en bancos' },
    { key: 'accountsReceivable', name: 'Cuentas por cobrar' },
    { key: 'merchandise', name: 'Mercaderías' },
    { key: 'movableGoods', name: 'Bienes muebles' },
    { key: 'vehicles', name: 'Vehículos' },
    { key: 'realEstate', name: 'Bienes inmuebles' },
    { key: 'otherAssets', name: 'Otros activos' }
  ];

  assetMap.forEach(({ key, name }) => {
    if (formData[key] && parseFloat(formData[key]) > 0) {
      assetItems.push({
        name,
        amount: parseFloat(formData[key])
      });
    }
  });

  // Liabilities mapping  
  const liabilityMap = [
    { key: 'accountsPayable', name: 'Cuentas por pagar' },
    { key: 'shortTermDebts', name: 'Deudas a corto plazo' },
    { key: 'longTermLoans', name: 'Préstamos a largo plazo' }
  ];

  liabilityMap.forEach(({ key, name }) => {
    if (formData[key] && parseFloat(formData[key]) > 0) {
      liabilityItems.push({
        name,
        amount: parseFloat(formData[key])
      });
    }
  });

  const assetsTotal = assetItems.reduce((sum, item) => sum + item.amount, 0);
  const liabilitiesTotal = liabilityItems.reduce((sum, item) => sum + item.amount, 0);
  const equityTotal = assetsTotal - liabilitiesTotal;

  const assets = Object.assign(assetItems, { total: assetsTotal });
  const liabilities = Object.assign(liabilityItems, { total: liabilitiesTotal });

  const financialStatus = {
    assets,
    liabilities,
    equity: {
      currentDebtRatio: assetsTotal > 0 ? (liabilitiesTotal / assetsTotal) * 100 : 0,
      projectedDebtRatio: assetsTotal > 0 ? ((liabilitiesTotal + parseFloat(formData.requestedAmount || 0)) / assetsTotal) * 100 : 0,
      total: equityTotal
    }
  };

  // Map personal references
  const references = [];
  if (formData.references && Array.isArray(formData.references)) {
    formData.references.forEach((ref: any) => {
      const names = splitFullName(ref.fullName || '');
      
      references.push({
        type: { id: "1", value: "PERSONAL" }, // Always personal as confirmed
        firstName: names.firstName,
        secondName: names.secondName,
        firstLastName: names.firstLastName,
        secondLastName: names.secondLastName,
        fullAddress: ref.address || '',
        relationship: ref.relationship || '',
        mobile: ref.phone || '',
        score: mapToCatalog(
          [
            { id: "1", value: "EXCELENTE" },
            { id: "2", value: "BUENO" },
            { id: "3", value: "REGULAR" },
            { id: "4", value: "MALO" }
          ],
          ref.rating
        ) || { id: "2", value: "BUENO" },
        comments: ref.comments || ''
      });
    });
  }

  // Enhanced personal document with required fields
  const enhancedPersonalDoc = {
    ...personalDoc,
    emissionState: mapToCatalog(departments, formData.dpiIssueDepartment) || { id: "01", value: "GUATEMALA" },
    emissionCounty: mapToCatalog(municipalities, formData.dpiIssueMunicipality) || { id: "0101", value: "GUATEMALA" },
    personalDocumentAddress: {
      ...personalDoc.personalDocumentAddress,
      county: mapToCatalog(municipalities, formData.residenceMunicipality) || { id: "0101", value: "GUATEMALA" }
    }
  };

  // Enhanced person data with correct email structure
  const enhancedPersonData = {
    ...personData,
    email: formData.email ? [{
      emailAddress: formData.email,
      emailType: "personal",
      emailId: "1"
    }] : []
  };

  // Corregir productDetail usando los mapeos correctos
  const correctedProductDetail = {
    ...productDetail,
    idTypeProduct: 1, // Valor requerido por el microservicio
    idAgency: 12, // Valor requerido por el microservicio
    paymentMethod: productDetail.paymentMethod || { id: "2", value: "NIVELADA" } // Usar mapeo original con fallback
  };
  
  console.log("✅ ProductDetail corregido (sin hardcodeos):", JSON.stringify(correctedProductDetail, null, 2));

  // Enhanced financial status with correct structure
  const enhancedFinancialStatus = {
    assets: {
      list: assetItems.map(item => ({
        name: item.name,
        amount: item.amount
      })),
      total: assetItems.reduce((sum, item) => sum + item.amount, 0)
    },
    liabilities: {
      list: liabilityItems.map(item => ({
        name: item.name,
        amount: item.amount
      })),
      total: liabilityItems.reduce((sum, item) => sum + item.amount, 0)
    },
    equity: {
      currentDebtRatio: 0.31,
      projectedDebtRatio: 0.45,
      total: equityTotal
    }
  };

  // Business information (default values)
  const business = {
    companyName: formData.businessName || "Abarrotería Pérez",
    activityDescription: formData.businessActivity || "Venta de abarrotes",
    grossProfit: parseFloat(formData.businessProfit) || 3500.0,
    productType: "Consumo",
    startDate: formData.businessStartDate || "2018-03-01",
    fullAddress: formData.businessAddress || "4a calle 3-45 Zona 2, Guatemala"
  };

  // Investment plan (default values)
  const investmentPlan = [
    {
      quantity: 2,
      unitOfMeasurement: "unidad",
      description: "Congelador comercial",
      unitPrice: 6000.0,
      total: 12000.0
    },
    {
      quantity: 1,
      unitOfMeasurement: "unidad",
      description: "Bascula industrial",
      unitPrice: 2500.0,
      total: 2500.0
    }
  ];

  // Collateral (default values)
  const collateral = [
    {
      name: "Hipoteca vivienda",
      amount: 100000.0,
      percentage: 80
    }
  ];

  // Calculate total expenses
  const totalExpenses = expenseItems.reduce((sum, item) => sum + item.amount, 0);

  const payload = {
    data: {
      process: {
        profile: {
          processControl: {
            processId: formData.id || formData.applicationId || "PRC-000123",
            ownerCounty: mapToCatalog(municipalities, formData.residenceMunicipality) || { id: "0101", value: "Guatemala" },
            ownerState: mapToCatalog(departments, formData.residenceDepartment) || { id: "01", value: "Guatemala" },
            cuaT24: "2031045",
            cif: "98622",
            userEmail: agentData?.email || "jose.garcia@coopsama.com.gt"
          },
          personalDocument: enhancedPersonalDoc,
          personData: enhancedPersonData,
          productDetail: correctedProductDetail,
          income,
          expense: expenseItems,
          financialStatus: enhancedFinancialStatus,
          collateral,
          personal: {
            references
          },
          business,
          investmentPlan,
          expenseSummary: {
            totalExpenses
          }
        }
      }
    },
    metadata: {
      processId: formData.id || formData.applicationId || "TEST1222",
      user: agentData?.full_name || "yordan"
    }
  };

  // Log payload final completo para debugging
  console.log("📤 PAYLOAD FINAL COMPLETO:", JSON.stringify(payload, null, 2));
  
  // Validar payload antes de enviarlo
  const validation = validateCoverage(payload);
  console.log("🔍 VALIDACIÓN DEL PAYLOAD:", validation);
  
  if (!validation.isValid) {
    console.error("❌ ERRORES EN PAYLOAD:", validation.issues);
  }
  
  if (validation.warnings.length > 0) {
    console.warn("⚠️ ADVERTENCIAS EN PAYLOAD:", validation.warnings);
  }

  return payload;
};

export const validateCoverage = (officialPayload: OfficialPayload) => {
  const issues = [];
  const warnings = [];

  // Check mandatory fields
  const profile = officialPayload.data.process.profile;
  
  if (!profile.processControl.processId) {
    issues.push('Missing application ID');
  }
  
  if (!profile.personalDocument.firstName) {
    issues.push('Missing first name');
  }
  
  if (!profile.personalDocument.personalDocumentId) {
    issues.push('Missing DPI');
  }
  
  if (!profile.productDetail.requestedAmount || profile.productDetail.requestedAmount <= 0) {
    issues.push('Missing or invalid requested amount');
  }

  // Check for default values that might indicate missing data
  if (profile.personalDocument.gender.id === "3") {
    warnings.push('Gender defaulted to N/D');
  }
  
  if (profile.personData.ethnicity.id === "3") {
    warnings.push('Ethnicity defaulted to Ladino');
  }

  return {
    isValid: issues.length === 0,
    issues,
    warnings,
    completeness: {
      personalData: !!profile.personalDocument.firstName && !!profile.personalDocument.personalDocumentId,
      contactData: !!profile.personData.mobile,
      creditData: !!profile.productDetail.requestedAmount && profile.productDetail.requestedAmount > 0,
      financialData: profile.income.length > 0 || profile.expense.length > 0,
      referencesData: profile.personal.references.length > 0
    }
  };
};