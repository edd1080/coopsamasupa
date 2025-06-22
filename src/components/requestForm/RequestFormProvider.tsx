import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { generateApplicationId } from '@/utils/applicationIdGenerator';
import { useToast } from '@/hooks/use-toast';

interface FormContextType {
  // Form state
  formData: FormData;
  updateFormData: (field: string, value: any) => void;
  
  // Navigation state
  currentStep: number;
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
  
  // Meta information
  getCurrentStepInfo: () => StepInfo;
  getTotalSteps: () => number;
  getProgressPercentage: () => number;
  getSubStepsForSection: (sectionIndex: number) => number;
  
  // Person name
  personName: string;
  
  // Exit dialog
  showExitDialog: boolean;
  setShowExitDialog: (show: boolean) => void;
  handleExit: () => void;
  hasUnsavedChanges: boolean;
  handleShowExitDialog: () => void;
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
  cif: string;
  
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
  
  // Generated fields
  applicationId: string;
  
  [key: string]: any;
}

interface StepInfo {
  title: string;
  description: string;
  component: string;
}

interface RequestFormProviderProps {
  children: React.ReactNode;
  steps: StepInfo[];
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export const useFormContext = (): FormContextType => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within a RequestFormProvider');
  }
  return context;
};

const RequestFormProvider: React.FC<RequestFormProviderProps> = ({ children, steps }) => {
  const { toast } = useToast();
  
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
    cif: '',
    
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
    
    // Financial analysis
    incomeSource: '',
    ingresoPrincipal: '',
    ingresoSecundario: '',
    comentarioIngreso: '',
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
    
    // Generated fields
    applicationId: generateApplicationId(),
  }));

  // Navigation state
  const [currentStep, setCurrentStep] = useState(0);
  const [subStep, setSubStep] = useState(0);
  
  // Exit dialog state
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Update form data function
  const updateFormData = useCallback((field: string, value: any) => {
    console.log('📝 Form data updated:', { field, value });
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  }, []);

  // Get sub-steps for each section
  const getSubStepsForSection = useCallback((sectionIndex: number): number => {
    switch (sectionIndex) {
      case 0: // IdentificationContact - REDUCED from 3 to 2
        return 2; 
      case 1: // FinancialAnalysis
        return 1;
      case 2: // BusinessEconomicProfile (Estado Patrimonial)
        return 1;
      case 3: // DocumentsSection
        return 1;
      case 4: // ConsentSection
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
    return steps[currentStep] || { title: '', description: '', component: '' };
  }, [currentStep, steps]);

  // Get progress percentage
  const getProgressPercentage = useCallback((): number => {
    const totalSubSteps = steps.reduce((acc, _, index) => acc + getSubStepsForSection(index), 0);
    const currentSubSteps = steps.slice(0, currentStep).reduce((acc, _, index) => acc + getSubStepsForSection(index), 0) + subStep + 1;
    return Math.round((currentSubSteps / totalSubSteps) * 100);
  }, [currentStep, subStep, steps, getSubStepsForSection]);

  // Navigation functions - OPTIMIZED to prevent multiple renders
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
  }, [currentStep, subStep, isLastSubStep, isLastStep]);

  const handleSubPrevious = useCallback(() => {
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
    setCurrentStep(step);
    setSubStep(subStepIndex);
  }, []);

  // Exit handling
  const handleExit = useCallback(() => {
    setShowExitDialog(false);
    // Here you could add logic to save draft or navigate away
    window.history.back();
  }, []);

  const handleShowExitDialog = useCallback(() => {
    setShowExitDialog(true);
  }, []);

  // Calculate person name for header
  const personName = [
    formData.firstName,
    formData.secondName,
    formData.thirdName,
    formData.firstLastName,
    formData.secondLastName,
    formData.marriedLastName
  ].filter(Boolean).join(' ').trim();

  const contextValue: FormContextType = {
    // Form state
    formData,
    updateFormData,
    
    // Navigation state
    currentStep,
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
    
    // Meta information
    getCurrentStepInfo,
    getTotalSteps: () => steps.length,
    getProgressPercentage,
    getSubStepsForSection,
    
    // Person name
    personName,
    
    // Exit dialog
    showExitDialog,
    setShowExitDialog,
    handleExit,
    hasUnsavedChanges,
    handleShowExitDialog,
  };

  return (
    <FormContext.Provider value={contextValue}>
      {children}
    </FormContext.Provider>
  );
};

export default RequestFormProvider;
