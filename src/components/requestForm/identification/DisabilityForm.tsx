
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface DisabilityFormProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

const DisabilityForm: React.FC<DisabilityFormProps> = ({ formData, updateFormData }) => {
  const hasDisability = formData.hasDisability || false;

  const handleDisabilityToggle = (checked: boolean) => {
    updateFormData('hasDisability', checked);
    // Clear disability description if toggle is turned off
    if (!checked) {
      updateFormData('disabilityDescription', '');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-3">
        <Switch
          id="hasDisability"
          checked={hasDisability}
          onCheckedChange={handleDisabilityToggle}
        />
        <Label htmlFor="hasDisability" className="text-sm font-medium">
          Incapacidad
        </Label>
      </div>

      {hasDisability && (
        <div className="space-y-2">
          <Label htmlFor="disabilityDescription">Descripción incapacidad</Label>
          <Input 
            id="disabilityDescription"
            value={formData.disabilityDescription || ''} 
            onChange={(e) => updateFormData('disabilityDescription', e.target.value)}
            placeholder="Describir la incapacidad"
            required={hasDisability}
          />
        </div>
      )}
    </div>
  );
};

export default DisabilityForm;
