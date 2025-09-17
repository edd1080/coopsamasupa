
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from "@/components/ui/slider";
import { productTypes } from '@/data/catalogs/productTypes';

interface CreditInfoProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

const CreditInfo: React.FC<CreditInfoProps> = ({ formData, updateFormData }) => {
  const loanAmountValue = formData.loanAmount || 50000;
  const termMonthsValue = formData.termMonths || 12;
  
  return (
    <Card className="border-0 shadow-none">
      <CardContent className="p-0 space-y-4">
        <h3 className="font-semibold text-lg">Datos del Crédito</h3>
        <p className="text-muted-foreground text-sm">
          Especifica los detalles del crédito que estás solicitando.
        </p>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="productType">Tipo de Producto</Label>
            <Select
              value={formData.productType || ''}
              onValueChange={(value) => updateFormData('productType', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el tipo de producto" />
              </SelectTrigger>
              <SelectContent>
                {productTypes.map((type) => (
                  <SelectItem key={type.id} value={type.name}>
                    {type.name} - {type.description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="creditType">Tipo de Crédito</Label>
            <Select
              value={formData.creditType || ''}
              onValueChange={(value) => updateFormData('creditType', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el tipo de crédito" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="personal">Crédito Personal</SelectItem>
                <SelectItem value="auto">Crédito Automotriz</SelectItem>
                <SelectItem value="mortgage">Crédito Hipotecario</SelectItem>
                <SelectItem value="business">Crédito Empresarial</SelectItem>
                <SelectItem value="education">Crédito Educativo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="loanAmount">Monto a Solicitar</Label>
                <span className="text-muted-foreground">
                  ${loanAmountValue.toLocaleString()}
                </span>
              </div>
              <Slider
                id="loanAmount"
                defaultValue={[loanAmountValue]}
                min={5000}
                max={1000000}
                step={5000}
                onValueChange={(value) => updateFormData('loanAmount', value[0])}
                className="mt-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>$5,000</span>
                <span>$1,000,000</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="termMonths">Plazo (meses)</Label>
                <span className="text-muted-foreground">
                  {termMonthsValue} meses
                </span>
              </div>
              <Slider
                id="termMonths"
                defaultValue={[termMonthsValue]}
                min={6}
                max={60}
                step={6}
                onValueChange={(value) => updateFormData('termMonths', value[0])}
                className="mt-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>6 meses</span>
                <span>60 meses</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="purpose">Propósito del Crédito</Label>
            <Select
              value={formData.purpose || ''}
              onValueChange={(value) => updateFormData('purpose', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="¿Para qué utilizarás el crédito?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="debt_consolidation">Consolidación de Deudas</SelectItem>
                <SelectItem value="home_improvement">Mejoras del Hogar</SelectItem>
                <SelectItem value="major_purchase">Compra Mayor</SelectItem>
                <SelectItem value="education">Educación</SelectItem>
                <SelectItem value="business">Negocio</SelectItem>
                <SelectItem value="medical">Gastos Médicos</SelectItem>
                <SelectItem value="vacation">Vacaciones</SelectItem>
                <SelectItem value="other">Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {formData.purpose === 'other' && (
            <div className="space-y-2">
              <Label htmlFor="purposeDescription">Describe el Propósito</Label>
              <Input 
                id="purposeDescription" 
                value={formData.purposeDescription || ''} 
                onChange={(e) => updateFormData('purposeDescription', e.target.value)} 
                placeholder="Describe para qué utilizarás el crédito"
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="collateral">¿Ofreces alguna garantía?</Label>
            <Select
              value={formData.collateral || ''}
              onValueChange={(value) => updateFormData('collateral', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una opción" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no">No, sin garantía</SelectItem>
                <SelectItem value="property">Propiedad</SelectItem>
                <SelectItem value="vehicle">Vehículo</SelectItem>
                <SelectItem value="investment">Inversión</SelectItem>
                <SelectItem value="other">Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {formData.collateral && formData.collateral !== 'no' && (
            <div className="space-y-2">
              <Label htmlFor="collateralDescription">Descripción de la Garantía</Label>
              <Input 
                id="collateralDescription" 
                value={formData.collateralDescription || ''} 
                onChange={(e) => updateFormData('collateralDescription', e.target.value)} 
                placeholder="Describe la garantía ofrecida"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CreditInfo;
