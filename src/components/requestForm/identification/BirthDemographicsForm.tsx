
import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface BirthDemographicsFormProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

const BirthDemographicsForm: React.FC<BirthDemographicsFormProps> = ({ formData, updateFormData }) => {
  const [calculatedAge, setCalculatedAge] = useState<number | null>(null);

  // Helper function to ensure we have a valid Date object
  const getValidDate = (dateValue: Date | string | undefined) => {
    if (!dateValue) return null;
    if (dateValue instanceof Date) return dateValue;
    if (typeof dateValue === 'string') {
      const parsed = new Date(dateValue);
      return isNaN(parsed.getTime()) ? null : parsed;
    }
    return null;
  };

  // Calculate age when birth date changes
  useEffect(() => {
    const birthDate = getValidDate(formData.birthDate);
    if (birthDate) {
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      setCalculatedAge(age);
      updateFormData('age', age);
    }
  }, [formData.birthDate, updateFormData]);

  const handleDateSelect = (date: Date | undefined) => {
    updateFormData('birthDate', date);
  };

  return (
    <>
      {/* Fecha Nacimiento y Edad */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Fecha Nacimiento *</Label>
          <DatePicker
            date={getValidDate(formData.birthDate)}
            onSelect={handleDateSelect}
            placeholder="Seleccionar fecha de nacimiento"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="age">Edad *</Label>
          <Input 
            id="age"
            type="number"
            value={calculatedAge || formData.age || ''} 
            readOnly
            placeholder="Se calcula automáticamente"
            className="bg-gray-100"
          />
          {calculatedAge && calculatedAge < 18 && (
            <p className="text-sm text-red-500">La edad debe ser mayor a 18 años</p>
          )}
        </div>
      </div>

      {/* Dependientes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dependents">Dependientes *</Label>
          <Input 
            id="dependents"
            type="number"
            min="0"
            value={formData.dependents || ''} 
            onChange={(e) => updateFormData('dependents', e.target.value)}
            placeholder="0"
          />
        </div>
        <div></div>
      </div>

      {/* Etnia y Nivel Educativo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="ethnicity">Etnia</Label>
          <Select value={formData.ethnicity || ''} onValueChange={(value) => updateFormData('ethnicity', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar etnia" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="maya">Maya</SelectItem>
              <SelectItem value="garifuna">Garífuna</SelectItem>
              <SelectItem value="xinca">Xinca</SelectItem>
              <SelectItem value="mestizo">Mestizo</SelectItem>
              <SelectItem value="ladino">Ladino</SelectItem>
              <SelectItem value="otro">Otro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="educationLevel">Nivel Educativo *</Label>
          <Select value={formData.educationLevel || ''} onValueChange={(value) => updateFormData('educationLevel', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar nivel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="primary">Primaria</SelectItem>
              <SelectItem value="secondary">Secundaria</SelectItem>
              <SelectItem value="highschool">Bachillerato</SelectItem>
              <SelectItem value="technical">Técnico</SelectItem>
              <SelectItem value="university">Universidad</SelectItem>
              <SelectItem value="postgraduate">Postgrado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Profesión y Ocupación */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="profession">Profesión *</Label>
          <Select value={formData.profession || ''} onValueChange={(value) => updateFormData('profession', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar profesión" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="medico">Médico</SelectItem>
              <SelectItem value="ingeniero">Ingeniero</SelectItem>
              <SelectItem value="abogado">Abogado</SelectItem>
              <SelectItem value="contador">Contador</SelectItem>
              <SelectItem value="maestro">Maestro</SelectItem>
              <SelectItem value="comerciante">Comerciante</SelectItem>
              <SelectItem value="agricultor">Agricultor</SelectItem>
              <SelectItem value="otro">Otro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="occupation">Ocupación *</Label>
          <Select value={formData.occupation || ''} onValueChange={(value) => updateFormData('occupation', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar ocupación" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="empleado">Empleado</SelectItem>
              <SelectItem value="independiente">Independiente</SelectItem>
              <SelectItem value="empresario">Empresario</SelectItem>
              <SelectItem value="jubilado">Jubilado</SelectItem>
              <SelectItem value="estudiante">Estudiante</SelectItem>
              <SelectItem value="ama_casa">Ama de casa</SelectItem>
              <SelectItem value="otro">Otro</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  );
};

export default BirthDemographicsForm;
