
import React from 'react';
import { useFormContext } from './RequestFormProvider';
import BasicDataForm from './identification/BasicDataForm';
import ContactHousingForm from './identification/ContactHousingForm';
import DocumentsForm from './identification/DocumentsForm';

interface IdentificationContactProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

const IdentificationContact: React.FC<IdentificationContactProps> = ({ formData, updateFormData }) => {
  const { subStep } = useFormContext();

  const renderSubStep = () => {
    switch (subStep) {
      case 0:
        return <BasicDataForm formData={formData} updateFormData={updateFormData} />;
      case 1:
        return <ContactHousingForm formData={formData} updateFormData={updateFormData} />;
      case 2:
        return <DocumentsForm formData={formData} updateFormData={updateFormData} />;
      default:
        return <BasicDataForm formData={formData} updateFormData={updateFormData} />;
    }
  };

  return (
    <div className="space-y-6">
      {renderSubStep()}
    </div>
  );
};

export default IdentificationContact;
