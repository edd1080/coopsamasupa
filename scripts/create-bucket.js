#!/usr/bin/env node

/**
 * Script to create the documents bucket in Supabase Storage
 * This script should be run with the service role key
 */

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://fsgzurbqrxjrjipghkcz.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY environment variable is required');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createDocumentsBucket() {
  try {
    console.log('🔍 Checking if documents bucket exists...');
    
    // Check if bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('❌ Error listing buckets:', listError);
      return false;
    }
    
    const documentsBucket = buckets.find(bucket => bucket.id === 'documents');
    
    if (documentsBucket) {
      console.log('✅ Documents bucket already exists');
      return true;
    }
    
    console.log('📦 Creating documents bucket...');
    
    // Create the bucket
    const { data, error } = await supabase.storage.createBucket('documents', {
      public: true,
      fileSizeLimit: 52428800, // 50MB
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
    });
    
    if (error) {
      console.error('❌ Error creating bucket:', error);
      return false;
    }
    
    console.log('✅ Documents bucket created successfully:', data);
    
    // Test upload
    console.log('🧪 Testing bucket access...');
    const testFile = new File(['test content'], 'test.txt', { type: 'text/plain' });
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload('test/test.txt', testFile);
    
    if (uploadError) {
      console.warn('⚠️ Test upload failed:', uploadError);
    } else {
      console.log('✅ Test upload successful');
      
      // Clean up test file
      await supabase.storage
        .from('documents')
        .remove(['test/test.txt']);
      
      console.log('🧹 Test file cleaned up');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return false;
  }
}

// Run the script
createDocumentsBucket()
  .then(success => {
    if (success) {
      console.log('🎉 Bucket creation completed successfully');
      process.exit(0);
    } else {
      console.log('💥 Bucket creation failed');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('💥 Script error:', error);
    process.exit(1);
  });
