import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CreditCard } from 'lucide-react';
import SubformHeader from '@/components/forms/SubformHeader';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
        {/* Primera fila - Destino, Monto, Plazo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="creditPurpose">Destino del Crédito *</Label>
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
            <Label htmlFor="requestedAmount">Monto Solicitado Q *</Label>
            <Input 
              id="requestedAmount"
              type="text"
              inputMode="decimal"
              value={formData.requestedAmount || ''} 
              onChange={(e) => updateFormData('requestedAmount', e.target.value)}
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="termMonths">Plazo (meses) *</Label>
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

        {/* Segunda fila - Forma de Pago Combinada */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="paymentPlan">Forma de pago de capital e interés *</Label>
            <Select value={formData.paymentPlan || ''} onValueChange={(value) => updateFormData('paymentPlan', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar forma de pago" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pago_mensual_fijo">Pago mensual fijo</SelectItem>
                <SelectItem value="interes_sobre_saldo">Interés sobre saldo</SelectItem>
                <SelectItem value="cuota_nivelada">Cuota nivelada</SelectItem>
                <SelectItem value="cuota_fija">Cuota fija</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div></div>
        </div>

        {/* Tercera fila - Información adicional */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div className="space-y-2">
             <Label htmlFor="capitalAmortization">Amortización del Capital</Label>
             <Select value={formData.capitalAmortization || ''} onValueChange={(value) => updateFormData('capitalAmortization', value)}>
               <SelectTrigger>
                 <SelectValue placeholder="Seleccionar tipo" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="mensual">Mensual</SelectItem>
                 <SelectItem value="trimestral">Trimestral</SelectItem>
                 <SelectItem value="semestral">Semestral</SelectItem>
                 <SelectItem value="anual">Anual</SelectItem>
                 <SelectItem value="al_vencimiento">Al vencimiento</SelectItem>
                 <SelectItem value="personalizada">Personalizada</SelectItem>
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
                <SelectItem value="vencida">Vencida</SelectItem>
                <SelectItem value="anticipada">Anticipada</SelectItem>
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
                <SelectItem value="individual">Individual</SelectItem>
                <SelectItem value="solidaria">Solidaria</SelectItem>
                <SelectItem value="grupal">Grupal</SelectItem>
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
            <Label htmlFor="fundsOrigin">Origen de los Fondos</Label>
            <Select value={formData.fundsOrigin || ''} onValueChange={(value) => updateFormData('fundsOrigin', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar origen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recursos_propios">Recursos Propios</SelectItem>
                <SelectItem value="prestamo_bancario">Préstamo Bancario</SelectItem>
                <SelectItem value="prestamo_familiar">Préstamo Familiar</SelectItem>
                <SelectItem value="prestamo_terceros">Préstamo de Terceros</SelectItem>
                <SelectItem value="otros">Otros</SelectItem>
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