import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft, Save, Check } from 'lucide-react';
import { useFormContext } from './RequestFormProvider';
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
    isSavingDraft
  } = useFormContext();

  // Check if we're at the very first step
  const isFirstStep = activeStep === 0 && subStep === 0;

  // Check if we should show the next button
  const showNext = !(isLastStep && isLastSubStep);
  return <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t z-40 px-4 py-3">
      <div className="container max-w-5xl mx-auto">
        <div className="flex items-center justify-center gap-6">
          {/* Left: Anterior button */}
          <Button 
            variant="outline" 
            onClick={handleSubPrevious} 
            disabled={isFirstStep} 
            className={`${isFirstStep ? "opacity-50 cursor-not-allowed" : ""} min-w-[100px]`}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Anterior
          </Button>
          
          {/* Center: Save draft button */}
          <Button 
            variant="outline" 
            onClick={handleSaveDraft} 
            disabled={isSavingDraft}
            className="min-w-[120px]"
          >
            {isSavingDraft ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent mr-2" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Guardar
              </>
            )}
          </Button>

          {/* Right: Next/Submit button */}
          {isLastStep && isLastSubStep ? (
            <Button onClick={handleSubmit} className="min-w-[140px]">
              <Check className="mr-2 h-4 w-4" />
              Enviar solicitud
            </Button>
          ) : showNext ? (
            <Button onClick={handleSubNext} className="min-w-[100px]">
              Siguiente
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <div className="min-w-[100px]"></div>
          )}
        </div>
      </div>
    </div>;
};
export default FormActionBar;