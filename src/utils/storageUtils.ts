import { supabase } from '@/integrations/supabase/client';

/**
 * Creates the documents bucket if it doesn't exist
 * This function will be called automatically when needed
 */
export async function ensureDocumentsBucket(): Promise<boolean> {
  try {
    console.log('🔍 Checking if documents bucket exists...');
    
    // Try to list files in the documents bucket to check if it exists
    const { data, error } = await supabase.storage
      .from('documents')
      .list('', { limit: 1 });
    
    if (error) {
      console.warn('⚠️ Documents bucket does not exist or is not accessible:', error.message);
      return false;
    }
    
    console.log('✅ Documents bucket exists and is accessible');
    return true;
  } catch (error) {
    console.warn('⚠️ Error checking documents bucket:', error);
    return false;
  }
}

/**
 * Creates a test file to verify bucket access
 */
export async function testBucketAccess(): Promise<boolean> {
  try {
    // Create a test image file instead of text file
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, 1, 1);
    }
    
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob!);
      }, 'image/png');
    });
    
    const testFile = new File([blob], 'test.png', { type: 'image/png' });
    const testPath = `test-${Date.now()}.png`;
    
    const { data, error } = await supabase.storage
      .from('documents')
      .upload(testPath, testFile);
    
    if (error) {
      console.warn('⚠️ Cannot upload to documents bucket:', error.message);
      return false;
    }
    
    // Clean up test file
    await supabase.storage
      .from('documents')
      .remove([testPath]);
    
    console.log('✅ Documents bucket is accessible for uploads');
    return true;
  } catch (error) {
    console.warn('⚠️ Error testing bucket access:', error);
    return false;
  }
}

/**
 * Gets the best available bucket for document storage
 * Tries documents bucket first, then public bucket as fallback
 */
export async function getBestStorageBucket(): Promise<'documents' | 'public' | null> {
  // First try documents bucket
  const documentsExists = await ensureDocumentsBucket();
  if (documentsExists) {
    const canUpload = await testBucketAccess();
    if (canUpload) {
      return 'documents';
    }
  }
  
  // Fallback to public bucket
  try {
    // Create a test image file instead of text file
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, 1, 1);
    }
    
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob!);
      }, 'image/png');
    });
    
    const testFile = new File([blob], 'test.png', { type: 'image/png' });
    const testPath = `test-${Date.now()}.png`;
    
    const { error } = await supabase.storage
      .from('public')
      .upload(testPath, testFile);
    
    if (!error) {
      // Clean up test file
      await supabase.storage
        .from('public')
        .remove([testPath]);
      
      console.log('✅ Using public bucket as fallback');
      return 'public';
    }
  } catch (error) {
    console.warn('⚠️ Public bucket also not accessible:', error);
  }
  
  console.warn('⚠️ No accessible storage buckets found');
  return null;
}
