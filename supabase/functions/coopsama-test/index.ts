import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Basic validation function for payload structure
function validateCoopsamaPayload(payload: any) {
  const issues: string[] = [];
  const warnings: string[] = [];
  
  // Basic structure validation
  if (!payload) {
    issues.push('Payload is null or undefined');
    return { isValid: false, completeness: 0, issues, warnings };
  }

  if (!payload.data?.process) {
    issues.push('Missing process data structure');
  }

  // Check required sections
  const requiredSections = ['processControl', 'personalDocument', 'personData'];
  let foundSections = 0;
  
  for (const section of requiredSections) {
    if (payload.data?.process?.profile?.[section]) {
      foundSections++;
    } else {
      warnings.push(`Missing section: ${section}`);
    }
  }

  const completeness = Math.round((foundSections / requiredSections.length) * 100);
  const isValid = issues.length === 0 && foundSections >= 2;

  return {
    isValid,
    completeness,
    issues,
    warnings
  };
}

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

    // Test básico de conectividad usando el endpoint principal
    const testUrl = coopsamaUrl; // Usar la URL base sin /health
    
    console.log('🌐 Testing connection to:', testUrl);
    console.log('🔑 Using credentials:', {
      userId: coopsamaUserId ? 'present' : 'missing',
      token: coopsamaToken ? 'present' : 'missing'
    });
    
    // Probar diferentes formatos de autenticación
    const authHeaders = {
      'Content-Type': 'application/json',
      'COOPSAMA_USER_ID': coopsamaUserId,
      'COOPSAMA_USER_TOKEN': coopsamaToken
    };
    
    console.log('📤 Sending headers:', Object.keys(authHeaders));
    
    const response = await fetch(testUrl, {
      method: 'GET',
      headers: authHeaders
    });

    const responseData = await response.text();
    
    console.log('📡 Connectivity test response:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      responsePreview: responseData.slice(0, 200)
    });

    if (response.ok) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Conectividad exitosa',
          status: response.status,
          responseData: responseData
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      // Si falla con headers directos, intentar con Bearer token
      console.log('🔄 Trying alternative authentication format...');
      
      const alternativeResponse = await fetch(testUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${coopsamaToken}`,
          'X-User-ID': coopsamaUserId
        }
      });
      
      const altResponseData = await alternativeResponse.text();
      console.log('📡 Alternative auth response:', {
        status: alternativeResponse.status,
        ok: alternativeResponse.ok
      });
      
      if (alternativeResponse.ok) {
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: 'Conectividad exitosa (formato alternativo)',
            status: alternativeResponse.status,
            authFormat: 'Token',
            responseData: altResponseData
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}. Alternative: ${alternativeResponse.status}`);
      }
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
    
    // Construir payload de prueba con la estructura correcta
    // Usar la misma estructura exitosa: { data: { process: { profile: {...} } }, metadata: {...} }
    const profileData = payload.data?.process?.profile || payload;
    
    const testPayload = {
      data: {
        process: {
          profile: profileData
        }
      },
      metadata: {
        processId: testProcessId,
        user: 'test@coopsama.com',
        isTest: true // Marcar como prueba
      }
    };

    console.log('📤 Sending test payload to Coopsama:', {
      processId: testProcessId,
      hasProcess: !!testPayload.data?.process,
      hasProfile: !!testPayload.data?.process?.profile,
      url: coopsamaUrl,
      payloadSize: JSON.stringify(testPayload).length
    });

    console.log('🔍 Test profile payload preview:', {
      processControl: testPayload.data?.process?.profile?.processControl ? 'present' : 'missing',
      personalDocument: testPayload.data?.process?.profile?.personalDocument ? 'present' : 'missing',
      personData: testPayload.data?.process?.profile?.personData ? 'present' : 'missing',
      productDetail: testPayload.data?.process?.profile?.productDetail ? 'present' : 'missing'
    });

    // Probar con headers directos primero
    const authHeaders = {
      'Content-Type': 'application/json',
      'COOPSAMA_USER_ID': coopsamaUserId,
      'COOPSAMA_USER_TOKEN': coopsamaToken
    };
    
    console.log('📤 Using direct headers authentication');
    
    // Enviar al microservicio
    const response = await fetch(coopsamaUrl, {
      method: 'POST',
      headers: authHeaders,
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
          processId: testProcessId,
          authFormat: 'direct_headers'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      // Si falla con headers directos, intentar con Token auth
      console.log('🔄 Trying alternative Token authentication for integration...');
      
      const alternativeResponse = await fetch(coopsamaUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${coopsamaToken}`,
          'X-User-ID': coopsamaUserId
        },
        body: JSON.stringify(testPayload)
      });
      
      const altResponseData = await alternativeResponse.json();
      console.log('📨 Alternative auth integration response:', {
        status: alternativeResponse.status,
        ok: alternativeResponse.ok,
        data: altResponseData
      });
      
      if (alternativeResponse.ok) {
        return new Response(
          JSON.stringify({
            success: true,
            message: 'Integración exitosa (formato Token)',
            response: altResponseData,
            processId: testProcessId,
            authFormat: 'token'
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } else {
        return new Response(
          JSON.stringify({
            success: false,
            error: responseData.message || `HTTP ${response.status}`,
            response: responseData,
            httpStatus: response.status,
            alternativeError: altResponseData.message || `HTTP ${alternativeResponse.status}`,
            alternativeStatus: alternativeResponse.status
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
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