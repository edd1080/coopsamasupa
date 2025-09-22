
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatDPI, validateDPIFormat, validateDPIWithError } from '@/utils/formatters';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DocumentsFormProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

const DocumentsForm: React.FC<DocumentsFormProps> = ({ formData, updateFormData }) => {
  // Enhanced NIT validation - minimum 8 digits, only numbers
  const validateNIT = (nit: string) => {
    return /^\d{8,}$/.test(nit);
  };

  const handleDPIChange = (value: string) => {
    // Only allow digits and limit to 13 characters
    const digitsOnly = value.replace(/\D/g, '').slice(0, 13);
    const formatted = formatDPI(digitsOnly);
    updateFormData('dpi', formatted);
  };

  // Complete Guatemala departments for DPI issuance
  const guatemalaDepartments = [
    { value: 'guatemala', label: 'Guatemala' },
    { value: 'alta_verapaz', label: 'Alta Verapaz' },
    { value: 'baja_verapaz', label: 'Baja Verapaz' },
    { value: 'chimaltenango', label: 'Chimaltenango' },
    { value: 'chiquimula', label: 'Chiquimula' },
    { value: 'el_progreso', label: 'El Progreso' },
    { value: 'escuintla', label: 'Escuintla' },
    { value: 'huehuetenango', label: 'Huehuetenango' },
    { value: 'izabal', label: 'Izabal' },
    { value: 'jalapa', label: 'Jalapa' },
    { value: 'jutiapa', label: 'Jutiapa' },
    { value: 'peten', label: 'Petén' },
    { value: 'quetzaltenango', label: 'Quetzaltenango' },
    { value: 'quiche', label: 'Quiché' },
    { value: 'retalhuleu', label: 'Retalhuleu' },
    { value: 'sacatepequez', label: 'Sacatepéquez' },
    { value: 'san_marcos', label: 'San Marcos' },
    { value: 'santa_rosa', label: 'Santa Rosa' },
    { value: 'solola', label: 'Sololá' },
    { value: 'suchitepequez', label: 'Suchitepéquez' },
    { value: 'totonicapan', label: 'Totonicapán' },
    { value: 'zacapa', label: 'Zacapa' }
  ];

  return (
    <>
      {/* DPI y NIT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dpi">DPI (13 dígitos)</Label>
          <Input 
            id="dpi"
            value={formData.dpi || ''} 
            onChange={(e) => handleDPIChange(e.target.value)}
            placeholder="0000 00000 0000"
            maxLength={15} // 13 digits + 2 spaces
            inputMode="numeric"
            pattern="[0-9]*"
            className={!validateDPIFormat(formData.dpi || '') && formData.dpi ? 'border-red-500' : ''}
          />
          {formData.dpi && !validateDPIFormat(formData.dpi) && (
            <p className="text-xs text-red-500">
              {validateDPIWithError(formData.dpi).error || 'Formato: 0000 00000 0000 (13 dígitos)'}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="nit">NIT (mínimo 8 dígitos)</Label>
          <Input 
            id="nit"
            value={formData.nit || ''} 
            onChange={(e) => {
              // Only allow numbers
              const value = e.target.value.replace(/\D/g, '');
              updateFormData('nit', value);
            }}
            placeholder="12345678"
            className={!validateNIT(formData.nit || '') && formData.nit ? 'border-red-500' : ''}
          />
          {formData.nit && !validateNIT(formData.nit) && (
            <p className="text-xs text-red-500">El NIT debe contener mínimo 8 dígitos</p>
          )}
        </div>
      </div>

      {/* DPI Extendido en */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dpiExtendedIn">DPI Extendido en</Label>
          <Select value={formData.dpiExtendedIn || ''} onValueChange={(value) => updateFormData('dpiExtendedIn', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar departamento" />
            </SelectTrigger>
            <SelectContent>
              {guatemalaDepartments.map((dept) => (
                <SelectItem key={dept.value} value={dept.value}>
                  {dept.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div></div>
      </div>

      {/* Hidden fields - kept in code but not displayed */}
      <div style={{ display: 'none' }}>
        <Input 
          value={formData.cua || ''} 
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, '');
            updateFormData('cua', value);
          }}
        />
      </div>
    </>
  );
};

export default DocumentsForm;
