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
  return <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t z-40 my-[10px] px-0 py-[4px]">
      <div className="container max-w-5xl mx-auto py-0">
        <div className="flex justify-between items-center py-[16px]">
          {/* Left: Anterior button */}
          <div className="flex-1">
            <Button variant="outline" onClick={handleSubPrevious} disabled={isFirstStep} className={isFirstStep ? "opacity-50 cursor-not-allowed" : ""}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Anterior
            </Button>
          </div>
          
          {/* Center: Save draft button (icon only) */}
          <div className="flex-1 flex justify-center px-0 mx-0">
            <Button 
              variant="outline" 
              onClick={handleSaveDraft} 
              size="icon"
              disabled={isSavingDraft}
            >
              {isSavingDraft ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              ) : (
                <Save className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Right: Next/Submit button */}
          <div className="flex-1 flex justify-end">
            {isLastStep && isLastSubStep ? <Button onClick={handleSubmit}>
                <Check className="mr-2 h-4 w-4" />
                Enviar solicitud
              </Button> : showNext ? <Button onClick={handleSubNext}>
                Siguiente
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button> : <div></div>}
          </div>
        </div>
      </div>
    </div>;
};
export default FormActionBar;