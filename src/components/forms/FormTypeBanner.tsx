
import React from 'react';
import { User, Users } from 'lucide-react';

interface FormTypeBannerProps {
  type: 'applicant' | 'guarantor';
}

const FormTypeBanner: React.FC<FormTypeBannerProps> = ({ type }) => {
  const isApplicant = type === 'applicant';
  
  return (
    <div className={`py-2 px-4 mb-4 rounded-lg ${isApplicant ? 'form-container-applicant' : 'form-container-guarantor'}`}>
      <div className="flex items-center gap-2">
        {isApplicant ? <User className="h-4 w-4 text-primary" /> : <Users className="h-4 w-4 text-white" />}
        <span className={`form-type-badge ${isApplicant ? 'form-type-badge-applicant' : 'bg-accent text-white font-medium px-2.5 py-0.5 rounded-full text-xs'}`}>
          {isApplicant ? 'Formulario de Solicitante' : 'Formulario de Fiador'}
        </span>
      </div>
    </div>
  );
};

export default FormTypeBanner;
