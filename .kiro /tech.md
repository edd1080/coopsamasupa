# Coopsama App - Technical Architecture

## Tech Stack Overview

### Frontend Framework
- **React 18.3.1** with TypeScript for type safety
- **Vite** as build tool and development server
- **React Router DOM 6.26.2** for client-side routing
- **SWC** for fast compilation and hot reload

### UI/UX Framework
- **Tailwind CSS 3.4.11** for utility-first styling
- **Radix UI** components for accessible headless UI primitives
- **Lucide React** for consistent iconography
- **Next Themes** for dark/light mode support
- **Class Variance Authority** for component variant management

### State Management
- **TanStack Query 5.56.2** for server state management
- **React Context** for client state and form management
- **LocalForage** for offline data persistence
- **React Query Persist Client** for query cache persistence

### Backend & Database
- **Supabase** as Backend-as-a-Service (BaaS)
- **PostgreSQL** database with Row Level Security (RLS)
- **Supabase Auth** for authentication and user management
- **Supabase Storage** for file and document management

### Forms & Validation
- **React Hook Form 7.53.0** for form state management
- **Zod 3.23.8** for schema validation
- **Hookform Resolvers** for form validation integration

### PWA & Mobile
- **Capacitor 7.4.3** for native mobile functionality
- **Vite PWA Plugin** for service worker generation
- **Workbox** for advanced caching strategies
- **Native Camera API** for document capture

### Maps & Geolocation
- **Leaflet 1.9.4** for interactive maps
- **React Leaflet 5.0.0** as React wrapper

### Charts & Visualization
- **Recharts 2.12.7** for data visualization and dashboards

### Utilities
- **Date-fns 4.1.0** for date manipulation
- **Lodash 4.17.21** for utility functions
- **CLSX & Tailwind Merge** for className utilities
- **DOMPurify** for XSS protection

## Architecture Patterns

### Component Architecture
```
src/
├── components/           # Feature-based component organization
│   ├── applications/    # Application management components
│   ├── auth/           # Authentication components
│   ├── documents/      # Document handling components
│   ├── forms/          # Reusable form components
│   ├── layout/         # Layout and navigation components
│   ├── prequalification/ # Prequalification components
│   ├── pwa/            # PWA-specific components
│   ├── requestForm/    # Multi-step form components
│   ├── settings/       # Settings and configuration
│   └── ui/             # Base UI components (shadcn/ui)
```

### State Management Patterns
- **Server State**: TanStack Query for API data and caching
- **Client State**: React Context for form data and UI state
- **Offline State**: LocalForage for persistent local storage
- **Form State**: React Hook Form with Zod validation

### Data Flow Architecture
```
User Action → Component → Hook → TanStack Query → Supabase API → Database
     ↓
LocalForage (Offline Cache) ← React Context (Form State)
```

## Key Technical Patterns

### 1. Custom Hooks Pattern
```typescript
// Example: useApplicationMetrics.tsx
export const useApplicationMetrics = () => {
  return useQuery({
    queryKey: ['application-metrics'],
    queryFn: fetchApplicationMetrics,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
  });
};
```

### 2. Context Provider Pattern
```typescript
// Example: FormContext.tsx
export const FormProvider: React.FC<FormProviderProps> = ({ children }) => {
  const [formData, setFormData] = useState<FormData>(initialData);
  const [sectionStatus, setSectionStatus] = useState<Record<string, 'pending' | 'complete'>>({});
  
  return (
    <FormContext.Provider value={{ formData, updateFormData, sectionStatus, updateSectionStatus }}>
      {children}
    </FormContext.Provider>
  );
};
```

### 3. Component Composition Pattern
```typescript
// Example: ApplicationCard.tsx
const ApplicationCard: React.FC<ApplicationCardProps> = ({ application, onEdit, onCancel, onDelete }) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <Card className="card-hover cursor-pointer group relative">
          <CardContent className="p-4">
            {/* Card content */}
          </CardContent>
        </Card>
      </ContextMenuTrigger>
      <ContextMenuContent>
        {/* Context menu actions */}
      </ContextMenuContent>
    </ContextMenu>
  );
};
```

## Database Schema

### Core Tables
- **applications**: Credit application data with draft/final states
- **user_profiles**: Agent profile information
- **application_documents**: Document metadata and storage references
- **application_references**: Personal references for applications
- **prequalifications**: Risk assessment results

### Security Model
- **Row Level Security (RLS)**: Database-level access control
- **JWT Authentication**: Secure token-based authentication
- **Role-based Access**: Different permissions for agents, supervisors, admins

