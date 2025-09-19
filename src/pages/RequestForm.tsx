
import React from 'react';
import { useNavigate } from 'react-router-dom';
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
import ApplicationSuccessScreen from '@/components/requestForm/ApplicationSuccessScreen';
import SafeNavigationWrapper from '@/components/requestForm/SafeNavigationWrapper';
import { steps } from '@/components/requestForm/formSteps';

const RequestFormContent = () => {
  const { 
    personName,
    showExitDialog,
    setShowExitDialog,
    handleExit,
    hasUnsavedChanges,
    formData,
    handleShowExitDialog,
    showSuccessScreen,
    submissionResult
  } = useFormContext();
  
  const navigate = useNavigate();

  console.log('🎯 RequestFormContent rendering');

  if (showSuccessScreen) {
    return (
      <ApplicationSuccessScreen
        applicationId={formData.applicationId}
        externalReferenceId={submissionResult?.externalReferenceId}
        onGoToApplications={() => navigate('/applications')}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        personName={getFirstNameAndLastName(personName)} 
        applicationId={formData.applicationId}
        onExitFormClick={handleShowExitDialog}
      />
      
      <main className="flex-1 container mx-auto px-4 py-0 pb-20 max-w-5xl">
        {/* Breadcrumb Navigation */}
        <div className="mb-3 mt-4">
          <BreadcrumbNavigation />
        </div>
        
        {/* Dynamic Form Header - now without X button */}
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
  console.log('🚀 RequestForm component initializing');
  const navigate = useNavigate();
  
  // Create navigation function to pass to provider
  const handleNavigateToApplications = () => {
    console.log('🔄 Navigating to applications list...');
    navigate('/applications');
  };
  
  return (
    <RequestFormProvider 
      steps={steps} 
      onNavigateAfterExit={handleNavigateToApplications}
      onRedirectSubmittedApplication={(id) => navigate(`/applications/${id}`)}
    >
      <SafeNavigationWrapper>
        <RequestFormContent />
      </SafeNavigationWrapper>
    </RequestFormProvider>
  );
};

export default RequestForm;
