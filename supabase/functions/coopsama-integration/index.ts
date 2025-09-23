import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

// Utility to generate process IDs in format PRC-000123
const generateProcessId = (applicationId?: string): string => {
  let seedNumber: number;
  
  if (applicationId) {
    const numberPart = applicationId.replace(/\D/g, '');
    seedNumber = numberPart ? parseInt(numberPart) : Math.floor(Math.random() * 999999);
  } else {
    seedNumber = Math.floor(Math.random() * 999999);
  }
  
  const processNumber = (seedNumber % 999999).toString().padStart(6, '0');
  return `PRC-${processNumber}`;
};

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
    console.log('🚀 Coopsama Integration Function Started');

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const coopsamaUserId = Deno.env.get('COOPSAMA_USER_ID');
    const coopsamaUserToken = Deno.env.get('COOPSAMA_USER_TOKEN');

    console.log('🔑 Environment variables loaded', {
      hasSupabaseUrl: !!supabaseUrl,
      hasSupabaseKey: !!supabaseKey,
      hasCoopsamaUserId: !!coopsamaUserId,
      hasCoopsamaUserToken: !!coopsamaUserToken
    });

    if (!coopsamaUserId || !coopsamaUserToken) {
      throw new Error('Missing Coopsama credentials');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { applicationId, payload, userEmail } = await req.json();

    console.log('📋 Processing application', { applicationId, hasPayload: !!payload, userEmail });

    // Get user email from authorization header if not provided
    let agentEmail = userEmail;
    if (!agentEmail) {
      try {
        const authHeader = req.headers.get('authorization');
        if (authHeader) {
          const token = authHeader.replace('Bearer ', '');
          const { data: { user } } = await supabase.auth.getUser(token);
          if (user) {
            // Get user profile to get email
            const { data: profile } = await supabase
              .from('profiles')
              .select('email')
              .eq('id', user.id)
              .single();
            agentEmail = profile?.email || user.email;
          }
        }
      } catch (error) {
        console.warn('⚠️ Could not extract user email from token:', error);
        agentEmail = 'unknown@coopsama.com'; // Fallback
      }
    }

    // Log the SCO ID (applicationId)
    console.log('🆔 SCO ID (applicationId):', applicationId);
    
    // Generate processId based on SCO ID
    const processId = generateProcessId(applicationId);
    console.log('🔄 Generated processId:', processId);

    // Update application status to pending sync and store SCO ID
    await supabase
      .from('applications')
      .update({ 
        coopsama_sync_status: 'pending',
        coopsama_sync_error: null,
        coopsama_synced_at: new Date().toISOString(),
      })
      .eq('id', applicationId);

    console.log('📤 Sending to Coopsama microservice');

    // Construct corrected payload structure for Coopsama microservice
    // The microservice expects: { data: { process: { profile: {...} } }, metadata: {...} }
    console.log('📥 Received payload structure:', {
      hasData: !!payload.data,
      hasProcess: !!payload.data?.process,
      hasProfile: !!payload.data?.process?.profile,
      payloadKeys: Object.keys(payload)
    });
    
    const profileData = payload.data?.process?.profile || payload;
    
    const coopsamaPayload = {
      data: {
        process: {
          profile: profileData
        }
      },
      metadata: {
        processId: applicationId, // Use SCO_XXXXXX as primary identifier
        user: agentEmail
      }
    };

    console.log('📦 Coopsama payload structure:', {
      hasData: !!coopsamaPayload.data,
      hasProcess: !!coopsamaPayload.data?.process,
      hasProfile: !!coopsamaPayload.data?.process?.profile,
      processId: coopsamaPayload.metadata.processId,
      user: coopsamaPayload.metadata.user,
      profileFieldsCount: coopsamaPayload.data?.process?.profile ? Object.keys(coopsamaPayload.data.process.profile).length : 0
    });

    console.log('🔍 Profile payload preview:', {
      processControl: coopsamaPayload.data?.process?.profile?.processControl ? 'present' : 'missing',
      personalDocument: coopsamaPayload.data?.process?.profile?.personalDocument ? 'present' : 'missing',
      personData: coopsamaPayload.data?.process?.profile?.personData ? 'present' : 'missing',
      productDetail: coopsamaPayload.data?.process?.profile?.productDetail ? 'present' : 'missing'
    });

    // Log the actual structure being sent for debugging
    console.log('📋 Complete payload being sent to Coopsama:', JSON.stringify(coopsamaPayload, null, 2));

    // Send to Coopsama microservice
    const coopsamaResponse = await fetch('https://services.bowpi.com/v1/micro-coopsama/coopsama/operation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': coopsamaUserId,
        'x-user-token': coopsamaUserToken,
      },
      body: JSON.stringify(coopsamaPayload),
    });

    console.log('📨 Coopsama response received', {
      status: coopsamaResponse.status,
      statusText: coopsamaResponse.statusText
    });

    const responseData = await coopsamaResponse.json();
    console.log('📋 Coopsama response data', responseData);

    if (responseData.code === 0 && responseData.success) {
      // Success response
      console.log('✅ Coopsama integration successful', responseData.data);
      
      await supabase
        .from('applications')
        .update({
          coopsama_sync_status: 'success',
          coopsama_operation_id: responseData.data?.operationId,
          coopsama_external_reference_id: responseData.data?.externalReferenceId,
          coopsama_process_id: processId,
          coopsama_sync_error: null,
          coopsama_synced_at: new Date().toISOString()
        })
        .eq('id', applicationId);

      console.log('✅ Returning success response with data:', {
        operationId: responseData.data?.operationId,
        externalReferenceId: responseData.data?.externalReferenceId
      });

      return new Response(JSON.stringify({
        success: true,
        message: responseData.message,
        data: responseData.data
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } else {
      // Error response from Coopsama
      console.error('❌ Coopsama integration failed', responseData);
      
      await supabase
        .from('applications')
        .update({
          coopsama_sync_status: 'error',
          coopsama_sync_error: responseData.message || 'Unknown error from Coopsama',
          coopsama_process_id: processId,
          coopsama_synced_at: new Date().toISOString()
        })
        .eq('id', applicationId);

      return new Response(JSON.stringify({
        success: false,
        error: responseData.message || 'Integration failed',
        code: responseData.code
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error('💥 Coopsama integration error:', error);

    // Try to update application with error if we have the applicationId
    try {
      const body = await req.json();
      if (body.applicationId) {
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
        const supabase = createClient(supabaseUrl, supabaseKey);
        
        await supabase
          .from('applications')
          .update({
            coopsama_sync_status: 'error',
            coopsama_sync_error: error.message,
            coopsama_process_id: processId,
            coopsama_synced_at: new Date().toISOString()
          })
          .eq('id', body.applicationId);
      }
    } catch (updateError) {
      console.error('Failed to update application with error:', updateError);
    }

    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});