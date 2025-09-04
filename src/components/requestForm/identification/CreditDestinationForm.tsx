import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { guatemalaDepartments, departmentsMunicipalities } from '@/data/guatemalaLocations';
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
      <div>
        <h3 className="font-semibold text-lg">Destino del Crédito</h3>
        <p className="text-muted-foreground text-sm">
          Complete la información sobre el destino específico del crédito.
        </p>
      </div>
      
      <div className="space-y-6">
        {/* Primera fila - Lugar de la inversión */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="investmentPlaceDepartment">Departamento de la Inversión</Label>
            <Select 
              value={formData.investmentPlaceDepartment || ''} 
              onValueChange={(value) => {
                updateFormData('investmentPlaceDepartment', value);
                setSelectedDepartment(value);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar departamento" />
              </SelectTrigger>
              <SelectContent>
                {guatemalaDepartments.map((dept) => (
                  <SelectItem key={dept.value} value={dept.value}>
                    {dept.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="investmentPlaceMunicipality">Municipio de la Inversión</Label>
            <Select 
              value={formData.investmentPlaceMunicipality || ''} 
              onValueChange={(value) => updateFormData('investmentPlaceMunicipality', value)}
              disabled={!selectedDepartment}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar municipio" />
              </SelectTrigger>
              <SelectContent>
                {selectedDepartment && departmentsMunicipalities[selectedDepartment as keyof typeof departmentsMunicipalities]?.map((municipality) => (
                  <SelectItem key={municipality} value={municipality.toLowerCase().replace(/ /g, '_')}>
                    {municipality}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

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

        {/* Tercera fila - Categoría del destino */}
        <div className="space-y-2">
          <Label htmlFor="destinationCategory">Categoría del Destino</Label>
          <Select value={formData.destinationCategory || ''} onValueChange={(value) => updateFormData('destinationCategory', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="productivo">Productivo</SelectItem>
              <SelectItem value="comercial">Comercial</SelectItem>
              <SelectItem value="consumo">Consumo</SelectItem>
              <SelectItem value="vivienda">Vivienda</SelectItem>
              <SelectItem value="educacion">Educación</SelectItem>
              <SelectItem value="salud">Salud</SelectItem>
              <SelectItem value="otros">Otros</SelectItem>
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

        {/* Cuarta fila - Coordenadas de siembra */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="sowingLatitude">Latitud de Siembra</Label>
            <Input 
              id="sowingLatitude"
              type="number"
              value={formData.sowingLatitude || ''} 
              onChange={(e) => updateFormData('sowingLatitude', e.target.value)}
              placeholder="14.6349"
              step="any"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sowingLongitude">Longitud de Siembra</Label>
            <Input 
              id="sowingLongitude"
              type="number"
              value={formData.sowingLongitude || ''} 
              onChange={(e) => updateFormData('sowingLongitude', e.target.value)}
              placeholder="-90.5069"
              step="any"
            />
          </div>
        </div>

        {/* Quinta fila - Descripción del destino */}
        <div className="space-y-2">
          <Label htmlFor="destinationDescription">Descripción del Destino</Label>
          <Textarea 
            id="destinationDescription"
            value={formData.destinationDescription || ''} 
            onChange={(e) => updateFormData('destinationDescription', e.target.value)}
            placeholder="Describa detalladamente el destino específico del crédito..."
            rows={3}
          />
        </div>

        {/* Sexta fila - Observaciones */}
        <div className="space-y-2">
          <Label htmlFor="destinationObservations">Observaciones</Label>
          <Textarea 
            id="destinationObservations"
            value={formData.destinationObservations || ''} 
            onChange={(e) => updateFormData('destinationObservations', e.target.value)}
            placeholder="Observaciones adicionales sobre el destino del crédito..."
            rows={2}
          />
        </div>

        {/* Séptima fila - Tipos de fuente y cantidad */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="sourceTypes">Tipos de Fuente</Label>
            <Select value={formData.sourceTypes || ''} onValueChange={(value) => updateFormData('sourceTypes', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recursos_propios">Recursos Propios</SelectItem>
                <SelectItem value="credito_bancario">Crédito Bancario</SelectItem>
                <SelectItem value="subsidio_gobierno">Subsidio Gobierno</SelectItem>
                <SelectItem value="donacion">Donación</SelectItem>
                <SelectItem value="cooperativa">Cooperativa</SelectItem>
                <SelectItem value="prestamo_familiar">Préstamo Familiar</SelectItem>
                <SelectItem value="otros">Otros</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sourceQuantity">Cantidad</Label>
            <Input 
              id="sourceQuantity"
              type="number"
              value={formData.sourceQuantity || ''} 
              onChange={(e) => updateFormData('sourceQuantity', e.target.value)}
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>
        </div>

        {/* Octava fila - Observaciones finales */}
        <div className="space-y-2">
          <Label htmlFor="sourceObservations">Observaciones de Fuentes</Label>
          <Textarea 
            id="sourceObservations"
            value={formData.sourceObservations || ''} 
            onChange={(e) => updateFormData('sourceObservations', e.target.value)}
            placeholder="Observaciones sobre las fuentes de financiamiento..."
            rows={2}
          />
        </div>
      </div>
    </div>
  );
};

export default CreditDestinationForm;