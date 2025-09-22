#!/bin/bash

# Bash script to create the documents bucket in Supabase Storage
# This script uses the REST API directly

SUPABASE_URL="https://fsgzurbqrxjrjipghkcz.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzZ3p1cmJxcnhqcmppcGdoa2N6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0MzY3MjksImV4cCI6MjA3MzAxMjcyOX0.G5--8jVYpQ_DIJkv2K8cr_q0JcnyKTSs78RFUAw5C_4"

echo "🔍 Checking if documents bucket exists..."

# Check if bucket exists
BUCKETS_RESPONSE=$(curl -s "$SUPABASE_URL/storage/v1/bucket" \
  -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json")

if echo "$BUCKETS_RESPONSE" | grep -q '"id":"documents"'; then
  echo "✅ Documents bucket already exists"
  exit 0
fi

echo "📦 Documents bucket not found, attempting to create..."

# Try to create the bucket (this might fail due to permissions)
CREATE_RESPONSE=$(curl -s -X POST "$SUPABASE_URL/storage/v1/bucket" \
  -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "documents",
    "name": "documents",
    "public": true,
    "file_size_limit": 52428800,
    "allowed_mime_types": ["image/jpeg", "image/png", "image/webp", "application/pdf"]
  }')

if echo "$CREATE_RESPONSE" | grep -q '"id":"documents"'; then
  echo "✅ Documents bucket created successfully"
elif echo "$CREATE_RESPONSE" | grep -q "Unauthorized\|403"; then
  echo "⚠️ Could not create documents bucket (permission denied)"
  echo "💡 The bucket needs to be created manually in the Supabase dashboard"
  echo "   Go to: https://supabase.com/dashboard/project/fsgzurbqrxjrjipghkcz/storage/buckets"
  echo "   Create a bucket named 'documents' with public access"
else
  echo "❌ Error creating bucket: $CREATE_RESPONSE"
  exit 1
fi

echo "🎉 Script completed"
