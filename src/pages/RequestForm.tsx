
import React from 'react';
import Header from '@/components/layout/Header';
import BottomNavigation from '@/components/layout/BottomNavigation';
import BreadcrumbNavigation from '@/components/navigation/BreadcrumbNavigation';
import DynamicFormHeader from '@/components/requestForm/DynamicFormHeader';
import { getFirstNameAndLastName } from '@/lib/nameUtils';

// Refactored components
import RequestFormProvider, { useFormContext } from '@/components/requestForm/RequestFormProvider';
import StepContent from '@/components/requestForm/StepContent';
import ExitDialog from '@/components/requestForm/ExitDialog';
import FormActionBar from '@/components/requestForm/FormActionBar';
import { steps } from '@/components/requestForm/formSteps';

const RequestFormContent = () => {
  const { 
    personName,
    showExitDialog,
    setShowExitDialog,
    handleExit,
    hasUnsavedChanges,
    formData
  } = useFormContext();

  return (
    <div className="min-h-screen flex flex-col">
      <Header personName={getFirstNameAndLastName(personName)} />
      
      <main className="flex-1 container mx-auto px-4 py-0 pb-20 max-w-5xl">
        {/* Breadcrumb Navigation */}
        <div className="mb-3 mt-4">
          <BreadcrumbNavigation />
        </div>
        
        {/* Dynamic Form Header - replaces NavigationHeader and SectionHeader */}
        <DynamicFormHeader />
        
        {/* Step Content */}
        <div className="mt-6">
          <StepContent />
        </div>
        
        {/* Action Bar */}
        <FormActionBar steps={steps} />
      </main>
      
      <BottomNavigation />
      
      {/* Exit Dialog */}
      <ExitDialog 
        open={showExitDialog} 
        onOpenChange={setShowExitDialog}
        onExit={handleExit}
        hasUnsavedChanges={hasUnsavedChanges}
        formData={formData}
      />
    </div>
  );
};

const RequestForm = () => {
  return (
    <RequestFormProvider steps={steps}>
      <RequestFormContent />
    </RequestFormProvider>
  );
};

export default RequestForm;
