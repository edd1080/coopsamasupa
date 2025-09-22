
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { normalizeDecimalInput } from '@/utils/formatters';
import { Separator } from '@/components/ui/separator';
import { PieChart, TrendingDown, TrendingUp } from 'lucide-react';
import CurrencyInput from '@/components/ui/currency-input';

interface PatrimonialStatementProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

const assetCategories = [
  { key: 'efectivoSaldoBancos', label: 'Efectivo y saldo en bancos' },
  { key: 'cuentasPorCobrar', label: 'Cuentas por cobrar' },
  { key: 'mercaderias', label: 'Mercaderías' },
  { key: 'bienesMuebles', label: 'Bienes Muebles (menaje)' },
  { key: 'vehiculos', label: 'Vehículos' },
  { key: 'bienesInmuebles', label: 'Bienes Inmuebles' },
  { key: 'otrosActivos', label: 'Otros Activos' }
];

const liabilityCategories = [
  { key: 'cuentasPorPagar', label: 'Cuentas por pagar' },
  { key: 'deudasCortoPlazo', label: 'Deudas a corto plazo' },
  { key: 'prestamosLargoPlazo', label: 'Préstamos a largo plazo' }
];

const PatrimonialStatement: React.FC<PatrimonialStatementProps> = ({ formData, updateFormData }) => {
  // Calculate totals
  const totalAssets = assetCategories.reduce((sum, category) => {
    return sum + parseFloat(formData[category.key] || '0');
  }, 0);

  const totalLiabilities = liabilityCategories.reduce((sum, category) => {
    return sum + parseFloat(formData[category.key] || '0');
  }, 0);

  const capitalPatrimonio = totalAssets - totalLiabilities;

  // Calculate ratios
  const indiceEndeudamientoActual = totalAssets > 0 ? (totalLiabilities / totalAssets) * 100 : 0;
  const montoSolicitado = parseFloat(formData.montoSolicitado || '0');
  const nuevoPasivo = totalLiabilities + montoSolicitado;
  const indiceEndeudamientoProyectado = totalAssets > 0 ? (nuevoPasivo / totalAssets) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <PieChart className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Estado Patrimonial</h3>
      </div>

      {/* Assets Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-600" />
            Activos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assetCategories.map((category) => (
              <div key={category.key} className="space-y-2">
                <Label htmlFor={category.key}>{category.label}</Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">Q</span>
                  <Input 
                    id={category.key}
                    className="pl-7"
                    type="text"
                    inputMode="decimal"
                    pattern="[0-9]*\.?[0-9]*"
                    placeholder="0.00"
                    value={formData[category.key] || ''}
                    onChange={(e) => updateFormData(category.key, normalizeDecimalInput(e.target.value))}
                  />
                </div>
              </div>
            ))}
          </div>
          <Separator className="my-4" />
          <div className="space-y-2">
            <Label>Total de Activos</Label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">Q</span>
              <Input 
                className="pl-7 bg-muted font-medium text-green-600"
                value={totalAssets.toFixed(2)}
                readOnly
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liabilities Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-red-600" />
            Pasivos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {liabilityCategories.map((category) => (
              <div key={category.key} className="space-y-2">
                <Label htmlFor={category.key}>{category.label}</Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">Q</span>
                  <Input 
                    id={category.key}
                    className="pl-7"
                    type="text"
                    inputMode="decimal"
                    pattern="[0-9]*\.?[0-9]*"
                    placeholder="0.00"
                    value={formData[category.key] || ''}
                    onChange={(e) => updateFormData(category.key, normalizeDecimalInput(e.target.value))}
                  />
                </div>
              </div>
            ))}
          </div>
          <Separator className="my-4" />
          <div className="space-y-2">
            <Label>Total de Pasivos</Label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">Q</span>
              <Input 
                className="pl-7 bg-muted font-medium text-red-600"
                value={totalLiabilities.toFixed(2)}
                readOnly
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Capital and Patrimony */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Capital y Patrimonio</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>Capital y Patrimonio (Calculado automáticamente)</Label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">Q</span>
              <Input 
                className={`pl-7 bg-muted font-medium ${capitalPatrimonio >= 0 ? 'text-green-600' : 'text-red-600'}`}
                value={capitalPatrimonio.toFixed(2)}
                readOnly
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Ratios */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Índices y Ratios Automáticos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Índice de Endeudamiento Actual</Label>
              <div className="relative">
                <Input 
                  className="bg-muted font-medium"
                  value={`${indiceEndeudamientoActual.toFixed(1)}%`}
                  readOnly
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Pasivos / Activos × 100
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="montoSolicitado">Monto Solicitado</Label>
              <CurrencyInput
                id="montoSolicitado"
                value={formData.montoSolicitado || ''}
                onValueChange={(value) => updateFormData('montoSolicitado', value)}
                placeholder="0.00"
                currencySymbol="Q"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Índice de Endeudamiento Proyectado</Label>
            <div className="relative">
              <Input 
                className={`bg-muted font-medium ${indiceEndeudamientoProyectado > 70 ? 'text-red-600' : indiceEndeudamientoProyectado > 50 ? 'text-yellow-600' : 'text-green-600'}`}
                value={`${indiceEndeudamientoProyectado.toFixed(1)}%`}
                readOnly
              />
            </div>
            <p className="text-xs text-muted-foreground">
              (Pasivos + Monto Solicitado) / Activos × 100
            </p>
          </div>

          {/* Risk Assessment */}
          <div className={`p-3 rounded-lg border ${
            indiceEndeudamientoProyectado > 70 ? 'bg-red-50 border-red-200' :
            indiceEndeudamientoProyectado > 50 ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200'
          }`}>
            <p className={`text-sm font-medium ${
              indiceEndeudamientoProyectado > 70 ? 'text-red-800' :
              indiceEndeudamientoProyectado > 50 ? 'text-yellow-800' : 'text-green-800'
            }`}>
              {indiceEndeudamientoProyectado > 70 ? 'Riesgo Alto' :
               indiceEndeudamientoProyectado > 50 ? 'Riesgo Medio' : 'Riesgo Bajo'}
            </p>
            <p className={`text-xs ${
              indiceEndeudamientoProyectado > 70 ? 'text-red-600' :
              indiceEndeudamientoProyectado > 50 ? 'text-yellow-600' : 'text-green-600'
            }`}>
              {indiceEndeudamientoProyectado > 70 ? 'Nivel de endeudamiento muy alto' :
               indiceEndeudamientoProyectado > 50 ? 'Nivel de endeudamiento moderado' : 'Nivel de endeudamiento saludable'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatrimonialStatement;
