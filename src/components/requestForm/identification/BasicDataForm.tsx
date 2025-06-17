
import React, { useEffect, useState } from 'react';
import { useFormContext } from '../RequestFormProvider';
import AgencyMemberForm from './AgencyMemberForm';
import PersonalInfoForm from './PersonalInfoForm';
import DocumentsForm from './DocumentsForm';
import BirthDemographicsForm from './BirthDemographicsForm';
import SpouseInfoForm from './SpouseInfoForm';
import DisabilityForm from './DisabilityForm';

interface BasicDataFormProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

const BasicDataForm: React.FC<BasicDataFormProps> = ({ formData, updateFormData }) => {
  const { isLoading, loadingError } = useFormContext();
  const [isMarried, setIsMarried] = useState(formData?.civilStatus === 'married');

  useEffect(() => {
    setIsMarried(formData?.civilStatus === 'married');
  }, [formData?.civilStatus]);

  console.log('🎯 BasicDataForm rendering', { 
    hasFormData: !!formData, 
    isLoading, 
    loadingError,
    civilStatus: formData?.civilStatus
  });

  // Show loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-6 bg-muted rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-muted rounded w-2/3 mb-6"></div>
          <div className="space-y-4">
            <div className="h-10 bg-muted rounded"></div>
            <div className="h-10 bg-muted rounded"></div>
            <div className="h-10 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (loadingError) {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold text-lg">Datos Básicos</h3>
          <p className="text-muted-foreground text-sm">
            Complete la información básica del solicitante.
          </p>
        </div>
        <div className="p-4 border border-destructive/20 bg-destructive/5 rounded-md">
          <p className="text-destructive text-sm">{loadingError}</p>
        </div>
      </div>
    );
  }

  // Ensure formData has default values to prevent rendering errors
  const safeFormData = formData || {};

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-lg">Datos Básicos</h3>
        <p className="text-muted-foreground text-sm">
          Complete la información básica del solicitante.
        </p>
      </div>
      
      <div className="space-y-6">
        {/* Agencia y Tipo Socio */}
        <AgencyMemberForm formData={safeFormData} updateFormData={updateFormData} />

        {/* Información Personal */}
        <PersonalInfoForm formData={safeFormData} updateFormData={updateFormData} />

        {/* Documentos */}
        <DocumentsForm formData={safeFormData} updateFormData={updateFormData} />

        {/* Fecha de Nacimiento y Demografía */}
        <BirthDemographicsForm formData={safeFormData} updateFormData={updateFormData} />

        {/* Campos condicionales para cónyuge */}
        {isMarried && (
          <SpouseInfoForm formData={safeFormData} updateFormData={updateFormData} />
        )}

        {/* Campo de Incapacidad */}
        <DisabilityForm formData={safeFormData} updateFormData={updateFormData} />
      </div>
    </div>
  );
};

export default BasicDataForm;
