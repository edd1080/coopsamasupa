
import React from 'react';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { agencies } from '@/data/catalogs/agencies';

interface AgencyMemberFormProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

const AgencyMemberForm: React.FC<AgencyMemberFormProps> = ({ formData, updateFormData }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="agency">Agencia</Label>
        <Select value={formData.agency || ''} onValueChange={(value) => updateFormData('agency', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar agencia" />
          </SelectTrigger>
           <SelectContent>
              {agencies.map((agency) => (
                <SelectItem key={agency.id} value={agency.name}>
                  {agency.name}
                </SelectItem>
              ))}
            </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="memberType">Tipo Socio</Label>
        <Select value={formData.memberType || ''} onValueChange={(value) => updateFormData('memberType', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar tipo" />
          </SelectTrigger>
           <SelectContent>
             <SelectItem value="A">A</SelectItem>
             <SelectItem value="B">B</SelectItem>
             <SelectItem value="C">C</SelectItem>
             <SelectItem value="D">D</SelectItem>
           </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default AgencyMemberForm;
