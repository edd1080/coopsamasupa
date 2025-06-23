
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatDPI, validateDPIFormat } from '@/utils/formatters';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import SpouseInfoForm from './SpouseInfoForm';

interface PersonalIdentificationFormProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

const PersonalIdentificationForm: React.FC<PersonalIdentificationFormProps> = ({ formData, updateFormData }) => {
  const isMarried = formData.civilStatus === 'married';

  // Enhanced NIT validation - minimum 8 digits, only numbers
  const validateNIT = (nit: string) => {
    return /^\d{8,}$/.test(nit);
  };

  const handleDPIChange = (value: string) => {
    const formatted = formatDPI(value);
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
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-lg">Datos Básicos</h3>
        <p className="text-muted-foreground text-sm">
          Complete la información personal básica del solicitante.
        </p>
      </div>
      
      <div className="space-y-6">
        {/* Nombres y Apellidos - Solo 2 campos */}
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

        {/* Género y Estado Civil */}
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

        {/* Información del Cónyuge - aparece cuando se selecciona casado */}
        {isMarried && (
          <SpouseInfoForm formData={formData} updateFormData={updateFormData} />
        )}

        {/* DPI y NIT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dpi">DPI (13 dígitos) *</Label>
            <Input 
              id="dpi"
              value={formData.dpi || ''} 
              onChange={(e) => handleDPIChange(e.target.value)}
              placeholder="0000 00000 0000"
              maxLength={16}
              className={!validateDPIFormat(formData.dpi || '') && formData.dpi ? 'border-red-500' : ''}
            />
            {formData.dpi && !validateDPIFormat(formData.dpi) && (
              <p className="text-xs text-red-500">Formato: 0000 00000 0000 (13 dígitos)</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="nit">NIT (opcional)</Label>
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
      </div>
    </div>
  );
};

export default PersonalIdentificationForm;
