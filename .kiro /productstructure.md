# Coopsama App - Project Structure & Code Organization

## Project Overview

The Coopsama App follows a **feature-based architecture** with clear separation of concerns, making it maintainable and scalable for a team of developers working on a Guatemalan credit management system.

## Root Directory Structure

```
coopsamasupa/
├── .kiro/                    # Project documentation and context
├── public/                   # Static assets and PWA files
├── src/                      # Source code
├── supabase/                 # Database migrations and functions
├── scripts/                  # Utility scripts and tools
├── package.json              # Dependencies and scripts
├── vite.config.ts           # Build configuration
├── capacitor.config.ts      # Mobile app configuration
├── tailwind.config.ts       # Styling configuration
└── components.json          # shadcn/ui configuration
```

## Source Code Organization (`src/`)

### Core Application Files
```
src/
├── App.tsx                   # Main application component
├── main.tsx                  # Application entry point
├── index.css                 # Global styles and Tailwind imports
└── vite-env.d.ts            # Vite type definitions
```

### Component Architecture (`src/components/`)

#### Feature-Based Organization
```
components/
├── applications/             # Application management
│   ├── ApplicationCard.tsx
│   ├── ApplicationDetails.tsx
│   ├── ApplicationForm.tsx
│   ├── ApplicationList.tsx
│   ├── ApplicationMetrics.tsx
│   ├── ApplicationSearch.tsx
│   └── ApplicationsHeader.tsx
├── auth/                    # Authentication
│   ├── AuthRouter.tsx
│   ├── LoginForm.tsx
│   ├── ProtectedRoute.tsx
│   └── SignUpForm.tsx
├── documents/               # Document handling
│   ├── InteractiveDocumentCard.tsx
│   └── SignatureCanvas.tsx
├── forms/                   # Reusable form components
│   ├── FormField.tsx
│   └── FormSection.tsx
├── layout/                  # Layout components
│   ├── Header.tsx
│   └── BottomNavigation.tsx
├── navigation/              # Navigation components
│   └── NavigationMenu.tsx
├── prequalification/        # Risk assessment
│   ├── PrequalificationForm.tsx
│   ├── PrequalificationResult.tsx
│   └── PrequalificationRules.tsx
├── pwa/                     # PWA-specific components
│   ├── InstallPrompt.tsx
│   ├── OfflineBanner.tsx
│   ├── SplashScreen.tsx
│   └── UpdatePrompt.tsx
├── requestForm/             # Multi-step form (52 files)
│   ├── RequestFormProvider.tsx
│   ├── PersonalIdStep.tsx
│   ├── ContactStep.tsx
│   ├── CreditInfoStep.tsx
│   ├── FinancialStep.tsx
│   ├── ReferencesStep.tsx
│   ├── DocumentsStep.tsx
│   ├── ReviewStep.tsx
│   └── [44 more step components]
├── settings/                # Settings and configuration
│   ├── ProfileSettings.tsx
│   ├── ThemeSettings.tsx
│   ├── NotificationSettings.tsx
│   └── DeviceInfo.tsx
└── ui/                      # Base UI components (shadcn/ui)
    ├── button.tsx
    ├── card.tsx
    ├── input.tsx
    ├── [48 more UI components]
    └── index.ts
```

### Context Management (`src/context/`)
```
context/
├── FormContext.tsx          # Form state management
└── ThemeContext.tsx         # Theme management
```

### Data Layer (`src/data/`)
```
data/
├── catalogs/                # Static data catalogs
│   ├── guatemalaLocations.ts
│   ├── occupations.ts
│   ├── professions.ts
│   └── [23 more catalog files]
├── prequalificationRules.json
└── [other data files]
```

