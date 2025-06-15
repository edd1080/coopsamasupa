
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface WorkInfoProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

const WorkInfo: React.FC<WorkInfoProps> = ({ formData, updateFormData }) => {
  return (
    <Card className="border-0 shadow-none">
      <CardContent className="p-0 space-y-4">
        <h3 className="font-semibold text-lg">Información Laboral</h3>
        <p className="text-muted-foreground text-sm">
          Proporciona los datos sobre tu situación laboral actual.
        </p>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="employmentStatus">Situación Laboral</Label>
            <Select
              value={formData.employmentStatus || ''}
              onValueChange={(value) => updateFormData('employmentStatus', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona tu situación laboral" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="employed">Empleado Tiempo Completo</SelectItem>
                <SelectItem value="part_time">Empleado Tiempo Parcial</SelectItem>
                <SelectItem value="self_employed">Trabajador Independiente</SelectItem>
                <SelectItem value="business_owner">Dueño de Negocio</SelectItem>
                <SelectItem value="unemployed">Sin Empleo Actualmente</SelectItem>
                <SelectItem value="retired">Jubilado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="companyName">Nombre de la Empresa</Label>
            <Input 
              id="companyName" 
              value={formData.companyName || ''} 
              onChange={(e) => updateFormData('companyName', e.target.value)} 
              placeholder="Nombre de la empresa donde trabajas"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="position">Puesto o Cargo</Label>
            <Input 
              id="position" 
              value={formData.position || ''} 
              onChange={(e) => updateFormData('position', e.target.value)} 
              placeholder="Tu puesto o cargo"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="yearsEmployed">Años en el Empleo</Label>
              <Input 
                id="yearsEmployed" 
                type="number"
                inputMode="numeric"
                value={formData.yearsEmployed || ''} 
                onChange={(e) => updateFormData('yearsEmployed', e.target.value)} 
                placeholder="Años"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="monthsEmployed">Meses en el Empleo</Label>
              <Input 
                id="monthsEmployed" 
                type="number"
                inputMode="numeric"
                value={formData.monthsEmployed || ''} 
                onChange={(e) => updateFormData('monthsEmployed', e.target.value)} 
                placeholder="Meses"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="workAddress">Dirección del Trabajo</Label>
            <Input 
              id="workAddress" 
              value={formData.workAddress || ''} 
              onChange={(e) => updateFormData('workAddress', e.target.value)} 
              placeholder="Dirección completa del lugar de trabajo"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="workPhone">Teléfono del Trabajo</Label>
            <Input 
              id="workPhone" 
              value={formData.workPhone || ''} 
              onChange={(e) => updateFormData('workPhone', e.target.value)} 
              placeholder="Teléfono de la empresa"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkInfo;
