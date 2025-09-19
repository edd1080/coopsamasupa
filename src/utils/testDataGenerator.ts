import { 
  departments, 
  municipalities, 
  genders, 
  civilStatuses, 
  ethnicities, 
  educationLevels,
  agencies,
  productTypes,
  destinationGroups,
  housingTypes,
  memberTypes,
  paymentMethods,
  officialProfessions,
  officialOccupations
} from '@/data/catalogs';

// Nombres guatemaltecos comunes
const guatemalanFirstNames = {
  male: ['José', 'Carlos', 'Luis', 'Miguel', 'Juan', 'Mario', 'Roberto', 'Pedro', 'Fernando', 'Diego'],
  female: ['María', 'Ana', 'Carmen', 'Rosa', 'Patricia', 'Gloria', 'Elena', 'Sandra', 'Claudia', 'Silvia']
};

const guatemalanLastNames = [
  'García', 'López', 'Martínez', 'González', 'Pérez', 'Rodríguez', 'Morales', 'Hernández', 
  'Jiménez', 'Vargas', 'Castillo', 'Ruiz', 'Díaz', 'Torres', 'Flores', 'Ramos',
  'Sánchez', 'Cruz', 'Mendoza', 'Vásquez'
];

const businessNames = [
  'Tienda La Esperanza', 'Abarrotes San José', 'Comercial Guatemala', 'Distribuidora Central',
  'Mercadito Familiar', 'Venta de Granos San Pedro', 'Panadería Santa Ana', 'Ferretería El Progreso',
  'Carnicería La Popular', 'Farmacia Comunitaria', 'Papelería Escolar', 'Zapatería El Buen Pie',
  'Librería San Martín', 'Verdulería Fresh', 'Pollería Doña Carmen'
];

const activityTypes = [
  'Comercio al por menor', 'Agricultura', 'Ganadería', 'Servicios', 'Manufactura',
  'Transporte', 'Construcción', 'Alimentación', 'Textiles', 'Artesanías'
];

// Generar DPI válido guatemalteco
const generateValidDPI = (): string => {
  const departments = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22'];
  const dept = departments[Math.floor(Math.random() * departments.length)];
  const municipality = String(Math.floor(Math.random() * 20) + 1).padStart(2, '0');
  const correlative = String(Math.floor(Math.random() * 99999) + 1).padStart(5, '0');
  
  return `${dept}${municipality}${correlative}`;
};

// Generar NIT válido
const generateValidNIT = (): string => {
  const base = String(Math.floor(Math.random() * 99999999) + 10000000);
  return `${base}-${Math.floor(Math.random() * 9) + 1}`;
};

