
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { useSaveDraft } from '@/hooks/useDraftActions';
import { useIncrementalSave } from '@/hooks/useIncrementalSave';
import { useDraftFormData } from '@/hooks/useApplicationData';
import { Loader2 } from 'lucide-react';

// Generate a random 6-digit number for application IDs
const generateRandomId = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// New simplified guarantor interface
interface GuarantorData {
  id: string;
  // Basic Info
  fullName: string;
  cui: string;
  email: string;
  phone: string;
  address: string;
  
  // Financial Info
  monthlyIncome: number;
  monthlyExpenses: number;
  hasProperty: boolean;
  propertyValue?: number;
  hasVehicle: boolean;
  vehicleValue?: number;
  bankAccounts: string;
  otherIncome: number;
  
  // Form completion status
  basicInfoCompleted: boolean;
  financialInfoCompleted: boolean;
}

interface FormContextType {
  activeStep: number;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  formData: Record<string, any>;
  updateFormData: (field: string, value: any) => void;
  personName: string;
  sectionStatus: Record<string, 'pending' | 'complete'>;
  setSectionStatus: React.Dispatch<React.SetStateAction<Record<string, 'pending' | 'complete'>>>;
  handleNext: () => void;
  handleChangeSection: (index: number) => void;
  handleSaveDraft: () => void;
  handleSubmit: () => void;
  handleShowExitDialog: () => void;
  isLastStep: boolean;
  showExitDialog: boolean;
  setShowExitDialog: React.Dispatch<React.SetStateAction<boolean>>;
  handleExit: (save: boolean) => void;
  hasFatca: boolean;
  setHasFatca: React.Dispatch<React.SetStateAction<boolean>>;
  isPep: boolean;
  setIsPep: React.Dispatch<React.SetStateAction<boolean>>;
  agentComments: string;
  setAgentComments: React.Dispatch<React.SetStateAction<string>>;
  subStep: number;
  setSubStep: React.Dispatch<React.SetStateAction<number>>;
  handleSubNext: () => void;
  handleSubPrevious: () => void;
  isLastSubStep: boolean;
  getSubStepsForSection: (sectionIndex: number) => number;
  hasUnsavedChanges: boolean;
  
  // New guarantor-related context
  guarantors: GuarantorData[];
  setGuarantors: React.Dispatch<React.SetStateAction<GuarantorData[]>>;
  currentGuarantorIndex: number;
  setCurrentGuarantorIndex: React.Dispatch<React.SetStateAction<number>>;
  guarantorFormStep: number;
  setGuarantorFormStep: React.Dispatch<React.SetStateAction<number>>;
  addGuarantor: () => void;
  updateGuarantor: (index: number, field: string, value: any) => void;
  removeGuarantor: (index: number) => void;
  isInGuarantorForm: boolean;
  setIsInGuarantorForm: React.Dispatch<React.SetStateAction<boolean>>;
  
  // Loading states
  isLoading: boolean;
  loadingError: string | null;
}

export const FormContext = createContext<FormContextType | undefined>(undefined);

interface Props {
  children: React.ReactNode;
  steps: {
    id: string;
    title: string;
    icon: React.ReactNode;
  }[];
}

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error('useFormContext must be used within a RequestFormProvider');
  }
  return context;
};

const createEmptyGuarantor = (): GuarantorData => ({
  id: generateRandomId(),
  fullName: '',
  cui: '',
  email: '',
  phone: '',
  address: '',
  monthlyIncome: 0,
  monthlyExpenses: 0,
  hasProperty: false,
  propertyValue: 0,
  hasVehicle: false,
  vehicleValue: 0,
  bankAccounts: '',
  otherIncome: 0,
  basicInfoCompleted: false,
  financialInfoCompleted: false,
});

