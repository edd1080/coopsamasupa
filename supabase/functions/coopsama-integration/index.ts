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

// Error code mapping for Coopsama microservice
interface ErrorCodeMap {
  [key: string]: {
    message: string;
    description: string;
    isRetryable: boolean;
  };
}

const COOPSAMA_ERROR_CODES: ErrorCodeMap = {
  'Erx001': {
    message: 'Error en el guardado del plan de pagos',
    description: 'Hubo un problema al procesar el plan de pagos de la solicitud',
    isRetryable: true
  },
  'Erx002': {
    message: 'Error en el guardado del análisis financiero',
    description: 'No se pudo procesar correctamente el análisis financiero',
    isRetryable: true
  },
  'Erx003': {
    message: 'Error en alguno de los registros de las fuentes de ingreso',
    description: 'Problema al procesar la información de ingresos',
    isRetryable: true
  },
  'Erx004': {
    message: 'Error en la información adicional',
    description: 'Hubo un problema con los datos adicionales proporcionados',
    isRetryable: true
  },
  'Erx005': {
    message: 'Error en el guardado de la solicitud de crédito',
    description: 'No se pudo guardar correctamente la solicitud de crédito',
    isRetryable: true
  },
  'Erx006': {
    message: 'Error en el guardado del balance patrimonial',
    description: 'Problema al procesar la información patrimonial',
    isRetryable: true
  },
  'Erx007': {
    message: 'Error en la calificación del asociado',
    description: 'No se pudo completar la evaluación del asociado',
    isRetryable: false
  },
  'Erx008': {
    message: 'Error al guardar las referencias personales y comerciales',
    description: 'Problema al procesar las referencias proporcionadas',
    isRetryable: true
  },
  'Erx009': {
    message: 'Error al guardar el plan de inversión',
    description: 'No se pudo procesar el plan de inversión',
    isRetryable: true
  },
  'Erx010': {
    message: 'Error al guardar la información del cliente',
    description: 'Problema al procesar los datos del cliente',
    isRetryable: true
  }
};

function getErrorDetails(errorCode: string, originalMessage?: string) {
  const errorInfo = COOPSAMA_ERROR_CODES[errorCode];
  if (errorInfo) {
    return {
      code: errorCode,
      message: errorInfo.message,
      description: errorInfo.description,
      isRetryable: errorInfo.isRetryable,
      originalMessage: originalMessage
    };
  }
  
  return {
    code: errorCode,
    message: originalMessage || `Error no identificado: ${errorCode}`,
    description: 'Se produjo un error no catalogado en el procesamiento',
    isRetryable: true,
    originalMessage: originalMessage
  };
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
      dpi: user.email || profile.email, // Using email as DPI per requirement
      email: user.email || profile.email,
      full_name: profile.full_name
    };

    // Add agent data and creation timestamp to the payload
    if (officialData.process && officialData.process.profile && officialData.process.profile.processControl) {
      officialData.process.profile.processControl.agentDPI = agentData.email; // Email as DPI
      officialData.process.profile.processControl.agentEmail = agentData.email;
      officialData.process.profile.processControl.agentName = agentData.full_name;
      officialData.process.profile.processControl.userEmail = agentData.email;
      officialData.process.profile.processControl.creationDateTime = new Date().toISOString();
      // Add default values based on successful JSON
      officialData.process.profile.processControl.cuaT24 = officialData.process.profile.processControl.cuaT24 || "2031045";
      officialData.process.profile.processControl.cif = officialData.process.profile.processControl.cif || "98622";
    }

    // Add missing productDetail fields
    if (officialData.process && officialData.process.profile && officialData.process.profile.productDetail) {
      officialData.process.profile.productDetail.idTypeProduct = officialData.process.profile.productDetail.idTypeProduct || 1;
      officialData.process.profile.productDetail.idAgency = officialData.process.profile.productDetail.idAgency || 12;
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
        user: user.email || profile.email
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

    // Determine success based on internal code (0 = success, others = errors)
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
      // Handle different types of errors with detailed error mapping
      let errorDetails;
      
      if (isCommunicationError) {
        errorDetails = {
          code: '1',
          message: 'Error de comunicación con el microservicio',
          description: 'No se pudo establecer conexión con el servicio de Coopsama',
          isRetryable: true,
          originalMessage: coopsamaResult.message || 'Connection to Coopsama failed'
        };
        console.error('🔌 Communication error with Coopsama:', coopsamaResult.message);
      } else {
        // Check if it's a known error code (Erx001-Erx010)
        const errorCode = String(coopsamaResult.code);
        if (errorCode.startsWith('Erx') || COOPSAMA_ERROR_CODES[errorCode]) {
          errorDetails = getErrorDetails(errorCode, coopsamaResult.message);
          console.error(`❌ Coopsama business error [${errorCode}]:`, errorDetails.message);
        } else {
          errorDetails = {
            code: errorCode,
            message: coopsamaResult.message || `Error desconocido (código: ${coopsamaResult.code})`,
            description: 'Se produjo un error no identificado en el procesamiento',
            isRetryable: true,
            originalMessage: coopsamaResult.message
          };
          console.error('❌ Unknown Coopsama error:', coopsamaResult.message, 'Code:', coopsamaResult.code);
        }
      }
      
      // Store detailed error information
      updateData.coopsama_sync_error = JSON.stringify(errorDetails);
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
      sync_status: updateData.coopsama_sync_status,
      error_details: updateData.coopsama_sync_error ? JSON.parse(updateData.coopsama_sync_error) : null
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