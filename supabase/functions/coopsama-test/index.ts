import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';
import { toCoopsamaPayload, validateCoopsamaPayload } from '../../../src/utils/fieldMapper.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { testType, payload, formData } = await req.json();
    
    console.log(`🧪 Coopsama Test - Type: ${testType}`);

    switch (testType) {
      case 'connectivity':
        return await testConnectivity();
      
      case 'validation':
        return await testPayloadValidation(payload);
      
      case 'full':
        return await testFullIntegration(payload, formData);
      
      default:
        return new Response(
          JSON.stringify({ error: 'Tipo de test no válido' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

  } catch (error) {
    console.error('❌ Error in coopsama-test function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function testConnectivity() {
  console.log('🔗 Testing connectivity...');
  
  try {
    // Verificar variables de entorno
    const coopsamaUrl = Deno.env.get('COOPSAMA_URL');
    const coopsamaUserId = Deno.env.get('COOPSAMA_USER_ID');
    const coopsamaToken = Deno.env.get('COOPSAMA_USER_TOKEN');

    if (!coopsamaUrl || !coopsamaUserId || !coopsamaToken) {
      throw new Error('Faltan variables de entorno de Coopsama');
    }

    // Test básico de conectividad (sin enviar datos)
    const testUrl = `${coopsamaUrl}/health`; // Asumiendo que existe un endpoint de health
    
    console.log('🌐 Testing connection to:', testUrl);
    
    const response = await fetch(testUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${coopsamaToken}`,
        'X-User-ID': coopsamaUserId
      }
    });

    const responseData = await response.text();
    
    console.log('📡 Connectivity test response:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    });

    if (response.ok) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Conectividad exitosa',
          status: response.status 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

  } catch (error) {
    console.error('❌ Connectivity test failed:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        type: 'connectivity_error'
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

async function testPayloadValidation(payload: any) {
  console.log('✅ Testing payload validation...');
  
  try {
    if (!payload) {
      throw new Error('No se proporcionó payload para validar');
    }

    // Validar estructura del payload
    const validation = validateCoopsamaPayload(payload);
    
    console.log('📋 Payload validation result:', {
      isValid: validation.isValid,
      completeness: validation.completeness,
      issuesCount: validation.issues.length,
      warningsCount: validation.warnings.length
    });

    return new Response(
      JSON.stringify({
        success: true,
        validation: validation,
        isValid: validation.isValid,
        completeness: validation.completeness,
        issues: validation.issues,
        warnings: validation.warnings
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Payload validation failed:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        type: 'validation_error'
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

async function testFullIntegration(payload: any, formData: any) {
  console.log('🔄 Testing full integration...');
  
  try {
    const coopsamaUrl = Deno.env.get('COOPSAMA_URL');
    const coopsamaUserId = Deno.env.get('COOPSAMA_USER_ID');
    const coopsamaToken = Deno.env.get('COOPSAMA_USER_TOKEN');

    if (!coopsamaUrl || !coopsamaUserId || !coopsamaToken) {
      throw new Error('Faltan variables de entorno de Coopsama');
    }

    // Generar ID de proceso de prueba
    const testProcessId = `TEST-${Date.now()}`;
    
    // Construir payload de prueba
    const testPayload = {
      process: payload.process || payload,
      metadata: {
        processId: testProcessId,
        user: 'test@coopsama.com',
        isTest: true // Marcar como prueba
      }
    };

    console.log('📤 Sending test payload to Coopsama:', {
      processId: testProcessId,
      hasProcess: !!testPayload.process,
      url: coopsamaUrl
    });

    // Enviar al microservicio
    const response = await fetch(coopsamaUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${coopsamaToken}`,
        'X-User-ID': coopsamaUserId
      },
      body: JSON.stringify(testPayload)
    });

    const responseData = await response.json();
    
    console.log('📨 Coopsama test response:', {
      status: response.status,
      ok: response.ok,
      data: responseData
    });

    if (response.ok) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Integración exitosa',
          response: responseData,
          processId: testProcessId
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      return new Response(
        JSON.stringify({
          success: false,
          error: responseData.message || `HTTP ${response.status}`,
          response: responseData,
          httpStatus: response.status
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

  } catch (error) {
    console.error('❌ Full integration test failed:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        type: 'integration_error'
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}