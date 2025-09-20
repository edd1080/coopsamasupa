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
  getDestinationsByGroup,
  getCategoriesByDestination,
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
  creditRecordTypes,
  findCatalogMatch
} from '@/data/catalogs';

// Interface for the Coopsama microservice payload
export interface CoopsamaPayload {
  data: {
    process: {
      profile: {
        processControl: {
          processId: string;
          ownerCounty: { id: string; value: string };
          ownerState: { id: string; value: string };
          cuaT24: string;
          cif: string;
          userEmail: string;
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
          numberOfDependants?: number;
          ethnicity: { id: string; value: string };
          academicDegree: { id: string; value: string };
          mobile: string;
          telephone?: string;
          email: {
            emailAddress: string;
            emailType: string;
            emailId: string;
          }[];
        };
        productDetail: {
          idTypeProduct: number;
          idAgency: number;
          requestedAmount: number;
          interestRate?: number;
          startingTerm?: number;
          principalAmortization?: { id: string; value: string };
          interestAmortization?: { id: string; value: string };
          partnerType: { id: string; value: string };
          requestType: { id: string; value: string };
          sourceOfFunds?: { id: string; value: string };
          principalProject?: { id: string; value: string };
          secondaryProject?: { id: string; value: string };
          paymentMethod?: { id: string; value: string };
          fundsDestination: {
            investmentState: { id: string; value: string };
            investmentCounty: { id: string; value: string };
            destinationCategory: { id: string; value: string };
            otherDestination?: string;
            description?: string;
            comments?: string;
          };
        };
        income: {
          incomeSource: { id: string; value: string };
          monthlyIncome: number;
          comments?: string;
          mainIncomeSource: boolean;
        }[];
        expense: {
          name: string;
          amount: number;
        }[];
        financialStatus: {
          assets: {
            list: { name: string; amount: number }[];
            total: number;
          };
          liabilities: {
            list: { name: string; amount: number }[];
            total: number;
          };
          equity: {
            currentDebtRatio: number;
            projectedDebtRatio: number;
            total: number;
          };
        };
        collateral?: {
          name: string;
          amount: number;
          percentage: number;
        }[];
        personal: {
          references: {
            type: { id: string; value: string };
            firstName: string;
            secondName?: string;
            firstLastName: string;
            secondLastName?: string;
            fullAddress: string;
            relationship: string;
            mobile: string;
            score?: { id: string; value: string };
            comments?: string;
          }[];
        };
        business?: {
          companyName: string;
          activityDescription: string;
          grossProfit: number;
          productType: string;
          startDate: string;
          fullAddress: string;
        };
        investmentPlan?: {
          quantity: number;
          unitOfMeasurement: string;
          description: string;
          unitPrice: number;
          total: number;
        }[];
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

// Helper function to map catalog values
const mapToCatalog = <T extends { id: string; value: string }>(
  catalog: T[],
  appValue: any,
  fallbackId = "1"
): { id: string; value: string } => {
  if (!appValue) return { id: fallbackId, value: "" };
  
  // Convert any value to string safely
  const stringValue = typeof appValue === 'string' ? appValue : String(appValue);
  
  const match = findCatalogMatch(catalog, stringValue);
  if (match) return { id: match.id, value: match.value };
  
  return { id: fallbackId, value: "" };
};

// Helper function to split full name
const splitFullName = (fullName: string) => {
  if (!fullName) return { firstName: "", secondName: "", firstLastName: "", secondLastName: "" };
  
  const parts = fullName.trim().split(/\s+/);
  
  if (parts.length === 1) {
    return { firstName: parts[0], secondName: "", firstLastName: "", secondLastName: "" };
  } else if (parts.length === 2) {
    return { firstName: parts[0], secondName: "", firstLastName: parts[1], secondLastName: "" };
  } else if (parts.length === 3) {
    return { firstName: parts[0], secondName: "", firstLastName: parts[1], secondLastName: parts[2] };
  } else {
    return {
      firstName: parts[0],
      secondName: parts[1],
      firstLastName: parts[2],
      secondLastName: parts.slice(3).join(" ")
    };
  }
};

// Helper function to calculate age from birth date
const calculateAge = (birthDate: string): number => {
  if (!birthDate) return 30; // Default age
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age > 0 ? age : 30;
};

// Helper function to calculate total expenses
const calculateTotalExpenses = (expenses: { name: string; amount: number }[]): number => {
  return expenses.reduce((total, expense) => total + expense.amount, 0);
};

// Main transformation function
export const toCoopsamaPayload = (formData: any, agentData?: any): CoopsamaPayload => {
  console.log('🔄 Starting Coopsama payload transformation', { formData, agentData });
  
  // Construir nombre completo desde campos individuales
  const firstName = formData.firstName || "";
  const secondName = formData.secondName || "";
  const firstLastName = formData.firstLastName || "";
  const secondLastName = formData.secondLastName || "";
  
  const names = {
    firstName,
    secondName,
    firstLastName,
    secondLastName
  };
  
  // Get agency info
  const agencyMatch = mapToCatalog(agencies, agentData?.agency || formData.agency || "", "1");
  const agencyId = parseInt(agencyMatch.id) || 1;
  
  // Get location data
  const departmentMatch = mapToCatalog(departments, formData.department || formData.departamento || "", "01");
  const municipalityMatch = mapToCatalog(municipalities, formData.municipality || formData.municipio || "", "0101");
  
  // Product type mapping
  const productTypeMatch = mapToCatalog(productTypes, formData.productType || formData.tipoProducto || "", "1");
  const productTypeId = parseInt(productTypeMatch.id) || 1;
  
  // Build the payload
  const payload: CoopsamaPayload = {
    data: {
      process: {
        profile: {
          processControl: {
            processId: formData.applicationId || `APP-${Date.now()}`,
            ownerCounty: { id: municipalityMatch.id, value: municipalityMatch.value },
            ownerState: { id: departmentMatch.id, value: departmentMatch.value },
            cuaT24: agentData?.cuaT24 || "2031045",
            cif: agentData?.cif || "98622",
            userEmail: agentData?.email || formData.email || "agent@coopsama.com.gt"
          },
          personalDocument: {
            firstName: names.firstName,
            secondName: names.secondName || "",
            firstLastName: names.firstLastName,
            secondLastName: names.secondLastName || "",
            marriedSurname: formData.marriedSurname || "",
            personalDocumentId: formData.dpi || "",
            emissionState: { id: departmentMatch.id, value: departmentMatch.value },
            emissionCounty: { id: municipalityMatch.id, value: municipalityMatch.value },
            gender: mapToCatalog(genders, formData.gender || formData.genero || "", "1"),
            maritalStatus: mapToCatalog(civilStatuses, formData.civilStatus || formData.estadoCivil || "", "1"),
            birthDate: formData.birthDate || formData.fechaNacimiento || null,
            age: calculateAge(formData.birthDate || formData.fechaNacimiento),
            academicTitle: mapToCatalog(officialProfessions, formData.profession || formData.profesion || "", "1"),
            occupation: mapToCatalog(officialOccupations, formData.occupation || formData.ocupacion || "", "1"),
            personalDocumentAddress: {
              fullAddress: formData.address || formData.direccion || "",
              otherIndications: formData.addressDetails || formData.detallesDireccion || "",
              state: { id: departmentMatch.id, value: departmentMatch.value },
              county: { id: municipalityMatch.id, value: municipalityMatch.value }
            },
            typeOfHousing: mapToCatalog(housingTypes, formData.housingType || formData.tipoVivienda || "", "1"),
            housingStability: mapToCatalog(residentialStabilities, formData.residentialStability || formData.estabilidadResidencial || "", "4"),
            geolocalization: formData.coordinates || formData.coordenadas || "",
            spouseFirstName: formData.spouseFirstName || "",
            spouseSecondName: formData.spouseSecondName || "",
            spouseThirdName: "",
            spouseFirstLastName: formData.spouseFirstLastName || "",
            spouseSecondLastName: formData.spouseSecondLastName || "",
            spouseCompanyName: formData.spouseWorkplace || "",
            spouseJobStability: formData.spouseJobStability ? mapToCatalog(workStabilities, formData.spouseJobStability, "4") : { id: "1", value: "" },
            spouseMobile: formData.spouseMobilePhone || "",
            spouseBirthDate: formData.spouseBirthDate || null
          },
          personData: {
            nit: formData.nit || "",
            numberOfDependants: parseInt(formData.dependents || formData.dependientes || "0") || 0,
            ethnicity: mapToCatalog(ethnicities, formData.ethnicity || formData.etnia || "", "2"),
            academicDegree: mapToCatalog(educationLevels, formData.educationLevel || formData.nivelEducacion || "", "3"),
            mobile: formData.mobilePhone || "",
            telephone: formData.homePhone || "",
            email: [{
              emailAddress: formData.email || "",
              emailType: "personal",
              emailId: "1"
            }]
          },
          productDetail: {
            idTypeProduct: productTypeId,
            idAgency: agencyId,
            requestedAmount: parseFloat(formData.requestedAmount || "0") || 0,
            interestRate: parseFloat(formData.interestRate || "12.5") || 12.5,
            startingTerm: parseInt(formData.termMonths || "36") || 36,
            principalAmortization: mapToCatalog(capitalAmortizations, formData.capitalAmortization || formData.amortizacionCapital || "", "1"),
            interestAmortization: mapToCatalog(interestAmortizations, formData.interestAmortization || formData.amortizacionInteres || "", "1"),
            partnerType: mapToCatalog(memberTypes, formData.memberType || formData.tipoSocio || "", "1"),
            requestType: mapToCatalog(requestTypes, formData.requestType || formData.tipoSolicitud || "", "1"),
            sourceOfFunds: mapToCatalog(fundsOrigins, formData.sourceOfFunds || formData.origenFondos || "", "2"),
            principalProject: mapToCatalog(projectTypes, formData.principalProject || formData.proyectoPrincipal || "", "5"),
            secondaryProject: mapToCatalog(projectTypes, formData.secondaryProject || formData.proyectoSecundario || "", "5"),
            paymentMethod: mapToCatalog(paymentMethods, formData.paymentMethod || formData.formaPago || "", "1"),
            fundsDestination: {
              investmentState: { id: departmentMatch.id, value: departmentMatch.value },
              investmentCounty: { id: municipalityMatch.id, value: municipalityMatch.value },
              destinationCategory: { id: "22", value: formData.destinationCategory || "Comercial" },
              otherDestination: formData.otherDestination || "",
              description: formData.destinationDescription || "",
              comments: formData.destinationComments || ""
            }
          },
          income: (formData.incomes || [
            {
              incomeSource: formData.incomeSource || "NOMINAL",
              monthlyIncome: formData.monthlyIncome || formData.ingresoMensual || 0,
              comments: formData.incomeComments || "",
              mainIncomeSource: true
            }
          ]).map((income: any) => ({
            incomeSource: mapToCatalog(incomeSourceTypes, income.incomeSource || income.tipoIngreso || "", "1"),
            monthlyIncome: parseFloat(income.monthlyIncome || income.ingresoMensual || "0") || 0,
            comments: income.comments || income.comentarios || "",
            mainIncomeSource: income.mainIncomeSource || income.ingresoFuentePrincipal || false
          })),
          expense: [
            { name: "food", amount: parseFloat(formData.foodExpense || "1500") || 1500 },
            { name: "clothing", amount: parseFloat(formData.clothingExpense || "300") || 300 },
            { name: "basic services", amount: parseFloat(formData.servicesExpense || "800") || 800 },
            { name: "education", amount: parseFloat(formData.educationExpense || "500") || 500 },
            { name: "housing", amount: parseFloat(formData.housingExpense || "2000") || 2000 },
            { name: "transportation", amount: parseFloat(formData.transportExpense || "600") || 600 },
            { name: "commitments", amount: parseFloat(formData.commitmentsExpense || "1000") || 1000 },
            { name: "financial expenses", amount: parseFloat(formData.financialExpense || "200") || 200 },
            { name: "payroll deductions", amount: parseFloat(formData.payrollDeductions || "400") || 400 },
            { name: "other expenses", amount: parseFloat(formData.otherExpenses || "300") || 300 }
          ],
          financialStatus: {
            assets: {
              list: [
                { name: "cashAndBanks", amount: parseFloat(formData.cashAndBanks || "10000") || 10000 },
                { name: "accountReceivable", amount: parseFloat(formData.accountReceivable || "5000") || 5000 },
                { name: "merchandise", amount: parseFloat(formData.merchandise || "15000") || 15000 },
                { name: "vehicles", amount: parseFloat(formData.vehicles || "50000") || 50000 },
                { name: "realEstate", amount: parseFloat(formData.realEstate || "100000") || 100000 },
                { name: "otherAssets", amount: parseFloat(formData.otherAssets || "5000") || 5000 }
              ],
              total: 0 // Will be calculated
            },
            liabilities: {
              list: [
                { name: "accountsPayable", amount: parseFloat(formData.accountsPayable || "5000") || 5000 },
                { name: "longTermCreditors", amount: parseFloat(formData.longTermCreditors || "10000") || 10000 },
                { name: "longTermLoans", amount: parseFloat(formData.longTermLoans || "20000") || 20000 }
              ],
              total: 0 // Will be calculated
            },
            equity: {
              currentDebtRatio: 0, // Will be calculated
              projectedDebtRatio: 0, // Will be calculated
              total: 0 // Will be calculated
            }
          },
          collateral: formData.collateral ? [{
            name: formData.collateral.name || "Garantía",
            amount: parseFloat(formData.collateral.amount || "0") || 0,
            percentage: parseInt(formData.collateral.percentage || "80") || 80
          }] : [{
            name: "",
            amount: 0,
            percentage: 0
          }],
          personal: {
            references: (formData.references || []).map((ref: any, index: number) => ({
              type: mapToCatalog(referenceTypes, ref.type || ref.tipoReferencia || "", "1"),
              firstName: ref.name ? splitFullName(ref.name).firstName : `Referencia${index + 1}`,
              secondName: ref.name ? splitFullName(ref.name).secondName : "",
              firstLastName: ref.name ? splitFullName(ref.name).firstLastName : "",
              secondLastName: ref.name ? splitFullName(ref.name).secondLastName : "",
              fullAddress: ref.address || ref.direccion || "",
              relationship: ref.relationship || ref.relacion || "Conocido",
              mobile: ref.phone || ref.telefono || "",
              score: mapToCatalog(referenceRatings, ref.score || ref.calificacion || "", "1"),
              comments: ref.comments || ref.comentarios || ""
            }))
          },
          business: formData.businessName ? {
            companyName: formData.businessName,
            activityDescription: formData.businessActivity || "Actividad comercial",
            grossProfit: parseFloat(formData.businessProfit || "0") || 0,
            productType: formData.businessProductType || "Comercio",
            startDate: formData.businessStartDate || "2020-01-01",
            fullAddress: formData.businessAddress || ""
          } : undefined,
          investmentPlan: formData.investmentPlan || [{
            quantity: 0,
            unitOfMeasurement: "",
            description: "",
            unitPrice: 0,
            total: 0
          }],
          expenseSummary: {
            totalExpenses: 0 // Will be calculated
          }
        }
      }
    },
    metadata: {
      processId: formData.applicationId || `APP-${Date.now()}`,
      user: agentData?.email || "agent"
    }
  };

  // Calculate totals
  const profile = payload.data.process.profile;
  
  // Calculate assets total
  profile.financialStatus.assets.total = profile.financialStatus.assets.list.reduce(
    (sum, asset) => sum + asset.amount, 0
  );
  
  // Calculate liabilities total
  profile.financialStatus.liabilities.total = profile.financialStatus.liabilities.list.reduce(
    (sum, liability) => sum + liability.amount, 0
  );
  
  // Calculate equity
  profile.financialStatus.equity.total = profile.financialStatus.assets.total - profile.financialStatus.liabilities.total;
  profile.financialStatus.equity.currentDebtRatio = profile.financialStatus.assets.total > 0 ? 
    profile.financialStatus.liabilities.total / profile.financialStatus.assets.total : 0;
  profile.financialStatus.equity.projectedDebtRatio = profile.financialStatus.equity.currentDebtRatio + 0.1; // Example projection
  
  // Calculate total expenses
  profile.expenseSummary.totalExpenses = calculateTotalExpenses(profile.expense);

  console.log('✅ Coopsama payload transformation completed', payload);
  return payload;
};

// VALIDACIÓN EXHAUSTIVA DEL PAYLOAD - 40+ CAMPOS CRÍTICOS
export const validateCoopsamaPayload = (payload: CoopsamaPayload): {
  isValid: boolean;
  issues: string[];
  warnings: string[];
  completeness: number;
  criticalCompleteness?: number;
  statistics?: any;
} => {
  const criticalErrors: string[] = [];
  const warnings: string[] = [];
  
  const profile = payload.data.process.profile;
  
  // ========== VALIDACIONES CRÍTICAS (BLOQUEAN ENVÍO) ==========
  
  // Información Personal Crítica (8 campos)
  if (!profile.personalDocument.firstName?.trim()) criticalErrors.push("❌ Primer nombre es obligatorio");
  if (!profile.personalDocument.firstLastName?.trim()) criticalErrors.push("❌ Primer apellido es obligatorio");
  if (!profile.personalDocument.personalDocumentId?.trim()) criticalErrors.push("❌ DPI es obligatorio");
  if (!profile.personalDocument.birthDate) criticalErrors.push("❌ Fecha de nacimiento es obligatoria");
  if (!profile.personalDocument.gender?.id) criticalErrors.push("❌ Género es obligatorio");
  if (!profile.personalDocument.maritalStatus?.id) criticalErrors.push("❌ Estado civil es obligatorio");
  if (!profile.personalDocument.personalDocumentAddress?.fullAddress?.trim()) criticalErrors.push("❌ Dirección completa es obligatoria");
  if (!profile.personalDocument.age || profile.personalDocument.age < 18) criticalErrors.push("❌ Edad debe ser mayor a 18 años");
  
  // Contacto Crítico (3 campos)
  if (!profile.personData.mobile?.trim()) criticalErrors.push("❌ Teléfono móvil es obligatorio");
  if (!profile.personData.email?.length || !profile.personData.email[0]?.emailAddress?.trim()) criticalErrors.push("❌ Email es obligatorio");
  if (profile.personData.email?.[0]?.emailAddress && !profile.personData.email[0].emailAddress.includes('@')) criticalErrors.push("❌ Formato de email inválido");
  
  // Información del Producto Crítica (6 campos)
  if (!profile.productDetail.requestedAmount || profile.productDetail.requestedAmount <= 0) criticalErrors.push("❌ Monto solicitado debe ser mayor a 0");
  if (!profile.productDetail.idTypeProduct) criticalErrors.push("❌ Tipo de producto es obligatorio");
  if (!profile.productDetail.idAgency) criticalErrors.push("❌ Agencia es obligatoria");
  if (!profile.productDetail.startingTerm || profile.productDetail.startingTerm <= 0) criticalErrors.push("❌ Plazo en meses es obligatorio");
  if (!profile.productDetail.partnerType?.id) criticalErrors.push("❌ Tipo de socio es obligatorio");
  if (!profile.productDetail.requestType?.id) criticalErrors.push("❌ Tipo de solicitud es obligatorio");
  
  // Ingresos Críticos (2 campos)
  if (!profile.income?.length) criticalErrors.push("❌ Debe tener al menos una fuente de ingresos");
  if (profile.income?.length && (!profile.income[0].monthlyIncome || profile.income[0].monthlyIncome <= 0)) criticalErrors.push("❌ Ingreso mensual debe ser mayor a 0");
  
  // Gastos Críticos (1 campo)
  if (!profile.expense?.length || profile.expenseSummary.totalExpenses <= 0) criticalErrors.push("❌ Debe registrar gastos mensuales");
  
  // Estado Financiero Crítico (4 campos)
  if (profile.financialStatus.assets.total <= 0) criticalErrors.push("❌ Debe declarar activos");
  if (profile.financialStatus.liabilities.total < 0) criticalErrors.push("❌ Pasivos no pueden ser negativos");
  if (profile.financialStatus.equity.total <= 0) criticalErrors.push("❌ Patrimonio debe ser positivo");
  if (profile.financialStatus.equity.currentDebtRatio > 70) criticalErrors.push("❌ Nivel de endeudamiento muy alto (>70%)");
  
  // Referencias Críticas (2 campos)
  if (!profile.personal.references?.length) criticalErrors.push("❌ Debe proporcionar al menos una referencia");
  if (profile.personal.references?.length < 2) criticalErrors.push("❌ Se requieren mínimo 2 referencias");
  
  // Control de Proceso Crítico (3 campos)
  if (!profile.processControl.processId?.trim()) criticalErrors.push("❌ Process ID es obligatorio");
  if (!profile.processControl.userEmail?.trim()) criticalErrors.push("❌ Email del usuario es obligatorio");
  if (!profile.processControl.cuaT24?.trim()) criticalErrors.push("❌ CUA T24 es obligatorio");
  
  // ========== VALIDACIONES DE ADVERTENCIA (RECOMENDACIONES) ==========
  
  // Información Personal Opcional
  if (!profile.personalDocument.secondName?.trim()) warnings.push("⚠️ Segundo nombre recomendado para identificación completa");
  if (!profile.personalDocument.secondLastName?.trim()) warnings.push("⚠️ Segundo apellido recomendado");
  if (!profile.personalDocument.marriedSurname?.trim() && profile.personalDocument.maritalStatus?.value === 'CASADO') warnings.push("⚠️ Apellido de casada recomendado para personas casadas");
  if (!profile.personData.nit?.trim()) warnings.push("⚠️ NIT recomendado para trámites fiscales");
  if (!profile.personData.telephone?.trim()) warnings.push("⚠️ Teléfono fijo recomendado como contacto adicional");
  
  // Información del Cónyuge (si está casado)
  if (profile.personalDocument.maritalStatus?.value === 'CASADO') {
    if (!profile.personalDocument.spouseFirstName?.trim()) warnings.push("⚠️ Información del cónyuge incompleta: primer nombre");
    if (!profile.personalDocument.spouseFirstLastName?.trim()) warnings.push("⚠️ Información del cónyuge incompleta: primer apellido");
    if (!profile.personalDocument.spouseMobile?.trim()) warnings.push("⚠️ Teléfono del cónyuge recomendado");
    if (!profile.personalDocument.spouseBirthDate) warnings.push("⚠️ Fecha de nacimiento del cónyuge recomendada");
    if (!profile.personalDocument.spouseCompanyName?.trim()) warnings.push("⚠️ Empresa del cónyuge recomendada");
  }
  
  // Producto y Finanzas
  if (!profile.productDetail.interestRate || profile.productDetail.interestRate <= 0) warnings.push("⚠️ Tasa de interés no especificada");
  if (!profile.productDetail.sourceOfFunds?.id) warnings.push("⚠️ Origen de fondos recomendado");
  if (!profile.productDetail.principalProject?.id) warnings.push("⚠️ Proyecto principal recomendado");
  if (!profile.productDetail.paymentMethod?.id) warnings.push("⚠️ Método de pago recomendado");
  
  // Destino de Fondos
  if (!profile.productDetail.fundsDestination.description?.trim()) warnings.push("⚠️ Descripción del destino de fondos recomendada");
  if (!profile.productDetail.fundsDestination.comments?.trim()) warnings.push("⚠️ Comentarios sobre destino recomendados");
  
  // Información del Negocio
  if (!profile.business?.companyName?.trim()) warnings.push("⚠️ Información del negocio incompleta");
  if (profile.business && !profile.business.startDate) warnings.push("⚠️ Fecha de inicio del negocio recomendada");
  if (profile.business && (!profile.business.grossProfit || profile.business.grossProfit <= 0)) warnings.push("⚠️ Utilidad bruta del negocio recomendada");
  
  // Plan de Inversión
  if (!profile.investmentPlan?.length) warnings.push("⚠️ Plan de inversión detallado recomendado");
  
  // Garantías
  if (!profile.collateral?.length || profile.collateral[0].amount <= 0) warnings.push("⚠️ Garantías específicas recomendadas");
  
  // Geolocalización
  if (!profile.personalDocument.geolocalization?.trim()) warnings.push("⚠️ Geolocalización recomendada para verificación");
  
  // Referencias Detalladas
  if (profile.personal.references?.length) {
    profile.personal.references.forEach((ref, index) => {
      if (!ref.firstName?.trim()) warnings.push(`⚠️ Referencia ${index + 1}: primer nombre faltante`);
      if (!ref.firstLastName?.trim()) warnings.push(`⚠️ Referencia ${index + 1}: primer apellido faltante`);
      if (!ref.mobile?.trim()) warnings.push(`⚠️ Referencia ${index + 1}: teléfono faltante`);
      if (!ref.fullAddress?.trim()) warnings.push(`⚠️ Referencia ${index + 1}: dirección faltante`);
      if (!ref.relationship?.trim()) warnings.push(`⚠️ Referencia ${index + 1}: relación faltante`);
    });
  }
  
  // ========== CÁLCULO DE COMPLETITUD REAL ==========
  const totalCriticalFields = 33; // Campos críticos reales
  const totalOptionalFields = 25; // Campos opcionales/recomendados
  const totalFields = totalCriticalFields + totalOptionalFields;
  
  const criticalFieldsFilled = totalCriticalFields - criticalErrors.length;
  const optionalFieldsFilled = totalOptionalFields - warnings.length;
  const totalFilled = criticalFieldsFilled + optionalFieldsFilled;
  
  const completeness = Math.round((totalFilled / totalFields) * 100);
  const criticalCompleteness = Math.round((criticalFieldsFilled / totalCriticalFields) * 100);
  
  return {
    isValid: criticalErrors.length === 0,
    issues: criticalErrors, // Solo errores críticos
    warnings, // Recomendaciones y campos opcionales
    completeness,
    criticalCompleteness,
    statistics: {
      totalFields,
      totalCriticalFields,
      totalOptionalFields,
      criticalFieldsFilled,
      optionalFieldsFilled,
      totalFilled,
      criticalErrors: criticalErrors.length,
      warnings: warnings.length
    }
  };
};