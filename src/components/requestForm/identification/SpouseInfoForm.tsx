
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SpouseInfoFormProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

const SpouseInfoForm: React.FC<SpouseInfoFormProps> = ({ formData, updateFormData }) => {
  return (
    <div className="border rounded-md p-4 space-y-4 bg-muted/20">
      <h4 className="font-medium">Información del Cónyuge</h4>
      
      {/* Nombres del Cónyuge */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="spouseFirstName">Primer Nombre Cónyuge *</Label>
          <Input 
            id="spouseFirstName"
            value={formData.spouseFirstName || ''} 
            onChange={(e) => updateFormData('spouseFirstName', e.target.value)}
            placeholder="Primer nombre del cónyuge"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="spouseSecondName">Segundo Nombre Cónyuge</Label>
          <Input 
            id="spouseSecondName"
            value={formData.spouseSecondName || ''} 
            onChange={(e) => updateFormData('spouseSecondName', e.target.value)}
            placeholder="Segundo nombre del cónyuge"
          />
        </div>
      </div>

      {/* Apellidos del Cónyuge */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="spouseFirstLastName">Primer Apellido Cónyuge *</Label>
          <Input 
            id="spouseFirstLastName"
            value={formData.spouseFirstLastName || ''} 
            onChange={(e) => updateFormData('spouseFirstLastName', e.target.value)}
            placeholder="Primer apellido del cónyuge"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="spouseSecondLastName">Segundo Apellido Cónyuge</Label>
          <Input 
            id="spouseSecondLastName"
            value={formData.spouseSecondLastName || ''} 
            onChange={(e) => updateFormData('spouseSecondLastName', e.target.value)}
            placeholder="Segundo apellido del cónyuge"
          />
        </div>
      </div>

      {/* Información Laboral y Personal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="spouseWorkplace">Lugar de Trabajo Cónyuge</Label>
          <Input 
            id="spouseWorkplace"
            value={formData.spouseWorkplace || ''} 
            onChange={(e) => updateFormData('spouseWorkplace', e.target.value)}
            placeholder="Lugar de trabajo del cónyuge"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="spouseJobStability">Estabilidad Laboral</Label>
          <Select value={formData.spouseJobStability || ''} onValueChange={(value) => updateFormData('spouseJobStability', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar estabilidad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="menos_1_año">Menos de 1 año</SelectItem>
              <SelectItem value="1_año">1 año</SelectItem>
              <SelectItem value="2_años">2 años</SelectItem>
              <SelectItem value="3_años">3 años</SelectItem>
              <SelectItem value="5_años">5 años</SelectItem>
              <SelectItem value="mas_5_años">Más de 5 años</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Contacto y Fecha de Nacimiento */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="spouseMobilePhone">Teléfono Móvil Cónyuge</Label>
          <Input 
            id="spouseMobilePhone"
            value={formData.spouseMobilePhone || ''} 
            onChange={(e) => updateFormData('spouseMobilePhone', e.target.value)}
            placeholder="0000 0000"
            maxLength={9}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="spouseBirthDate">Fecha de Nacimiento Cónyuge</Label>
          <Input 
            id="spouseBirthDate"
            type="date"
            value={formData.spouseBirthDate || ''} 
            onChange={(e) => updateFormData('spouseBirthDate', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default SpouseInfoForm;
