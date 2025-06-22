
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

interface DocumentsFormProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

const DocumentsForm: React.FC<DocumentsFormProps> = ({ formData, updateFormData }) => {
  // Validation functions
  const validateDPIField = (dpi: string) => {
    if (dpi.length !== 13) return false;
    return /^\d{13}$/.test(dpi);
  };

  const validateCUA = (cua: string) => {
    return /^\d+$/.test(cua) && cua.length > 0;
  };

  const validateCIF = (cif: string) => {
    return /^\d+$/.test(cif) && cif.length > 0;
  };

  // Updated NIT validation - minimum 8 digits, only numbers
  const validateNIT = (nit: string) => {
    return /^\d{8,}$/.test(nit);
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
          <Label htmlFor="dpi">DPI (13 dígitos) *</Label>
          <Input 
            id="dpi"
            value={formData.dpi || ''} 
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '').slice(0, 13);
              updateFormData('dpi', value);
            }}
            placeholder="1234567890123"
            maxLength={13}
            className={!validateDPIField(formData.dpi || '') && formData.dpi ? 'border-red-500' : ''}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="nit">NIT (mínimo 8 dígitos) *</Label>
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
          <Label htmlFor="dpiExtendedIn">DPI Extendido en *</Label>
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
        <Input 
          value={formData.cif || ''} 
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, '');
            updateFormData('cif', value);
          }}
        />
      </div>
    </>
  );
};

export default DocumentsForm;
