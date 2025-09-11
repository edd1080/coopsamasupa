import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const COOPSAMA_MICROSERVICE_URL = Deno.env.get('COOPSAMA_MICROSERVICE_URL') || 'http://192.168.206.48:32100/micro-coopsama/coopsama/operation';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🚀 Coopsama integration function called');
    
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Get user from JWT
    const jwt = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(jwt);
    
    if (authError || !user) {
      console.error('Authentication error:', authError);
      throw new Error('Invalid authentication');
    }

    console.log('👤 Authenticated user:', user.id);

    // Get user profile to extract tenant
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('tenant, full_name')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      console.error('Profile error:', profileError);
      throw new Error('User profile not found');
    }

    console.log('🏢 User tenant:', profile.tenant);

    // Get request payload
    const { applicationId, officialData } = await req.json();
    
    if (!applicationId || !officialData) {
      throw new Error('Missing required data: applicationId and officialData');
    }

    console.log('📋 Processing application:', applicationId);

    // Build Coopsama payload
    const coopsamaPayload = {
      processId: applicationId,
      user: profile.full_name || user.email || 'unknown',
      data: officialData
    };

    console.log('📤 Sending to Coopsama microservice...');

    // Send to Coopsama microservice
    const coopsamaResponse = await fetch(COOPSAMA_MICROSERVICE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Tenant': profile.tenant, // Include tenant in header
      },
      body: JSON.stringify(coopsamaPayload)
    });

    const coopsamaResult = await coopsamaResponse.json();
    
    console.log('📥 Coopsama response:', {
      status: coopsamaResponse.status,
      success: coopsamaResult.success,
      code: coopsamaResult.code
    });

    // Update application with Coopsama response
    const updateData: any = {
      coopsama_sync_status: coopsamaResult.success ? 'success' : 'error',
      coopsama_synced_at: new Date().toISOString()
    };

    if (coopsamaResult.success && coopsamaResult.data) {
      updateData.coopsama_operation_id = coopsamaResult.data.processId;
      updateData.coopsama_external_reference_id = coopsamaResult.data.externalReferenceId;
    } else {
      updateData.coopsama_sync_error = coopsamaResult.message || 'Unknown error';
    }

    // Update application in Supabase
    const { error: updateError } = await supabase
      .from('applications')
      .update(updateData)
      .eq('id', applicationId);

    if (updateError) {
      console.error('❌ Error updating application:', updateError);
      // Don't throw here, just log the error
    }

    console.log('✅ Coopsama integration completed successfully');

    return new Response(JSON.stringify({
      success: true,
      coopsama_response: coopsamaResult,
      sync_status: updateData.coopsama_sync_status
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Error in coopsama-integration:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Unknown error occurred'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});