// Generar teléfono guatemalteco
const generatePhoneNumber = (): string => {
  const prefixes = ['3', '4', '5'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const number = String(Math.floor(Math.random() * 9999999) + 1000000).padStart(7, '0');
  return `${prefix}${number}`;
};

// Generar fecha de nacimiento coherente con edad
const generateBirthDate = (minAge: number = 18, maxAge: number = 65): Date => {
  const currentYear = new Date().getFullYear();
  const birthYear = currentYear - Math.floor(Math.random() * (maxAge - minAge + 1)) - minAge;
  const birthMonth = Math.floor(Math.random() * 12);
  const birthDay = Math.floor(Math.random() * 28) + 1; // Evitar problemas con febrero
  return new Date(birthYear, birthMonth, birthDay);
};

// Generar dirección guatemalteca
const generateAddress = (): string => {
  const zones = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21'];
  const streets = ['Avenida', 'Calle', 'Boulevard', 'Calzada'];
  const zone = zones[Math.floor(Math.random() * zones.length)];
  const street = streets[Math.floor(Math.random() * streets.length)];
  const number1 = Math.floor(Math.random() * 50) + 1;
  const number2 = Math.floor(Math.random() * 100) + 1;
  
  return `${street} ${number1}-${number2}, Zona ${zone}`;
};

// Función principal para generar datos de prueba
export const generateTestData = (profile: 'random' | 'agricultor' | 'comerciante' | 'servicios' = 'random') => {
  const gender = genders[Math.floor(Math.random() * genders.length)];
  const isMale = gender.value === 'HOMBRE';
  
  const firstName = (male: boolean) => {
    return male 
      ? guatemalanFirstNames.male[Math.floor(Math.random() * guatemalanFirstNames.male.length)]
      : guatemalanFirstNames.female[Math.floor(Math.random() * guatemalanFirstNames.female.length)];
  };

  const lastName = guatemalanLastNames[Math.floor(Math.random() * guatemalanLastNames.length)];
  const secondLastName = guatemalanLastNames[Math.floor(Math.random() * guatemalanLastNames.length)];
  
  const birthDate = generateBirthDate();
  const department = departments[Math.floor(Math.random() * departments.length)];
  const deptMunicipalities = municipalities.filter(m => m.departmentId === department.id);
  const municipality = deptMunicipalities[Math.floor(Math.random() * deptMunicipalities.length)] || municipalities[0];
  
  // Seleccionar actividad según perfil
  let activityType = activityTypes[Math.floor(Math.random() * activityTypes.length)];
  let businessName = businessNames[Math.floor(Math.random() * businessNames.length)];
  
  if (profile === 'agricultor') {
    activityType = 'Agricultura';
    businessName = 'Finca ' + firstName(isMale) + ' ' + lastName;
  } else if (profile === 'comerciante') {
    activityType = 'Comercio al por menor';
    businessName = businessNames[Math.floor(Math.random() * businessNames.length)];
  } else if (profile === 'servicios') {
    activityType = 'Servicios';
    businessName = 'Servicios ' + lastName;
  }

  // Generar montos coherentes según perfil
  const baseAmount = profile === 'agricultor' ? 50000 : 
                   profile === 'comerciante' ? 30000 : 
                   profile === 'servicios' ? 25000 : 35000;
  
  const requestedAmount = baseAmount + (Math.floor(Math.random() * 20000));
  const monthlyIncome = Math.floor(requestedAmount * 0.3) + Math.floor(Math.random() * 5000);
  const expenses = Math.floor(monthlyIncome * 0.6) + Math.floor(Math.random() * 2000);

  return {
    // Información personal
    firstName: firstName(isMale),
    lastName,
    secondLastName,
    gender: gender.value,
    civilStatus: civilStatuses[Math.floor(Math.random() * civilStatuses.length)].value,
    ethnicity: ethnicities[Math.floor(Math.random() * ethnicities.length)].value,
    educationLevel: educationLevels[Math.floor(Math.random() * educationLevels.length)].value,
    
    // Documentos
    dpi: generateValidDPI(),
    nit: generateValidNIT(),
    dpiExtendedIn: municipality.value,
    cua: `CUA${Math.floor(Math.random() * 999999)}`,
    
    // Contacto
    mobilePhone: generatePhoneNumber(),
    email: `${firstName(isMale).toLowerCase()}.${lastName.toLowerCase()}@ejemplo.com`,
    address: generateAddress(),
    
    // Fechas
    birthDate: birthDate.toISOString().split('T')[0],
    applicationDate: new Date().toISOString().split('T')[0],
    
    // Ubicación
    department: department.value,
    municipality: municipality.value,
    birthDepartment: department.value,
    birthMunicipality: municipality.value,
    
    // Vivienda
    housingType: housingTypes[Math.floor(Math.random() * housingTypes.length)].value,
    
    // Información de crédito
    requestedAmount,
    termMonths: [6, 12, 18, 24, 36, 48][Math.floor(Math.random() * 6)],
    creditPurpose: destinationGroups[Math.floor(Math.random() * destinationGroups.length)].value,
    memberType: memberTypes[Math.floor(Math.random() * memberTypes.length)].value,
    paymentPlan: paymentMethods[Math.floor(Math.random() * paymentMethods.length)].value,
    
    // Información laboral
    profession: officialProfessions[Math.floor(Math.random() * officialProfessions.length)].value,
    occupation: officialOccupations[Math.floor(Math.random() * officialOccupations.length)].value,
    experienceYears: Math.floor(Math.random() * 20) + 1,
    
    // Información del negocio
    businessName,
    activityType,
    businessAddress: generateAddress(),
    
    // Información financiera
    monthlyIncome,
    otherIncome: Math.floor(Math.random() * 3000),
    totalIncome: monthlyIncome + Math.floor(Math.random() * 3000),
    expenses,
    
    // Ventas (para comerciantes)
    cashSales: profile === 'comerciante' ? Math.floor(requestedAmount * 0.4) : 0,
    creditSales: profile === 'comerciante' ? Math.floor(requestedAmount * 0.3) : 0,
    
    // Agencia
    agency: agencies[Math.floor(Math.random() * agencies.length)].value,
    
    // Referencias
    references: [
      {
        id: '1',
        name: guatemalanFirstNames.male[Math.floor(Math.random() * guatemalanFirstNames.male.length)] + ' ' + guatemalanLastNames[Math.floor(Math.random() * guatemalanLastNames.length)],
        phone: generatePhoneNumber(),
        relationship: 'Familiar',
        yearsKnown: Math.floor(Math.random() * 10) + 1
      },
      {
        id: '2',
        name: guatemalanFirstNames.female[Math.floor(Math.random() * guatemalanFirstNames.female.length)] + ' ' + guatemalanLastNames[Math.floor(Math.random() * guatemalanLastNames.length)],
        phone: generatePhoneNumber(),
        relationship: 'Comercial',
        yearsKnown: Math.floor(Math.random() * 5) + 1
      }
    ],
    
    // Observaciones
    characterObservations: profile === 'agricultor' ? 'Cliente dedicado a actividades agrícolas con experiencia en el sector.' :
                          profile === 'comerciante' ? 'Comerciante establecido con negocio propio y flujo de ventas constante.' :
                          profile === 'servicios' ? 'Proveedor de servicios con clientela establecida en la comunidad.' :
                          'Cliente con perfil económico estable y referencias comerciales positivas.',
    
    // Productos (para comerciantes)
    products: profile === 'comerciante' ? [
      {
        id: '1',
        name: 'Producto Principal',
        total: Math.floor(requestedAmount * 0.2)
      },
      {
        id: '2',
        name: 'Producto Secundario',
        total: Math.floor(requestedAmount * 0.1)
      }
    ] : []
  };
};

// Presets de datos comunes
export const dataPresets = {
  agricultor: () => generateTestData('agricultor'),
  comerciante: () => generateTestData('comerciante'),
  servicios: () => generateTestData('servicios'),
  random: () => generateTestData('random')
};