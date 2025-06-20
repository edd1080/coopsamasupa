
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

const FormActionBar: React.FC<FormActionBarProps> = ({ steps }) => {
  const {
    activeStep,
    subStep,
    isLastStep,
    isLastSubStep,
    formData,
    handleSaveDraft,
    handleSubNext,
    handleSubPrevious,
    handleSubmit
  } = useFormContext();

  // Check if we're at the very first step
  const isFirstStep = activeStep === 0 && subStep === 0;
  
  // Check if we should show the next button
  const showNext = !(isLastStep && isLastSubStep);

  return (
    <div className="fixed bottom-16 left-0 right-0 py-6 px-4 bg-background/95 backdrop-blur-md border-t z-40">
      <div className="container max-w-5xl mx-auto">
        <div className="flex justify-between items-center py-2">
          {/* Left: Anterior button */}
          <div className="flex-1">
            <Button 
              variant="outline" 
              onClick={handleSubPrevious}
              disabled={isFirstStep}
              className={isFirstStep ? "opacity-50 cursor-not-allowed" : ""}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Anterior
            </Button>
          </div>
          
          {/* Center: Save draft button (icon only) */}
          <div className="flex-1 flex justify-center">
            <Button 
              variant="outline" 
              onClick={handleSaveDraft}
              size="icon"
            >
              <Save className="h-4 w-4" />
            </Button>
          </div>

          {/* Right: Next/Submit button */}
          <div className="flex-1 flex justify-end">
            {isLastStep && isLastSubStep ? (
              <Button 
                onClick={handleSubmit}
                disabled={
                  !formData.termsAccepted || 
                  !formData.dataProcessingAccepted || 
                  !formData.creditCheckAccepted
                }
              >
                <Check className="mr-2 h-4 w-4" />
                Enviar solicitud
              </Button>
            ) : showNext ? (
              <Button onClick={handleSubNext}>
                Siguiente
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormActionBar;
