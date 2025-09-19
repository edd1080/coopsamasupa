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
  const isCasado = Math.random() > 0.6; // 40% casados
  
  const firstName = (male: boolean) => {
    return male 
      ? guatemalanFirstNames.male[Math.floor(Math.random() * guatemalanFirstNames.male.length)]
      : guatemalanFirstNames.female[Math.floor(Math.random() * guatemalanFirstNames.female.length)];
  };

  const lastName = guatemalanLastNames[Math.floor(Math.random() * guatemalanLastNames.length)];
  const secondLastName = guatemalanLastNames[Math.floor(Math.random() * guatemalanLastNames.length)];
  
  const birthDate = generateBirthDate();
  const age = new Date().getFullYear() - birthDate.getFullYear();
  const department = departments[Math.floor(Math.random() * departments.length)];
  const deptMunicipalities = municipalities.filter(m => m.departmentId === department.id);
  const municipality = deptMunicipalities[Math.floor(Math.random() * deptMunicipalities.length)] || municipalities[0];
  
  // Seleccionar actividad según perfil
  let activityType = activityTypes[Math.floor(Math.random() * activityTypes.length)];
  let businessName = businessNames[Math.floor(Math.random() * businessNames.length)];
  let companyName = businessName;
  
  if (profile === 'agricultor') {
    activityType = 'Agricultura';
    businessName = 'Finca ' + firstName(isMale) + ' ' + lastName;
    companyName = businessName;
  } else if (profile === 'comerciante') {
    activityType = 'Comercio al por menor';
    businessName = businessNames[Math.floor(Math.random() * businessNames.length)];
    companyName = businessName;
  } else if (profile === 'servicios') {
    activityType = 'Servicios';
    businessName = 'Servicios ' + lastName;
    companyName = businessName;
  }

  // Generar montos coherentes según perfil
  const baseAmount = profile === 'agricultor' ? 50000 : 
                   profile === 'comerciante' ? 30000 : 
                   profile === 'servicios' ? 25000 : 35000;
  
  const requestedAmount = baseAmount + (Math.floor(Math.random() * 20000));
  const monthlyIncome = Math.floor(requestedAmount * 0.3) + Math.floor(Math.random() * 5000);
  const secondaryIncome = Math.floor(monthlyIncome * 0.2);
  
  // Generar gastos detallados
  const alimentacion = Math.floor(monthlyIncome * 0.25);
  const vestuario = Math.floor(monthlyIncome * 0.05);
  const serviciosBasicos = Math.floor(monthlyIncome * 0.15);
  const educacion = Math.floor(monthlyIncome * 0.08);
  const vivienda = Math.floor(monthlyIncome * 0.2);
  const transporte = Math.floor(monthlyIncome * 0.1);
  const compromisos = Math.floor(monthlyIncome * 0.05);
  const gastosFinancieros = Math.floor(monthlyIncome * 0.03);
  const descuentosPlanilla = Math.floor(monthlyIncome * 0.05);
  const otros = Math.floor(monthlyIncome * 0.04);
  
  // Generar activos y pasivos coherentes
  const efectivoSaldoBancos = Math.floor(monthlyIncome * 2);
  const cuentasPorCobrar = profile === 'comerciante' ? Math.floor(monthlyIncome * 1.5) : 0;
  const mercaderias = profile === 'comerciante' ? Math.floor(monthlyIncome * 3) : 0;
  const bienesMuebles = Math.floor(monthlyIncome * 4);
  const vehiculos = Math.random() > 0.5 ? Math.floor(monthlyIncome * 8) : 0;
  const bienesInmuebles = Math.random() > 0.7 ? Math.floor(monthlyIncome * 20) : 0;
  const otrosActivos = Math.floor(monthlyIncome * 0.5);
  
  const cuentasPorPagar = Math.floor(monthlyIncome * 0.5);
  const deudasCortoPlazo = Math.floor(monthlyIncome * 1);
  const prestamosLargoPlazo = Math.floor(monthlyIncome * 5);

  // Información del cónyuge (si está casado)
  const spouseInfo = isCasado ? {
    spouseFirstName: firstName(!isMale),
    spouseLastName: guatemalanLastNames[Math.floor(Math.random() * guatemalanLastNames.length)],
    spouseSecondLastName: guatemalanLastNames[Math.floor(Math.random() * guatemalanLastNames.length)],
    spouseCompany: companyName,
    spouseJobStability: (Math.floor(Math.random() * 10) + 1).toString(),
    spousePhone: generatePhoneNumber(),
    spouseBirthDate: generateBirthDate(18, 60).toISOString().split('T')[0]
  } : {};

  // Generar referencias completas
  const referenceTypes = ['Familiar', 'Comercial', 'Personal'];
  const generateReference = () => ({
    referenceType: referenceTypes[Math.floor(Math.random() * referenceTypes.length)],
    fullName: firstName(Math.random() > 0.5) + ' ' + guatemalanLastNames[Math.floor(Math.random() * guatemalanLastNames.length)] + ' ' + guatemalanLastNames[Math.floor(Math.random() * guatemalanLastNames.length)],
    address: generateAddress(),
    relation: ['Hermano/a', 'Primo/a', 'Amigo/a', 'Vecino/a', 'Cliente', 'Proveedor'][Math.floor(Math.random() * 6)],
    phone: generatePhoneNumber(),
    rating: ['Excelente', 'Buena', 'Regular'][Math.floor(Math.random() * 3)],
    comment: ['Persona muy responsable', 'Cliente confiable', 'Excelente relación comercial', 'Conocido de la comunidad'][Math.floor(Math.random() * 4)]
  });

  return {
    // ========== IDENTIFICACIÓN PERSONAL ==========
    firstName: firstName(isMale),
    secondName: Math.random() > 0.7 ? firstName(isMale) : '',
    thirdName: Math.random() > 0.9 ? firstName(isMale) : '',
    firstLastName: lastName,
    secondLastName: secondLastName,
    marriedLastName: (isCasado && !isMale) ? guatemalanLastNames[Math.floor(Math.random() * guatemalanLastNames.length)] : '',
    dpi: generateValidDPI(),
    nit: generateValidNIT(),
    dpiExtendedIn: municipality.value,
    cua: `CUA${Math.floor(Math.random() * 999999)}`,
    memberType: memberTypes[Math.floor(Math.random() * memberTypes.length)].value,
    agencyType: agencies[Math.floor(Math.random() * agencies.length)].value,

    // ========== DEMOGRAFÍA Y NACIMIENTO ==========
    birthDate: birthDate.toISOString().split('T')[0],
    age: age,
    dependents: Math.floor(Math.random() * 4),
    gender: gender.value,
    civilStatus: isCasado ? 'CASADO' : civilStatuses[Math.floor(Math.random() * civilStatuses.length)].value,
    ethnicity: ethnicities[Math.floor(Math.random() * ethnicities.length)].value,
    educationLevel: educationLevels[Math.floor(Math.random() * educationLevels.length)].value,
    profession: officialProfessions[Math.floor(Math.random() * officialProfessions.length)].value,
    occupation: officialOccupations[Math.floor(Math.random() * officialOccupations.length)].value,

    // Información del cónyuge
    ...spouseInfo,
    
    // ========== CONTACTO Y VIVIENDA ==========
    mobilePhone: generatePhoneNumber(),
    homePhone: Math.random() > 0.5 ? `2${Math.floor(Math.random() * 9999999) + 1000000}` : '',
    email: `${firstName(isMale).toLowerCase()}.${lastName.toLowerCase()}@ejemplo.com`,
    address: generateAddress(),
    addressReference: `Cerca de ${['Iglesia', 'Escuela', 'Mercado', 'Farmacia', 'Tienda'][Math.floor(Math.random() * 5)]} ${lastName}`,
    geolocation: {
      latitude: 14.6349 + (Math.random() - 0.5) * 0.1,
      longitude: -90.5069 + (Math.random() - 0.5) * 0.1,
      accuracy: Math.floor(Math.random() * 50) + 10,
      timestamp: new Date().toISOString()
    },
    residenceDepartment: department.value,
    residenceMunicipality: municipality.value,
    housingType: housingTypes[Math.floor(Math.random() * housingTypes.length)].value,
    residenceStability: Math.floor(Math.random() * 10) + 1,

    // ========== INFORMACIÓN DE CRÉDITO ==========
    productType: productTypes[Math.floor(Math.random() * productTypes.length)].value,
    creditType: profile === 'agricultor' ? 'Agrícola' : profile === 'comerciante' ? 'Comercial' : 'Personal',
    loanAmount: requestedAmount,
    termMonths: [6, 12, 18, 24, 36, 48][Math.floor(Math.random() * 6)],
    purpose: destinationGroups[Math.floor(Math.random() * destinationGroups.length)].value,
    purposeDescription: profile === 'agricultor' ? 'Compra de semillas y fertilizantes' : 
                       profile === 'comerciante' ? 'Ampliación de inventario' : 
                       'Capital de trabajo',
    collateral: Math.random() > 0.5 ? 'Sí' : 'No',
    collateralDescription: 'Hipoteca sobre inmueble',

    // ========== ANÁLISIS FINANCIERO ==========
    incomeSource: profile === 'agricultor' ? 'Agricultura' : profile === 'comerciante' ? 'Comercio' : 'Servicios profesionales',
    ingresoPrincipal: monthlyIncome.toString(),
    ingresoSecundario: secondaryIncome.toString(),
    comentarioIngreso: `Ingresos ${profile === 'agricultor' ? 'de cultivos estacionales' : profile === 'comerciante' ? 'por ventas regulares' : 'por servicios profesionales'}`,
    incomeSources: [
      { id: '1', type: 'Principal', description: activityType, amount: monthlyIncome.toString() },
      { id: '2', type: 'Secundario', description: 'Ingresos adicionales', amount: secondaryIncome.toString() }
    ],
    
    // Gastos detallados
    alimentacion: alimentacion.toString(),
    vestuario: vestuario.toString(),
    serviciosBasicos: serviciosBasicos.toString(),
    educacion: educacion.toString(),
    vivienda: vivienda.toString(),
    transporte: transporte.toString(),
    compromisos: compromisos.toString(),
    gastosFinancieros: gastosFinancieros.toString(),
    descuentosPlanilla: descuentosPlanilla.toString(),
    otros: otros.toString(),
    cuotaSolicitada: Math.floor(requestedAmount / ([6, 12, 18, 24, 36, 48][Math.floor(Math.random() * 6)])).toString(),

    // ========== ESTADO PATRIMONIAL ==========
    efectivoSaldoBancos: efectivoSaldoBancos.toString(),
    cuentasPorCobrar: cuentasPorCobrar.toString(),
    mercaderias: mercaderias.toString(),
    bienesMuebles: bienesMuebles.toString(),
    vehiculos: vehiculos.toString(),
    bienesInmuebles: bienesInmuebles.toString(),
    otrosActivos: otrosActivos.toString(),
    cuentasPorPagar: cuentasPorPagar.toString(),
    deudasCortoPlazo: deudasCortoPlazo.toString(),
    prestamosLargoPlazo: prestamosLargoPlazo.toString(),
    montoSolicitado: requestedAmount.toString(),

    // ========== INFORMACIÓN LABORAL ==========
    employmentStatus: profile === 'servicios' ? 'Independiente' : 'Propietario',
    companyName: companyName,
    position: profile === 'agricultor' ? 'Agricultor' : profile === 'comerciante' ? 'Comerciante' : 'Profesional independiente',
    yearsEmployed: Math.floor(Math.random() * 15) + 2,
    monthsEmployed: Math.floor(Math.random() * 12),
    workAddress: generateAddress(),
    workPhone: generatePhoneNumber(),

    // ========== REFERENCIAS COMPLETAS ==========
    references: [generateReference(), generateReference()],

    // ========== FECHAS Y METADATOS ==========
    applicationDate: new Date().toISOString().split('T')[0],
    agency: agencies[Math.floor(Math.random() * agencies.length)].value,
    
    // ========== CONSENTIMIENTOS ==========
    termsAccepted: true,
    dataProcessingAccepted: true,
    creditCheckAccepted: true,

    // ========== OBSERVACIONES ==========
    characterObservations: profile === 'agricultor' ? 'Cliente dedicado a actividades agrícolas con experiencia en el sector. Maneja cultivos estacionales y tiene conocimiento del mercado local.' :
                          profile === 'comerciante' ? 'Comerciante establecido con negocio propio y flujo de ventas constante. Cuenta con clientela fija y experiencia en el sector comercial.' :
                          profile === 'servicios' ? 'Proveedor de servicios profesionales con clientela establecida en la comunidad. Ingresos estables y reputación sólida.' :
                          'Cliente con perfil económico estable, referencias comerciales positivas y capacidad de pago demostrada.',

    // ========== DATOS ESPECÍFICOS POR PERFIL ==========
    // Información del negocio
    businessName,
    activityType,
    businessAddress: generateAddress(),
    
    // Ventas (para comerciantes)
    cashSales: profile === 'comerciante' ? Math.floor(requestedAmount * 0.4) : 0,
    creditSales: profile === 'comerciante' ? Math.floor(requestedAmount * 0.3) : 0,
    
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

// Función especial para generar solicitud ultra completa
export const generateUltraCompleteApplication = () => {
  const profile = ['agricultor', 'comerciante', 'servicios'][Math.floor(Math.random() * 3)] as 'agricultor' | 'comerciante' | 'servicios';
  return generateTestData(profile);
};

// Presets de datos comunes
export const dataPresets = {
  agricultor: () => generateTestData('agricultor'),
  comerciante: () => generateTestData('comerciante'),
  servicios: () => generateTestData('servicios'),
  random: () => generateTestData('random'),
  ultraCompleta: () => generateUltraCompleteApplication()
};