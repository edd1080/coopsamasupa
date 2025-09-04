
import React from 'react';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AgencyMemberFormProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

const AgencyMemberForm: React.FC<AgencyMemberFormProps> = ({ formData, updateFormData }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="agency">Agencia *</Label>
        <Select value={formData.agency || ''} onValueChange={(value) => updateFormData('agency', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar agencia" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="central">Agencia Central</SelectItem>
            <SelectItem value="zona1">Zona 1</SelectItem>
            <SelectItem value="zona10">Zona 10</SelectItem>
            <SelectItem value="mixco">Mixco</SelectItem>
            <SelectItem value="villa_nueva">Villa Nueva</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="memberType">Tipo Socio *</Label>
        <Select value={formData.memberType || ''} onValueChange={(value) => updateFormData('memberType', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="socio_activo">Socio activo</SelectItem>
            <SelectItem value="no_socio">No socio</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default AgencyMemberForm;
