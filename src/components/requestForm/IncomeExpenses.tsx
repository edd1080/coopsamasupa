
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from "@/components/ui/separator";
import { normalizeDecimalInput } from '@/utils/formatters';

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
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">$</span>
                      <Input 
                        id="primaryIncome" 
                        type="text"
                        inputMode="decimal"
                        pattern="[0-9]*\.?[0-9]*"
                        value={formData.primaryIncome || ''} 
                        onChange={(e) => updateFormData('primaryIncome', normalizeDecimalInput(e.target.value))} 
                        placeholder="0.00"
                        className="pl-8"
                      />
                    </div>
                  </div>
                
                  <div className="space-y-2">
                    <Label htmlFor="secondaryIncome">Otros Ingresos</Label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">$</span>
                      <Input 
                        id="secondaryIncome" 
                        type="text"
                        inputMode="decimal"
                        pattern="[0-9]*\.?[0-9]*"
                        value={formData.secondaryIncome || ''} 
                        onChange={(e) => updateFormData('secondaryIncome', normalizeDecimalInput(e.target.value))} 
                        placeholder="0.00"
                        className="pl-8"
                      />
                    </div>
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
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">$</span>
                      <Input 
                        id="rent" 
                        type="text"
                        inputMode="decimal"
                        pattern="[0-9]*\.?[0-9]*"
                        value={formData.rent || ''} 
                        onChange={(e) => updateFormData('rent', normalizeDecimalInput(e.target.value))} 
                        placeholder="0.00"
                        className="pl-8"
                      />
                    </div>
                  </div>
                
                  <div className="space-y-2">
                    <Label htmlFor="utilities">Servicios (Luz, Agua, etc.)</Label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">$</span>
                      <Input 
                        id="utilities" 
                        type="text"
                        inputMode="decimal"
                        pattern="[0-9]*\.?[0-9]*"
                        value={formData.utilities || ''} 
                        onChange={(e) => updateFormData('utilities', normalizeDecimalInput(e.target.value))} 
                        placeholder="0.00"
                        className="pl-8"
                      />
                    </div>
                  </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="food">Alimentación</Label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">$</span>
                      <Input 
                        id="food" 
                        type="text"
                        inputMode="decimal"
                        pattern="[0-9]*\.?[0-9]*"
                        value={formData.food || ''} 
                        onChange={(e) => updateFormData('food', normalizeDecimalInput(e.target.value))} 
                        placeholder="0.00"
                        className="pl-8"
                      />
                    </div>
                  </div>
                
                  <div className="space-y-2">
                    <Label htmlFor="transportation">Transporte</Label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">$</span>
                      <Input 
                        id="transportation" 
                        type="text"
                        inputMode="decimal"
                        pattern="[0-9]*\.?[0-9]*"
                        value={formData.transportation || ''} 
                        onChange={(e) => updateFormData('transportation', normalizeDecimalInput(e.target.value))} 
                        placeholder="0.00"
                        className="pl-8"
                      />
                    </div>
                  </div>
              </div>
              
                <div className="space-y-2">
                  <Label htmlFor="otherExpenses">Otros Gastos</Label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">$</span>
                    <Input 
                      id="otherExpenses" 
                      type="text"
                      inputMode="decimal"
                      pattern="[0-9]*\.?[0-9]*"
                      value={formData.otherExpenses || ''} 
                      onChange={(e) => updateFormData('otherExpenses', normalizeDecimalInput(e.target.value))} 
                      placeholder="0.00"
                      className="pl-8"
                    />
                  </div>
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
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">$</span>
                      <Input 
                        id="currentLoans" 
                        type="text"
                        inputMode="decimal"
                        pattern="[0-9]*\.?[0-9]*"
                        value={formData.currentLoans || ''} 
                        onChange={(e) => updateFormData('currentLoans', normalizeDecimalInput(e.target.value))} 
                        placeholder="0.00"
                        className="pl-8"
                      />
                    </div>
                  </div>
                
                  <div className="space-y-2">
                    <Label htmlFor="creditCards">Tarjetas de Crédito</Label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">$</span>
                      <Input 
                        id="creditCards" 
                        type="text"
                        inputMode="decimal"
                        pattern="[0-9]*\.?[0-9]*"
                        value={formData.creditCards || ''} 
                        onChange={(e) => updateFormData('creditCards', normalizeDecimalInput(e.target.value))} 
                        placeholder="0.00"
                        className="pl-8"
                      />
                    </div>
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
