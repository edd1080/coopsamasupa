
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
import ApplicationErrorScreen from '@/components/requestForm/ApplicationErrorScreen';
import CoopsamaErrorDialog from '@/components/requestForm/CoopsamaErrorDialog';
// import ValidationDialog from '@/components/requestForm/ValidationDialog'; // REMOVED (no longer needed)
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
    submissionResult,
    showErrorScreen,
    errorMessage,
    showCoopsamaErrorDialog,
    setShowCoopsamaErrorDialog,
    coopsamaErrorMessage
  } = useFormContext();
  
  const navigate = useNavigate();

  console.log('🎯 RequestFormContent rendering');

  // Show Coopsama error dialog if there's an error, even if success screen is shown
  if (showCoopsamaErrorDialog) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-center mb-8">Enviando Solicitud</h1>
            <div className="bg-card rounded-lg p-6 shadow-sm border">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Procesando solicitud...</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Coopsama Error Dialog */}
        <CoopsamaErrorDialog
          open={showCoopsamaErrorDialog}
          onOpenChange={setShowCoopsamaErrorDialog}
          errorMessage={coopsamaErrorMessage}
          onRetry={() => {
            setShowCoopsamaErrorDialog(false);
            // User can retry by submitting again
          }}
          onGoToApplications={() => navigate('/applications')}
        />
      </div>
    );
  }

  if (showSuccessScreen) {
    return (
      <ApplicationSuccessScreen
        applicationId={formData.applicationId}
        externalReferenceId={submissionResult?.externalReferenceId}
        onGoToApplications={() => navigate('/applications')}
      />
    );
  }

  if (showErrorScreen) {
    return (
      <ApplicationErrorScreen
        errorMessage={errorMessage}
        applicationId={formData.applicationId}
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
      
      {/* Coopsama Error Dialog - moved to conditional rendering above */}
      
      {/* Validation Dialog - REMOVED (no longer needed) */}
    </div>
  );
};

const RequestForm = () => {
  console.log('🚀 RequestForm component initializing');
  console.log('🔍 RequestForm render stack trace:', new Error().stack);
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
