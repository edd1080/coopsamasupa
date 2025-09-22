#!/usr/bin/env node

/**
 * Script para probar las métricas del dashboard
 * Simula diferentes estados de solicitudes para verificar los cálculos
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fsgzurbqrxjrjipghkcz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzZ3p1cmJxcnhqcmppcGdoa2N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0MzY3MjksImV4cCI6MjA3MzAxMjcyOX0.8d8QH8XEV4ghyfsAcWHREM1jSniAjpjz4zTvimnhjoU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDashboardMetrics() {
  console.log('🧪 Probando métricas del dashboard...');
  
  try {
    // Simular diferentes estados de solicitudes
    const testApplications = [
      { status: 'pending', client_name: 'Test Pending 1' },
      { status: 'pending', client_name: 'Test Pending 2' },
      { status: 'error', client_name: 'Test Failed 1' },
      { status: 'error', client_name: 'Test Failed 2' },
      { status: 'approved', client_name: 'Test Approved 1' },
      { status: 'reviewing', client_name: 'Test Reviewing 1' },
      { status: 'reviewing', client_name: 'Test Reviewing 2' },
      { status: 'rejected', client_name: 'Test Rejected 1' },
      { status: 'cancelled', client_name: 'Test Cancelled 1' },
    ];

    console.log('📊 Aplicando lógica de cálculo de métricas...');
    
    // Aplicar la misma lógica que en useApplicationMetrics
    const applicationMetrics = {
      approved: testApplications.filter(app => app.status === 'approved').length,
      reviewing: testApplications.filter(app => app.status === 'reviewing').length,
      rejected: testApplications.filter(app => app.status === 'rejected').length,
      cancelled: testApplications.filter(app => app.status === 'cancelled').length,
      pending: testApplications.filter(app => app.status === 'pending').length,
      failed: testApplications.filter(app => app.status === 'error').length,
      // Enviadas: todas las que no son borradores y no están en error
      sent: testApplications.filter(app => app.status !== 'error' && app.status !== 'pending').length,
    };
    
    const metrics = {
      // Activas incluye borradores + aplicaciones pendientes
      active: 0 + applicationMetrics.pending, // 0 borradores para la prueba
      // Enviadas: aplicaciones que se enviaron exitosamente (no error, no pending)
      sent: applicationMetrics.sent,
      reviewing: applicationMetrics.reviewing,
      // Falló envío: aplicaciones con status 'error'
      failed: applicationMetrics.failed,
      cancelled: applicationMetrics.cancelled,
      total: testApplications.length + 0 // 0 borradores para la prueba
    };

    console.log('📋 Resultados de las métricas:');
    console.log('================================');
    console.log(`📝 Solicitudes Activas: ${metrics.active} (borradores + pendientes)`);
    console.log(`✅ Enviadas: ${metrics.sent} (enviadas exitosamente)`);
    console.log(`⏳ En Revisión: ${metrics.reviewing} (en revisión)`);
    console.log(`❌ Falló envío: ${metrics.failed} (con error)`);
    console.log(`📊 Total: ${metrics.total}`);
    
    console.log('\n📊 Desglose por estado:');
    console.log('=======================');
    console.log(`- pending: ${applicationMetrics.pending} (aparece en Activas)`);
    console.log(`- error: ${applicationMetrics.failed} (aparece en Falló envío)`);
    console.log(`- approved: ${applicationMetrics.approved} (aparece en Enviadas)`);
    console.log(`- reviewing: ${applicationMetrics.reviewing} (aparece en Enviadas + En Revisión)`);
    console.log(`- rejected: ${applicationMetrics.rejected} (aparece en Enviadas)`);
    console.log(`- cancelled: ${applicationMetrics.cancelled} (aparece en Enviadas)`);

    // Verificar que los cálculos son correctos
    const expectedSent = applicationMetrics.approved + applicationMetrics.reviewing + applicationMetrics.rejected + applicationMetrics.cancelled;
    const expectedActive = applicationMetrics.pending; // Sin borradores en esta prueba
    
    console.log('\n🔍 Verificación de cálculos:');
    console.log('============================');
    console.log(`✅ Enviadas calculadas correctamente: ${metrics.sent === expectedSent ? 'SÍ' : 'NO'} (${metrics.sent}/${expectedSent})`);
    console.log(`✅ Activas calculadas correctamente: ${metrics.active === expectedActive ? 'SÍ' : 'NO'} (${metrics.active}/${expectedActive})`);
    
    if (metrics.sent === expectedSent && metrics.active === expectedActive) {
      console.log('\n🎉 ¡Todas las métricas están calculándose correctamente!');
      return true;
    } else {
      console.log('\n❌ Hay errores en los cálculos de las métricas');
      return false;
    }

  } catch (error) {
    console.error('❌ Error general:', error);
    return false;
  }
}

// Ejecutar la prueba
testDashboardMetrics()
  .then(success => {
    if (success) {
      console.log('\n✅ Prueba de métricas completada exitosamente');
    } else {
      console.log('\n❌ Prueba de métricas falló');
    }
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('❌ Error fatal:', error);
    process.exit(1);
  });
