
import React from 'react';
import { useFormContext } from './RequestFormProvider';
import PersonalIdentificationForm from './identification/PersonalIdentificationForm';
import ContactHousingForm from './identification/ContactHousingForm';
import CreditInfoForm from './identification/CreditInfoForm';
import CreditDestinationForm from './identification/CreditDestinationForm';

interface IdentificationContactProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

const IdentificationContact: React.FC<IdentificationContactProps> = ({ formData, updateFormData }) => {
  const { subStep } = useFormContext();

  const renderSubStep = () => {
    switch (subStep) {
      case 0:
        return <PersonalIdentificationForm formData={formData} updateFormData={updateFormData} />;
      case 1:
        return <ContactHousingForm formData={formData} updateFormData={updateFormData} />;
      case 2:
        return <CreditInfoForm formData={formData} updateFormData={updateFormData} />;
      case 3:
        return <CreditDestinationForm formData={formData} updateFormData={updateFormData} />;
      default:
        return <PersonalIdentificationForm formData={formData} updateFormData={updateFormData} />;
    }
  };

  return (
    <div className="space-y-6">
      {renderSubStep()}
    </div>
  );
};

export default IdentificationContact;
