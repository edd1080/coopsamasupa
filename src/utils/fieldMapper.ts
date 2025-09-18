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
  process: {
    profile: {
      processControl: {
        processId: string;
        cuaT24?: string;
        cif?: string;
        agency?: { id: string; value: string };
        ownerCounty?: { id: string; value: string };
        agentDPI?: string;
        agentEmail?: string;
        agentName?: string;
        creationDateTime?: string;
      };
      personalDocument: {
        firstName: string;
        secondName?: string;
        firstLastName: string;
        secondLastName?: string;
        marriedSurname?: string;
        personalDocumentId: string;
        emissionState?: { id: string; value: string };
        emissionCounty?: { id: string; value: string };
        gender: { id: string; value: string };
        maritalStatus: { id: string; value: string };
        birthDate: string;
        age: number;
        academicTitle: { id: string; value: string };
        occupation: { id: string; value: string };
        typeOfHousing: { id: string; value: string };
        housingStability: { id: string; value: string };
        geolocalization?: string;
        personalDocumentAddress: {
          fullAddress: string;
          otherIndications?: string;
          state: { id: string; value: string };
        };
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
        mobile: string;
        telephone?: string;
        email: Array<{
          emailAddress: string;
          emailType: string;
          emailId: number;
        }>;
        numberOfDependants: number;
        ethnicity: { id: string; value: string };
        academicDegree: { id: string; value: string };
      };
      productDetail: {
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
        paymentMethod: { id: string; value: string };
        productType?: { id: string; value: string };
        fundsDestination: {
          investmentState?: { id: string; value: string };
          investmentCounty?: { id: string; value: string };
          group: { id: string; value: string };
          destination: { id: string; value: string };
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
      }> & { totalExpenses: number };
      financialStatus: {
        assets: Array<{
          name: string;
          amount: number;
        }> & { total: number };
        liabilities: Array<{
          name: string;
          amount: number;
        }> & { total: number };
        equity: {
          currentDebtRatio: number;
          projectedDebtRatio: number;
          total: number;
        };
      };
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
    };
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
    // Handle specific gender mappings
    if (catalog === genders) {
      const genderMappings: { [key: string]: string } = {
        'Femenino': 'MUJER',
        'Masculino': 'HOMBRE',
        'FEMENINO': 'MUJER',
        'MASCULINO': 'HOMBRE'
      };
      const mappedValue = genderMappings[appValue] || appValue;
      const match = findCatalogMatch(catalog, mappedValue);
      if (match) return { id: match.id, value: match.value };
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
      if (match) return { id: match.id, value: match.value };
    }
    
    // Handle education level mappings
    if (catalog === educationLevels) {
      const educationMappings: { [key: string]: string } = {
        'Universitario': 'SUPERIOR',
        'Universidad': 'SUPERIOR',
        'Bachillerato': 'DIVERSIFICADO',
        'Básicos': 'BASICO',
        'Primaria': 'PRIMARIA'
      };
      const mappedValue = educationMappings[appValue] || appValue;
      const match = findCatalogMatch(catalog, mappedValue);
      if (match) return { id: match.id, value: match.value };
    }
    
    // Default catalog matching
    const match = findCatalogMatch(catalog, appValue);
    if (match) return { id: match.id, value: match.value };
  }
  
  if (fallbackId) {
    const fallback = catalog.find(item => item.id === fallbackId);
    if (fallback) return { id: fallback.id, value: fallback.value };
  }
  
  return undefined;
};

const mapProfession = (appValue: string): { id: string; value: string } | undefined => {
  if (!appValue) return undefined;
  
  // Find in local professions first
  const localProf = professions.find(p => p.value === appValue);
  if (localProf) {
    // Map to official catalog
    return mapToCatalog(officialProfessions, localProf.label);
  }
  
  // Direct mapping attempt
  return mapToCatalog(officialProfessions, appValue);
};

