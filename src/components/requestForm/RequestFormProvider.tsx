import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { generateApplicationId } from '@/utils/applicationIdGenerator';
import { useToast } from '@/hooks/use-toast';
import { useSaveDraft } from '@/hooks/useDraftActions';
import { useFinalizeApplication } from '@/hooks/useFinalizeApplication';
import { useApplicationData } from '@/hooks/useApplicationData';
import { guatemalanDocuments } from '@/hooks/useDocumentManager';

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
  
  // Documents
  documents: any[];
  updateDocuments: (documents: any[]) => void;
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
  const { toast } = useToast();
  const location = useLocation();
  const { id: applicationId } = useParams<{ id: string }>();
  
  // Check if application is submitted
  const { data: applicationData } = useApplicationData(applicationId || '');
  
  // Redirect if application is successfully submitted (not a draft and not error)
  useEffect(() => {
    if (applicationData && !applicationData.isDraft && 'status' in applicationData && applicationData.status !== 'error' && onRedirectSubmittedApplication) {
      console.log('🔄 Application is successfully submitted, redirecting to read-only view');
      onRedirectSubmittedApplication(applicationData.id);
    }
  }, [applicationData, onRedirectSubmittedApplication]);
  
  // Initialize form data with application ID
  const [formData, setFormData] = useState<FormData>(() => ({
    // Basic identification
    firstName: '',
    secondName: '',
    thirdName: '',
    firstLastName: '',
    secondLastName: '',
    marriedLastName: '',
    dpi: '',
    nit: '',
    dpiExtendedIn: '',
    cua: '',
    
    
    // Birth Demographics and Disability Information
    birthDate: null,
    age: '',
    dependents: '',
    ethnicity: '',
    educationLevel: '',
    profession: '',
    occupation: '',
    hasDisability: false,
    disabilityDescription: '',
    
    // Spouse information
    spouseFirstName: '',
    spouseSecondName: '',
    spouseFirstLastName: '',
    spouseSecondLastName: '',
    spouseWorkplace: '',
    spouseJobStability: '',
    spouseMobilePhone: '',
    spouseBirthDate: '',
    
    // Contact and housing
    mobilePhone: '',
    homePhone: '',
    email: '',
    address: '',
    addressReference: '',
    geolocation: null,
    residenceDepartment: '',
    residenceMunicipality: '',
    housingType: '',
    residenceStability: '',
    
    // Credit information
    creditPurpose: '',
    requestedAmount: '',
    termMonths: '',
    capitalPayment: '',
    interestPayment: '',
    paymentPlan: '',
    capitalAmortization: '',
    memberType: '',
    interestRate: '',
    interestAmortization: '',
    applicationType: '',
    obtainedCreditsCount: '',
    fundsOrigin: '',
    characterObservations: '',
    
    // Credit destination
    investmentPlaceDepartment: '',
    investmentPlaceMunicipality: '',
    destinationGroup: '',
    creditDestination: '',
    destinationCategory: '',
    sowingLatitude: '',
    sowingLongitude: '',
    destinationDescription: '',
    destinationObservations: '',
    sourceTypes: '',
    sourceQuantity: '',
    sourceObservations: '',
    
    // Financial analysis
    incomeSource: '',
    ingresoPrincipal: '',
    ingresoSecundario: '',
    comentarioIngreso: '',
    incomeSources: [],
    alimentacion: '',
    vestuario: '',
    serviciosBasicos: '',
    educacion: '',
    vivienda: '',
    transporte: '',
    compromisos: '',
    gastosFinancieros: '',
    descuentosPlanilla: '',
    otros: '',
    cuotaSolicitada: '',
    
    // Patrimonial statement
    efectivoSaldoBancos: '',
    cuentasPorCobrar: '',
    mercaderias: '',
    bienesMuebles: '',
    vehiculos: '',
    bienesInmuebles: '',
    otrosActivos: '',
    cuentasPorPagar: '',
    deudasCortoPlazo: '',
    prestamosLargoPlazo: '',
    montoSolicitado: '',
    
    
    // Consent fields
    termsAccepted: false,
    dataProcessingAccepted: false,
    creditCheckAccepted: false,
    
    // Business information
    companyName: '',
    activityDescription: '',
    productType: '',
    fullAddress: '',
    
    // Generated fields - ID generated immediately for new applications
    applicationId: applicationId || generateApplicationId(),
  }));

  // Navigation state
  const [currentStep, setCurrentStep] = useState(0);
  const [subStep, setSubStep] = useState(0);
  
  // Section status
  const [sectionStatus, setSectionStatus] = useState<Record<string, 'pending' | 'complete'>>({});
  
  // References state (formerly guarantors)
  const [references, setReferences] = useState<ReferenceData[]>([]);
  const [currentReferenceIndex, setCurrentReferenceIndex] = useState(0);
  const [referenceFormStep, setReferenceFormStep] = useState(0);
  const [isInReferenceForm, setIsInReferenceForm] = useState(false);
  
  // Documents state
  const [documents, setDocuments] = useState<any[]>([]);
  
  // Progress tracking
  const [maxProgressReached, setMaxProgressReached] = useState(0);
  
  // Exit dialog state
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<any>(null);
  const [showErrorScreen, setShowErrorScreen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Add save draft mutation
  const saveDraftMutation = useSaveDraft();
  const finalizeApplicationMutation = useFinalizeApplication();

  // Load existing data when editing - Fixed: Also load data for failed applications
  useEffect(() => {
    if (applicationData && (applicationData.isDraft || ('status' in applicationData && applicationData.status === 'error')) && applicationData.draft_data) {
      console.log('📥 Loading existing data (draft or failed):', applicationData.draft_data);
      const draftData = applicationData.draft_data as any;
      
      // Merge draft data with current form data
      setFormData(prev => ({
        ...prev,
        ...draftData,
        // Ensure applicationId is preserved from draft, or keep empty if new
        applicationId: draftData.applicationId || '',
        // Ensure birthDate is properly restored
        birthDate: draftData.birthDate || null
      }));
      
      // Restore references if they exist
      if (draftData.references && Array.isArray(draftData.references)) {
        console.log('👥 Restoring references from draft data:', draftData.references);
        setReferences(draftData.references);
      }
      
      // Restore documents if they exist
      if (draftData.documents && typeof draftData.documents === 'object') {
        console.log('📸 Restoring documents from draft data:', draftData.documents);
        // Convert documents object to array format
        const documentsArray = Object.values(draftData.documents).map((doc: any) => ({
          id: doc.id || '',
          title: doc.title || '',
          description: doc.description || '',
          required: doc.required || false,
          file: doc.file || null,
          status: doc.status || 'empty',
          thumbnailUrl: doc.thumbnailUrl || undefined,
          type: doc.type || 'document'
        }));
        setDocuments(documentsArray);
      } else {
        // Initialize with default documents if no saved documents
        setDocuments(guatemalanDocuments);
      }
      
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
        
        // Set max progress reached based on last step
        const totalSubSteps = steps.reduce((acc, _, index) => acc + getSubStepsForSection(index), 0);
        const lastSubSteps = steps.slice(0, draftInfo.last_step).reduce((acc, _, index) => acc + getSubStepsForSection(index), 0) + (draftInfo.last_sub_step || 0) + 1;
        const progressPercentage = Math.round((lastSubSteps / totalSubSteps) * 100);
        setMaxProgressReached(progressPercentage);
      }
      if (draftInfo.last_sub_step !== undefined) {
        setSubStep(draftInfo.last_sub_step);
      }
    }
  }, [applicationData]);

  // Initialize documents with default values if not loaded from draft
  useEffect(() => {
    if (documents.length === 0) {
      console.log('📸 Initializing documents with default values');
      setDocuments(guatemalanDocuments);
    }
  }, [documents.length]);

  // Update formData with generated applicationId after first save
  useEffect(() => {
    if (saveDraftMutation.isSuccess && saveDraftMutation.data?.applicationId && !formData.applicationId) {
      console.log('🆔 Updating formData with generated applicationId:', saveDraftMutation.data.applicationId);
      setFormData(prev => ({
        ...prev,
        applicationId: saveDraftMutation.data.applicationId
      }));
    }
  }, [saveDraftMutation.isSuccess, saveDraftMutation.data?.applicationId, formData.applicationId]);

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

  // Update form data function
  const updateFormData = useCallback((field: string, value: any) => {
    console.log('📝 Form data updated:', { field, value });
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
    
    // No auto-save - return to previous behavior
    // All fields are now critical and will be saved when user explicitly saves
  }, []);

  // Update section status
  const updateSectionStatus = useCallback((sectionId: string, status: 'pending' | 'complete') => {
    setSectionStatus(prev => ({ ...prev, [sectionId]: status }));
  }, []);

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
      
      // Sincronizar con formData
      setFormData(prevFormData => ({
        ...prevFormData,
        references: updated
      }));
      
      return updated;
    });
  }, [references.length]);

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
      
      // Sincronizar con formData
      setFormData(prevFormData => ({
        ...prevFormData,
        references: updated
      }));
      
      return updated;
    });
  }, []);

  // Document functions
  const updateDocuments = useCallback((newDocuments: any[]) => {
    setDocuments(newDocuments);
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

  // Get progress percentage - use max progress reached to prevent reset
  const getProgressPercentage = useCallback((): number => {
    const totalSubSteps = steps.reduce((acc, _, index) => acc + getSubStepsForSection(index), 0);
    const currentSubSteps = steps.slice(0, currentStep).reduce((acc, _, index) => acc + getSubStepsForSection(index), 0) + subStep + 1;
    const currentProgress = Math.round((currentSubSteps / totalSubSteps) * 100);
    
    // Update max progress if current is higher
    if (currentProgress > maxProgressReached) {
      setMaxProgressReached(currentProgress);
      return currentProgress;
    }
    
    // Return max progress reached to prevent reset
    return maxProgressReached;
  }, [currentStep, subStep, steps, getSubStepsForSection, maxProgressReached]);

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
    // Sync documents before saving
    const documentsData = documents.reduce((acc, doc) => {
      acc[doc.id] = {
        file: doc.file,
        status: doc.status,
        thumbnailUrl: doc.thumbnailUrl
      };
      return acc;
    }, {} as Record<string, any>);
    
    const formDataWithDocuments = {
      ...formData,
      documents: documentsData
    };
    
    saveDraftMutation.mutate({
      formData: formDataWithDocuments,
      currentStep,
      currentSubStep: subStep,
      isIncremental: false
    });
    setHasUnsavedChanges(false);
  }, [formData, currentStep, subStep, saveDraftMutation, documents]);

  const handleSubmit = useCallback(() => {
    console.log('📤 Submitting form with data:', formData);
    
    // Mark all sections as complete when submitting
    steps.forEach(step => {
      updateSectionStatus(step.id, 'complete');
    });
    
    finalizeApplicationMutation.mutate(formData, {
      onSuccess: (result) => {
        setSubmissionResult(result);
        setShowSuccessScreen(true);
        setShowErrorScreen(false); // Reset error screen
      },
      onError: (error) => {
        console.error('❌ Error submitting form:', error);
        
        // Check if this is a Coopsama microservice error
        if (error.message?.includes('COOPSAMA_ERROR:')) {
          const errorMsg = error.message.replace('COOPSAMA_ERROR:', '');
          setErrorMessage(errorMsg);
          setShowErrorScreen(true);
          setShowSuccessScreen(false);
        }
        // Other errors will be handled by the mutation's onError
      }
    });
  }, [formData, finalizeApplicationMutation, steps, updateSectionStatus]);

  // Updated exit handling with save functionality and proper navigation
  const handleExit = useCallback(async (shouldSave: boolean = false) => {
    console.log('🚪 handleExit called with shouldSave:', shouldSave);
    
    if (shouldSave) {
      try {
        console.log('💾 Attempting to save before exit...');
        
        // Save the draft
        await new Promise((resolve, reject) => {
          saveDraftMutation.mutate({
            formData,
            currentStep,
            currentSubStep: subStep,
            isIncremental: false
          }, {
            onSuccess: (data) => {
              console.log('✅ Save successful before exit:', data);
              setHasUnsavedChanges(false);
              resolve(data);
            },
            onError: (error) => {
              console.error('❌ Save failed before exit:', error);
              reject(error);
            }
          });
        });
        
        console.log('✅ Save completed, proceeding with exit');
      } catch (error) {
        console.error('❌ Exit with save failed:', error);
        // Don't exit if save failed - let the user see the error toast
        return;
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
    
    // Documents
    documents,
    updateDocuments,
    
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
  };

  return (
    <FormContext.Provider value={contextValue}>
      {children}
    </FormContext.Provider>
  );
};

export default RequestFormProvider;
