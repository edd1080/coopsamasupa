import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
      <div>
        <h3 className="font-semibold text-lg">Información del Crédito Solicitado</h3>
        <p className="text-muted-foreground text-sm">
          Complete los datos del crédito que desea solicitar.
        </p>
      </div>
      
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
              type="number"
              value={formData.requestedAmount || ''} 
              onChange={(e) => updateFormData('requestedAmount', e.target.value)}
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="termMonths">Plazo (meses) *</Label>
            <Input 
              id="termMonths"
              type="number"
              value={formData.termMonths || ''} 
              onChange={(e) => updateFormData('termMonths', e.target.value)}
              placeholder="12"
              min="1"
              max="120"
            />
          </div>
        </div>

        {/* Segunda fila - Formas de Pago */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="capitalPayment">Forma Pago Capital *</Label>
            <Select value={formData.capitalPayment || ''} onValueChange={(value) => updateFormData('capitalPayment', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar forma de pago" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mensual">Mensual</SelectItem>
                <SelectItem value="bimestral">Bimestral</SelectItem>
                <SelectItem value="trimestral">Trimestral</SelectItem>
                <SelectItem value="semestral">Semestral</SelectItem>
                <SelectItem value="anual">Anual</SelectItem>
                <SelectItem value="al_vencimiento">Al Vencimiento</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="interestPayment">Forma Pago Interés *</Label>
            <Select value={formData.interestPayment || ''} onValueChange={(value) => updateFormData('interestPayment', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar forma de pago" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mensual">Mensual</SelectItem>
                <SelectItem value="bimestral">Bimestral</SelectItem>
                <SelectItem value="trimestral">Trimestral</SelectItem>
                <SelectItem value="semestral">Semestral</SelectItem>
                <SelectItem value="anual">Anual</SelectItem>
                <SelectItem value="al_vencimiento">Al Vencimiento</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
                <SelectItem value="frances">Francés</SelectItem>
                <SelectItem value="aleman">Alemán</SelectItem>
                <SelectItem value="americano">Americano</SelectItem>
                <SelectItem value="cuotas_iguales">Cuotas Iguales</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="memberType">Tipo de Socio</Label>
            <Select value={formData.memberType || ''} onValueChange={(value) => updateFormData('memberType', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nuevo">Nuevo</SelectItem>
                <SelectItem value="recurrente">Recurrente</SelectItem>
                <SelectItem value="preferencial">Preferencial</SelectItem>
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
              type="number"
              value={formData.interestRate || ''} 
              onChange={(e) => updateFormData('interestRate', e.target.value)}
              placeholder="0.00"
              min="0"
              max="100"
              step="0.01"
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