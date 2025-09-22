#!/usr/bin/env node

/**
 * Script para demostrar y probar los cálculos del Análisis Financiero
 * Paso 3 - Finanzas y Patrimonio - Subpaso "Análisis Financiero"
 */

// Simular los cálculos del componente FinancialAnalysis
class FinancialAnalysisCalculator {
  constructor() {
    this.expenseCategories = [
      { key: 'alimentacion', label: 'Alimentación' },
      { key: 'vestuario', label: 'Vestuario' },
      { key: 'serviciosBasicos', label: 'Servicios Básicos' },
      { key: 'educacion', label: 'Educación' },
      { key: 'vivienda', label: 'Vivienda' },
      { key: 'transporte', label: 'Transporte' },
      { key: 'compromisos', label: 'Compromisos' },
      { key: 'gastosFinancieros', label: 'Gastos Financieros' },
      { key: 'descuentosPlanilla', label: 'Descuentos de Planilla' },
      { key: 'otros', label: 'Otros' }
    ];
  }

  // Calcular ingresos totales
  calculateTotalIncome(formData) {
    // Ingresos principales
    const ingresoPrincipal = parseFloat(formData.ingresoPrincipal || '0');
    const ingresoSecundario = parseFloat(formData.ingresoSecundario || '0');
    
    // Ingresos adicionales (otras fuentes)
    const additionalIncome = (formData.incomeSources || []).reduce((sum, source) => 
      sum + parseFloat(source.amount || '0'), 0
    );
    
    const totalIncome = ingresoPrincipal + ingresoSecundario + additionalIncome;
    
    return {
      ingresoPrincipal,
      ingresoSecundario,
      additionalIncome,
      totalIncome
    };
  }

  // Calcular gastos totales
  calculateTotalExpenses(formData) {
    const totalExpenses = this.expenseCategories.reduce((sum, category) => {
      return sum + parseFloat(formData[category.key] || '0');
    }, 0);
    
    return {
      totalExpenses,
      breakdown: this.expenseCategories.map(category => ({
        category: category.label,
        amount: parseFloat(formData[category.key] || '0')
      }))
    };
  }

  // Calcular disponibilidad
  calculateDisponibilidad(totalIncome, totalExpenses) {
    return totalIncome - totalExpenses;
  }

  // Calcular cobertura de cuota (porcentaje)
  calculateCoberturaPercent(cuotaSolicitada, totalIncome) {
    return totalIncome > 0 ? (cuotaSolicitada / totalIncome) * 100 : 0;
  }

  // Determinar estado del semáforo
  getTrafficLightStatus(disponibilidad, coberturaPercent) {
    if (disponibilidad < 0) {
      return { 
        color: 'red', 
        status: 'No Aplica', 
        reason: 'Disponibilidad negativa (gastos > ingresos)',
        icon: 'XCircle'
      };
    }
    
    if (coberturaPercent > 70) {
      return { 
        color: 'red', 
        status: 'No Aplica', 
        reason: 'Cobertura de cuota muy alta (>70%)',
        icon: 'XCircle'
      };
    }
    
    if (coberturaPercent > 50) {
      return { 
        color: 'yellow', 
        status: 'Revisar', 
        reason: 'Cobertura de cuota alta (50-70%)',
        icon: 'AlertCircle'
      };
    }
    
    return { 
      color: 'green', 
      status: 'Aplica', 
      reason: 'Cobertura de cuota aceptable (<50%)',
      icon: 'CheckCircle'
    };
  }

  // Análisis completo
  performFinancialAnalysis(formData) {
    const incomeAnalysis = this.calculateTotalIncome(formData);
    const expenseAnalysis = this.calculateTotalExpenses(formData);
    const disponibilidad = this.calculateDisponibilidad(incomeAnalysis.totalIncome, expenseAnalysis.totalExpenses);
    const cuotaSolicitada = parseFloat(formData.cuotaSolicitada || '0');
    const coberturaPercent = this.calculateCoberturaPercent(cuotaSolicitada, incomeAnalysis.totalIncome);
    const trafficLight = this.getTrafficLightStatus(disponibilidad, coberturaPercent);

    return {
      incomeAnalysis,
      expenseAnalysis,
      disponibilidad,
      cuotaSolicitada,
      coberturaPercent,
      trafficLight
    };
  }
}

