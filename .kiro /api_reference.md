# Coopsama App - API Reference

## Supabase Integration

### Authentication API

#### Sign In
```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
});
```

#### Sign Up
```typescript
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
  options: {
    data: {
      full_name: 'John Doe',
      role: 'credit_agent',
      agency_id: 'agency_123'
    }
  }
});
```

#### Sign Out
```typescript
const { error } = await supabase.auth.signOut();
```

#### Get Current User
```typescript
const { data: { user } } = await supabase.auth.getUser();
```

### Database API

#### Applications Table
```typescript
// Get all applications for current user
const { data, error } = await supabase
  .from('applications')
  .select('*')
  .eq('agent_id', user.id)
  .order('created_at', { ascending: false });

// Get single application
const { data, error } = await supabase
  .from('applications')
  .select('*')
  .eq('id', applicationId)
  .single();

// Create new application
const { data, error } = await supabase
  .from('applications')
  .insert({
    agent_id: user.id,
    client_name: 'John Doe',
    status: 'draft',
    draft_data: formData
  })
  .select()
  .single();

// Update application
const { data, error } = await supabase
  .from('applications')
  .update({
    status: 'submitted',
    submitted_at: new Date().toISOString()
  })
  .eq('id', applicationId)
  .select()
  .single();

// Delete application
const { error } = await supabase
  .from('applications')
  .delete()
  .eq('id', applicationId);
```

#### User Profiles Table
```typescript
// Get user profile
const { data, error } = await supabase
  .from('user_profiles')
  .select('*')
  .eq('user_id', user.id)
  .single();

// Update user profile
const { data, error } = await supabase
  .from('user_profiles')
  .update({
    full_name: 'Updated Name',
    phone: '+50212345678',
    agency_id: 'new_agency'
  })
  .eq('user_id', user.id)
  .select()
  .single();
```

#### Application Documents Table
```typescript
// Get application documents
const { data, error } = await supabase
  .from('application_documents')
  .select('*')
  .eq('application_id', applicationId);

// Create document record
const { data, error } = await supabase
  .from('application_documents')
  .insert({
    application_id: applicationId,
    document_type: 'dpi_front',
    file_path: 'documents/dpi_front_123.jpg',
    file_size: 1024000,
    mime_type: 'image/jpeg'
  })
  .select()
  .single();
```

#### Application References Table
```typescript
// Get application references
const { data, error } = await supabase
  .from('application_references')
  .select('*')
  .eq('application_id', applicationId);

// Create reference
const { data, error } = await supabase
  .from('application_references')
  .insert({
    application_id: applicationId,
    reference_type: 'personal',
    full_name: 'Jane Smith',
    phone: '+50298765432',
    relation: 'friend',
    address: '123 Main St'
  })
  .select()
  .single();
```

### Storage API

#### Upload File
```typescript
const { data, error } = await supabase.storage
  .from('application-documents')
  .upload(`documents/${fileName}`, file, {
    cacheControl: '3600',
    upsert: false
  });
```

#### Download File
```typescript
const { data, error } = await supabase.storage
  .from('application-documents')
  .download(`documents/${fileName}`);
```

#### Get Public URL
```typescript
const { data } = supabase.storage
  .from('application-documents')
  .getPublicUrl(`documents/${fileName}`);
```

#### Delete File
```typescript
const { data, error } = await supabase.storage
  .from('application-documents')
  .remove([`documents/${fileName}`]);
```

## Custom Hooks API

### useAuth
```typescript
const {
  user,
  session,
  loading,
  signIn,
  signUp,
  signOut
} = useAuth();
```

### useApplicationData
```typescript
const {
  data: application,
  isLoading,
  error,
  refetch
} = useApplicationData(applicationId);
```

### useApplicationMetrics
```typescript
const {
  data: metrics,
  isLoading,
  error
} = useApplicationMetrics();

// Returns:
// {
//   active: number,
//   sent: number,
//   reviewing: number,
//   failed: number
// }
```

### useApplicationsList
```typescript
const {
  data: applications,
  isLoading,
  error,
  refetch
} = useApplicationsList({
  status: 'draft', // optional filter
  limit: 10, // optional limit
  offset: 0 // optional offset
});
```

### useSaveDraft
```typescript
const saveDraftMutation = useSaveDraft();

// Usage
saveDraftMutation.mutate({
  formData: formData,
  currentStep: 2,
  currentSubStep: 1,
  isIncremental: false
});
```

### useFinalizeApplication
```typescript
const finalizeApplicationMutation = useFinalizeApplication();

// Usage
finalizeApplicationMutation.mutate(formData, {
  onSuccess: (result) => {
    console.log('Application submitted:', result);
  },
  onError: (error) => {
    console.error('Submission failed:', error);
  }
});
```

