import React, { createContext, useContext, useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useLocation, useParams } from 'react-router-dom';
import { generateApplicationId } from '@/utils/applicationIdGenerator';
import { useToast } from '@/hooks/use-toast';
import { useSaveDraft } from '@/hooks/useDraftActions';
import { useFinalizeApplication } from '@/hooks/useFinalizeApplication';
import { useApplicationData } from '@/hooks/useApplicationData';
import { calculateFieldProgress } from '@/utils/fieldProgressTracker';
// import { validateFormData } from '@/utils/fieldMapper'; // Removed - no longer needed

interface FormContextType {
  // Form state
  formData: FormData;
  updateFormData: (field: string, value: any) => void;
  
  // Navigation state
  currentStep: number;
  activeStep: number; // alias for currentStep for compatibility
  subStep: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  isFirstSubStep: boolean;
  isLastSubStep: boolean;
  
  // Navigation actions
  handleNext: () => void;
  handlePrevious: () => void;
  handleSubNext: () => void;
  handleSubPrevious: () => void;
  goToStep: (step: number, subStep?: number) => void;
  handleChangeSection: (step: number) => void;
  
  // Section status
  sectionStatus: Record<string, 'pending' | 'complete'>;
  updateSectionStatus: (sectionId: string, status: 'pending' | 'complete') => void;
  
  // Form actions
  handleSaveDraft: () => void;
  handleSubmit: () => void;
  
  // Meta information
  getCurrentStepInfo: () => StepInfo;
  getTotalSteps: () => number;
  getProgressPercentage: () => number;
  getSubStepsForSection: (sectionIndex: number) => number;
  
  // References (formerly guarantors)
  references: ReferenceData[];
  currentReferenceIndex: number;
  setCurrentReferenceIndex: (index: number) => void;
  referenceFormStep: number;
  setReferenceFormStep: (step: number) => void;
  addReference: () => void;
  removeReference: (index: number) => void;
  updateReference: (index: number, field: string, value: any) => void;
  isInReferenceForm: boolean;
  setIsInReferenceForm: (inForm: boolean) => void;
  
  // Person name
  personName: string;
  
  // Exit dialog - updated signature
  showExitDialog: boolean;
  setShowExitDialog: (show: boolean) => void;
  handleExit: (shouldSave?: boolean) => Promise<void> | void;
  hasUnsavedChanges: boolean;
  handleShowExitDialog: () => void;
  showSuccessScreen: boolean;
  submissionResult: any;
  isSavingDraft: boolean;
  isSubmitting: boolean;
  showErrorScreen: boolean;
  errorMessage: string;

  // Coopsama error dialog
  showCoopsamaErrorDialog: boolean;
  setShowCoopsamaErrorDialog: (show: boolean) => void;
  coopsamaErrorMessage: string;
  setCoopsamaErrorMessage: (message: string) => void;

  // Validation dialog - REMOVED (no longer needed)
}


interface FormData {
  // Basic identification
  firstName: string;
  secondName: string;
  thirdName: string;
  firstLastName: string;
  secondLastName: string;
  marriedLastName: string;
  dpi: string;
  nit: string;
  dpiExtendedIn: string;
  cua: string;
  
  
  // Contact and housing
  mobilePhone: string;
  homePhone: string;
  email: string;
  address: string;
  addressReference: string;
  otherIndications: string;
  geolocation: any;
  residenceDepartment: string;
  residenceMunicipality: string;
  housingType: string;
  residenceStability: string;
  
  // Financial analysis
  incomeSource: string;
  ingresoPrincipal: string;
  ingresoSecundario: string;
  comentarioIngreso: string;
  incomeSources: Array<{ id: string; type: string; description?: string; amount: string }>;
  alimentacion: string;
  vestuario: string;
  serviciosBasicos: string;
  educacion: string;
  vivienda: string;
  transporte: string;
  compromisos: string;
  gastosFinancieros: string;
  descuentosPlanilla: string;
  otros: string;
  cuotaSolicitada: string;
  idTypeProduct: string;
  
  // Patrimonial statement
  efectivoSaldoBancos: string;
  cuentasPorCobrar: string;
  mercaderias: string;
  bienesMuebles: string;
  vehiculos: string;
  bienesInmuebles: string;
  otrosActivos: string;
  cuentasPorPagar: string;
  deudasCortoPlazo: string;
  prestamosLargoPlazo: string;
  montoSolicitado: string;
  
  
  // Consent fields
  termsAccepted: boolean;
  dataProcessingAccepted: boolean;
  creditCheckAccepted: boolean;
  
  // Generated fields
  applicationId: string;
  
  // Agency and application date
  agency: string;
  applicationDate: string;
  
