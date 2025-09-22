import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2 } from 'lucide-react';

interface BusinessInfoFormProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

const BusinessInfoForm: React.FC<BusinessInfoFormProps> = ({ formData, updateFormData }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Building2 className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Información del Negocio</h3>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Datos del Negocio</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Nombre del Negocio */}
          <div className="space-y-2">
            <Label htmlFor="companyName">Nombre del Negocio</Label>
            <Input 
              id="companyName"
              value={formData.companyName || ''} 
              onChange={(e) => updateFormData('companyName', e.target.value)}
              placeholder="Nombre comercial del negocio"
            />
          </div>

          {/* Descripción de la Actividad Principal */}
          <div className="space-y-2">
            <Label htmlFor="activityDescription">Descripción de la Actividad Principal</Label>
            <Textarea 
              id="activityDescription"
              value={formData.activityDescription || ''} 
              onChange={(e) => updateFormData('activityDescription', e.target.value)}
              placeholder="Describa la actividad principal del negocio"
              rows={3}
            />
          </div>

          {/* Tipo de Producto(s) */}
          <div className="space-y-2">
            <Label htmlFor="productType">Tipo de Producto(s)</Label>
            <Input 
              id="productType"
              value={formData.productType || ''} 
              onChange={(e) => updateFormData('productType', e.target.value)}
              placeholder="Ej: Consumo, Servicios, Manufactura, etc."
            />
          </div>

          {/* Dirección del Negocio */}
          <div className="space-y-2">
            <Label htmlFor="fullAddress">Dirección del Negocio</Label>
            <Textarea 
              id="fullAddress"
              value={formData.fullAddress || ''} 
              onChange={(e) => updateFormData('fullAddress', e.target.value)}
              placeholder="Dirección completa del negocio"
              rows={2}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessInfoForm;
