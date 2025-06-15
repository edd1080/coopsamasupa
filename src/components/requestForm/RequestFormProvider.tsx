import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";

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
  const [toastShown, setToastShown] = useState(false);
  const [hasFatca, setHasFatca] = useState(false);
  const [isPep, setIsPep] = useState(false);
  const [agentComments, setAgentComments] = useState("");
  const [lastSavedData, setLastSavedData] = useState<Record<string, any>>({});
  
  // New guarantor states
  const [guarantors, setGuarantors] = useState<GuarantorData[]>([createEmptyGuarantor(), createEmptyGuarantor()]);
  const [currentGuarantorIndex, setCurrentGuarantorIndex] = useState(0);
  const [guarantorFormStep, setGuarantorFormStep] = useState(0); // 0: basic info, 1: financial info
  const [isInGuarantorForm, setIsInGuarantorForm] = useState(false);
  
  // Check if there are unsaved changes
  const hasUnsavedChanges = JSON.stringify(formData) !== JSON.stringify(lastSavedData);

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

  useEffect(() => {
    console.log('🏁 RequestFormProvider initializing...');
    console.log('📍 Current path:', location.pathname);
    console.log('📝 Current active step:', steps[activeStep].id);
    
    // Check if there's a sectionId in the navigation state
    const navigationState = location.state as { sectionId?: string } | null;
    if (navigationState?.sectionId) {
      const targetStepIndex = sectionIdToStepIndex[navigationState.sectionId as keyof typeof sectionIdToStepIndex];
      if (targetStepIndex !== undefined) {
        setActiveStep(targetStepIndex);
        setSubStep(0); // Reset to beginning of section
        
        // Show toast notification
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
    
    // If we're editing an existing application, fetch its data
    if (id) {
      console.log(`📂 Fetching data for application: ${id}`);
      
      // Simulate API delay
      setTimeout(() => {
        // This is mock data - in a real app, this would come from an API
        const mockData = {
          personalInfo: {
            firstName: 'María',
            lastName: 'Rodríguez',
          },
          termsAccepted: false,
          dataProcessingAccepted: false,
          creditCheckAccepted: false,
          applicationCode: `BVM_${generateRandomId()}`,
          hasFatca: false,
          isPep: false,
          agentComments: "",
          creditAmount: 50000
        };
        
        setFormData(mockData);
        setInitialFormData(mockData);
        setLastSavedData(mockData);
        setPersonName(`${mockData.personalInfo.firstName} ${mockData.personalInfo.lastName}`);
        
        // Set sections that have data as complete
        if (mockData.personalInfo) {
          setSectionStatus(prev => ({ ...prev, identification: 'complete' }));
        }
        
        // Only show toast once if not navigating to specific section
        if (!toastShown && !navigationState?.sectionId) {
          toast({
            title: "Datos cargados",
            description: `Se ha cargado la solicitud ${mockData.applicationCode || id} para edición`,
            duration: 3000,
            className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
          });
          setToastShown(true);
        }
      }, 500);
    }
  }, [navigate, activeStep, id, toast, toastShown, steps, location.state]);
  
  // Check if current section has sufficient data to be marked as complete
  const checkSectionCompletion = () => {
    const currentSectionId = steps[activeStep].id;
    
    // Basic validation - in a real app this would be more sophisticated
    switch (currentSectionId) {
      case 'identification':
        return !!(formData.fullName && formData.cui && formData.email && formData.creditPurpose);
      case 'finances':
        return !!(formData.monthlyIncome || formData.businessIncome);
      case 'business':
        return !!(formData.businessType || formData.businessDescription);
      case 'guarantors':
        // Check if we have at least 2 guarantors and all are completed
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
    // Mark section as complete if it has sufficient data
    if (checkSectionCompletion()) {
      setSectionStatus(prev => ({ ...prev, [steps[activeStep].id]: 'complete' }));
    }
    
    if (!isLastSubStep) {
      setSubStep(prev => prev + 1);
      console.log(`Moving to sub-step: ${subStep + 1} of section: ${steps[activeStep].id}`);
    } else {
      // Move to next main section
      handleNext();
    }
    window.scrollTo(0, 0);
  };
  
  const handleSubPrevious = () => {
    if (subStep > 0) {
      setSubStep(prev => prev - 1);
      console.log(`Moving back to sub-step: ${subStep - 1} of section: ${steps[activeStep].id}`);
    } else if (activeStep > 0) {
      // Move to previous main section's last sub-step
      const prevStep = activeStep - 1;
      const prevSubSteps = getSubStepsForSection(prevStep);
      setActiveStep(prevStep);
      setSubStep(prevSubSteps - 1);
      console.log(`Moving back to previous section: ${steps[prevStep].id}, sub-step: ${prevSubSteps - 1}`);
    }
    window.scrollTo(0, 0);
  };
  
  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
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
      // Mark current section as complete if it has data
      if (checkSectionCompletion()) {
        setSectionStatus(prev => ({ ...prev, [steps[activeStep].id]: 'complete' }));
      }
      setActiveStep(prev => prev + 1);
      setSubStep(0); // Reset sub-step when moving to new section
      console.log(`Moving to step: ${steps[activeStep + 1].id}`);
      
      window.scrollTo(0, 0);
    }
  };
  
  const handleChangeSection = (index: number) => {
    setActiveStep(index);
    setSubStep(0); // Reset sub-step when jumping to section
    console.log(`Jumping to step: ${steps[index].id}`);
    window.scrollTo(0, 0);
  };
  
  const handleSaveDraft = () => {
    console.log('Saving draft:', formData);
    
    // Update last saved data
    setLastSavedData(formData);
    
    // Mark current section as complete if it has sufficient data
    if (checkSectionCompletion()) {
      setSectionStatus(prev => ({ ...prev, [steps[activeStep].id]: 'complete' }));
    }
    
    toast({
      title: "Borrador guardado",
      description: "Tu solicitud ha sido guardada como borrador.",
      variant: "default",
      className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
      duration: 3000,
    });
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
  
  const handleExit = (save: boolean) => {
    if (save) {
      handleSaveDraft();
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
    if (guarantors.length > 2) { // Minimum 2 guarantors required
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
    
    // New guarantor context values
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
    setIsInGuarantorForm
  };

  return (
    <FormContext.Provider value={value}>
      {children}
    </FormContext.Provider>
  );
};

export default RequestFormProvider;