export const RequestFormProvider: React.FC<Props> = ({ children, steps }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { toast } = useToast();
  
  // State management
  const [activeStep, setActiveStep] = useState(0);
  const [subStep, setSubStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [initialFormData, setInitialFormData] = useState<Record<string, any>>({});
  const [personName, setPersonName] = useState<string>("");
  const [sectionStatus, setSectionStatus] = useState<Record<string, 'pending' | 'complete'>>({
    identification: 'pending',
    finances: 'pending',
    business: 'pending',
    guarantors: 'pending',
    documents: 'pending',
    review: 'pending',
  });
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [hasFatca, setHasFatca] = useState(false);
  const [isPep, setIsPep] = useState(false);
  const [agentComments, setAgentComments] = useState("");
  const [loadingError, setLoadingError] = useState<string | null>(null);
  
  // New guarantor states
  const [guarantors, setGuarantors] = useState<GuarantorData[]>([createEmptyGuarantor(), createEmptyGuarantor()]);
  const [currentGuarantorIndex, setCurrentGuarantorIndex] = useState(0);
  const [guarantorFormStep, setGuarantorFormStep] = useState(0);
  const [isInGuarantorForm, setIsInGuarantorForm] = useState(false);
  
  // Hooks
  const saveDraftMutation = useSaveDraft();
  const { data: draftData, isLoading: isDraftLoading, error: draftError } = useDraftFormData(id || '');
  
  // Loading state - only show loading if we're fetching draft data
  const isLoading = isDraftLoading && !!id;
  
  // Import the useIncrementalSave hook
  const { saveIncremental, updateLastSavedData, hasUnsavedChanges: hasIncrementalChanges } = useIncrementalSave({
    currentData: formData,
    onSave: async (dataToSave: any, hasChanges: boolean) => {
      if (hasChanges) {
        await saveDraftMutation.mutateAsync({
          formData,
          currentStep: activeStep,
          currentSubStep: subStep,
          isIncremental: true,
          changedData: dataToSave
        });
      }
    }
  });
  
  // Check if there are unsaved changes
  const hasUnsavedChanges = hasIncrementalChanges();

  // Mapping from sectionId to step index
  const sectionIdToStepIndex = {
    'identification': 0,
    'finances': 1,
    'business': 2,
    'guarantors': 3,
    'documents': 4,
    'review': 5
  };

  // Section names for toast messages
  const sectionNames = {
    'identification': 'Identificación y Contacto',
    'finances': 'Finanzas y Patrimonio',
    'business': 'Negocio y Perfil Económico',
    'guarantors': 'Fiadores y Referencias',
    'documents': 'Documentos',
    'review': 'Revisión Final'
  };

  // Initialize form data effect
  useEffect(() => {
    console.log('🏁 RequestFormProvider initializing...');
    console.log('📍 Current path:', location.pathname);
    console.log('🔍 Draft ID:', id);
    console.log('📊 Draft loading state:', { isDraftLoading, draftError: !!draftError });
    
    // If we don't have an ID, initialize with empty form
    if (!id) {
      console.log('✅ No ID provided, initializing empty form');
      setDataLoaded(true);
      setLoadingError(null);
      return;
    }
    
    // If we have an error loading the draft
    if (draftError) {
      console.error('❌ Error loading draft data:', draftError);
      setLoadingError('No se pudo cargar el borrador. Iniciando solicitud nueva.');
      setDataLoaded(true);
      toast({
        title: "Error cargando borrador",
        description: "No se pudo cargar el borrador. Iniciando solicitud nueva.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    // If we have draft data, load it
    if (draftData && !dataLoaded) {
      console.log('📂 Loading draft data:', { id, clientName: draftData.client_name });
      
      try {
        const loadedFormData = draftData.draft_data || {};
        const clientName = draftData.client_name || 'Sin nombre';
        
        setFormData(loadedFormData);
        setInitialFormData(loadedFormData);
        setPersonName(clientName);
        
        // Restore step and sub-step
        if (draftData.last_step !== undefined) {
          setActiveStep(Math.max(0, Math.min(draftData.last_step, steps.length - 1)));
        }
        if (draftData.last_sub_step !== undefined) {
          setSubStep(Math.max(0, draftData.last_sub_step));
        }
        
        setDataLoaded(true);
        setLoadingError(null);
        
        toast({
          title: "Borrador cargado",
          description: `Se ha cargado el borrador de ${clientName}`,
          duration: 3000,
          className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
        });
        
        console.log('✅ Draft data loaded successfully');
      } catch (error) {
        console.error('❌ Error processing draft data:', error);
        setLoadingError('Error procesando los datos del borrador');
        setDataLoaded(true);
      }
    }
  }, [id, draftData, draftError, toast, steps.length, dataLoaded]);
  
  // Handle navigation effect
  useEffect(() => {
    if (!dataLoaded) return;
    
    // Check if there's a sectionId in the navigation state
    const navigationState = location.state as { sectionId?: string } | null;
    if (navigationState?.sectionId) {
      const targetStepIndex = sectionIdToStepIndex[navigationState.sectionId as keyof typeof sectionIdToStepIndex];
      if (targetStepIndex !== undefined) {
        setActiveStep(targetStepIndex);
        setSubStep(0);
        
        const sectionName = sectionNames[navigationState.sectionId as keyof typeof sectionNames];
        toast({
          title: "Navegación exitosa",
          description: `Navegando a: ${sectionName}`,
          duration: 3000,
          className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
        });
        
        console.log(`✅ Navigated to section: ${navigationState.sectionId}, step index: ${targetStepIndex}`);
      }
    }
  }, [dataLoaded, location.state, toast]);
  
  // Loading component
  if (isLoading || (!dataLoaded && !loadingError)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Cargando formulario...</p>
        </div>
      </div>
    );
  }
  
  // Check if current section has sufficient data to be marked as complete
  const checkSectionCompletion = () => {
    const currentSectionId = steps[activeStep].id;
    
    switch (currentSectionId) {
      case 'identification':
        return !!(formData.fullName && formData.cui && formData.email && formData.creditPurpose);
      case 'finances':
        return !!(formData.monthlyIncome || formData.businessIncome);
      case 'business':
        return !!(formData.businessType || formData.businessDescription);
      case 'guarantors':
        return guarantors.length >= 2 && guarantors.every(g => g.basicInfoCompleted && g.financialInfoCompleted);
      case 'documents':
        return !!(formData.documentsUploaded);
      case 'review':
        return !!(formData.termsAccepted && formData.dataProcessingAccepted);
      default:
        return false;
    }
  };
  
  // Define sub-steps for each section
  const getSubStepsForSection = (sectionIndex: number) => {
    switch (sectionIndex) {
      case 0: // Identificación y Contacto
        return 3;
      default:
        return 1;
    }
  };
  
  const isLastSubStep = subStep >= getSubStepsForSection(activeStep) - 1;
  
  // Handle sub-step navigation
  const handleSubNext = () => {
    if (checkSectionCompletion()) {
      setSectionStatus(prev => ({ ...prev, [steps[activeStep].id]: 'complete' }));
    }
    
    if (!isLastSubStep) {
      setSubStep(prev => prev + 1);
      console.log(`Moving to sub-step: ${subStep + 1} of section: ${steps[activeStep].id}`);
    } else {
      handleNext();
    }
    window.scrollTo(0, 0);
  };
  
  const handleSubPrevious = () => {
    if (subStep > 0) {
      setSubStep(prev => prev - 1);
      console.log(`Moving back to sub-step: ${subStep - 1} of section: ${steps[activeStep].id}`);
    } else if (activeStep > 0) {
      const prevStep = activeStep - 1;
      const prevSubSteps = getSubStepsForSection(prevStep);
      setActiveStep(prevStep);
      setSubStep(prevSubSteps - 1);
      console.log(`Moving back to previous section: ${steps[prevStep].id}, sub-step: ${prevSubSteps - 1}`);
    }
    window.scrollTo(0, 0);
  };
  
  const updateFormData = (field: string, value: any) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      console.log('📝 Form data updated:', { field, value });
      return newData;
    });
    
    // Auto-check completion when data is updated
    setTimeout(() => {
      if (checkSectionCompletion()) {
        setSectionStatus(prev => ({ ...prev, [steps[activeStep].id]: 'complete' }));
      } else {
        setSectionStatus(prev => ({ ...prev, [steps[activeStep].id]: 'pending' }));
      }
    }, 100);
  };
  
  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      if (checkSectionCompletion()) {
        setSectionStatus(prev => ({ ...prev, [steps[activeStep].id]: 'complete' }));
      }
      setActiveStep(prev => prev + 1);
      setSubStep(0);
      console.log(`Moving to step: ${steps[activeStep + 1].id}`);
      window.scrollTo(0, 0);
    }
  };
  
  const handleChangeSection = (index: number) => {
    setActiveStep(index);
    setSubStep(0);
    console.log(`Jumping to step: ${steps[index].id}`);
    window.scrollTo(0, 0);
  };
  
  const handleSaveDraft = async () => {
    console.log('💾 Saving draft with incremental save...');
    
    try {
      await saveIncremental(false);
      
      if (checkSectionCompletion()) {
        setSectionStatus(prev => ({ ...prev, [steps[activeStep].id]: 'complete' }));
      }
      
      console.log('✅ Draft saved successfully');
      
    } catch (error) {
      console.error('❌ Error saving draft:', error);
    }
  };
  
  const handleSubmit = () => {
    console.log('Submitting form:', formData);
    
    if (!formData.termsAccepted || !formData.dataProcessingAccepted || !formData.creditCheckAccepted) {
      toast({
        title: "Error en el envío",
        description: "Debes aceptar los términos obligatorios para continuar.",
        variant: "destructive",
        className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
        duration: 3000,
      });
      return;
    }
    
    toast({
      title: "Solicitud enviada",
      description: "Tu solicitud ha sido enviada correctamente.",
      variant: "default",
      className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
      duration: 3000,
    });
    
    setTimeout(() => {
      navigate('/applications');
    }, 1000);
  };
  
  const handleShowExitDialog = () => {
    setShowExitDialog(true);
  };
  
  const handleExit = async (save: boolean) => {
    console.log('🚪 Exiting application, save:', save);
    
    if (save) {
      try {
        await saveIncremental(true);
        console.log('✅ Draft saved before exit');
      } catch (error) {
        console.error('❌ Failed to save draft before exit:', error);
      }
    }
    
    setShowExitDialog(false);
    navigate('/applications');
  };
  
  // New guarantor functions
  const addGuarantor = () => {
    setGuarantors(prev => [...prev, createEmptyGuarantor()]);
  };
  
  const updateGuarantor = (index: number, field: string, value: any) => {
    setGuarantors(prev => prev.map((guarantor, i) => 
      i === index ? { ...guarantor, [field]: value } : guarantor
    ));
  };
  
  const removeGuarantor = (index: number) => {
    if (guarantors.length > 2) {
      setGuarantors(prev => prev.filter((_, i) => i !== index));
      if (currentGuarantorIndex >= guarantors.length - 1) {
        setCurrentGuarantorIndex(0);
      }
    }
  };
  
  const isLastStep = activeStep === steps.length - 1;
  
  const value = {
    activeStep,
    setActiveStep,
    formData,
    updateFormData,
    personName,
    sectionStatus,
    setSectionStatus,
    handleNext,
    handleChangeSection,
    handleSaveDraft,
    handleSubmit,
    handleShowExitDialog,
    isLastStep,
    showExitDialog,
    setShowExitDialog,
    handleExit,
    hasFatca,
    setHasFatca,
    isPep,
    setIsPep,
    agentComments,
    setAgentComments,
    subStep,
    setSubStep,
    handleSubNext,
    handleSubPrevious,
    isLastSubStep,
    getSubStepsForSection,
    hasUnsavedChanges,
    guarantors,
    setGuarantors,
    currentGuarantorIndex,
    setCurrentGuarantorIndex,
    guarantorFormStep,
    setGuarantorFormStep,
    addGuarantor,
    updateGuarantor,
    removeGuarantor,
    isInGuarantorForm,
    setIsInGuarantorForm,
    isLoading: isLoading || !dataLoaded,
    loadingError
  };

  return (
    <FormContext.Provider value={value}>
      {children}
    </FormContext.Provider>
  );
};

export default RequestFormProvider;
