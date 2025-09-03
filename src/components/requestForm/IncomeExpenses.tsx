
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from "@/components/ui/separator";
import { normalizeDecimalInput } from '@/utils/formatters';
import CurrencyInput from '@/components/ui/currency-input';

interface IncomeExpensesProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

const IncomeExpenses: React.FC<IncomeExpensesProps> = ({ formData, updateFormData }) => {
  return (
    <Card className="border-0 shadow-none">
      <CardContent className="p-0 space-y-4">
        <h3 className="font-semibold text-lg">Ingresos y Egresos</h3>
        <p className="text-muted-foreground text-sm">
          Detalla tu situación financiera mensual.
        </p>
        
        <div className="space-y-6">
          <div>
            <h4 className="text-base font-medium mb-2">Ingresos Mensuales</h4>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="primaryIncome">Ingreso Principal</Label>
                    <CurrencyInput
                      id="primaryIncome"
                      value={formData.primaryIncome || ''}
                      onValueChange={(value) => updateFormData('primaryIncome', value)}
                      placeholder="0.00"
                      currencySymbol="Q"
                    />
                  </div>
                
                  <div className="space-y-2">
                    <Label htmlFor="secondaryIncome">Otros Ingresos</Label>
                    <CurrencyInput
                      id="secondaryIncome"
                      value={formData.secondaryIncome || ''}
                      onValueChange={(value) => updateFormData('secondaryIncome', value)}
                      placeholder="0.00"
                      currencySymbol="Q"
                    />
                  </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="incomeSource">Fuente de Otros Ingresos</Label>
                <Input 
                  id="incomeSource" 
                  value={formData.incomeSource || ''} 
                  onChange={(e) => updateFormData('incomeSource', e.target.value)} 
                  placeholder="Renta, inversiones, etc."
                />
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h4 className="text-base font-medium mb-2">Egresos Mensuales</h4>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="rent">Renta / Hipoteca</Label>
                    <CurrencyInput
                      id="rent"
                      value={formData.rent || ''}
                      onValueChange={(value) => updateFormData('rent', value)}
                      placeholder="0.00"
                      currencySymbol="Q"
                    />
                  </div>
                
                  <div className="space-y-2">
                    <Label htmlFor="utilities">Servicios (Luz, Agua, etc.)</Label>
                    <CurrencyInput
                      id="utilities"
                      value={formData.utilities || ''}
                      onValueChange={(value) => updateFormData('utilities', value)}
                      placeholder="0.00"
                      currencySymbol="Q"
                    />
                  </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="food">Alimentación</Label>
                    <CurrencyInput
                      id="food"
                      value={formData.food || ''}
                      onValueChange={(value) => updateFormData('food', value)}
                      placeholder="0.00"
                      currencySymbol="Q"
                    />
                  </div>
                
                  <div className="space-y-2">
                    <Label htmlFor="transportation">Transporte</Label>
                    <CurrencyInput
                      id="transportation"
                      value={formData.transportation || ''}
                      onValueChange={(value) => updateFormData('transportation', value)}
                      placeholder="0.00"
                      currencySymbol="Q"
                    />
                  </div>
              </div>
              
                <div className="space-y-2">
                  <Label htmlFor="otherExpenses">Otros Gastos</Label>
                  <CurrencyInput
                    id="otherExpenses"
                    value={formData.otherExpenses || ''}
                    onValueChange={(value) => updateFormData('otherExpenses', value)}
                    placeholder="0.00"
                    currencySymbol="Q"
                  />
                </div>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h4 className="text-base font-medium mb-2">Deudas Actuales</h4>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentLoans">Préstamos / Créditos</Label>
                    <CurrencyInput
                      id="currentLoans"
                      value={formData.currentLoans || ''}
                      onValueChange={(value) => updateFormData('currentLoans', value)}
                      placeholder="0.00"
                      currencySymbol="Q"
                    />
                  </div>
                
                  <div className="space-y-2">
                    <Label htmlFor="creditCards">Tarjetas de Crédito</Label>
                    <CurrencyInput
                      id="creditCards"
                      value={formData.creditCards || ''}
                      onValueChange={(value) => updateFormData('creditCards', value)}
                      placeholder="0.00"
                      currencySymbol="Q"
                    />
                  </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IncomeExpenses;