### useDocumentManager
```typescript
const {
  uploadDocument,
  deleteDocument,
  getDocumentUrl,
  isUploading
} = useDocumentManager(applicationId);
```

### usePWA
```typescript
const {
  isLoading,
  updateAvailable,
  updateApp,
  installPrompt,
  showInstallPrompt
} = usePWA();
```

## Form Context API

### FormProvider
```typescript
<FormProvider
  steps={formSteps}
  onNavigateAfterExit={() => navigate('/applications')}
  onRedirectSubmittedApplication={(id) => navigate(`/applications/${id}`)}
>
  {children}
</FormProvider>
```

### useFormContext
```typescript
const {
  // Form state
  formData,
  updateFormData,
  
  // Navigation
  currentStep,
  subStep,
  handleNext,
  handlePrevious,
  handleSubNext,
  handleSubPrevious,
  goToStep,
  
  // Section status
  sectionStatus,
  updateSectionStatus,
  
  // Form actions
  handleSaveDraft,
  handleSubmit,
  
  // References
  references,
  addReference,
  removeReference,
  updateReference,
  
  // Exit handling
  showExitDialog,
  setShowExitDialog,
  handleExit,
  hasUnsavedChanges
} = useFormContext();
```

## Utility Functions API

### Application ID Generation
```typescript
import { 
  generateApplicationId, 
  formatApplicationId, 
  getApplicationNumber 
} from '@/utils/applicationIdGenerator';

// Generate new ID
const newId = generateApplicationId(); // "SCO_123456"

// Format existing ID
const formatted = formatApplicationId("123456"); // "SCO_123456"

// Get number part
const number = getApplicationNumber("SCO_123456"); // "123456"
```

### DPI Validation
```typescript
import { validateDPI } from '@/utils/dpiValidation';

const isValid = validateDPI("1234567890123"); // boolean
```

### Date Formatting
```typescript
import { formatDateToGuatemalan } from '@/utils/dateUtils';

const formatted = formatDateToGuatemalan("2024-01-15"); // "15/01/2024"
```

### Currency Formatting
```typescript
import { formatCurrencyWithSymbol } from '@/utils/formatters';

const formatted = formatCurrencyWithSymbol("15000"); // "Q15,000.00"
```

### Prequalification Engine
```typescript
import { evaluatePrequalification } from '@/utils/prequalificationEngine';

const result = evaluatePrequalification({
  nombre_completo: "John Doe",
  dpi: "1234567890123",
  telefono: "+50212345678",
  actividad_economica: "agriculture",
  ingreso_mensual: 5000,
  destino_credito: "production",
  monto_solicitado: 10000,
  historial: "good"
});

// Returns:
// {
//   status: 'green' | 'yellow' | 'red',
//   reason: string,
//   canProceed: boolean,
//   requiresAdditionalData: boolean
// }
```

## Error Handling

### API Errors
```typescript
try {
  const { data, error } = await supabase
    .from('applications')
    .select('*');
    
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
} catch (error) {
  console.error('API Error:', error);
  throw error;
}
```

### Form Validation Errors
```typescript
const schema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  dpi: z.string().regex(/^\d{13}$/, 'Invalid DPI format'),
  email: z.string().email('Invalid email format')
});

const result = schema.safeParse(formData);
if (!result.success) {
  const errors = result.error.flatten().fieldErrors;
  // Handle validation errors
}
```

### Network Errors
```typescript
const { toast } = useToast();

const handleError = (error: Error) => {
  if (error.message.includes('Failed to fetch')) {
    toast({
      title: "Connection Error",
      description: "Please check your internet connection",
      variant: "destructive"
    });
  } else {
    toast({
      title: "Error",
      description: error.message,
      variant: "destructive"
    });
  }
};
```

## Offline Support

### Offline Detection
```typescript
const [isOnline, setIsOnline] = useState(navigator.onLine);

useEffect(() => {
  const handleOnline = () => setIsOnline(true);
  const handleOffline = () => setIsOnline(false);
  
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);
  
  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}, []);
```

### Offline Queue
```typescript
import { addToOfflineQueue, processOfflineQueue } from '@/utils/offlineQueue';

// Add action to offline queue
addToOfflineQueue({
  type: 'SAVE_DRAFT',
  data: formData,
  timestamp: Date.now()
});

// Process queue when online
if (isOnline) {
  processOfflineQueue();
}
```

This API reference provides comprehensive documentation for all the key interfaces and functions available in the Coopsama App, enabling developers to effectively work with the codebase.
