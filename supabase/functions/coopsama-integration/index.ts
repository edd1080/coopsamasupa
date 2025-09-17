import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const COOPSAMA_MICROSERVICE_URL = 'https://services.bowpi.com/v1/micro-coopsama/coopsama/operation';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

// Tenant credentials mapping
interface TenantCredentials {
  userId: string;
  userToken: string;
}

function getTenantCredentials(tenant: string): TenantCredentials | null {
  switch (tenant) {
    case 'coopsama':
      const coopsamaUserId = Deno.env.get('COOPSAMA_USER_ID');
      const coopsamaUserToken = Deno.env.get('COOPSAMA_USER_TOKEN');
      if (!coopsamaUserId || !coopsamaUserToken) {
        console.error('Missing Coopsama credentials in environment variables');
        return null;
      }
      return {
        userId: coopsamaUserId,
        userToken: coopsamaUserToken
      };
    
    case 'cosmos':
      const cosmosUserId = Deno.env.get('COSMOS_USER_ID');
      const cosmosUserToken = Deno.env.get('COSMOS_USER_TOKEN');
      if (!cosmosUserId || !cosmosUserToken) {
        console.error('Missing Cosmos credentials in environment variables');
        return null;
      }
      return {
        userId: cosmosUserId,
        userToken: cosmosUserToken
      };
    
    case 'cch':
      const cchUserId = Deno.env.get('CCH_USER_ID');
      const cchUserToken = Deno.env.get('CCH_USER_TOKEN');
      if (!cchUserId || !cchUserToken) {
        console.error('Missing CCH credentials in environment variables');
        return null;
      }
      return {
        userId: cchUserId,
        userToken: cchUserToken
      };
    
    case 'ptc':
      const ptcUserId = Deno.env.get('PTC_USER_ID');
      const ptcUserToken = Deno.env.get('PTC_USER_TOKEN');
      if (!ptcUserId || !ptcUserToken) {
        console.error('Missing PTC credentials in environment variables');
        return null;
      }
      return {
        userId: ptcUserId,
        userToken: ptcUserToken
      };
    
    default:
      console.error(`Unknown tenant: ${tenant}`);
      return null;
  }
}

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

    // Get user profile to extract tenant and agent data
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('tenant, full_name, email, phone, agency_id')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      console.error('Profile error:', profileError);
      throw new Error('User profile not found');
    }

    console.log('🏢 User tenant:', profile.tenant);

    // Get tenant credentials from environment variables
    const tenantCredentials = getTenantCredentials(profile.tenant);
    if (!tenantCredentials) {
      throw new Error(`No credentials configured for tenant: ${profile.tenant}`);
    }

    // Get request payload
    const { applicationId, officialData } = await req.json();
    
    if (!applicationId || !officialData) {
      throw new Error('Missing required data: applicationId and officialData');
    }

    console.log('📋 Processing application:', applicationId);

    // Enrich official data with agent information
    const agentData = {
      dpi: profile.phone, // Using phone as DPI placeholder - should be updated with actual DPI field
      email: user.email || profile.email,
      full_name: profile.full_name
    };

    // Add agent data and creation timestamp to the payload
    if (officialData.process && officialData.process.profile && officialData.process.profile.processControl) {
      officialData.process.profile.processControl.agentDPI = agentData.dpi;
      officialData.process.profile.processControl.agentEmail = agentData.email;
      officialData.process.profile.processControl.agentName = agentData.full_name;
      officialData.process.profile.processControl.creationDateTime = new Date().toISOString();
    }

    // Log the official data payload for debugging
    console.log('🔍 Official Data Payload:', JSON.stringify(officialData, null, 2));
    
    // Log destination mapping details for debugging
    console.log('🎯 Destination Mapping Details:', {
      originalDestinationGroup: officialData?.process?.profile?.productDetail?.fundsDestination?.group,
      originalDestination: officialData?.process?.profile?.productDetail?.fundsDestination?.destination,
      originalCategory: officialData?.process?.profile?.productDetail?.fundsDestination?.destinationCategory
    });
    
    // Log comprehensive field mappings for debugging
    console.log('🔍 Detailed Field Mappings Analysis:', {
      personalDocument: {
        gender: {
          mapped: officialData?.process?.profile?.personalDocument?.gender,
          expected: 'Should be MUJER/HOMBRE with valid ID'
        },
        maritalStatus: {
          mapped: officialData?.process?.profile?.personalDocument?.maritalStatus,
          expected: 'Should be SOLTERO/CASADO/etc with valid ID'
        },
        occupation: {
          mapped: officialData?.process?.profile?.personalDocument?.occupation,
          expected: 'Should be COMERCIANTE, not NINGUNA for Comercio'
        },
        academicTitle: {
          mapped: officialData?.process?.profile?.personalDocument?.academicTitle,
          expected: 'Should match profession mapping'
        },
        housingStability: {
          mapped: officialData?.process?.profile?.personalDocument?.housingStability,
          expected: 'Should have valid stability period'
        }
      },
      personData: {
        academicDegree: {
          mapped: officialData?.process?.profile?.personData?.academicDegree,
          expected: 'Should be SUPERIOR for university level'
        },
        ethnicity: {
          mapped: officialData?.process?.profile?.personData?.ethnicity,
          expected: 'Should have valid ethnicity mapping'
        }
      },
      productDetail: {
        destination: {
          mapped: officialData?.process?.profile?.productDetail?.fundsDestination,
          expected: 'Should have group, destination and category'
        }
      },
      income: {
        sources: officialData?.process?.profile?.income?.map(inc => ({
          source: inc.incomeSource,
          amount: inc.monthlyIncome,
          main: inc.mainIncomeSource
        })),
        expected: 'Should have proper income source mapping'
      }
    });

    // Build Coopsama payload
    const coopsamaPayload = {
      data: officialData,
      metadata: {
        processId: applicationId,
        user: profile.full_name || user.email || 'unknown'
      }
    };

    console.log('📤 Sending to Coopsama microservice with credentials for tenant:', profile.tenant);
    console.log('📦 Full Coopsama Payload:', JSON.stringify(coopsamaPayload, null, 2));

    // Send to Coopsama microservice with tenant-specific credentials
    const coopsamaResponse = await fetch(COOPSAMA_MICROSERVICE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': tenantCredentials.userId,
        'x-user-token': tenantCredentials.userToken,
      },
      body: JSON.stringify(coopsamaPayload)
    });

    // Validate HTTP status first
    if (coopsamaResponse.status !== 200) {
      console.error('❌ Unexpected HTTP status from Coopsama:', coopsamaResponse.status);
      // Try to get response text for more details
      try {
        const errorText = await coopsamaResponse.text();
        console.error('❌ Error response body:', errorText);
      } catch (e) {
        console.error('❌ Could not read error response body');
      }
      throw new Error(`Microservice returned HTTP ${coopsamaResponse.status}`);
    }

    const coopsamaResult = await coopsamaResponse.json();
    
    console.log('📥 Coopsama response details:', {
      httpStatus: coopsamaResponse.status,
      internalCode: coopsamaResult.code,
      success: coopsamaResult.success,
      message: coopsamaResult.message,
      hasData: !!coopsamaResult.data
    });

    // Validate response structure
    if (typeof coopsamaResult.code === 'undefined') {
      console.error('❌ Invalid response structure - missing code field');
      throw new Error('Invalid microservice response format');
    }

    // Determine success based on internal code (0 = success, 1 = communication error)
    const isSuccess = coopsamaResult.code === 0;
    const isCommunicationError = coopsamaResult.code === 1;

    // Update application with Coopsama response
    const updateData: any = {
      coopsama_sync_status: isSuccess ? 'success' : 'error',
      coopsama_synced_at: new Date().toISOString()
    };

    if (isSuccess && coopsamaResult.data) {
      // Map the correct field names according to specifications
      updateData.coopsama_operation_id = coopsamaResult.data.operationId;
      updateData.coopsama_external_reference_id = coopsamaResult.data.externalReferenceId;
      console.log('✅ Success - Mapped operation ID:', updateData.coopsama_operation_id);
    } else {
      // Handle different types of errors
      if (isCommunicationError) {
        updateData.coopsama_sync_error = `Communication error: ${coopsamaResult.message || 'Connection to Coopsama failed'}`;
        console.error('🔌 Communication error with Coopsama:', coopsamaResult.message);
      } else {
        updateData.coopsama_sync_error = coopsamaResult.message || `Unknown error (code: ${coopsamaResult.code})`;
        console.error('❌ Coopsama error:', coopsamaResult.message, 'Code:', coopsamaResult.code);
      }
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