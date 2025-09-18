
import React from 'react';
import { CheckCircle } from 'lucide-react';

interface Step {
  id: string;
  title: string;
  icon: React.ReactNode;
}

interface StepNavigationProps {
  steps: Step[];
  activeStep: number;
  sectionStatus: Record<string, 'pending' | 'complete'>;
  onChangeStep: (index: number) => void;
}

const StepNavigation: React.FC<StepNavigationProps> = ({ 
  steps, 
  activeStep, 
  sectionStatus, 
  onChangeStep 
}) => {
  // CSS styles for hide-scrollbar
  const hideScrollbarStyle = {
    msOverflowStyle: 'none',
    scrollbarWidth: 'none',
    '::-webkit-scrollbar': {
      display: 'none'
    }
  } as React.CSSProperties;
  
  return (
    <div className="relative">
      <div className="flex overflow-x-auto gap-1 pb-1 dropdown-content" style={hideScrollbarStyle}>
        {steps.map((step, index) => {
          const isActive = activeStep === index;
          const isCompleted = sectionStatus[step.id] === 'complete';
          const isPast = index < activeStep;
          const isClickable = true; // Make all sections clickable for non-linear access
          
          return (
            <button
              key={step.id}
              onClick={() => isClickable && onChangeStep(index)}
              disabled={!isClickable}
              className={`
                relative flex items-center gap-2 py-2 px-3 min-w-fit rounded-lg transition-all duration-200
                ${isActive ? 'bg-primary/10 text-primary shadow-sm' : ''}
                ${isCompleted && !isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : ''}
                ${isPast && !isActive && !isCompleted ? 'text-primary/70' : ''}
                ${!isClickable ? 'opacity-40' : 'hover:bg-primary/10 hover:text-primary focus-visible:ring-primary'}
              `}
            >
              {/* Check icon for completed sections */}
              {isCompleted && !isActive && (
                <CheckCircle 
                  size={12} 
                  className="absolute -top-1 -right-1 bg-white rounded-full text-emerald-600" 
                />
              )}
              <div className={`
                flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium
                ${isActive ? 'bg-primary text-primary-foreground' : ''} 
                ${isCompleted && !isActive ? 'bg-primary/80 text-primary-foreground' : ''}
                ${!isActive && !isCompleted ? 'bg-muted border' : ''}
              `}>
                {isCompleted ? <CheckCircle size={14} /> : index + 1}
              </div>
              <span className="whitespace-nowrap font-medium text-sm">
                {step.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default StepNavigation;
