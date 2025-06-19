
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
import SpouseInfoForm from './SpouseInfoForm';

interface PersonalInfoFormProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ formData, updateFormData }) => {
  const isMarried = formData.civilStatus === 'married';

  return (
    <>
      {/* Nombres y Apellidos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">Nombres *</Label>
          <Input 
            id="firstName"
            value={formData.firstName || ''} 
            onChange={(e) => {
              const value = e.target.value.replace(/[0-9]/g, '');
              updateFormData('firstName', value);
            }}
            placeholder="Nombres completos"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Apellidos</Label>
          <Input 
            id="lastName"
            value={formData.lastName || ''} 
            onChange={(e) => {
              const value = e.target.value.replace(/[0-9]/g, '');
              updateFormData('lastName', value);
            }}
            placeholder="Apellidos completos"
          />
        </div>
      </div>

      {/* Género */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="gender">Género *</Label>
          <Select value={formData.gender || ''} onValueChange={(value) => updateFormData('gender', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar género" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="masculino">Masculino</SelectItem>
              <SelectItem value="femenino">Femenino</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="civilStatus">Estado Civil *</Label>
          <Select 
            value={formData.civilStatus || ''} 
            onValueChange={(value) => updateFormData('civilStatus', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="single">Soltero/a</SelectItem>
              <SelectItem value="married">Casado/a</SelectItem>
              <SelectItem value="divorced">Divorciado/a</SelectItem>
              <SelectItem value="widowed">Viudo/a</SelectItem>
              <SelectItem value="cohabiting">Unión libre</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Información del Cónyuge - aparece inmediatamente después del Estado Civil */}
      {isMarried && (
        <SpouseInfoForm formData={formData} updateFormData={updateFormData} />
      )}
    </>
  );
};

export default PersonalInfoForm;
