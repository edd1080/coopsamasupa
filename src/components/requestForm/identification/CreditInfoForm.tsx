
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
          Complete los detalles del crédito que desea solicitar.
        </p>
      </div>
      
      <div className="space-y-6">
        {/* Destino del Crédito */}
        <div className="space-y-2">
          <Label htmlFor="creditPurpose">Destino del Crédito *</Label>
          <Select value={formData.creditPurpose || ''} onValueChange={(value) => updateFormData('creditPurpose', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar destino" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="business_capital">Capital de Trabajo</SelectItem>
              <SelectItem value="equipment">Compra de Equipo</SelectItem>
              <SelectItem value="inventory">Inventario</SelectItem>
              <SelectItem value="expansion">Expansión del Negocio</SelectItem>
              <SelectItem value="personal">Gastos Personales</SelectItem>
              <SelectItem value="education">Educación</SelectItem>
              <SelectItem value="health">Salud</SelectItem>
              <SelectItem value="other">Otro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Monto y Plazo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="requestedAmount">Monto Solicitado Q *</Label>
            <Input 
              id="requestedAmount"
              type="number"
              min="1"
              value={formData.requestedAmount || ''} 
              onChange={(e) => updateFormData('requestedAmount', e.target.value)}
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="termMonths">Plazo (meses) *</Label>
            <Input 
              id="termMonths"
              type="number"
              min="6"
              max="60"
              value={formData.termMonths || ''} 
              onChange={(e) => updateFormData('termMonths', e.target.value)}
              placeholder="12"
            />
          </div>
        </div>

        {/* Hidden payment forms - kept in code but not displayed */}
        <div style={{ display: 'none' }}>
          <Select value={formData.capitalPayment || ''} onValueChange={(value) => updateFormData('capitalPayment', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar forma" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Mensual</SelectItem>
              <SelectItem value="biweekly">Quincenal</SelectItem>
              <SelectItem value="weekly">Semanal</SelectItem>
              <SelectItem value="end_term">Al Vencimiento</SelectItem>
            </SelectContent>
          </Select>

          <Select value={formData.interestPayment || ''} onValueChange={(value) => updateFormData('interestPayment', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar forma" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Mensual</SelectItem>
              <SelectItem value="biweekly">Quincenal</SelectItem>
              <SelectItem value="weekly">Semanal</SelectItem>
              <SelectItem value="deducted">Descontado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Observaciones */}
        <div className="space-y-2">
          <Label htmlFor="characterObservations">Observaciones de Carácter (opcional)</Label>
          <Textarea 
            id="characterObservations"
            value={formData.characterObservations || ''} 
            onChange={(e) => updateFormData('characterObservations', e.target.value)}
            placeholder="Observaciones adicionales sobre el carácter del solicitante"
            rows={3}
          />
        </div>
      </div>
    </div>
  );
};

export default CreditInfoForm;