  // Investment destination
  investmentPlaceDepartment: string;
  investmentPlaceMunicipality: string;
  destinationGroup: string;
  creditDestination: string;
  destinationCategory: string;
  sowingLatitude: string;
  sowingLongitude: string;
  destinationDescription: string;
  destinationObservations: string;
  sourceTypes: string;
  sourceQuantity: string;
  sourceObservations: string;
  specificDestination: string;
  otherDestination: string;
  // secondaryProject: string; // Removido - causaba error Erx003 en Coopsama
  addressDetails: string;
  
  // Credit Information
  creditPurpose: string;
  requestedAmount: string;
  termMonths: string;
  capitalPayment: string;
  interestPayment: string;
  paymentPlan: string;
  capitalAmortization: string;
  memberType: string;
  interestRate: string;
  interestAmortization: string;
  applicationType: string;
  obtainedCreditsCount: string;
  fundsOrigin: string;
  sourceOfFunds: string;
  characterObservations: string;
  
  [key: string]: any;
}

interface StepInfo {
  id: string;
  title: string;
  icon: React.ReactNode;
  description?: string;
  component?: string;
}

interface ReferenceData {
  id: string;
  referenceType: string;
  // Campos separados para nombres (nuevos)
  firstName: string;
  secondName: string;
  firstLastName: string;
  secondLastName: string;
  // Campo completo para compatibilidad temporal
  fullName: string;
  // Campos actualizados con nombres correctos
  fullAddress: string;
  relationship: string;
  mobile: string;
  score: string;
  comments: string;
  // Campos legacy para compatibilidad
  address: string;
  relation: string;
  phone: string;
  rating: string;
  comment: string;
  basicInfoCompleted: boolean;
}

interface RequestFormProviderProps {
  children: React.ReactNode;
  steps: StepInfo[];
  onNavigateAfterExit?: () => void;
  onRedirectSubmittedApplication?: (id: string) => void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export const useFormContext = (): FormContextType => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within a RequestFormProvider');
  }
  return context;
};