### Custom Hooks (`src/hooks/`)
```
hooks/
├── useAuth.tsx              # Authentication logic
├── useApplicationActions.tsx
├── useApplicationData.tsx
├── useApplicationMetrics.tsx
├── useApplicationsList.tsx
├── useDocumentManager.tsx
├── useDraftActions.tsx
├── useFinalizeApplication.tsx
├── useFormPersistence.tsx
├── useIncrementalSave.tsx
├── useNetworkSync.tsx
├── useOfflineStorage.tsx
├── usePrequalificationActions.tsx
├── usePrequalifications.ts
├── usePWA.tsx
├── useSecureAuth.tsx
├── useSecurityHeaders.tsx
├── useSecurityMonitoring.tsx
├── useSessionTimeout.tsx
├── useSupabaseQuery.tsx
├── useUpdateProfile.tsx
├── useUserProfile.tsx
├── useWeeklyApplications.tsx
├── use-mobile.tsx
├── use-toast.ts
├── toast-state.ts
├── toast-timeouts.ts
└── toast-types.ts
```

### Integration Layer (`src/integrations/`)
```
integrations/
└── supabase/
    ├── client.ts            # Supabase client configuration
    └── types.ts             # Database type definitions
```

### Utility Libraries (`src/lib/`)
```
lib/
├── nameUtils.ts             # Name formatting utilities
└── utils.ts                 # General utility functions
```

### Page Components (`src/pages/`)
```
pages/
├── Alerts.tsx
├── ApplicationDetails.tsx
├── Applications.tsx
├── ChangePassword.tsx
├── Index.tsx                # Dashboard
├── Login.tsx
├── NotFound.tsx
├── PersonalInfo.tsx
├── Prequalifications.tsx
├── ProspectDetails.tsx
├── Prospects.tsx
├── ReportProblem.tsx
├── RequestForm.tsx          # Main form page
└── Settings.tsx
```

### Utility Functions (`src/utils/`)
```
utils/
├── applicationIdGenerator.ts
├── coopsamaPayloadValidator.ts
├── dateUtils.ts
├── dpiValidation.ts
├── fieldMapper.ts
├── fieldNavigation.ts
├── formatters.ts
├── inputValidation.ts
├── nameExtraction.ts
├── offlineQueue.ts
├── prequalificationEngine.ts
├── processIdGenerator.ts
├── securityUtils.ts
├── storageUtils.ts
└── testDataGenerator.ts
```

## Database Structure (`supabase/`)

### Migrations
```
supabase/migrations/
├── 20250615191625-*.sql     # Initial schema
├── 20250615192557-*.sql     # User profiles
├── 20250615193617-*.sql     # Applications table
├── 20250616045545-*.sql     # Documents table
├── 20250616210335-*.sql     # References table
├── 20250619044335-*.sql     # Prequalifications
├── 20250619063423-*.sql     # RLS policies
├── 20250909173455_*.sql     # Additional features
├── 20250911220344_*.sql     # Storage policies
├── 20250911220651_*.sql     # Indexes
├── 20250916212228_*.sql     # Performance optimizations
├── 20250917211746_*.sql     # Security enhancements
├── 20250919044200_*.sql     # Application status updates
├── 20250919050350_*.sql     # Document metadata
└── 20250919214617_*.sql     # Final schema updates
```

### Edge Functions
```
supabase/functions/
├── coopsama-integration/    # Credit processing integration
├── coopsama-test/          # Testing endpoints
└── custom-access-token-hook/ # Authentication hooks
```

## Configuration Files

### Build Configuration
- **`vite.config.ts`**: Vite build configuration with PWA plugin
- **`capacitor.config.ts`**: Mobile app configuration
- **`tailwind.config.ts`**: Tailwind CSS configuration
- **`tsconfig.json`**: TypeScript configuration
- **`eslint.config.js`**: ESLint configuration

### Package Management
- **`package.json`**: Dependencies and scripts
- **`components.json`**: shadcn/ui component configuration

## Code Organization Patterns

### 1. Feature-Based Components
Each major feature has its own directory with related components:
```
components/
├── applications/            # All application-related components
├── auth/                   # All authentication components
├── documents/              # All document-related components
└── requestForm/            # All form-related components
```

