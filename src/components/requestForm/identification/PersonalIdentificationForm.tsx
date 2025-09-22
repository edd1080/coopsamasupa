
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatDPI, validateDPIFormat, validateDPIWithError, normalizeIntegerInput } from '@/utils/formatters';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { User } from 'lucide-react';
import SpouseInfoForm from './SpouseInfoForm';
import SubformHeader from '@/components/forms/SubformHeader';

interface PersonalIdentificationFormProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

const PersonalIdentificationForm: React.FC<PersonalIdentificationFormProps> = ({ formData, updateFormData }) => {
  const isMarried = formData.civilStatus === 'casado';

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
    <div className="space-y-6">
      <SubformHeader
        icon={<User className="w-5 h-5" />}
        title="Datos Básicos"
        subtitle="Complete la información personal básica del solicitante."
        variant="applicant"
      />
      
      <div className="space-y-6">
        {/* Tipo de socio y Agencia - Primeras dos preguntas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="memberType">Tipo de Socio</Label>
            <Select value={formData.memberType || ''} onValueChange={(value) => updateFormData('memberType', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar tipo de socio" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A">A</SelectItem>
                <SelectItem value="B">B</SelectItem>
                <SelectItem value="C">C</SelectItem>
                <SelectItem value="D">D</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="agencyType">Agencia</Label>
            <Select value={formData.agencyType || ''} onValueChange={(value) => updateFormData('agencyType', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar agencia" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Central">Central</SelectItem>
                <SelectItem value="San Cristobal">San Cristobal</SelectItem>
                <SelectItem value="Purulha">Purulha</SelectItem>
                <SelectItem value="Chisec">Chisec</SelectItem>
                <SelectItem value="Playa Grande">Playa Grande</SelectItem>
                <SelectItem value="San Pedro Carcha">San Pedro Carcha</SelectItem>
                <SelectItem value="Tactic Asuncion">Tactic Asuncion</SelectItem>
                <SelectItem value="Sayaxche">Sayaxche</SelectItem>
                <SelectItem value="Santa Cruz">Santa Cruz</SelectItem>
                <SelectItem value="Chicaman">Chicaman</SelectItem>
                <SelectItem value="La Libertad">La Libertad</SelectItem>
                <SelectItem value="CC Gran Carcha">CC Gran Carcha</SelectItem>
                <SelectItem value="Raxruha">Raxruha</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Nombres - 4 campos separados */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">Primer Nombre</Label>
            <Input 
              id="firstName"
              value={formData.firstName || ''} 
              onChange={(e) => {
                const value = e.target.value.replace(/[0-9]/g, '');
                updateFormData('firstName', value);
              }}
              placeholder="Primer nombre"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="secondName">Segundo Nombre</Label>
            <Input 
              id="secondName"
              value={formData.secondName || ''} 
              onChange={(e) => {
                const value = e.target.value.replace(/[0-9]/g, '');
                updateFormData('secondName', value);
              }}
              placeholder="Segundo nombre"
            />
          </div>
        </div>

        {/* Apellidos - 2 campos separados */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstLastName">Primer Apellido</Label>
            <Input 
              id="firstLastName"
              value={formData.firstLastName || ''} 
              onChange={(e) => {
                const value = e.target.value.replace(/[0-9]/g, '');
                updateFormData('firstLastName', value);
              }}
              placeholder="Primer apellido"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="secondLastName">Segundo Apellido</Label>
            <Input 
              id="secondLastName"
              value={formData.secondLastName || ''} 
              onChange={(e) => {
                const value = e.target.value.replace(/[0-9]/g, '');
                updateFormData('secondLastName', value);
              }}
              placeholder="Segundo apellido"
            />
          </div>
        </div>

        {/* Género */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="gender">Género</Label>
            <Select value={formData.gender || ''} onValueChange={(value) => updateFormData('gender', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar género" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hombre">Hombre</SelectItem>
                <SelectItem value="mujer">Mujer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div></div>
        </div>

        {/* DPI, CUA y NIT */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <Label htmlFor="cua">CUA (T24)</Label>
            <Input 
              id="cua"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={formData.cua || ''} 
              onChange={(e) => updateFormData('cua', normalizeIntegerInput(e.target.value))}
              placeholder="Número CUA"
            />
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

        {/* DPI Extendido en y Estado Civil */}
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

          <div className="space-y-2">
            <Label htmlFor="civilStatus">Estado Civil</Label>
            <Select 
              value={formData.civilStatus || ''} 
              onValueChange={(value) => updateFormData('civilStatus', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="casado">Casado(a)</SelectItem>
                <SelectItem value="divorciado">Divorciado(a)</SelectItem>
                <SelectItem value="soltero">Soltero(a)</SelectItem>
                <SelectItem value="unido">Unido(a)</SelectItem>
                <SelectItem value="viudo">Viudo(a)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Información del Cónyuge - aparece cuando se selecciona casado */}
        {isMarried && (
          <SpouseInfoForm formData={formData} updateFormData={updateFormData} />
        )}
      </div>
    </div>
  );
};

export default PersonalIdentificationForm;
