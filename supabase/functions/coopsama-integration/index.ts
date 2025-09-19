import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

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
    const { applicationId, payload } = await req.json();

    console.log('📋 Processing application', { applicationId, hasPayload: !!payload });

    // Update application status to pending sync
    await supabase
      .from('applications')
      .update({ 
        coopsama_sync_status: 'pending',
        coopsama_sync_error: null,
        coopsama_synced_at: new Date().toISOString()
      })
      .eq('id', applicationId);

    console.log('📤 Sending to Coopsama microservice');

    // Send to Coopsama microservice
    const coopsamaResponse = await fetch('https://services.bowpi.com/v1/micro-coopsama/coopsama/operation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': coopsamaUserId,
        'x-user-token': coopsamaUserToken,
      },
      body: JSON.stringify(payload),
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
          coopsama_sync_error: null,
          coopsama_synced_at: new Date().toISOString()
        })
        .eq('id', applicationId);

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