### 2. Custom Hooks Pattern
Business logic is encapsulated in custom hooks:
```typescript
// Example: useApplicationMetrics.tsx
export const useApplicationMetrics = () => {
  return useQuery({
    queryKey: ['application-metrics'],
    queryFn: fetchApplicationMetrics,
    staleTime: 5 * 60 * 1000,
  });
};
```

### 3. Context Provider Pattern
Global state is managed through React Context:
```typescript
// Example: FormContext.tsx
export const FormProvider: React.FC<FormProviderProps> = ({ children }) => {
  const [formData, setFormData] = useState<FormData>(initialData);
  // ... other state and methods
  
  return (
    <FormContext.Provider value={contextValue}>
      {children}
    </FormContext.Provider>
  );
};
```

### 4. Utility-First Organization
Utility functions are organized by domain:
```
utils/
├── applicationIdGenerator.ts    # ID generation
├── dpiValidation.ts             # Guatemalan DPI validation
├── prequalificationEngine.ts    # Risk assessment
├── securityUtils.ts             # Security functions
└── storageUtils.ts              # Storage operations
```

### 5. Data Catalog Pattern
Static data is organized in catalogs:
```
data/catalogs/
├── guatemalaLocations.ts        # Guatemalan geography
├── occupations.ts               # Occupation codes
├── professions.ts               # Profession codes
└── [23 more catalog files]      # Other static data
```

## File Naming Conventions

### Components
- **PascalCase**: `ApplicationCard.tsx`, `RequestFormProvider.tsx`
- **Descriptive Names**: Clear indication of component purpose
- **Suffix Patterns**: 
  - `*Provider.tsx` for context providers
  - `*Form.tsx` for form components
  - `*Card.tsx` for card components
  - `*Step.tsx` for form step components

### Hooks
- **camelCase with use prefix**: `useApplicationMetrics.tsx`
- **Descriptive Names**: Clear indication of hook purpose
- **Domain-specific**: Hooks grouped by business domain

### Utilities
- **camelCase**: `applicationIdGenerator.ts`
- **Descriptive Names**: Clear indication of utility purpose
- **Domain-specific**: Utilities grouped by functionality

### Pages
- **PascalCase**: `ApplicationDetails.tsx`, `RequestForm.tsx`
- **Route-aligned**: Page names match route structure
- **Descriptive Names**: Clear indication of page purpose

## Import/Export Patterns

### Absolute Imports
```typescript
// Using path alias @ for src directory
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { formatCurrency } from '@/utils/formatters';
```

### Component Exports
```typescript
// Default export for main component
export default ApplicationCard;

// Named exports for utilities
export { formatApplicationId, generateApplicationId };
```

### Hook Exports
```typescript
// Named export for custom hooks
export const useApplicationMetrics = () => {
  // hook implementation
};
```

## Development Guidelines

### Component Structure
1. **Imports**: External libraries first, then internal imports
2. **Types/Interfaces**: Define component props and state types
3. **Component Definition**: Main component logic
4. **Exports**: Default export for main component

### Hook Structure
1. **Imports**: Dependencies and utilities
2. **Type Definitions**: Hook return type and parameters
3. **Hook Implementation**: Main hook logic
4. **Exports**: Named export for hook

### File Organization
1. **Single Responsibility**: Each file has one clear purpose
2. **Co-location**: Related files are kept together
3. **Consistent Naming**: Follow established naming patterns
4. **Clear Exports**: Explicit import/export statements

## Scalability Considerations

### Adding New Features
1. Create feature directory in `components/`
2. Add related hooks in `hooks/`
3. Add utilities in `utils/`
4. Add pages in `pages/`
5. Update routing in `App.tsx`

### Adding New Data Sources
1. Add integration in `integrations/`
2. Create custom hooks for data access
3. Add type definitions
4. Update context providers if needed

### Adding New UI Components
1. Add to `components/ui/` for base components
2. Add to feature directory for feature-specific components
3. Update `components.json` for shadcn/ui components
4. Add to component index if needed

This structure provides a clear, maintainable foundation for the Coopsama App, enabling efficient development and easy onboarding of new team members.
