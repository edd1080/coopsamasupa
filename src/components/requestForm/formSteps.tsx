
import React from 'react';
import { 
  User, MapPin, DollarSign, Users, FileCheck, CheckCircle
} from 'lucide-react';

export const steps = [
  { 
    id: 'identification', 
    title: 'Identificación y Contacto', 
    icon: React.createElement(User, { size: 18 }),
    description: 'Datos básicos',
    component: 'IdentificationContact'
  },
  { 
    id: 'finances', 
    title: 'Finanzas y Patrimonio', 
    icon: React.createElement(DollarSign, { size: 18 }),
    description: 'Información financiera',
    component: 'FinancialInfo'
  },
  { 
    id: 'business', 
    title: 'Negocio y Perfil Económico', 
    icon: React.createElement(MapPin, { size: 18 }),
    description: 'Perfil económico',
    component: 'BusinessEconomicProfile'
  },
  { 
    id: 'guarantors', 
    title: 'Garantías, Fiadores y Referencias', 
    icon: React.createElement(Users, { size: 18 }),
    description: 'Fiadores y referencias',
    component: 'GuarantorsSection'
  },
  { 
    id: 'documents', 
    title: 'Documentos y Cierre', 
    icon: React.createElement(FileCheck, { size: 18 }),
    description: 'Documentos y cierre',
    component: 'PhotoDocumentUpload'
  },
  { 
    id: 'review', 
    title: 'Revisión Final', 
    icon: React.createElement(CheckCircle, { size: 18 }),
    description: 'Revisión final',
    component: 'ReviewSection'
  },
];
