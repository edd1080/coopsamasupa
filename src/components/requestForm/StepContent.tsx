import React from 'react';
import { useFormContext } from './RequestFormProvider';
import IdentificationContact from './IdentificationContact';
import FinancialInfo from './FinancialInfo';
import ImprovedReferencesSection from './ImprovedReferencesSection';
import PhotoDocumentUpload from './PhotoDocumentUpload';
import ReviewSection from './ReviewSection';
import FormTypeBanner from '../forms/FormTypeBanner';
import CreditInfoForm from './identification/CreditInfoForm';
import CreditDestinationForm from './identification/CreditDestinationForm';
import ReferencesSection from './ReferencesSection';

const StepContent: React.FC = () => {
  const { activeStep, subStep, formData, updateFormData, isInReferenceForm } = useFormContext();

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return <IdentificationContact formData={formData} updateFormData={updateFormData} />;
      case 1:
        // Credit information step
        return subStep === 0 ? (
          <CreditInfoForm formData={formData} updateFormData={updateFormData} />
        ) : (
          <CreditDestinationForm formData={formData} updateFormData={updateFormData} />
        );
      case 2:
        return <FinancialInfo formData={formData} updateFormData={updateFormData} />;
      case 3:
        return isInReferenceForm ? (
          <ImprovedReferencesSection formData={formData} updateFormData={updateFormData} />
        ) : (
          <ReferencesSection formData={formData} updateFormData={updateFormData} />
        );
      case 4:
        return <PhotoDocumentUpload formData={formData} updateFormData={updateFormData} />;
      case 5:
        return <ReviewSection formData={formData} updateFormData={updateFormData} />;
      default:
        return <IdentificationContact formData={formData} updateFormData={updateFormData} />;
    }
  };

  const getFormType = () => {
    if (activeStep === 3 && isInReferenceForm) {
      return 'reference';
    }
    return 'applicant';
  };

  return (
    <div className="mb-24">
      {activeStep === 3 && isInReferenceForm && (
        <div className="mb-6">
          <FormTypeBanner type={getFormType()} />
        </div>
      )}
      {renderStepContent()}
    </div>
  );
};

export default StepContent;