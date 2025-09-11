import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user } = await req.json();
    
    console.log('🔧 Custom Access Token Hook called for user:', user.id);
    
    // Initialize Supabase client with service role
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Get user profile to extract tenant
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('tenant')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      // Return empty claims if profile not found (user might be in process of creation)
      return new Response(JSON.stringify({
        claims: {
          tenant: 'coopsama' // Default tenant
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('✅ Adding tenant to JWT:', profile.tenant);

    // Return custom claims
    return new Response(JSON.stringify({
      claims: {
        tenant: profile.tenant || 'coopsama'
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Error in custom-access-token-hook:', error);
    
    // Return default claims on error
    return new Response(JSON.stringify({
      claims: {
        tenant: 'coopsama'
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});