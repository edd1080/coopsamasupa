import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CreditCard } from 'lucide-react';
import SubformHeader from '@/components/forms/SubformHeader';
import CurrencyInput from '@/components/ui/currency-input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { requestTypes, fundsOrigins, productTypes } from '@/data/catalogs';

interface CreditInfoFormProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

const CreditInfoForm: React.FC<CreditInfoFormProps> = ({ formData, updateFormData }) => {
  return (
    <div className="space-y-6">
      <SubformHeader
        icon={<CreditCard className="w-5 h-5" />}
        title="Información del Crédito Solicitado"
        subtitle="Complete los datos del crédito que desea solicitar."
        variant="applicant"
      />
      
      <div className="space-y-6">
        {/* Primera fila - Tipo de Producto */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label htmlFor="idTypeProduct">Tipo de Producto</Label>
            <Select value={formData.idTypeProduct || ''} onValueChange={(value) => updateFormData('idTypeProduct', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar tipo de producto" />
              </SelectTrigger>
              <SelectContent>
                {productTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Segunda fila - Destino, Monto, Plazo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="creditPurpose">Destino del Crédito</Label>
            <Select value={formData.creditPurpose || ''} onValueChange={(value) => updateFormData('creditPurpose', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar destino" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="capital_trabajo">Capital de Trabajo</SelectItem>
                <SelectItem value="expansion_negocio">Expansión de Negocio</SelectItem>
                <SelectItem value="maquinaria_equipo">Maquinaria y Equipo</SelectItem>
                <SelectItem value="vivienda">Vivienda</SelectItem>
                <SelectItem value="agricultura">Agricultura</SelectItem>
                <SelectItem value="ganaderia">Ganadería</SelectItem>
                <SelectItem value="comercio">Comercio</SelectItem>
                <SelectItem value="servicios">Servicios</SelectItem>
                <SelectItem value="otros">Otros</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="requestedAmount">Monto Solicitado</Label>
            <CurrencyInput
              id="requestedAmount"
              value={formData.requestedAmount || ''}
              onValueChange={(value) => updateFormData('requestedAmount', value)}
              placeholder="0.00"
              currencySymbol="Q"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="termMonths">Plazo (meses)</Label>
            <Input 
              id="termMonths"
              type="text"
              inputMode="numeric"
              value={formData.termMonths || ''} 
              onChange={(e) => updateFormData('termMonths', e.target.value)}
              placeholder="12"
            />
          </div>
        </div>

        {/* Tercera fila - Forma de Pago Combinada */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="paymentPlan">Forma de pago de capital</Label>
            <Select value={formData.paymentPlan || ''} onValueChange={(value) => updateFormData('paymentPlan', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar forma de pago" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nivelado">Nivelado</SelectItem>
                <SelectItem value="decreciente">Decreciente</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div></div>
        </div>

        {/* Cuarta fila - Información adicional */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div className="space-y-2">
             <Label htmlFor="capitalAmortization">Amortización del Capital</Label>
             <Select value={formData.capitalAmortization || ''} onValueChange={(value) => updateFormData('capitalAmortization', value)}>
               <SelectTrigger>
                 <SelectValue placeholder="Seleccionar tipo" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="mensual/1">Mensual/1</SelectItem>
                 <SelectItem value="bimensual/2">Bimensual/2</SelectItem>
                 <SelectItem value="trimestral/3">Trimestral/3</SelectItem>
                 <SelectItem value="semestral/6">Semestral/6</SelectItem>
                 <SelectItem value="anual/12">Anual/12</SelectItem>
                 <SelectItem value="al_vencimiento">Al vencimiento</SelectItem>
                 <SelectItem value="fondo_revolvente/1">Fondo Revolvente/1</SelectItem>
               </SelectContent>
             </Select>
           </div>

        </div>

        {/* Cuarta fila - Tasa y más información */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="interestRate">Tasa de Interés (%)</Label>
            <Input 
              id="interestRate"
              type="text"
              inputMode="decimal"
              value={formData.interestRate || ''} 
              onChange={(e) => updateFormData('interestRate', e.target.value)}
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="interestAmortization">Amortización de Interés</Label>
            <Select value={formData.interestAmortization || ''} onValueChange={(value) => updateFormData('interestAmortization', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mensual/1">Mensual/1</SelectItem>
                <SelectItem value="bimensual/2">Bimensual/2</SelectItem>
                <SelectItem value="trimestral/3">Trimestral/3</SelectItem>
                <SelectItem value="semestral/6">Semestral/6</SelectItem>
                <SelectItem value="anual/12">Anual/12</SelectItem>
                <SelectItem value="al_vencimiento">Al vencimiento</SelectItem>
                <SelectItem value="fondo_revolvente/1">Fondo Revolvente/1</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="applicationType">Tipo de Solicitud</Label>
            <Select value={formData.applicationType || ''} onValueChange={(value) => updateFormData('applicationType', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar tipo" />
              </SelectTrigger>
              <SelectContent>
                {requestTypes.map((type) => (
                  <SelectItem key={type.id} value={type.value}>
                    {type.value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Quinta fila - Créditos obtenidos y origen de fondos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="obtainedCreditsCount">No. de Créditos Obtenidos</Label>
            <Input 
              id="obtainedCreditsCount"
              type="number"
              value={formData.obtainedCreditsCount || ''} 
              onChange={(e) => updateFormData('obtainedCreditsCount', e.target.value)}
              placeholder="0"
              min="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sourceOfFunds">Origen de los Fondos</Label>
            <Select value={formData.sourceOfFunds || ''} onValueChange={(value) => updateFormData('sourceOfFunds', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar origen" />
              </SelectTrigger>
              <SelectContent className="max-w-md">
                {fundsOrigins.map((origin) => (
                  <SelectItem 
                    key={origin.id} 
                    value={origin.payloadValue}
                    className="whitespace-normal leading-tight py-2 min-h-[2.5rem]"
                  >
                    <div 
                      className="text-xs leading-tight"
                      dangerouslySetInnerHTML={{ __html: origin.displayValue }}
                    />
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Observaciones de Carácter */}
        <div className="space-y-2">
          <Label htmlFor="characterObservations">Observaciones de Carácter (opcional)</Label>
          <Textarea 
            id="characterObservations"
            value={formData.characterObservations || ''} 
            onChange={(e) => updateFormData('characterObservations', e.target.value)}
            placeholder="Observaciones adicionales sobre el carácter del solicitante..."
            rows={3}
          />
        </div>
      </div>
    </div>
  );
};

export default CreditInfoForm;