## PWA Configuration

### Service Worker Strategy
```typescript
// vite.config.ts
VitePWA({
  registerType: 'autoUpdate',
  workbox: {
    maximumFileSizeToCacheInBytes: 3 * 1024 * 1024, // 3 MB limit
    globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/.*\.supabase\.co\/rest\/v1\/.*/i,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'supabase-rest',
          networkTimeoutSeconds: 5,
        }
      }
    ]
  }
})
```

### Offline Capabilities
- **Query Persistence**: TanStack Query cache persisted to LocalForage
- **Form State Persistence**: Draft data saved locally and synced when online
- **Document Caching**: Images and documents cached for offline access
- **Background Sync**: Automatic synchronization when connection restored

## Mobile Integration

### Capacitor Configuration
```typescript
// capacitor.config.ts
const config: CapacitorConfig = {
  appId: 'app.lovable.c018926e40254894ae52122f75906f16',
  appName: 'coopsamasupa',
  webDir: 'dist',
  plugins: {
    Camera: {
      permissions: ['camera', 'photos']
    },
    StatusBar: {
      backgroundColor: '#19418A',
      style: 'light'
    }
  }
};
```

### Native Features
- **Camera Access**: Document capture using native camera
- **Geolocation**: GPS coordinates for application verification
- **File System**: Local file storage and management
- **Push Notifications**: Real-time updates and alerts

## Performance Optimizations

### Code Splitting
- **Route-based Splitting**: Each page loaded on demand
- **Component Lazy Loading**: Heavy components loaded when needed
- **Bundle Analysis**: Regular bundle size monitoring

### Caching Strategy
- **API Caching**: TanStack Query with configurable stale times
- **Static Assets**: Service worker caching for images and fonts
- **Database Queries**: Optimized queries with proper indexing

### Image Optimization
- **Automatic Compression**: Images compressed before upload
- **Lazy Loading**: Images loaded only when visible
- **Format Optimization**: WebP format for better compression

## Security Implementation

### Authentication Flow
```typescript
// useAuth.tsx
export const useAuth = () => {
  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw new Error(error.message);
  };
};
```

### Data Protection
- **Input Sanitization**: DOMPurify for XSS prevention
- **Rate Limiting**: Authentication attempt limiting
- **Data Validation**: Zod schemas for all user inputs
- **Secure Headers**: Security headers for all responses

### Error Handling
- **Graceful Degradation**: App continues working with limited functionality
- **User-friendly Messages**: Clear error messages without technical details
- **Logging**: Comprehensive error logging for debugging
- **Retry Mechanisms**: Automatic retry for transient failures

## Development Workflow

### Build Process
```bash
# Development
npm run dev          # Vite dev server with HMR

# Production Build
npm run build        # Optimized production build
npm run preview      # Preview production build

# Mobile Development
npx cap run ios      # iOS development
npx cap run android  # Android development
```

### Code Quality
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code linting with React-specific rules
- **Prettier**: Code formatting (via ESLint integration)
- **Git Hooks**: Pre-commit validation

### Testing Strategy
- **Unit Tests**: Component and utility function testing
- **Integration Tests**: Hook and context testing
- **E2E Tests**: Critical user flow testing
- **Manual Testing**: Device-specific testing on iOS/Android

## Deployment Architecture

### Web Deployment
- **Static Hosting**: Vite build output served as static files
- **CDN**: Global content delivery for optimal performance
- **HTTPS**: SSL/TLS encryption for all communications

### Mobile Deployment
- **iOS App Store**: Native iOS app distribution
- **Google Play Store**: Android app distribution
- **Over-the-Air Updates**: PWA updates without app store approval

### Backend Infrastructure
- **Supabase Cloud**: Managed PostgreSQL and authentication
- **Edge Functions**: Serverless functions for business logic
- **Storage**: Scalable file storage with CDN
- **Monitoring**: Real-time performance and error monitoring

## Monitoring & Analytics

### Performance Monitoring
- **Core Web Vitals**: LCP, FID, CLS tracking
- **Bundle Analysis**: Regular bundle size monitoring
- **Error Tracking**: Real-time error reporting
- **User Analytics**: Usage patterns and feature adoption

### Business Metrics
- **Application Metrics**: Credit application statistics
- **User Engagement**: Agent activity and productivity
- **System Health**: Uptime and performance metrics
- **Security Events**: Authentication and access monitoring