const mapOccupation = (appValue: string): { id: string; value: string } | undefined => {
  if (!appValue) return undefined;
  
  // Handle specific occupation mappings first
  const occupationMappings: { [key: string]: string } = {
    'Comercio': 'COMERCIANTE',
    'comercio': 'COMERCIANTE',
    'Comerciante': 'COMERCIANTE',
    'Agricultura': 'AGRICULTOR',
    'agricultura': 'AGRICULTOR',
    'Ganadería': 'GANADERO',
    'ganadería': 'GANADERO',
    'Ninguna': 'NINGUNA',
    'ninguna': 'NINGUNA',
    'Sin ocupación': 'NINGUNA',
    'No aplica': 'NINGUNA'
  };
  
  const mappedValue = occupationMappings[appValue] || appValue;
  
  // Direct mapping with mapped value
  let result = mapToCatalog(officialOccupations, mappedValue);
  if (result) return result;
  
  // Find in local occupations
  const localOcc = occupations.find(o => 
    o.value === appValue || 
    o.label.toLowerCase() === appValue.toLowerCase()
  );
  if (localOcc) {
    // Map to official catalog
    result = mapToCatalog(officialOccupations, localOcc.label);
    if (result) return result;
  }
  
  // Last resort: try uppercase version
  return mapToCatalog(officialOccupations, appValue.toUpperCase());
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
  // Map personal identification
  const personalDoc = {
    firstName: formData.firstName || '',
    secondName: formData.secondName || formData.middleName || '',
    firstLastName: formData.lastName || formData.firstLastName || '',
    secondLastName: formData.secondLastName || '',
    marriedSurname: formData.marriedLastName || '',
    personalDocumentId: formData.dpi || '',
    gender: mapToCatalog(genders, formData.gender) || { id: "3", value: "N/D" },
    maritalStatus: mapToCatalog(civilStatuses, formData.civilStatus) || { id: "6", value: "N/D" },
    birthDate: formData.birthDate ? new Date(formData.birthDate).toISOString().split('T')[0] : '',
    age: formData.age || 0,
    academicTitle: mapProfession(formData.profession) || { id: "1", value: "BACHILLER" },
    occupation: mapOccupation(formData.occupation) || { id: "169", value: "NINGUNA" },
    typeOfHousing: mapToCatalog(
      [
        { id: "1", value: "PROPIA" },
        { id: "2", value: "ALQUILADA" }, 
        { id: "3", value: "FAMILIAR" },
        { id: "4", value: "PAGANDO" }
      ], 
      formData.housingType
    ) || { id: "1", value: "PROPIA" },
    housingStability: mapToCatalog(
      [
        { id: "1", value: "MENOR A 1 AÑO" },
        { id: "2", value: "1 A 2 AÑOS" },
        { id: "3", value: "2 A 3 AÑOS" },
        { id: "4", value: "MAYOR A 3 AÑOS" }
      ],
      formData.residentialStability
    ) || { id: "4", value: "MAYOR A 3 AÑOS" },
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
    ethnicity: mapToCatalog(ethnicities, formData.ethnicity) || { id: "3", value: "Ladino" },
    academicDegree: mapToCatalog(educationLevels, formData.educationLevel) || { id: "5", value: "N/A" }
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
      group: mapToCatalog(destinationGroups, formData.destinationGroup) || { id: "1", value: "Grupo Consumo" },
      destination: mapToCatalog(destinationsByGroup, formData.creditDestination) || { id: "7", value: "CONSUMO" },
      destinationCategory: formData.destinationCategory ? mapToCatalog(destinationCategories, formData.destinationCategory) : { id: "22", value: "Gastos personales" },
      otherDestination: formData.specificDestination || '',
      description: formData.destinationDescription || '',
      comments: formData.destinationComments || ''
    }
  };

  // Map income (if exists)
  const income = formData.income && Array.isArray(formData.income) ? formData.income.map((inc: any) => ({
    incomeSource: mapToCatalog(
      [
        { id: "1", value: "NOMINAL" },
        { id: "2", value: "COMERCIAL" },
        { id: "3", value: "AGRICOLA" },
        { id: "4", value: "CONYUGE" },
        { id: "5", value: "OTROS" }
      ],
      inc.source
    ) || { id: "5", value: "OTROS" },
    monthlyIncome: parseFloat(inc.amount) || 0,
    comments: inc.observations || '',
    mainIncomeSource: inc.isMain || false
  })) : [];

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

  return {
    process: {
      profile: {
        processControl: {
          processId: formData.id || formData.applicationId || '',
          cuaT24: formData.cua || undefined,
          cif: undefined, // Ignored as confirmed
          agency: { id: "1", value: "AGENCIA CENTRAL" }, // Will be updated from new catalog
          ownerCounty: mapToCatalog(municipalities, formData.residenceMunicipality) || { id: "01", value: "GUATEMALA" },
          agentDPI: agentData?.dpi,
          agentEmail: agentData?.email,
          agentName: agentData?.full_name,
          creationDateTime: new Date().toISOString()
        },
        personalDocument: personalDoc,
        personData,
        productDetail: {
          ...productDetail,
          productType: { id: "1", value: "CREDITO" }
        },
        income,
        expense,
        financialStatus,
        personal: {
          references
        }
      }
    }
  };
};

export const validateCoverage = (officialPayload: OfficialPayload) => {
  const issues = [];
  const warnings = [];

  // Check mandatory fields
  const profile = officialPayload.process.profile;
  
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