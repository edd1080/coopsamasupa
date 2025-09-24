
import React, { useState } from 'react';
import { ChevronDown, CheckCircle } from 'lucide-react';
import { useFormContext } from './RequestFormProvider';
import { steps } from './formSteps';
import { useScrollLock } from '../../hooks/useScrollLock';
import { useClickOutside } from '../../hooks/useClickOutside';

const DynamicFormHeader: React.FC = () => {
  const {
    activeStep,
    handleChangeSection,
    sectionStatus,
    getProgressPercentage
  } = useFormContext();

  const [isExpanded, setIsExpanded] = useState(false);

  // Usar hooks personalizados
  useScrollLock(isExpanded);
  const dropdownRef = useClickOutside(isExpanded, () => setIsExpanded(false));

  const currentStep = steps[activeStep] || steps[0]; // Fallback to first step if activeStep is invalid
  const totalSteps = steps.length;
  const currentStepNumber = Math.min(activeStep + 1, totalSteps); // Ensure within bounds
  
  // Usar el sistema robusto de progreso basado en el último campo editado
  const progress = getProgressPercentage();

  // Define step contexts for each section
  const getStepContext = (stepId: string) => {
    switch (stepId) {
      case 'identification':
        return 'Datos básicos';
      case 'finances':
        return 'Información financiera';
      case 'business':
        return 'Perfil económico';
      case 'guarantors':
        return 'Referencias personales';
      case 'documents':
        return 'Documentos y cierre';
      case 'review':
        return 'Revisión final';
      default:
        return 'Información general';
    }
  };

  const handleSectionSelect = (index: number) => {
    handleChangeSection(index);
    setIsExpanded(false);
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="flex items-center">
        {/* Full width clickable title and step info - Removed X button */}
        <div className="w-full relative" ref={dropdownRef}>
          <button 
            onClick={toggleExpanded} 
            className="flex items-center gap-2 text-left w-full group hover:bg-primary/10 rounded-lg p-2 -m-2 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <h1 className="text-xl md:text-2xl font-semibold text-foreground truncate transition-all duration-300">
                {currentStep.title}
              </h1>
              <p className="text-sm text-muted-foreground mt-1 transition-all duration-300">
                Paso {currentStepNumber} de {totalSteps} – {getStepContext(currentStep.id)}
              </p>
            </div>
            <ChevronDown 
              size={20} 
              className={`text-muted-foreground transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} 
            />
          </button>

          {/* Dropdown menu */}
          {isExpanded && (
             <div 
               className="absolute top-full left-0 mt-2 w-full max-w-md bg-popover border rounded-lg shadow-lg z-50 py-2 max-h-96 overflow-y-auto"
               onClick={(e) => e.stopPropagation()}
             >
              {steps.map((step, index) => {
                const isActive = activeStep === index;
                const isCompleted = step?.id ? sectionStatus[step.id] === 'complete' : false;
                
                return (
                  <button
                    key={step.id}
                    onClick={() => handleSectionSelect(index)}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-primary/10 transition-colors
                      ${isActive ? 'bg-primary/10' : ''}
                    `}
                  >
                    <div className={`
                      flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium flex-shrink-0
                      ${isActive ? 'bg-primary text-primary-foreground' : ''} 
                      ${isCompleted && !isActive ? 'bg-primary/80 text-primary-foreground' : ''}
                      ${!isActive && !isCompleted ? 'bg-muted border' : ''}
                    `}>
                      {isCompleted && !isActive ? <CheckCircle size={14} /> : index + 1}
                    </div>
                     <div className="flex-1 min-w-0">
                      <div className={`font-medium text-sm truncate ${isActive ? 'text-primary' : ''} ${isCompleted && !isActive ? 'text-primary' : ''}`}>
                        {step?.title || `Paso ${index + 1}`}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {step?.id ? getStepContext(step.id) : 'Información general'}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
      
      {/* Progress bar for mobile - linear indicator without percentage */}
      <div className="mt-3 md:hidden">
        <div className="w-full bg-muted/30 rounded-full h-1.5">
          <div 
            className="bg-primary h-1.5 rounded-full transition-all duration-500 ease-out" 
            style={{ width: `${progress}%` }} 
          />
        </div>
      </div>
    </div>
  );
};

export default DynamicFormHeader;
