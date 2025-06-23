
import React from 'react';
import { useFormContext } from './RequestFormProvider';
import PersonalInfoForm from './identification/PersonalInfoForm';
import ContactHousingForm from './identification/ContactHousingForm';

interface IdentificationContactProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

const IdentificationContact: React.FC<IdentificationContactProps> = ({ formData, updateFormData }) => {
  const { subStep } = useFormContext();

  const renderSubStep = () => {
    switch (subStep) {
      case 0:
        return <PersonalInfoForm formData={formData} updateFormData={updateFormData} />;
      case 1:
        return <ContactHousingForm formData={formData} updateFormData={updateFormData} />;
      default:
        return <PersonalInfoForm formData={formData} updateFormData={updateFormData} />;
    }
  };

  return (
    <div className="space-y-6">
      {renderSubStep()}
    </div>
  );
};

export default IdentificationContact;
