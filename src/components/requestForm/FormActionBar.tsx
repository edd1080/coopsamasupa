import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft, Save, Check } from 'lucide-react';
import { useFormContext } from './RequestFormProvider';
import { useApplicationValidation } from '@/hooks/useDraftActions';
import { useToast } from '@/hooks/use-toast';
interface FormActionBarProps {
  steps: {
    id: string;
    title: string;
    icon: React.ReactNode;
  }[];
}
const FormActionBar: React.FC<FormActionBarProps> = ({
  steps
}) => {
  const {
    activeStep,
    subStep,
    isLastStep,
    isLastSubStep,
    formData,
    handleSaveDraft,
    handleSubNext,
    handleSubPrevious,
    handleSubmit,
    isSavingDraft,
    isSubmitting
  } = useFormContext();
  
  const { validateMinimumRequiredData } = useApplicationValidation();
  const { toast } = useToast();

  // Check if we're at the very first step
  const isFirstStep = activeStep === 0 && subStep === 0;

  // Check if we should show the next button
  const showNext = !(isLastStep && isLastSubStep);
  
  // Función de envío con validación mínima
  const handleSubmitWithValidation = () => {
    // Validar datos mínimos requeridos antes del envío
    const validation = validateMinimumRequiredData(formData);
    
    if (!validation.isValid) {
      toast({
        title: "Datos mínimos requeridos",
        description: `Para enviar la solicitud, complete al menos: ${validation.missingFields.join(', ')}`,
        variant: "destructive"
      });
      return;
    }
    
    // Si la validación pasa, proceder con el envío
    handleSubmit();
  };
  return <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t z-40 px-3 py-2.5 sm:px-4 sm:py-3.5">
      <div className="container max-w-5xl mx-auto">
        <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4">
          {/* Left: Anterior button */}
          <Button 
            variant="outline" 
            onClick={handleSubPrevious} 
            disabled={isFirstStep} 
            className={`${isFirstStep ? "opacity-50 cursor-not-allowed" : ""} min-w-[70px] sm:min-w-[80px] md:min-w-[90px] h-9 text-xs sm:text-sm px-3 py-1.5`}
          >
            <ArrowLeft className="mr-0.5 h-3 w-3 sm:h-4 sm:w-4" />
            Anterior
          </Button>
          
          {/* Center: Save draft button */}
          <Button 
            variant="outline" 
            onClick={handleSaveDraft} 
            disabled={isSavingDraft}
            className="min-w-[40px] sm:min-w-[44px] md:min-w-[48px] h-9 px-2 py-1.5"
          >
            {isSavingDraft ? (
              <div className="h-3 w-3 sm:h-4 sm:w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            ) : (
              <Save className="h-3 w-3 sm:h-4 sm:w-4" />
            )}
          </Button>

          {/* Right: Next/Submit button */}
          {isLastStep && isLastSubStep ? (
            <Button 
              onClick={handleSubmitWithValidation} 
              className="min-w-[100px] sm:min-w-[110px] md:min-w-[120px] h-9 text-xs sm:text-sm px-3 py-1.5"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="h-3 w-3 sm:h-4 sm:w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent mr-1" />
                  Enviando...
                </>
              ) : (
                <>
                  <Check className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                  Enviar solicitud
                </>
              )}
            </Button>
          ) : showNext ? (
            <Button 
              onClick={handleSubNext} 
              className="min-w-[70px] sm:min-w-[80px] md:min-w-[90px] h-9 text-xs sm:text-sm px-3 py-1.5"
            >
              Siguiente
              <ArrowRight className="ml-0.5 h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          ) : (
            <div className="min-w-[70px] sm:min-w-[80px] md:min-w-[90px]"></div>
          )}
        </div>
      </div>
    </div>;
};
export default FormActionBar;