const RequestFormProvider: React.FC<RequestFormProviderProps> = ({ 
  children, 
  steps, 
  onNavigateAfterExit,
  onRedirectSubmittedApplication
}) => {
  // Removed console.log to reduce re-render noise
  const { toast } = useToast();
  const location = useLocation();
  const { id: applicationId } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  
  // Check if application is submitted
  const { data: applicationData } = useApplicationData(applicationId || '');
  
  // Redirect if application is successfully submitted (not a draft and not error)
  useEffect(() => {
    if (applicationData && !applicationData.isDraft && 'status' in applicationData && applicationData.status !== 'error' && onRedirectSubmittedApplication) {
      console.log('🔄 Application is successfully submitted, redirecting to read-only view');
      onRedirectSubmittedApplication(applicationData.id);
    }
  }, [applicationData, onRedirectSubmittedApplication]);
  
  // Create default form data using useMemo to avoid recreating on every render
  const defaultFormData = useMemo((): FormData => {
    const defaultFormData: FormData = {
      // Basic identification
      firstName: '', secondName: '', thirdName: '', firstLastName: '', secondLastName: '', marriedLastName: '',
      dpi: '', nit: '', dpiExtendedIn: '', cua: '',
      
      // Birth Demographics and Disability Information
      birthDate: null, age: '', dependents: '', ethnicity: '', educationLevel: '', profession: '', occupation: '',
      hasDisability: false, disabilityDescription: '',
      
      // Spouse information
      spouseFirstName: '', spouseSecondName: '', spouseFirstLastName: '', spouseSecondLastName: '',
      spouseWorkplace: '', spouseJobStability: '', spouseMobilePhone: '', spouseBirthDate: null,
      
      // Contact and Housing
      mobilePhone: '', homePhone: '', email: '', address: '', addressReference: '', otherIndications: '', geolocation: null,
      residenceDepartment: '', residenceMunicipality: '', housingType: '', residenceStability: '',
      
      // Credit Information
      creditPurpose: '', requestedAmount: '', termMonths: '', capitalPayment: '', interestPayment: '',
      paymentPlan: '', capitalAmortization: '', memberType: '', interestRate: '', interestAmortization: '',
      applicationType: '', obtainedCreditsCount: '', fundsOrigin: '', sourceOfFunds: '', characterObservations: '',
      
      // Investment destination
      investmentPlaceDepartment: '', investmentPlaceMunicipality: '', destinationGroup: '', creditDestination: '',
      destinationCategory: '', sowingLatitude: '', sowingLongitude: '', destinationDescription: '',
      destinationObservations: '', sourceTypes: '', sourceQuantity: '', sourceObservations: '',
      specificDestination: '', otherDestination: '', /* secondaryProject: '', */ addressDetails: '',
      
      // Financial Analysis
      incomeSource: '', ingresoPrincipal: '', ingresoSecundario: '', comentarioIngreso: '', incomeSources: [],
      
      // Expenses
      alimentacion: '', vestuario: '', serviciosBasicos: '', educacion: '', vivienda: '', transporte: '',
      compromisos: '', gastosFinancieros: '', descuentosPlanilla: '', otros: '', cuotaSolicitada: '',
      idTypeProduct: '',
      
      // Patrimonial Statement
      efectivoSaldoBancos: '', cuentasPorCobrar: '', mercaderias: '', bienesMuebles: '', vehiculos: '',
      bienesInmuebles: '', otrosActivos: '', cuentasPorPagar: '', deudasCortoPlazo: '', prestamosLargoPlazo: '',
      montoSolicitado: '',
      
      // Business Information
      companyName: '', activityDescription: '', productType: '', fullAddress: '',
      
      // References
      references: [],
      
      // Documents
      dpiFrontal: null, dpiTrasero: null, fotoSolicitante: null, location: null,
      
      // Consent
      termsAccepted: false, dataProcessingAccepted: false, creditCheckAccepted: false,
      
      // Application ID
      applicationId: applicationId || generateApplicationId(),
      
      // Agency and application date
      agency: '',
      applicationDate: new Date().toISOString().split('T')[0]
    };

    // Si tenemos applicationData con draft_data, inicializar con esos datos
    if (applicationData && (applicationData.isDraft || ('status' in applicationData && applicationData.status === 'error')) && ('draft_data' in applicationData && applicationData.draft_data)) {
      console.log('📥 Initializing formData with existing draft data:', applicationData.draft_data);
      const draftData = applicationData.draft_data as any;
      return {
        ...defaultFormData, // Start with all default values
        ...draftData, // Overlay with draft data
        // Ensure applicationId is preserved from draft, or keep empty if new
        applicationId: draftData.applicationId || applicationId || generateApplicationId()
      };
    }
    
    // Si no hay datos del borrador, usar valores por defecto
    return defaultFormData;
  }, [applicationId]);

  // Initialize form data with application ID
  const [formData, setFormData] = useState<FormData>(defaultFormData);
  
  // Update formData when defaultFormData changes (e.g., when loading existing draft)
  useEffect(() => {
    if (applicationData && (applicationData.isDraft || ('status' in applicationData && applicationData.status === 'error'))) {
      setFormData(defaultFormData);
    }
  }, [defaultFormData, applicationData]);

  // Navigation state
  const [currentStep, setCurrentStep] = useState(0);
  const [subStep, setSubStep] = useState(0);
  
  // Section status
  const [sectionStatus, setSectionStatus] = useState<Record<string, 'pending' | 'complete'>>({});
  
  // References state (formerly guarantors) - Initialize with formData.references if available
  const [references, setReferences] = useState<ReferenceData[]>(() => {
    // Try to get references from formData if available (for draft loading)
    const initialFormData = formData;
    if (initialFormData?.references && Array.isArray(initialFormData.references)) {
      console.log('📝 Initializing references from formData:', initialFormData.references);
      return initialFormData.references;
    }
    console.log('📝 Initializing references as empty array');
    return [];
  });
  const [currentReferenceIndex, setCurrentReferenceIndex] = useState(0);
  const [referenceFormStep, setReferenceFormStep] = useState(0);
  const [isInReferenceForm, setIsInReferenceForm] = useState(false);
  
  // Exit dialog state
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<any>(null);
  const [showErrorScreen, setShowErrorScreen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Coopsama error dialog state
  const [showCoopsamaErrorDialog, setShowCoopsamaErrorDialog] = useState(false);
  const [coopsamaErrorMessage, setCoopsamaErrorMessage] = useState('');

  // Validation dialog state - REMOVED (no longer needed)

  // Add save draft mutation
  const saveDraftMutation = useSaveDraft();
  const finalizeApplicationMutation = useFinalizeApplication();
  
  // Debug: Log mutation status on component mount
  useEffect(() => {
    console.log('🔧 saveDraftMutation initialized:', {
      isPending: saveDraftMutation.isPending,
      isError: saveDraftMutation.isError,
      isSuccess: saveDraftMutation.isSuccess,
      error: saveDraftMutation.error,
      hasMutate: typeof saveDraftMutation.mutate === 'function'
    });
  }, [saveDraftMutation]);

  // Prevent component restart during save operation
  const [isSaving, setIsSaving] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isSavingRef = useRef(false);

  // Load existing data when editing
  useEffect(() => {
    if (applicationData && (applicationData.isDraft || ('status' in applicationData && applicationData.status === 'error')) && ('draft_data' in applicationData && applicationData.draft_data)) {
      console.log('📥 Loading existing draft data:', applicationData.draft_data);
      const draftData = applicationData.draft_data as any;
      
      
      // Log references specifically
      if (draftData.references) {
        console.log('📝 Draft data contains references:', draftData.references);
        console.log('📝 References type:', typeof draftData.references);
        console.log('📝 References is array:', Array.isArray(draftData.references));
        console.log('📝 References length:', draftData.references.length);
      } else {
        console.log('📝 Draft data does NOT contain references');
      }
      
      // Merge draft data with current form data
      setFormData(prev => ({
        ...prev,
        ...draftData,
        // Ensure applicationId is preserved from draft, or keep empty if new
        applicationId: draftData.applicationId || ''
      }));
      
      // Set current step from draft (using any to access the draft properties)
      const draftInfo = applicationData as any;
      if (draftInfo.last_step !== undefined) {
        setCurrentStep(draftInfo.last_step);
        
        // Mark all previous sections as complete
        for (let i = 0; i < draftInfo.last_step; i++) {
          if (steps[i]) {
            setSectionStatus(prev => ({ ...prev, [steps[i].id]: 'complete' }));
          }
        }
      }
      if (draftInfo.last_sub_step !== undefined) {
        setSubStep(draftInfo.last_sub_step);
      }
    }
  }, [applicationData]);

  // Update formData with generated applicationId after first save
  useEffect(() => {
    if (saveDraftMutation.isSuccess && saveDraftMutation.data && 'applicationId' in saveDraftMutation.data && saveDraftMutation.data.applicationId && !formData.applicationId) {
      console.log('🆔 Updating formData with generated applicationId:', saveDraftMutation.data.applicationId);
      setFormData(prev => ({
        ...prev,
        applicationId: 'applicationId' in saveDraftMutation.data ? saveDraftMutation.data.applicationId : ''
      }));
    }
  }, [saveDraftMutation.isSuccess, saveDraftMutation.data && 'applicationId' in saveDraftMutation.data ? saveDraftMutation.data.applicationId : null, formData.applicationId]);

  // Handle navigation from ApplicationDetails
  useEffect(() => {
    if (location.state?.stepIndex !== undefined) {
      const stepIndex = location.state.stepIndex;
      if (stepIndex >= 0 && stepIndex < steps.length) {
        setCurrentStep(stepIndex);
        setSubStep(0); // Reset to first substep
      }
    }
  }, [location.state, steps.length]);

  // Restaurar referencias desde formData cuando se carga un borrador
  useEffect(() => {
    if (formData.references && Array.isArray(formData.references) && formData.references.length > 0) {
      console.log('📝 Restaurando referencias desde formData:', formData.references);
      console.log('📝 Referencias actuales antes de restaurar:', references);
      
      // Solo actualizar si las referencias son diferentes
      const currentReferencesString = JSON.stringify(references);
      const newReferencesString = JSON.stringify(formData.references);
      
      if (currentReferencesString !== newReferencesString) {
        console.log('📝 Referencias diferentes, actualizando...');
        setReferences(formData.references);
      } else {
        console.log('📝 Referencias ya están sincronizadas');
      }
    } else if (formData.references && Array.isArray(formData.references) && formData.references.length === 0) {
      console.log('📝 FormData tiene referencias vacías, limpiando referencias locales');
      if (references.length > 0) {
        setReferences([]);
      }
    }
  }, [formData.references]); // CORREGIDO: Eliminada dependencia circular 'references'

  // Update form data function
  const updateFormData = useCallback((field: string, value: any) => {
    console.log('📝 Form data updated:', { field, value });
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  }, []);

  // Update section status
  const updateSectionStatus = useCallback((sectionId: string, status: 'pending' | 'complete') => {
    setSectionStatus(prev => ({ ...prev, [sectionId]: status }));
  }, []);

  // Check if a section is completed based on form data
  const checkSectionCompletion = useCallback((sectionId: string): boolean => {
    switch (sectionId) {
      case 'identification':
        return !!(formData.firstName && formData.firstLastName && formData.dpi);
      case 'finances':
        return !!(formData.ingresoPrincipal || formData.ingresoSecundario);
      case 'business':
        return !!(formData.occupation || formData.companyName);
      case 'guarantors':
        return references.length > 0;
      case 'documents':
        return !!(formData.dpiFrontal || formData.fotoSolicitante);
      case 'review':
        return true; // Review section is always considered complete
      default:
        return false;
    }
  }, [formData, references.length]);

  // Auto-update section status based on form data
  useEffect(() => {
    steps.forEach(step => {
      const isCompleted = checkSectionCompletion(step.id);
      const currentStatus = sectionStatus[step.id];
      
      if (isCompleted && currentStatus !== 'complete') {
        updateSectionStatus(step.id, 'complete');
      } else if (!isCompleted && currentStatus === 'complete') {
        updateSectionStatus(step.id, 'pending');
      }
    });
  }, [formData, references, steps, sectionStatus, checkSectionCompletion, updateSectionStatus]);

  // Reference functions (formerly guarantor functions)
  const addReference = useCallback(() => {
    // Validar límite máximo de 3 referencias
    if (references.length >= 3) {
      console.warn('Máximo 3 referencias permitidas');
      return;
    }
    
    const newReference: ReferenceData = {
      id: `${references.length + 1}`,
      referenceType: '',
      // Campos separados para nombres
      firstName: '',
      secondName: '',
      firstLastName: '',
      secondLastName: '',
      // Campo completo para compatibilidad
      fullName: '',
      // Campos actualizados
      fullAddress: '',
      relationship: '',
      mobile: '',
      score: '',
      comments: '',
      // Campos legacy para compatibilidad
      address: '',
      relation: '',
      phone: '',
      rating: '',
      comment: '',
      basicInfoCompleted: false
    };
    setReferences(prev => {
      const updated = [...prev, newReference];
      
      // Mark guarantors section as complete when adding first reference
      if (prev.length === 0) {
        updateSectionStatus('guarantors', 'complete');
      }
      
      // Sincronizar con formData inmediatamente
      setFormData(prevFormData => ({
        ...prevFormData,
        references: updated
      }));
      
      // Removed console.logs to reduce re-render noise
      
      return updated;
    });
  }, [references.length, updateSectionStatus]);

  const removeReference = useCallback((index: number) => {
    setReferences(prev => {
      const updated = prev.filter((_, i) => i !== index);
      
      // Sincronizar con formData
      setFormData(prevFormData => ({
        ...prevFormData,
        references: updated
      }));
      
      return updated;
    });
  }, []);

  const updateReference = useCallback((index: number, field: string, value: any) => {
    setReferences(prev => {
      const updated = prev.map((reference, i) => 
        i === index ? { ...reference, [field]: value } : reference
      );
      
      // Sincronizar con formData inmediatamente
      setFormData(prevFormData => ({
        ...prevFormData,
        references: updated
      }));
      
      // Removed console.logs to reduce re-render noise
      
      return updated;
    });
  }, []);

  // Get sub-steps for each section
  const getSubStepsForSection = useCallback((sectionIndex: number): number => {
    switch (sectionIndex) {
      case 0: // IdentificationContact
        return 3; // PersonalId, Birth/Disability, Contact
      case 1: // Credit Information
        return 2; // CreditInfo, CreditDestination
      case 2: // FinancialInfo  
        return 2; // Financial Analysis, Patrimonial Statement
      case 3: // ReferencesSection (formerly GuarantorsSection)
        return 1;
      case 4: // DocumentsSection
        return 1;
      case 5: // ReviewSection
        return 1;
      default:
        return 1;
    }
  }, []);

  // Navigation helpers
  const isFirstStep = currentStep === 0 && subStep === 0;
  const isLastStep = currentStep === steps.length - 1;
  const isFirstSubStep = subStep === 0;
  const isLastSubStep = subStep >= getSubStepsForSection(currentStep) - 1;

  // Get current step info
  const getCurrentStepInfo = useCallback((): StepInfo => {
    return steps[currentStep] || { id: '', title: '', icon: null };
  }, [currentStep, steps]);

  // Get progress percentage based on actual field completion
  const getProgressPercentage = useCallback((): number => {
    const fieldProgress = calculateFieldProgress(formData);
    return fieldProgress.progressPercentage;
  }, [formData]);

  // Navigation functions
  const handleNext = useCallback(() => {
    if (isLastStep) return;
    
    setCurrentStep(prev => prev + 1);
    setSubStep(0);
  }, [isLastStep]);

  const handlePrevious = useCallback(() => {
    if (isFirstStep) return;
    
    if (subStep > 0) {
      setSubStep(prev => prev - 1);
    } else if (currentStep > 0) {
      const prevStep = currentStep - 1;
      const prevSubSteps = getSubStepsForSection(prevStep);
      setCurrentStep(prevStep);
      setSubStep(prevSubSteps - 1);
    }
  }, [isFirstStep, subStep, currentStep, getSubStepsForSection]);

  const handleSubNext = useCallback(() => {
    console.log('🔄 handleSubNext called:', { currentStep, subStep, isLastSubStep });
    
    // Reset scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Mark section as complete when finishing last sub-step
    if (isLastSubStep) {
      updateSectionStatus(steps[currentStep].id, 'complete');
    }
    
    if (isLastSubStep) {
      // Move to next main step
      if (!isLastStep) {
        console.log('➡️ Moving to next step:', currentStep + 1);
        setCurrentStep(prev => prev + 1);
        setSubStep(0);
      }
    } else {
      // Move to next sub-step
      console.log('➡️ Moving to next sub-step:', subStep + 1);
      setSubStep(prev => prev + 1);
    }
  }, [currentStep, subStep, isLastSubStep, isLastStep, steps, updateSectionStatus]);

  const handleSubPrevious = useCallback(() => {
    // Reset scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    if (isFirstSubStep) {
      if (currentStep > 0) {
        const prevStep = currentStep - 1;
        const prevSubSteps = getSubStepsForSection(prevStep);
        setCurrentStep(prevStep);
        setSubStep(prevSubSteps - 1);
      }
    } else {
      setSubStep(prev => prev - 1);
    }
  }, [isFirstSubStep, currentStep, getSubStepsForSection]);

  const goToStep = useCallback((step: number, subStepIndex: number = 0) => {
    // Reset scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentStep(step);
    setSubStep(subStepIndex);
  }, []);

  const handleChangeSection = useCallback((step: number) => {
    setCurrentStep(step);
    setSubStep(0);
  }, []);

  // Form actions
  const handleSaveDraft = useCallback(() => {
    if (isSavingRef.current) {
      console.log('⏳ Save already in progress, skipping...');
      return;
    }

    const isCurrentlyOffline = !navigator.onLine;
    console.log('💾 HANDLE SAVE DRAFT CALLED');
    console.log('💾 Form data:', formData);
    console.log('💾 Current offline status:', { 
      isOffline: isCurrentlyOffline, 
      navigatorOnLine: navigator.onLine,
      connectionType: (navigator as any)?.connection?.effectiveType || 'unknown'
    });
    console.log('💾 About to call saveDraftMutation.mutate...');
    console.log('💾 saveDraftMutation status:', {
      isPending: saveDraftMutation.isPending,
      isError: saveDraftMutation.isError,
      isSuccess: saveDraftMutation.isSuccess,
      error: saveDraftMutation.error
    });
    
    // Set saving state to prevent component restart
    isSavingRef.current = true;
    setIsSaving(true);
    
    // Clear any existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    // For offline mode, bypass React Query to avoid component restart
    if (isCurrentlyOffline) {
      console.log('📵 OFFLINE MODE - Bypassing React Query to avoid component restart');
      
      // Directly call the offline save logic
      const saveOfflineDataDirectly = async () => {
        try {
          console.log('🚀 MUTATION FUNCTION EXECUTING - useSaveDraft started (OFFLINE DIRECT)');
          
          // Import localforage directly
          const localforage = (await import('localforage')).default;
          
          // Create offline storage instance
          const offlineStorage = localforage.createInstance({
            name: 'coopsama',
            storeName: 'offlineData'
          });
          
          // Import offline queue
          const { offlineQueue } = await import('@/utils/offlineQueue');
          
          // Create offline data
          const offlineApplicationId = formData.applicationId || generateApplicationId();
          const offlineData = {
            id: `offline-${Date.now()}`,
            agent_id: 'offline-user',
            client_name: `${formData.firstName} ${formData.firstLastName}`,
            draft_data: { ...formData, applicationId: offlineApplicationId },
            status: 'draft',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            applicationId: offlineApplicationId,
            _offline_timestamp: Date.now(),
            _offline_saved: true
          };
          
          // Save offline using localforage directly
          await offlineStorage.setItem(`draft-${Date.now()}`, offlineData);
          
          // Enqueue for sync
          await offlineQueue.enqueue({
            type: 'updateDraft',
            payload: offlineData
          });
          
          console.log('✅ OFFLINE SAVE COMPLETED - Returning optimistic result');
          console.log('✅ Offline data saved:', offlineData);
          
          // Invalidate applications list so offline drafts appear immediately
          try {
            console.log('🔄 Invalidating applications list cache (offline save)');
            queryClient.invalidateQueries({ queryKey: ['applications-list'] });
          } catch (e) {
            console.warn('⚠️ Failed to invalidate applications list cache:', e);
          }

          // Toast confirmando guardado con ID
          const displayId = offlineData.applicationId || formData.applicationId || offlineData.id;
          toast({
            title: 'Borrador guardado',
            description: `Tu solicitud ha sido guardada offline${displayId ? ` con ID: ${displayId}` : ''}`,
            variant: 'success',
            duration: 2500,
          });

          // Reset saving state
          isSavingRef.current = false;
          setIsSaving(false);
          setHasUnsavedChanges(false);
          
          console.log('🔄 Save operation completed, resetting saving state');
        } catch (error) {
          console.error('❌ ERROR in offline save:', error);
          isSavingRef.current = false;
          setIsSaving(false);
        }
      };
      
      saveOfflineDataDirectly();
      return;
    }
    
    try {
    saveDraftMutation.mutate({
      formData,
      currentStep,
      currentSubStep: subStep,
      isIncremental: false
    }, {
        onSuccess: (data) => {
          console.log('✅ SAVE DRAFT SUCCESS - Clearing unsaved changes');
          console.log('✅ Save result:', data);
        setHasUnsavedChanges(false);
          
          // Reset saving state after a delay to allow mutation to complete
          saveTimeoutRef.current = setTimeout(() => {
            isSavingRef.current = false;
            setIsSaving(false);
            console.log('🔄 Save operation completed, resetting saving state');
          }, 1000);
      },
      onError: (error) => {
          console.error('❌ SAVE DRAFT ERROR:', error);
          console.error('❌ Error details:', error.message);
        // Don't clear unsaved changes on error
          
          // Reset saving state immediately on error
          isSavingRef.current = false;
          setIsSaving(false);
        }
      });
      console.log('💾 saveDraftMutation.mutate() called successfully');
    } catch (error) {
      console.error('❌ ERROR calling saveDraftMutation.mutate():', error);
      isSavingRef.current = false;
      setIsSaving(false);
    }
  }, [formData, currentStep, subStep, saveDraftMutation]);

  const handleSubmit = useCallback(async () => {
    console.log('📤 Submitting form with data:', formData);
    
    // Mark all sections as complete when submitting
    steps.forEach(step => {
      updateSectionStatus(step.id, 'complete');
    });

    try {
      console.log('🚀 Calling finalizeApplicationMutation.mutateAsync...');
      const result = await finalizeApplicationMutation.mutateAsync(formData);
      console.log('✅ finalizeApplication result:', result);
      setSubmissionResult(result);
      setShowSuccessScreen(true);
      setShowErrorScreen(false);
    } catch (error: any) {
      console.error('❌ Error submitting form (mutateAsync):', error);
      if (error?.message?.includes('COOPSAMA_ERROR:')) {
        const errorMsg = error.message.replace('COOPSAMA_ERROR:', '');
        setCoopsamaErrorMessage(errorMsg);
        setShowCoopsamaErrorDialog(true);
        setShowSuccessScreen(false);
      } else {
        // Fallback: show generic error screen
        setErrorMessage(error?.message || 'Error desconocido al enviar la solicitud');
        setShowErrorScreen(true);
        setShowSuccessScreen(false);
      }
    }
  }, [formData, finalizeApplicationMutation, steps, updateSectionStatus]);

  // Función goToField - REMOVED (no longer needed)

  // Updated exit handling with save functionality and proper navigation
  const handleExit = useCallback(async (shouldSave: boolean = false) => {
    console.log('🚪 handleExit called with shouldSave:', shouldSave);
    
    if (shouldSave) {
      try {
        console.log('💾 Attempting to save before exit using unified save logic...');
        
        const isCurrentlyOffline = !navigator.onLine;
        console.log('💾 HANDLE EXIT SAVE - Form data:', formData);
        console.log('💾 HANDLE EXIT SAVE - Current offline status:', { 
          isOffline: isCurrentlyOffline, 
          navigatorOnLine: navigator.onLine,
          connectionType: (navigator as any)?.connection?.effectiveType || 'unknown'
        });
        
        // Use the same offline bypass logic as handleSaveDraft
        if (isCurrentlyOffline) {
          console.log('📵 OFFLINE MODE - Bypassing React Query for exit save');
          
          // Directly call the offline save logic
          const saveOfflineDataDirectly = async () => {
            try {
              console.log('🚀 MUTATION FUNCTION EXECUTING - useSaveDraft started (OFFLINE DIRECT EXIT)');
              
              // Import localforage directly
              const localforage = (await import('localforage')).default;
              
              // Create offline storage instance
              const offlineStorage = localforage.createInstance({
                name: 'coopsama',
                storeName: 'offlineData'
              });
              
              // Import offline queue
              const { offlineQueue } = await import('@/utils/offlineQueue');
              
              // Create offline data
              const offlineApplicationIdExit = formData.applicationId || generateApplicationId();
              const offlineData = {
                id: `offline-${Date.now()}`,
                agent_id: 'offline-user',
                client_name: `${formData.firstName} ${formData.firstLastName}`,
                draft_data: { ...formData, applicationId: offlineApplicationIdExit },
                status: 'draft',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                applicationId: offlineApplicationIdExit,
                _offline_timestamp: Date.now(),
                _offline_saved: true
              };
              
              // Save offline using localforage directly
              await offlineStorage.setItem(`draft-${Date.now()}`, offlineData);
              
              // Enqueue for sync
              await offlineQueue.enqueue({
                type: 'updateDraft',
                payload: offlineData
              });
              
              console.log('✅ OFFLINE EXIT SAVE COMPLETED - Returning optimistic result');
              console.log('✅ Offline data saved:', offlineData);
              
          // Invalidate applications list so offline drafts appear immediately
          try {
            console.log('🔄 Invalidating applications list cache (offline exit save)');
            queryClient.invalidateQueries({ queryKey: ['applications-list'] });
          } catch (e) {
            console.warn('⚠️ Failed to invalidate applications list cache:', e);
          }

              // Toast confirmando guardado con ID
              const displayId = offlineData.applicationId || formData.applicationId || offlineData.id;
              toast({
                title: 'Borrador guardado',
                description: `Tu solicitud ha sido guardada offline${displayId ? ` con ID: ${displayId}` : ''}`,
                variant: 'success',
                duration: 2500,
              });

              return offlineData;
            } catch (error) {
              console.error('❌ ERROR in offline exit save:', error);
              throw error;
            }
          };
          
          await saveOfflineDataDirectly();
          setHasUnsavedChanges(false);
        } else {
          // Online mode - use React Query
          await new Promise((resolve, reject) => {
          saveDraftMutation.mutate({
            formData,
            currentStep,
            currentSubStep: subStep,
              isIncremental: false,
              // Evitar doble toast; manejaremos aquí el aviso con ID
              silentToast: true as any
            } as any, {
              onSuccess: (data: any) => {
              console.log('✅ Save successful before exit:', data);
              setHasUnsavedChanges(false);

                const displayId = data?.applicationId || formData.applicationId || data?.id;
                toast({
                  title: 'Borrador guardado',
                  description: `Tu solicitud ha sido guardada${!navigator.onLine ? ' offline' : ''}${displayId ? ` con ID: ${displayId}` : ''}`,
                  variant: 'success',
                  duration: 2500,
                });

              resolve(data);
            },
            onError: (error) => {
              console.error('❌ Save failed before exit:', error);
              reject(error);
            }
          });
        });
        }
        
        console.log('✅ Save completed, proceeding with exit');
      } catch (error) {
        console.error('❌ Exit with save failed:', error);
        // Re-throw the error so ExitDialog can handle it
        throw error;
      }
    }
    
    // Close the dialog and navigate
    setShowExitDialog(false);
    
    // Use the provided navigation function or fallback to history.back()
    if (onNavigateAfterExit) {
      console.log('🔄 Using provided navigation function...');
      onNavigateAfterExit();
    } else {
      console.log('🔄 Falling back to history.back()...');
      window.history.back();
    }
  }, [formData, currentStep, subStep, saveDraftMutation, onNavigateAfterExit]);

  const handleShowExitDialog = useCallback(() => {
    setShowExitDialog(true);
  }, []);

  // Calculate person name for header
  const personName = [
    formData.firstName,
    formData.secondName,
    formData.firstLastName,
    formData.secondLastName
  ].filter(Boolean).join(' ').trim();

  const contextValue: FormContextType = {
    // Form state
    formData,
    updateFormData,
    
    // Navigation state
    currentStep,
    activeStep: currentStep, // alias for compatibility
    subStep,
    isFirstStep,
    isLastStep,
    isFirstSubStep,
    isLastSubStep,
    
    // Navigation actions
    handleNext,
    handlePrevious,
    handleSubNext,
    handleSubPrevious,
    goToStep,
    handleChangeSection,
    
    // Section status
    sectionStatus,
    updateSectionStatus,
    
    // Form actions
    handleSaveDraft,
    handleSubmit,
    
    // Meta information
    getCurrentStepInfo,
    getTotalSteps: () => steps.length,
    getProgressPercentage,
    getSubStepsForSection,
    
    // Guarantors
    references,
    currentReferenceIndex,
    setCurrentReferenceIndex,
    referenceFormStep,
    setReferenceFormStep,
    addReference,
    removeReference,
    updateReference,
    isInReferenceForm,
    setIsInReferenceForm,
    
    // Person name
    personName,
    
    // Exit dialog - updated to pass the save parameter
    showExitDialog,
    setShowExitDialog,
    handleExit,
    hasUnsavedChanges,
    handleShowExitDialog,
    showSuccessScreen,
    submissionResult,
    isSavingDraft: saveDraftMutation.isPending,
    isSubmitting: finalizeApplicationMutation.isPending,
    showErrorScreen,
    errorMessage,

    // Coopsama error dialog
    showCoopsamaErrorDialog,
    setShowCoopsamaErrorDialog,
    coopsamaErrorMessage,
    setCoopsamaErrorMessage,

    // Validation dialog - REMOVED (no longer needed)
  };

  return (
    <FormContext.Provider value={contextValue}>
      {children}
    </FormContext.Provider>
  );
};

export default RequestFormProvider;