// Función para formatear moneda
function formatCurrency(amount) {
  return new Intl.NumberFormat('es-GT', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

// Función principal de pruebas
async function testFinancialAnalysisCalculations() {
  console.log('🧮 Análisis de Cálculos del Análisis Financiero');
  console.log('===============================================\n');
  
  const calculator = new FinancialAnalysisCalculator();
  
  try {
    // Caso de prueba 1: Escenario típico
    console.log('📋 CASO DE PRUEBA 1: Escenario Típico');
    console.log('====================================');
    
    const formData1 = {
      // Ingresos
      ingresoPrincipal: '15000.00',
      ingresoSecundario: '3000.00',
      incomeSources: [
        { type: 'COMERCIAL', description: 'Venta de productos', amount: '2000.00' },
        { type: 'OTROS', description: 'Bonificaciones', amount: '500.00' }
      ],
      
      // Gastos
      alimentacion: '3000.00',
      vestuario: '800.00',
      serviciosBasicos: '1200.00',
      educacion: '1500.00',
      vivienda: '4000.00',
      transporte: '1000.00',
      compromisos: '2000.00',
      gastosFinancieros: '500.00',
      descuentosPlanilla: '800.00',
      otros: '200.00',
      
      // Cuota solicitada
      cuotaSolicitada: '2500.00'
    };
    
    const analysis1 = calculator.performFinancialAnalysis(formData1);
    
    console.log('💰 INGRESOS:');
    console.log(`   - Ingreso Principal: Q${formatCurrency(analysis1.incomeAnalysis.ingresoPrincipal)}`);
    console.log(`   - Ingreso Secundario: Q${formatCurrency(analysis1.incomeAnalysis.ingresoSecundario)}`);
    console.log(`   - Otras fuentes: Q${formatCurrency(analysis1.incomeAnalysis.additionalIncome)}`);
    console.log(`   - TOTAL INGRESOS: Q${formatCurrency(analysis1.incomeAnalysis.totalIncome)}`);
    
    console.log('\n💸 GASTOS:');
    analysis1.expenseAnalysis.breakdown.forEach(item => {
      if (item.amount > 0) {
        console.log(`   - ${item.category}: Q${formatCurrency(item.amount)}`);
      }
    });
    console.log(`   - TOTAL GASTOS: Q${formatCurrency(analysis1.expenseAnalysis.totalExpenses)}`);
    
    console.log('\n📊 CÁLCULOS:');
    console.log(`   - Disponibilidad: Q${formatCurrency(analysis1.disponibilidad)}`);
    console.log(`   - Cuota Solicitada: Q${formatCurrency(analysis1.cuotaSolicitada)}`);
    console.log(`   - Cobertura de Cuota: ${analysis1.coberturaPercent.toFixed(1)}%`);
    
    console.log('\n🚦 RESULTADO:');
    console.log(`   - Estado: ${analysis1.trafficLight.status}`);
    console.log(`   - Color: ${analysis1.trafficLight.color.toUpperCase()}`);
    console.log(`   - Razón: ${analysis1.trafficLight.reason}`);
    
    // Caso de prueba 2: Escenario problemático
    console.log('\n\n📋 CASO DE PRUEBA 2: Escenario Problemático');
    console.log('==========================================');
    
    const formData2 = {
      // Ingresos bajos
      ingresoPrincipal: '8000.00',
      ingresoSecundario: '0.00',
      incomeSources: [],
      
      // Gastos altos
      alimentacion: '2500.00',
      vestuario: '600.00',
      serviciosBasicos: '1000.00',
      educacion: '2000.00',
      vivienda: '5000.00',
      transporte: '800.00',
      compromisos: '3000.00',
      gastosFinancieros: '1000.00',
      descuentosPlanilla: '500.00',
      otros: '400.00',
      
      // Cuota alta
      cuotaSolicitada: '6000.00'
    };
    
    const analysis2 = calculator.performFinancialAnalysis(formData2);
    
    console.log('💰 INGRESOS:');
    console.log(`   - Ingreso Principal: Q${formatCurrency(analysis2.incomeAnalysis.ingresoPrincipal)}`);
    console.log(`   - Ingreso Secundario: Q${formatCurrency(analysis2.incomeAnalysis.ingresoSecundario)}`);
    console.log(`   - Otras fuentes: Q${formatCurrency(analysis2.incomeAnalysis.additionalIncome)}`);
    console.log(`   - TOTAL INGRESOS: Q${formatCurrency(analysis2.incomeAnalysis.totalIncome)}`);
    
    console.log('\n💸 GASTOS:');
    analysis2.expenseAnalysis.breakdown.forEach(item => {
      if (item.amount > 0) {
        console.log(`   - ${item.category}: Q${formatCurrency(item.amount)}`);
      }
    });
    console.log(`   - TOTAL GASTOS: Q${formatCurrency(analysis2.expenseAnalysis.totalExpenses)}`);
    
    console.log('\n📊 CÁLCULOS:');
    console.log(`   - Disponibilidad: Q${formatCurrency(analysis2.disponibilidad)}`);
    console.log(`   - Cuota Solicitada: Q${formatCurrency(analysis2.cuotaSolicitada)}`);
    console.log(`   - Cobertura de Cuota: ${analysis2.coberturaPercent.toFixed(1)}%`);
    
    console.log('\n🚦 RESULTADO:');
    console.log(`   - Estado: ${analysis2.trafficLight.status}`);
    console.log(`   - Color: ${analysis2.trafficLight.color.toUpperCase()}`);
    console.log(`   - Razón: ${analysis2.trafficLight.reason}`);
    
    // Caso de prueba 3: Escenario límite
    console.log('\n\n📋 CASO DE PRUEBA 3: Escenario Límite');
    console.log('=====================================');
    
    const formData3 = {
      // Ingresos
      ingresoPrincipal: '12000.00',
      ingresoSecundario: '2000.00',
      incomeSources: [
        { type: 'NOMINAL', description: 'Trabajo extra', amount: '1000.00' }
      ],
      
      // Gastos
      alimentacion: '2000.00',
      vestuario: '500.00',
      serviciosBasicos: '800.00',
      educacion: '1000.00',
      vivienda: '3000.00',
      transporte: '600.00',
      compromisos: '1500.00',
      gastosFinancieros: '300.00',
      descuentosPlanilla: '400.00',
      otros: '100.00',
      
      // Cuota que está en el límite
      cuotaSolicitada: '9000.00' // 60% de cobertura
    };
    
    const analysis3 = calculator.performFinancialAnalysis(formData3);
    
    console.log('💰 INGRESOS:');
    console.log(`   - Ingreso Principal: Q${formatCurrency(analysis3.incomeAnalysis.ingresoPrincipal)}`);
    console.log(`   - Ingreso Secundario: Q${formatCurrency(analysis3.incomeAnalysis.ingresoSecundario)}`);
    console.log(`   - Otras fuentes: Q${formatCurrency(analysis3.incomeAnalysis.additionalIncome)}`);
    console.log(`   - TOTAL INGRESOS: Q${formatCurrency(analysis3.incomeAnalysis.totalIncome)}`);
    
    console.log('\n💸 GASTOS:');
    analysis3.expenseAnalysis.breakdown.forEach(item => {
      if (item.amount > 0) {
        console.log(`   - ${item.category}: Q${formatCurrency(item.amount)}`);
      }
    });
    console.log(`   - TOTAL GASTOS: Q${formatCurrency(analysis3.expenseAnalysis.totalExpenses)}`);
    
    console.log('\n📊 CÁLCULOS:');
    console.log(`   - Disponibilidad: Q${formatCurrency(analysis3.disponibilidad)}`);
    console.log(`   - Cuota Solicitada: Q${formatCurrency(analysis3.cuotaSolicitada)}`);
    console.log(`   - Cobertura de Cuota: ${analysis3.coberturaPercent.toFixed(1)}%`);
    
    console.log('\n🚦 RESULTADO:');
    console.log(`   - Estado: ${analysis3.trafficLight.status}`);
    console.log(`   - Color: ${analysis3.trafficLight.color.toUpperCase()}`);
    console.log(`   - Razón: ${analysis3.trafficLight.reason}`);
    
    // Resumen de fórmulas
    console.log('\n\n📐 FÓRMULAS UTILIZADAS');
    console.log('=====================');
    console.log('1. Total de Ingresos = Ingreso Principal + Ingreso Secundario + Otras Fuentes');
    console.log('2. Total de Gastos = Suma de todas las categorías de gastos');
    console.log('3. Disponibilidad = Total de Ingresos - Total de Gastos');
    console.log('4. Cobertura de Cuota = (Cuota Solicitada / Total de Ingresos) × 100');
    console.log('\n🚦 LÓGICA DEL SEMÁFORO:');
    console.log('• ROJO (No Aplica): Disponibilidad < 0 O Cobertura > 70%');
    console.log('• AMARILLO (Revisar): Cobertura entre 50% y 70%');
    console.log('• VERDE (Aplica): Cobertura < 50% Y Disponibilidad ≥ 0');
    
    return true;

  } catch (error) {
    console.error('❌ Error durante las pruebas:', error);
    return false;
  }
}

// Ejecutar las pruebas
testFinancialAnalysisCalculations()
  .then(success => {
    if (success) {
      console.log('\n🎉 Análisis de cálculos financieros completado exitosamente');
    } else {
      console.log('\n❌ El análisis falló');
    }
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('❌ Error fatal:', error);
    process.exit(1);
  });
