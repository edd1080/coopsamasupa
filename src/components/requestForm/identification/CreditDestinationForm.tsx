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

        {/* Categoría del destino (mandatory) */}
        <div className="space-y-2">
          <Label htmlFor="destinationCategory">Categoría del destino *</Label>
          <Select 
            value={formData.destinationCategory || ''} 
            onValueChange={(value) => updateFormData('destinationCategory', value)}
            disabled={!formData.creditDestination}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar categoría" />
            </SelectTrigger>
            <SelectContent>
              {formData.creditDestination === 'agricultura' && (
                <>
                  <SelectItem value="costo_produccion">Costo de producción</SelectItem>
                  <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
                  <SelectItem value="activos_fijos">Activos fijos</SelectItem>
                  <SelectItem value="siembra">Siembra</SelectItem>
                </>
              )}
              {formData.creditDestination === 'agroindustria' && (
                <>
                  <SelectItem value="produccion_agropecuarios">Producción de productos agropecuarios</SelectItem>
                  <SelectItem value="comercializacion_agropecuarios">Comercialización de productos agropecuarios</SelectItem>
                  <SelectItem value="comercializacion_forestales">Comercialización de productos forestales</SelectItem>
                  <SelectItem value="activos_fijos">Activos fijos</SelectItem>
                </>
              )}
              {formData.creditDestination === 'comercio' && (
                <>
                  <SelectItem value="capital_trabajo">Capital de trabajo</SelectItem>
                  <SelectItem value="activos_fijos">Activos fijos</SelectItem>
                  <SelectItem value="construccion_mejoras">Construcción y mejoras</SelectItem>
                  <SelectItem value="otros">Otros</SelectItem>
                </>
              )}
              {formData.creditDestination === 'servicios' && (
                <>
                  <SelectItem value="capital_trabajo">Capital de trabajo</SelectItem>
                  <SelectItem value="activos_fijos">Activos fijos</SelectItem>
                  <SelectItem value="construccion_mejoras">Construcción y mejoras</SelectItem>
                </>
              )}
              {formData.creditDestination === 'vivienda' && (
                <>
                  <SelectItem value="construccion_mejoras">Construcción y mejoras</SelectItem>
                  <SelectItem value="activos_fijos">Activos fijos</SelectItem>
                </>
              )}
              {formData.creditDestination === 'consumo' && (
                <>
                  <SelectItem value="gastos_personales">Gastos personales</SelectItem>
                  <SelectItem value="consolidacion_deuda">Consolidación de deuda</SelectItem>
                  <SelectItem value="compra_vehiculo">Compra de vehículo</SelectItem>
                </>
              )}
              {formData.creditDestination === 'industria' && (
                <>
                  <SelectItem value="capital_trabajo">Capital de trabajo</SelectItem>
                  <SelectItem value="activos_fijos">Activos fijos</SelectItem>
                </>
              )}
              {(formData.creditDestination === 'reestructura' || formData.creditDestination === 'novacion') && (
                <>
                  <SelectItem value="reestructura">Reestructura</SelectItem>
                  <SelectItem value="novacion">Novación</SelectItem>
                </>
              )}
              {formData.creditDestination === 'tarjeta_credito' && (
                <>
                  <SelectItem value="gastos_personales">Gastos personales</SelectItem>
                  <SelectItem value="servicios">Servicios</SelectItem>
                  <SelectItem value="comercio">Comercio</SelectItem>
                </>
              )}
              {formData.creditDestination === 'pecuario_avicola' && (
                <>
                  <SelectItem value="compra_venta">Compra-venta</SelectItem>
                  <SelectItem value="crianza_engorde">Crianza y engorde</SelectItem>
                  <SelectItem value="materia_prima_insumos">Compra de materia prima y/o insumos</SelectItem>
                  <SelectItem value="activos_fijos">Activos fijos</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
          {!formData.creditDestination && (
            <p className="text-sm text-muted-foreground">Seleccione un destino de crédito primero</p>
          )}
        </div>

        {/* Campos opcionales para departamento y municipio de inversión */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="investmentDepartment">Departamento de la inversión</Label>
            <Select value={formData.investmentPlaceDepartment || ''} onValueChange={(value) => {
              updateFormData('investmentPlaceDepartment', value);
              updateFormData('investmentPlaceMunicipality', '');
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar departamento" />
              </SelectTrigger>
              <SelectContent>
                {guatemalaDepartments.map((dept) => (
                  <SelectItem key={dept.value} value={dept.label}>
                    {dept.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="investmentMunicipality">Municipio de inversión</Label>
            <Select 
              value={formData.investmentPlaceMunicipality || ''} 
              onValueChange={(value) => updateFormData('investmentPlaceMunicipality', value)}
              disabled={!selectedDepartment}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar municipio" />
              </SelectTrigger>
              <SelectContent>
                {selectedDepartment && departmentsMunicipalities[selectedDepartment]?.map((municipality) => (
                  <SelectItem key={municipality} value={municipality}>
                    {municipality}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Campos adicionales opcionales */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="specificDestination">Otros (destino específico)</Label>
            <Input
              id="specificDestination"
              value={formData.specificDestination || ''}
              onChange={(e) => updateFormData('specificDestination', e.target.value)}
              placeholder="Especificar otro destino si aplica"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="destinationDescription">Descripción del destino</Label>
            <Textarea
              id="destinationDescription"
              value={formData.destinationDescription || ''}
              onChange={(e) => updateFormData('destinationDescription', e.target.value)}
              placeholder="Describir el destino del crédito"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="destinationComments">Observaciones</Label>
            <Textarea
              id="destinationComments"
              value={formData.destinationComments || ''}
              onChange={(e) => updateFormData('destinationComments', e.target.value)}
              placeholder="Observaciones adicionales"
              rows={2}
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default CreditDestinationForm;