# PowerShell script to create the documents bucket in Supabase Storage
# This script uses the REST API directly

$SUPABASE_URL = "https://fsgzurbqrxjrjipghkcz.supabase.co"
$SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzZ3p1cmJxcnhqcmppcGdoa2N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0MzY3MjksImV4cCI6MjA3MzAxMjcyOX0.G5--8jVYpQ_DIJkv2K8cr_q0JcnyKTSs78RFUAw5C_4"

Write-Host "🔍 Checking if documents bucket exists..." -ForegroundColor Yellow

# Check if bucket exists
try {
    $response = Invoke-RestMethod -Uri "$SUPABASE_URL/storage/v1/bucket" -Method GET -Headers @{
        "Authorization" = "Bearer $SUPABASE_ANON_KEY"
        "Content-Type" = "application/json"
    }
    
    $documentsBucket = $response | Where-Object { $_.id -eq "documents" }
    
    if ($documentsBucket) {
        Write-Host "✅ Documents bucket already exists" -ForegroundColor Green
        exit 0
    }
    
    Write-Host "📦 Documents bucket not found, attempting to create..." -ForegroundColor Yellow
    
    # Try to create the bucket (this might fail due to permissions)
    $bucketData = @{
        id = "documents"
        name = "documents"
        public = $true
        file_size_limit = 52428800
        allowed_mime_types = @("image/jpeg", "image/png", "image/webp", "application/pdf")
    } | ConvertTo-Json
    
    try {
        $createResponse = Invoke-RestMethod -Uri "$SUPABASE_URL/storage/v1/bucket" -Method POST -Headers @{
            "Authorization" = "Bearer $SUPABASE_ANON_KEY"
            "Content-Type" = "application/json"
        } -Body $bucketData
        
        Write-Host "✅ Documents bucket created successfully" -ForegroundColor Green
    }
    catch {
        Write-Host "⚠️ Could not create documents bucket (permission denied): $($_.Exception.Message)" -ForegroundColor Yellow
        Write-Host "💡 The bucket needs to be created manually in the Supabase dashboard" -ForegroundColor Cyan
        Write-Host "   Go to: https://supabase.com/dashboard/project/fsgzurbqrxjrjipghkcz/storage/buckets" -ForegroundColor Cyan
        Write-Host "   Create a bucket named 'documents' with public access" -ForegroundColor Cyan
    }
}
catch {
    Write-Host "❌ Error checking buckets: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "🎉 Script completed" -ForegroundColor Green
