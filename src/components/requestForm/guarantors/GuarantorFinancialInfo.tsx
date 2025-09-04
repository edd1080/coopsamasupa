
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { DollarSign, Home, Car, Banknote } from 'lucide-react';
import { useFormContext } from '../RequestFormProvider';
import { normalizeDecimalInput } from '@/utils/formatters';

interface GuarantorFinancialInfoProps {
  guarantorIndex: number;
}

const GuarantorFinancialInfo: React.FC<GuarantorFinancialInfoProps> = ({ guarantorIndex }) => {
  const { references, updateReference } = useFormContext();
  const reference = references[guarantorIndex];

  const handleInputChange = (field: string, value: string | number | boolean) => {
    updateReference(guarantorIndex, field, value);
    
    // Check if financial info is completed
    const updatedGuarantor = { ...guarantor, [field]: value };
    const isCompleted = !!(
      updatedGuarantor.monthlyIncome > 0 && 
      updatedGuarantor.monthlyExpenses >= 0 && 
      updatedGuarantor.bankAccounts
    );
    
    if (isCompleted !== guarantor.financialInfoCompleted) {
      updateReference(guarantorIndex, 'financialInfoCompleted', isCompleted);
    }
  };

  // Calculate available flow automatically
  const monthlyIncome = Number(guarantor.monthlyIncome) || 0;
  const otherIncome = Number(guarantor.otherIncome) || 0;
  const monthlyExpenses = Number(guarantor.monthlyExpenses) || 0;
  const availableFlow = monthlyIncome + otherIncome - monthlyExpenses;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: 'GTQ',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h3 className="text-lg font-semibold">Análisis Financiero del Fiador {guarantorIndex + 1}</h3>
        <p className="text-muted-foreground">
          Información financiera para evaluar la capacidad de respaldo del fiador
        </p>
      </div>

      {/* Ingresos y Gastos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            Ingresos y Gastos Mensuales
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`monthlyIncome-${guarantorIndex}`}>Ingresos Mensuales *</Label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-muted-foreground">Q</span>
                <Input
                  id={`monthlyIncome-${guarantorIndex}`}
                  type="text"
                  inputMode="decimal"
                  pattern="[0-9]*\.?[0-9]*"
                  value={guarantor.monthlyIncome || ''}
                  onChange={(e) => handleInputChange('monthlyIncome', parseFloat(normalizeDecimalInput(e.target.value)) || 0)}
                  placeholder="0.00"
                  className="pl-8"
                  step="0.01"
                />
              </div>
              {monthlyIncome > 0 && (
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(monthlyIncome)}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`monthlyExpenses-${guarantorIndex}`}>Gastos Mensuales *</Label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-muted-foreground">Q</span>
                <Input
                  id={`monthlyExpenses-${guarantorIndex}`}
                  type="text"
                  inputMode="decimal"
                  pattern="[0-9]*\.?[0-9]*"
                  value={guarantor.monthlyExpenses || ''}
                  onChange={(e) => handleInputChange('monthlyExpenses', parseFloat(normalizeDecimalInput(e.target.value)) || 0)}
                  placeholder="0.00"
                  className="pl-8"
                />
              </div>
              {monthlyExpenses > 0 && (
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(monthlyExpenses)}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`otherIncome-${guarantorIndex}`}>Otros Ingresos</Label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-muted-foreground">Q</span>
              <Input
                id={`otherIncome-${guarantorIndex}`}
                type="text"
                inputMode="decimal"
                pattern="[0-9]*\.?[0-9]*"
                value={guarantor.otherIncome || ''}
                onChange={(e) => handleInputChange('otherIncome', parseFloat(normalizeDecimalInput(e.target.value)) || 0)}
                placeholder="0.00"
                className="pl-8"
              />
            </div>
            {otherIncome > 0 && (
              <p className="text-sm text-muted-foreground">
                {formatCurrency(otherIncome)}
              </p>
            )}
          </div>

          {/* Flujo disponible - Fixed calculation */}
          {(monthlyIncome > 0 || monthlyExpenses > 0) && (
            <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">Flujo disponible mensual:</span>
                <span className={`font-bold ${
                  availableFlow > 0 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {formatCurrency(availableFlow)}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Patrimonio */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5 text-primary" />
            Patrimonio y Bienes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`hasProperty-${guarantorIndex}`}
                checked={guarantor.hasProperty}
                onCheckedChange={(checked) => handleInputChange('hasProperty', checked)}
              />
              <Label htmlFor={`hasProperty-${guarantorIndex}`}>Posee propiedades inmuebles</Label>
            </div>
            
            {guarantor.hasProperty && (
              <div className="space-y-2 ml-6">
                <Label htmlFor={`propertyValue-${guarantorIndex}`}>Valor estimado de propiedades</Label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-muted-foreground">Q</span>
                  <Input
                    id={`propertyValue-${guarantorIndex}`}
                    type="text"
                    inputMode="decimal"
                    pattern="[0-9]*\.?[0-9]*"
                    value={guarantor.propertyValue || ''}
                    onChange={(e) => handleInputChange('propertyValue', parseFloat(normalizeDecimalInput(e.target.value)) || 0)}
                    placeholder="0.00"
                    className="pl-8"
                  />
                </div>
                {guarantor.propertyValue && guarantor.propertyValue > 0 && (
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(guarantor.propertyValue)}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`hasVehicle-${guarantorIndex}`}
                checked={guarantor.hasVehicle}
                onCheckedChange={(checked) => handleInputChange('hasVehicle', checked)}
              />
              <Label htmlFor={`hasVehicle-${guarantorIndex}`}>Posee vehículos</Label>
            </div>
            
            {guarantor.hasVehicle && (
              <div className="space-y-2 ml-6">
                <Label htmlFor={`vehicleValue-${guarantorIndex}`}>Valor estimado de vehículos</Label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-muted-foreground">Q</span>
                  <Input
                    id={`vehicleValue-${guarantorIndex}`}
                    type="text"
                    inputMode="decimal"
                    pattern="[0-9]*\.?[0-9]*"
                    value={guarantor.vehicleValue || ''}
                    onChange={(e) => handleInputChange('vehicleValue', parseFloat(normalizeDecimalInput(e.target.value)) || 0)}
                    placeholder="0.00"
                    className="pl-8"
                  />
                </div>
                {guarantor.vehicleValue && guarantor.vehicleValue > 0 && (
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(guarantor.vehicleValue)}
                  </p>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Cuentas Bancarias */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Banknote className="h-5 w-5 text-primary" />
            Información Bancaria
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`bankAccounts-${guarantorIndex}`}>Bancos donde mantiene cuentas *</Label>
            <Textarea
              id={`bankAccounts-${guarantorIndex}`}
              value={guarantor.bankAccounts}
              onChange={(e) => handleInputChange('bankAccounts', e.target.value)}
              placeholder="Ej: Banco Industrial - Cuenta de Ahorros, Banco G&T - Cuenta Monetaria"
              className="min-h-[80px]"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GuarantorFinancialInfo;
