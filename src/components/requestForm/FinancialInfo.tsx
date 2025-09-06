import React from 'react';
import { DollarSign, Calculator, PieChart } from 'lucide-react';
import SubformHeader from '@/components/forms/SubformHeader';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useFormContext } from './RequestFormProvider';

// Import the new components
import FinancialAnalysis from './FinancialAnalysis';
import PatrimonialStatement from './PatrimonialStatement';

interface FinancialInfoProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

const FinancialInfo: React.FC<FinancialInfoProps> = ({ formData, updateFormData }) => {
  const { subStep, goToStep, currentStep } = useFormContext();
  
  const tabs = [
    { id: 0, name: 'Análisis Financiero', icon: <Calculator className="w-4 h-4 mr-2" /> },
    { id: 1, name: 'Estado Patrimonial', icon: <PieChart className="w-4 h-4 mr-2" /> }
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
        <TabsList className="grid w-full grid-cols-2">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id.toString()}>
              {tab.icon}
              {tab.name}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="0">
          <FinancialAnalysis formData={formData} updateFormData={updateFormData} />
        </TabsContent>

        <TabsContent value="1">
          <PatrimonialStatement formData={formData} updateFormData={updateFormData} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinancialInfo;