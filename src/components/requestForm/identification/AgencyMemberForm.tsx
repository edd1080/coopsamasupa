
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
             <SelectItem value="agencia_central">Agencia Central</SelectItem>
             <SelectItem value="agencia_santa_maria">Agencia Santa Maria</SelectItem>
             <SelectItem value="agencia_guastatoya">Agencia Guastatoya</SelectItem>
             <SelectItem value="agencia_asuncion_mita">Agencia Asunción Mita</SelectItem>
             <SelectItem value="agencia_zacapa">Agencia Zacapa</SelectItem>
             <SelectItem value="agencia_chiquimula">Agencia Chiquimula</SelectItem>
             <SelectItem value="agencia_jalapa">Agencia Jalapa</SelectItem>
             <SelectItem value="agencia_mataquescuintla">Agencia Mataquescuintla</SelectItem>
             <SelectItem value="agencia_monjas">Agencia Monjas</SelectItem>
             <SelectItem value="agencia_jutiapa">Agencia Jutiapa</SelectItem>
             <SelectItem value="agencia_nueva_santa_rosa">Agencia Nueva Santa Rosa</SelectItem>
             <SelectItem value="agencia_puerto_barrios">Agencia Puerto Barrios</SelectItem>
             <SelectItem value="agencia_el_progreso">Agencia El Progreso</SelectItem>
             <SelectItem value="agencia_teculutan">Agencia Teculután</SelectItem>
             <SelectItem value="agencia_rio_dulce">Agencia Río Dulce</SelectItem>
             <SelectItem value="agencia_gualan">Agencia Gualán</SelectItem>
             <SelectItem value="agencia_san_jose_acatempa">Agencia San José Acatempa</SelectItem>
             <SelectItem value="agencia_moyuta">Agencia Moyuta</SelectItem>
             <SelectItem value="agencia_entre_rios">Agencia Entre Ríos</SelectItem>
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
