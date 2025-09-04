
import React from 'react';
import { User, Users } from 'lucide-react';

interface FormTypeBannerProps {
  type: 'applicant' | 'guarantor' | 'reference';
}

const FormTypeBanner: React.FC<FormTypeBannerProps> = ({ type }) => {
  const isApplicant = type === 'applicant';
  const isReference = type === 'reference';
  
  const getIconColor = () => {
    if (isApplicant) return 'text-primary';
    if (isReference) return 'text-primary';
    return 'text-accent';
  };

  const getBannerClass = () => {
    if (isApplicant) return 'form-container-applicant';
    if (isReference) return 'form-container-applicant'; // Use same style as applicant
    return 'form-container-guarantor';
  };

  const getBadgeClass = () => {
    if (isApplicant) return 'form-type-badge-applicant';
    if (isReference) return 'form-type-badge-applicant'; // Use same style as applicant
    return 'bg-accent text-white font-medium px-2.5 py-0.5 rounded-full text-xs';
  };

  const getLabel = () => {
    if (isApplicant) return 'Formulario de Solicitante';
    if (isReference) return 'Formulario de Referencia';
    return 'Formulario de Fiador';
  };
  
  return (
    <div className={`py-2 px-4 mb-4 rounded-lg ${getBannerClass()}`}>
      <div className="flex items-center gap-2">
        {isApplicant ? <User className={`h-4 w-4 ${getIconColor()}`} /> : <Users className={`h-4 w-4 ${getIconColor()}`} />}
        <span className={`form-type-badge ${getBadgeClass()}`}>
          {getLabel()}
        </span>
      </div>
    </div>
  );
};

export default FormTypeBanner;
