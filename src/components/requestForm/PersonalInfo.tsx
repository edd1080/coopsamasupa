import React, { useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface PersonalInfoProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

const PersonalInfo: React.FC<PersonalInfoProps> = ({ formData, updateFormData }) => {
  // Handle showing spouse information when civil status is "married"
  useEffect(() => {
    if (formData.civilStatus !== 'married') {
      // Reset spouse fields if not married
      updateFormData('spouseName', '');
      updateFormData('spouseId', '');
      updateFormData('spouseProfession', '');
      updateFormData('spouseIncome', '');
    }
  }, [formData.civilStatus, updateFormData]);

  // Handle dependents visibility
  const hasDependents = formData.hasDependents || false;

  return (
    <Card className="border-0 shadow-none">
      <CardContent className="p-0 space-y-4">
        <h3 className="font-semibold text-lg">Información Personal</h3>
        <p className="text-muted-foreground text-sm">
          Por favor proporciona tus datos personales para comenzar la solicitud.
        </p>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="educationLevel">Nivel de escolaridad</Label>
              <Select 
                value={formData.educationLevel || ''} 
                onValueChange={(value) => updateFormData('educationLevel', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar nivel educativo" />
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

            <div className="space-y-2">
              <Label htmlFor="profession">Profesión u oficio</Label>
              <Input 
                id="profession" 
                value={formData.profession || ''} 
                onChange={(e) => updateFormData('profession', e.target.value)} 
                placeholder="Profesión u oficio"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input 
              id="email" 
              type="email"
              value={formData.email || ''} 
              onChange={(e) => updateFormData('email', e.target.value)} 
              placeholder="correo@ejemplo.com"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="housingType">Tenencia de la vivienda</Label>
              <Select 
                value={formData.housingType || ''} 
                onValueChange={(value) => updateFormData('housingType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="own">Propia</SelectItem>
                  <SelectItem value="rent">Alquilada</SelectItem>
                  <SelectItem value="family">Familiar</SelectItem>
                  <SelectItem value="mortgage">Hipotecada</SelectItem>
                  <SelectItem value="other">Otra</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="civilStatus">Estado civil</Label>
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

          {/* Dependent persons switch */}
          <div className="flex items-center space-x-2 pt-2">
            <Switch 
              id="hasDependents"
              checked={hasDependents}
              onCheckedChange={(checked) => updateFormData('hasDependents', checked)}
            />
            <Label htmlFor="hasDependents" className="font-medium">
              ¿Hay personas dependientes económicamente del solicitante?
            </Label>
          </div>

          {/* Conditionally rendered spouse information */}
          {formData.civilStatus === 'married' && (
            <div className="border rounded-md p-4 mt-2 space-y-4 bg-muted/20">
              <h4 className="font-medium">Información del cónyuge</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="spouseName">Nombre del cónyuge</Label>
                  <Input 
                    id="spouseName" 
                    value={formData.spouseName || ''} 
                    onChange={(e) => updateFormData('spouseName', e.target.value)} 
                    placeholder="Nombre completo"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="spouseId">DPI del cónyuge</Label>
                  <Input 
                    id="spouseId" 
                    value={formData.spouseId || ''} 
                    onChange={(e) => updateFormData('spouseId', e.target.value)} 
                    placeholder="Número de identificación"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="spouseProfession">Profesión del cónyuge</Label>
                  <Input 
                    id="spouseProfession" 
                    value={formData.spouseProfession || ''} 
                    onChange={(e) => updateFormData('spouseProfession', e.target.value)} 
                    placeholder="Profesión u oficio"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="spouseIncome">Ingresos del cónyuge</Label>
                  <Input 
                    id="spouseIncome" 
                    type="number"
                    value={formData.spouseIncome || ''} 
                    onChange={(e) => updateFormData('spouseIncome', e.target.value)} 
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Conditionally rendered dependents information */}
          {hasDependents && (
            <div className="border rounded-md p-4 mt-2 space-y-4 bg-muted/20">
              <h4 className="font-medium">Información de dependientes</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dependentsCount">Número de dependientes</Label>
                  <Input 
                    id="dependentsCount" 
                    type="number"
                    inputMode="numeric"
                    min="1"
                    value={formData.dependentsCount || ''} 
                    onChange={(e) => updateFormData('dependentsCount', e.target.value)} 
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dependentsStudying">Número de dependientes estudiando</Label>
                  <Input 
                    id="dependentsStudying" 
                    type="number"
                    inputMode="numeric"
                    min="0"
                    value={formData.dependentsStudying || ''} 
                    onChange={(e) => updateFormData('dependentsStudying', e.target.value)} 
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalInfo;
