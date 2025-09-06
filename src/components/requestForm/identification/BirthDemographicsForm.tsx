
import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
import { Calendar } from 'lucide-react';
import { normalizeIntegerInput } from '@/utils/formatters';
import SubformHeader from '@/components/forms/SubformHeader';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { professions } from '@/data/professions';
import { occupations } from '@/data/occupations';

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
    <div className="space-y-6">
      <SubformHeader
        icon={<Calendar className="w-5 h-5" />}
        title="Datos Demográficos y Nacimiento"
        subtitle="Complete la información demográfica y de nacimiento del solicitante."
        variant="applicant"
      />
      
      {/* Fecha Nacimiento y Edad */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Fecha Nacimiento</Label>
          <DatePicker
            date={getValidDate(formData.birthDate)}
            onSelect={handleDateSelect}
            placeholder="Seleccionar fecha de nacimiento"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="age">Edad</Label>
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
          <Label htmlFor="dependents">Dependientes</Label>
          <Input 
            id="dependents"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={formData.dependents || ''} 
            onChange={(e) => updateFormData('dependents', normalizeIntegerInput(e.target.value))}
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
                 <SelectItem value="ladino">Ladino</SelectItem>
                 <SelectItem value="garifuna">Garífuna</SelectItem>
                 <SelectItem value="xinca">Xinca</SelectItem>
                 <SelectItem value="otro">Otro</SelectItem>
                 <SelectItem value="prefiero_no_responder">Prefiero no responder</SelectItem>
               </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="educationLevel">Nivel Educativo</Label>
          <Select value={formData.educationLevel || ''} onValueChange={(value) => updateFormData('educationLevel', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar nivel" />
            </SelectTrigger>
               <SelectContent>
                 <SelectItem value="basico">Básico</SelectItem>
                 <SelectItem value="diversificado">Diversificado</SelectItem>
                 <SelectItem value="na">N/A</SelectItem>
                 <SelectItem value="primaria">Primaria</SelectItem>
                 <SelectItem value="superior">Superior</SelectItem>
               </SelectContent>
          </Select>
        </div>
      </div>

      {/* Profesión y Ocupación */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <div className="space-y-2">
           <Label htmlFor="profession">Profesión</Label>
           <Select value={formData.profession || ''} onValueChange={(value) => updateFormData('profession', value)}>
             <SelectTrigger>
               <SelectValue placeholder="Seleccionar profesión" />
             </SelectTrigger>
             <SelectContent>
               {professions.map((profession) => (
                 <SelectItem key={profession.value} value={profession.value}>
                   {profession.label}
                 </SelectItem>
               ))}
             </SelectContent>
           </Select>
         </div>

         <div className="space-y-2">
           <Label htmlFor="occupation">Ocupación</Label>
           <Select value={formData.occupation || ''} onValueChange={(value) => updateFormData('occupation', value)}>
             <SelectTrigger>
               <SelectValue placeholder="Seleccionar ocupación" />
             </SelectTrigger>
             <SelectContent>
               {occupations.map((occupation) => (
                 <SelectItem key={occupation.value} value={occupation.value}>
                   {occupation.label}
                 </SelectItem>
               ))}
             </SelectContent>
           </Select>
          </div>
       </div>
     </div>
   );
 };

export default BirthDemographicsForm;
