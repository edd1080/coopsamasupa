import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { generateApplicationId } from '@/utils/applicationIdGenerator';
import { useToast } from '@/hooks/use-toast';
import { useSaveDraft } from '@/hooks/useDraftActions';
import { useFinalizeApplication } from '@/hooks/useFinalizeApplication';
import { useApplicationData } from '@/hooks/useApplicationData';

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
  fullName: string;
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
  
  // Redirect if application is submitted (not a draft)
  useEffect(() => {
    if (applicationData && !applicationData.isDraft && onRedirectSubmittedApplication) {
      console.log('🔄 Application is submitted, redirecting to read-only view');
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
    
    // Generated fields
    applicationId: generateApplicationId(),
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
  
  // Exit dialog state
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<any>(null);

  // Add save draft mutation
  const saveDraftMutation = useSaveDraft();
  const finalizeApplicationMutation = useFinalizeApplication();

  // Load existing data when editing
  useEffect(() => {
    if (applicationData && applicationData.isDraft && applicationData.draft_data) {
      console.log('📥 Loading existing draft data:', applicationData.draft_data);
      const draftData = applicationData.draft_data as any;
      
      // Merge draft data with current form data
      setFormData(prev => ({
        ...prev,
        ...draftData,
        // Ensure applicationId is preserved
        applicationId: draftData.applicationId || prev.applicationId
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
  }, []);

  // Update section status
  const updateSectionStatus = useCallback((sectionId: string, status: 'pending' | 'complete') => {
    setSectionStatus(prev => ({ ...prev, [sectionId]: status }));
  }, []);

  // Reference functions (formerly guarantor functions)
  const addReference = useCallback(() => {
    const newReference: ReferenceData = {
      id: `${references.length + 1}`,
      referenceType: '',
      fullName: '',
      address: '',
      relation: '',
      phone: '',
      rating: '',
      comment: '',
      basicInfoCompleted: false
    };
    setReferences(prev => [...prev, newReference]);
  }, [references.length]);

  const removeReference = useCallback((index: number) => {
    setReferences(prev => prev.filter((_, i) => i !== index));
  }, []);

  const updateReference = useCallback((index: number, field: string, value: any) => {
    setReferences(prev => prev.map((reference, i) => 
      i === index ? { ...reference, [field]: value } : reference
    ));
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

  // Get progress percentage
  const getProgressPercentage = useCallback((): number => {
    const totalSubSteps = steps.reduce((acc, _, index) => acc + getSubStepsForSection(index), 0);
    const currentSubSteps = steps.slice(0, currentStep).reduce((acc, _, index) => acc + getSubStepsForSection(index), 0) + subStep + 1;
    return Math.round((currentSubSteps / totalSubSteps) * 100);
  }, [currentStep, subStep, steps, getSubStepsForSection]);

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
    saveDraftMutation.mutate({
      formData,
      currentStep,
      currentSubStep: subStep,
      isIncremental: false
    });
    setHasUnsavedChanges(false);
  }, [formData, currentStep, subStep, saveDraftMutation]);

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
      },
      onError: (error) => {
        console.error('❌ Error submitting form:', error);
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
  };

  return (
    <FormContext.Provider value={contextValue}>
      {children}
    </FormContext.Provider>
  );
};

export default RequestFormProvider;
