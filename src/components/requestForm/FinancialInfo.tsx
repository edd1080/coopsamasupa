import React from 'react';
import { DollarSign } from 'lucide-react';
import SubformHeader from '@/components/forms/SubformHeader';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useFormContext } from './RequestFormProvider';

// Import the new components
import FinancialAnalysis from './FinancialAnalysis';
import PatrimonialStatement from './PatrimonialStatement';
import BusinessInfoForm from './finances/BusinessInfoForm';

interface FinancialInfoProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

const FinancialInfo: React.FC<FinancialInfoProps> = ({ formData, updateFormData }) => {
  const { subStep, goToStep, currentStep } = useFormContext();
  
  const tabs = [
    { id: 0, name: 'Análisis Financiero' },
    { id: 1, name: 'Estado Patrimonial' }
    // { id: 2, name: 'Negocio' } - Oculto pero mantiene mapeo en payload
  ];

  const handleTabChange = (tabValue: string) => {
    const tabIndex = parseInt(tabValue);
    goToStep(currentStep, tabIndex);
  };

  return (
    <div className="space-y-6">
      <SubformHeader
        icon={<DollarSign className="w-5 h-5" />}
        title="Información Financiera"
        subtitle="Complete la información económica y financiera del solicitante."
        variant="applicant"
      />
      
      <Tabs value={subStep.toString()} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2 gap-1 h-auto">
          {tabs.map((tab) => (
            <TabsTrigger 
              key={tab.id} 
              value={tab.id.toString()}
              className="text-xs px-2 py-1.5 h-auto min-h-[1.75rem] flex items-center justify-center"
            >
              <span className="text-xs leading-tight text-center truncate">{tab.name}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="0">
          <FinancialAnalysis formData={formData} updateFormData={updateFormData} />
        </TabsContent>

        <TabsContent value="1">
          <PatrimonialStatement formData={formData} updateFormData={updateFormData} />
        </TabsContent>

        {/* TabsContent de Negocio oculto - mantiene mapeo en payload */}
        {/* <TabsContent value="2">
          <BusinessInfoForm formData={formData} updateFormData={updateFormData} />
        </TabsContent> */}
      </Tabs>
    </div>
  );
};

export default FinancialInfo;