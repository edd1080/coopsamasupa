import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CreditCard } from 'lucide-react';
import { guatemalaDepartments, departmentsMunicipalities } from '@/data/guatemalaLocations';
import SubformHeader from '@/components/forms/SubformHeader';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CreditDestinationFormProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

const CreditDestinationForm: React.FC<CreditDestinationFormProps> = ({ formData, updateFormData }) => {
  const [selectedDepartment, setSelectedDepartment] = useState(formData.investmentPlaceDepartment || '');

  useEffect(() => {
    // Reset municipality when department changes
    if (selectedDepartment !== formData.investmentPlaceDepartment) {
      updateFormData('investmentPlaceMunicipality', '');
    }
  }, [selectedDepartment, formData.investmentPlaceDepartment, updateFormData]);

  return (
    <div className="space-y-6">
      <SubformHeader
        icon={<CreditCard className="w-5 h-5" />}
        title="Destino del Crédito"
        subtitle="Complete la información sobre el destino específico del crédito."
        variant="applicant"
      />
      
      <div className="space-y-6">

        {/* Segunda fila - Destino Grupo */}
        <div className="space-y-2">
          <Label htmlFor="destinationGroup">Destino Grupo</Label>
          <Select value={formData.destinationGroup || ''} onValueChange={(value) => {
            updateFormData('destinationGroup', value);
            // Reset credit destination when group changes
            updateFormData('creditDestination', '');
          }}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar grupo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="grupo_consumo">Grupo Consumo</SelectItem>
              <SelectItem value="grupo_microcredito">Grupo MicroCredito</SelectItem>
              <SelectItem value="grupo_productivo">Grupo Productivo</SelectItem>
              <SelectItem value="grupo_vivienda">Grupo Vivienda</SelectItem>
            </SelectContent>
          </Select>
        </div>


        {/* Cuarta fila - Destino Crédito (condicional) */}
        <div className="space-y-2">
          <Label htmlFor="creditDestination">Destino Crédito</Label>
          <Select 
            value={formData.creditDestination || ''} 
            onValueChange={(value) => updateFormData('creditDestination', value)}
            disabled={!formData.destinationGroup}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar destino" />
            </SelectTrigger>
            <SelectContent>
              {formData.destinationGroup === 'grupo_consumo' && (
                <>
                  <SelectItem value="consumo">Consumo</SelectItem>
                  <SelectItem value="novacion">Novación</SelectItem>
                  <SelectItem value="reestructura">Reestructura</SelectItem>
                  <SelectItem value="tarjeta_credito">Tarjeta de Crédito</SelectItem>
                </>
              )}
              {(formData.destinationGroup === 'grupo_microcredito' || formData.destinationGroup === 'grupo_productivo') && (
                <>
                  <SelectItem value="agricultura">Agricultura</SelectItem>
                  <SelectItem value="agroindustria">Agroindustria</SelectItem>
                  <SelectItem value="comercio">Comercio</SelectItem>
                  <SelectItem value="industria">Industria</SelectItem>
                  <SelectItem value="pecuario_avicola">Pecuario/Avícola</SelectItem>
                  <SelectItem value="reestructura">Reestructura</SelectItem>
                  <SelectItem value="servicios">Servicios</SelectItem>
                </>
              )}
              {formData.destinationGroup === 'grupo_vivienda' && (
                <>
                  <SelectItem value="vivienda">Vivienda</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
        </div>

      </div>
    </div>
  );
};

export default CreditDestinationForm;