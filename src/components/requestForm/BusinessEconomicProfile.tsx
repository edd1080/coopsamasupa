
import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { normalizeDecimalInput, normalizeIntegerInput } from '@/utils/formatters';
import CurrencyInput from '@/components/ui/currency-input';

interface Product {
  id: string;
  name: string;
  unit: string;
  quantity: number;
  price: number;
  total: number;
  profit: number;
}

interface BusinessEconomicProfileProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

const BusinessEconomicProfile: React.FC<BusinessEconomicProfileProps> = ({ formData, updateFormData }) => {
  const [products, setProducts] = useState<Product[]>(formData.products || []);
  const [applicantType, setApplicantType] = useState(formData.applicantType || '');
  const [internalSubStep, setInternalSubStep] = useState(0);
  const tabsListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    updateFormData('products', products);
  }, [products, updateFormData]);

  useEffect(() => {
    updateFormData('applicantType', applicantType);
    // Reset substep when changing applicant type
    if (applicantType === 'asalariado') {
      setInternalSubStep(0);
    }
  }, [applicantType, updateFormData]);

  // Auto-center active tab
  const centerActiveTab = () => {
    if (!tabsListRef.current) return;
    
    const container = tabsListRef.current;
    const activeTab = container.querySelector('[data-state="active"]') as HTMLElement;
    
    if (activeTab) {
      const containerWidth = container.clientWidth;
      const activeTabWidth = activeTab.offsetWidth;
      const activeTabLeft = activeTab.offsetLeft;
      
      const desiredScrollLeft = Math.max(
        0,
        Math.min(
          activeTabLeft - (containerWidth / 2 - activeTabWidth / 2),
          container.scrollWidth - containerWidth
        )
      );
      
      container.scrollTo({
        left: desiredScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  // Center tab when internalSubStep changes
  useEffect(() => {
    if (applicantType === 'negocio_propio') {
      setTimeout(centerActiveTab, 100); // Small delay to ensure DOM is updated
    }
  }, [internalSubStep, applicantType]);

  const addProduct = () => {
    const newProduct: Product = {
      id: Date.now().toString(),
      name: '',
      unit: '',
      quantity: 0,
      price: 0,
      total: 0,
      profit: 0
    };
    setProducts([...products, newProduct]);
  };

  const removeProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const updateProduct = (id: string, field: keyof Product, value: any) => {
    setProducts(products.map(p => {
      if (p.id === id) {
        const updated = { ...p, [field]: value };
        // Calculate totals
        if (field === 'quantity' || field === 'price') {
          updated.total = updated.quantity * updated.price;
        }
        return updated;
      }
      return p;
    }));
  };

  // Add navigation buttons for substeps when in business mode
  const renderSubStepNavigation = () => {
    if (applicantType !== 'negocio_propio') return null;
    
    return (
      <div className="flex justify-between mt-6">
        <Button 
          variant="success" 
          size="md"
          onClick={() => {
            const newStep = Math.max(0, internalSubStep - 1);
            setInternalSubStep(newStep);
            setTimeout(centerActiveTab, 100);
          }}
          disabled={internalSubStep === 0}
        >
          Anterior
        </Button>
        <span className="flex items-center text-sm text-muted-foreground">
          Paso {internalSubStep + 1} de 4
        </span>
        <Button 
          variant="success"
          size="md"
          onClick={() => {
            const newStep = Math.min(3, internalSubStep + 1);
            setInternalSubStep(newStep);
            setTimeout(centerActiveTab, 100);
          }}
          disabled={internalSubStep === 3}
        >
          Siguiente
        </Button>
      </div>
    );
  };

  // Render tabs for business substeps
  const renderTabsHeader = () => {
    if (applicantType !== 'negocio_propio') return null;
    
    return (
      <div className="mb-6">
        <Tabs 
          value={String(internalSubStep)} 
          onValueChange={(value) => {
            setInternalSubStep(Number(value));
            setTimeout(centerActiveTab, 100);
          }}
        >
          <TabsList 
            ref={tabsListRef}
            className="w-full overflow-x-auto hide-scrollbar bg-transparent p-0"
          >
            <TabsTrigger 
              value="0" 
              className="flex-shrink-0 px-4 py-2"
            >
              Info general
            </TabsTrigger>
            <TabsTrigger 
              value="1" 
              className="flex-shrink-0 px-4 py-2"
            >
              Productos
            </TabsTrigger>
            <TabsTrigger 
              value="2" 
              className="flex-shrink-0 px-4 py-2"
            >
              Gastos administrativos
            </TabsTrigger>
            <TabsTrigger 
              value="3" 
              className="flex-shrink-0 px-4 py-2"
            >
              Análisis del negocio
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    );
  };

  const renderSubStepContent = () => {
    if (applicantType === 'asalariado') {
      // For employees, show only the applicant type selector
      return (
        <div className="space-y-4">
          <Label className="text-base font-medium">Tipo de Solicitante</Label>
          <RadioGroup 
            value={applicantType} 
            onValueChange={setApplicantType}
            className="flex flex-col space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="asalariado" id="asalariado" />
              <Label htmlFor="asalariado">Asalariado</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="negocio_propio" id="negocio_propio" />
              <Label htmlFor="negocio_propio">Negocio Propio</Label>
            </div>
          </RadioGroup>
        </div>
      );
    }

    if (applicantType === 'negocio_propio') {
      // Substep 0: Applicant type + Basic business info to monthly sales
      if (internalSubStep === 0) {
        return (
          <div className="space-y-6">
            {/* Tipo de Solicitante - Radio Button */}
            <div className="space-y-4">
              <Label className="text-base font-medium">Tipo de Solicitante</Label>
              <RadioGroup 
                value={applicantType} 
                onValueChange={setApplicantType}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="asalariado" id="asalariado" />
                  <Label htmlFor="asalariado">Asalariado</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="negocio_propio" id="negocio_propio" />
                  <Label htmlFor="negocio_propio">Negocio Propio</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Nombre del Negocio */}
            <div className="space-y-2">
              <Label htmlFor="businessName">Nombre del Negocio</Label>
              <Input 
                id="businessName"
                value={formData.businessName || ''} 
                onChange={(e) => updateFormData('businessName', e.target.value)}
                placeholder="Nombre comercial del negocio"
              />
            </div>

            {/* Información Básica del Negocio */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="activityType">Tipo de Actividad</Label>
                <Select value={formData.activityType || ''} onValueChange={(value) => updateFormData('activityType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar actividad CNAE" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="agriculture">Agricultura, ganadería, silvicultura y pesca</SelectItem>
                    <SelectItem value="mining">Explotación de minas y canteras</SelectItem>
                    <SelectItem value="manufacturing">Industrias manufactureras</SelectItem>
                    <SelectItem value="construction">Construcción</SelectItem>
                    <SelectItem value="commerce">Comercio al por mayor y menor</SelectItem>
                    <SelectItem value="transport">Transporte y almacenamiento</SelectItem>
                    <SelectItem value="accommodation">Alojamiento y servicios de comida</SelectItem>
                    <SelectItem value="information">Información y comunicaciones</SelectItem>
                    <SelectItem value="financial">Actividades financieras y de seguros</SelectItem>
                    <SelectItem value="real_estate">Actividades inmobiliarias</SelectItem>
                    <SelectItem value="professional">Actividades profesionales, científicas y técnicas</SelectItem>
                    <SelectItem value="administrative">Actividades de servicios administrativos</SelectItem>
                    <SelectItem value="education">Enseñanza</SelectItem>
                    <SelectItem value="health">Actividades de atención de la salud humana</SelectItem>
                    <SelectItem value="arts">Actividades artísticas, de entretenimiento</SelectItem>
                    <SelectItem value="other_services">Otras actividades de servicios</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="experienceYears">Años de Experiencia</Label>
                <Input 
                  id="experienceYears"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={formData.experienceYears || ''} 
                  onChange={(e) => updateFormData('experienceYears', normalizeIntegerInput(e.target.value))}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessAddress">Dirección del Negocio</Label>
              <Textarea 
                id="businessAddress"
                value={formData.businessAddress || ''} 
                onChange={(e) => updateFormData('businessAddress', e.target.value)}
                placeholder="Dirección completa del negocio"
                rows={2}
              />
            </div>

            {/* Ventas Mensuales */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cashSales">Ventas Mensuales de Contado Q</Label>
                <CurrencyInput
                  id="cashSales"
                  value={formData.cashSales || ''}
                  onValueChange={(value) => updateFormData('cashSales', value)}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="creditSales">Ventas Mensuales a Crédito Q</Label>
                <CurrencyInput
                  id="creditSales"
                  value={formData.creditSales || ''}
                  onValueChange={(value) => updateFormData('creditSales', value)}
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>
        );
      }

      // Substep 1: Products and seasonality
      if (internalSubStep === 1) {
        return (
          <div className="space-y-6">
            {/* Productos */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Productos/Servicios</h4>
                <Button type="button" variant="outline" size="sm" onClick={addProduct}>
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Producto
                </Button>
              </div>

              {products.length === 0 ? (
                <p className="text-muted-foreground text-sm">No hay productos agregados</p>
              ) : (
                <div className="space-y-4">
                  {products.map((product, index) => (
                    <div key={product.id} className="border rounded-md p-4 space-y-4">
                      <div className="flex justify-between items-center">
                        <h5 className="font-medium">Producto {index + 1}</h5>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm"
                          onClick={() => removeProduct(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Nombre</Label>
                          <Input 
                            value={product.name}
                            onChange={(e) => updateProduct(product.id, 'name', e.target.value)}
                            placeholder="Nombre del producto"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Unidad</Label>
                          <Input 
                            value={product.unit}
                            onChange={(e) => updateProduct(product.id, 'unit', e.target.value)}
                            placeholder="kg, unidad, litro, etc."
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Cantidad</Label>
                          <Input 
                            type="text"
                            inputMode="decimal"
                            pattern="[0-9]*\.?[0-9]*"
                            value={product.quantity}
                            onChange={(e) => updateProduct(product.id, 'quantity', parseFloat(normalizeDecimalInput(e.target.value)) || 0)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Precio Unitario Q</Label>
                          <CurrencyInput
                            value={product.price.toString()}
                            onValueChange={(value) => updateProduct(product.id, 'price', parseFloat(value) || 0)}
                            placeholder="0.00"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Total Q</Label>
                          <CurrencyInput
                            value={product.total.toString()}
                            onValueChange={() => {}} // Read only
                            readOnly
                            className=""
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Utilidad Q</Label>
                          <CurrencyInput
                            value={product.profit.toString()}
                            onValueChange={(value) => updateProduct(product.id, 'profit', parseFloat(value) || 0)}
                            placeholder="0.00"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Separator />

            {/* Estacionalidad */}
            <div className="space-y-4">
              <h4 className="font-medium">Estacionalidad del Negocio</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="highSeasonMonths">Meses de Temporada Alta</Label>
                  <Input 
                    id="highSeasonMonths"
                    value={formData.highSeasonMonths || ''} 
                    onChange={(e) => updateFormData('highSeasonMonths', e.target.value)}
                    placeholder="Ej: Enero, Febrero, Diciembre"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="highSeasonAmount">Ventas Temporada Alta Q</Label>
                  <CurrencyInput
                    id="highSeasonAmount"
                    value={formData.highSeasonAmount || ''}
                    onValueChange={(value) => updateFormData('highSeasonAmount', value)}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lowSeasonMonths">Meses de Temporada Baja</Label>
                  <Input 
                    id="lowSeasonMonths"
                    value={formData.lowSeasonMonths || ''} 
                    onChange={(e) => updateFormData('lowSeasonMonths', e.target.value)}
                    placeholder="Ej: Marzo, Abril, Mayo"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lowSeasonAmount">Ventas Temporada Baja Q</Label>
                  <CurrencyInput
                    id="lowSeasonAmount"
                    value={formData.lowSeasonAmount || ''}
                    onValueChange={(value) => updateFormData('lowSeasonAmount', value)}
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>
          </div>
        );
      }

      // Substep 2: Administrative expenses
      if (internalSubStep === 2) {
        return (
          <div className="space-y-4">
            <h4 className="font-medium">Gastos Administrativos Mensuales</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bonuses">Bonificaciones Q</Label>
                <CurrencyInput
                  id="bonuses"
                  value={formData.bonuses || ''}
                  onValueChange={(value) => updateFormData('bonuses', value)}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="salaries">Sueldos Q</Label>
                <CurrencyInput
                  id="salaries"
                  value={formData.salaries || ''}
                  onValueChange={(value) => updateFormData('salaries', value)}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rent">Alquiler Q</Label>
                <CurrencyInput
                  id="rent"
                  value={formData.rent || ''}
                  onValueChange={(value) => updateFormData('rent', value)}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="utilities">Servicios Q</Label>
                <CurrencyInput
                  id="utilities"
                  value={formData.utilities || ''}
                  onValueChange={(value) => updateFormData('utilities', value)}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="transport">Transporte Q</Label>
                <CurrencyInput
                  id="transport"
                  value={formData.transport || ''}
                  onValueChange={(value) => updateFormData('transport', value)}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="otherExpenses">Otros Gastos Q</Label>
                <CurrencyInput
                  id="otherExpenses"
                  value={formData.otherExpenses || ''}
                  onValueChange={(value) => updateFormData('otherExpenses', value)}
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>
        );
      }

      // Substep 3: Business analysis
      if (internalSubStep === 3) {
        return (
          <TooltipProvider>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h4 className="font-medium">Análisis del Negocio (para uso exclusivo del agente de créditos)</h4>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Esta sección es únicamente para el análisis interno del agente de créditos</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="incomeRisks">Riesgo de Ingresos</Label>
                  <p className="text-xs text-muted-foreground">
                    Describa los principales factores que podrían afectar negativamente los ingresos del negocio, como estacionalidad, competencia, cambios en el mercado, etc.
                  </p>
                  <Textarea 
                    id="incomeRisks"
                    value={formData.incomeRisks || ''} 
                    onChange={(e) => updateFormData('incomeRisks', e.target.value)}
                    placeholder="Ejemplo: El negocio depende de temporadas altas navideñas, existe competencia directa en la zona..."
                    rows={3}
                    minLength={20}
                    maxLength={500}
                  />
                  <div className="text-xs text-muted-foreground">
                    {(formData.incomeRisks || '').length}/500 caracteres
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="opportunities">Oportunidades</Label>
                  <p className="text-xs text-muted-foreground">
                    Identifique las oportunidades de crecimiento, expansión o mejora que tiene el negocio a corto y mediano plazo.
                  </p>
                  <Textarea 
                    id="opportunities"
                    value={formData.opportunities || ''} 
                    onChange={(e) => updateFormData('opportunities', e.target.value)}
                    placeholder="Ejemplo: Posibilidad de abrir sucursal, incorporar nuevos productos, mejorar procesos..."
                    rows={3}
                    minLength={20}
                    maxLength={500}
                  />
                  <div className="text-xs text-muted-foreground">
                    {(formData.opportunities || '').length}/500 caracteres
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="riskMitigation">Mitigación de Riesgos</Label>
                  <p className="text-xs text-muted-foreground">
                    Describa las estrategias que el solicitante tiene o podría implementar para reducir los riesgos identificados.
                  </p>
                  <Textarea 
                    id="riskMitigation"
                    value={formData.riskMitigation || ''} 
                    onChange={(e) => updateFormData('riskMitigation', e.target.value)}
                    placeholder="Ejemplo: Diversificar productos, buscar nuevos canales de venta, mantener inventario de seguridad..."
                    rows={3}
                    minLength={20}
                    maxLength={500}
                  />
                  <div className="text-xs text-muted-foreground">
                    {(formData.riskMitigation || '').length}/500 caracteres
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="marketEvaluation">Evaluación del Mercado</Label>
                  <p className="text-xs text-muted-foreground">
                    Analice el mercado en el que opera: demanda, competencia, ubicación, potencial de crecimiento del sector.
                  </p>
                  <Textarea 
                    id="marketEvaluation"
                    value={formData.marketEvaluation || ''} 
                    onChange={(e) => updateFormData('marketEvaluation', e.target.value)}
                    placeholder="Ejemplo: Mercado con demanda estable, ubicación estratégica, competencia moderada..."
                    rows={3}
                    minLength={20}
                    maxLength={500}
                  />
                  <div className="text-xs text-muted-foreground">
                    {(formData.marketEvaluation || '').length}/500 caracteres
                  </div>
                </div>
              </div>
            </div>
          </TooltipProvider>
        );
      }
    }

    // Default fallback
    return (
      <div className="space-y-4">
        <Label className="text-base font-medium">Tipo de Solicitante</Label>
        <RadioGroup 
          value={applicantType} 
          onValueChange={setApplicantType}
          className="flex flex-col space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="asalariado" id="asalariado" />
            <Label htmlFor="asalariado">Asalariado</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="negocio_propio" id="negocio_propio" />
            <Label htmlFor="negocio_propio">Negocio Propio</Label>
          </div>
        </RadioGroup>
      </div>
    );
  };

  return (
    <Card className="border-0 shadow-none">
      <CardContent className="p-0 space-y-6">
        <div>
          <h3 className="font-semibold text-lg">Negocio y Perfil Económico</h3>
          <p className="text-muted-foreground text-sm">
            Información detallada sobre la actividad económica del solicitante.
          </p>
        </div>

        {renderTabsHeader()}
        {renderSubStepContent()}
        {renderSubStepNavigation()}
      </CardContent>
    </Card>
  );
};

export default BusinessEconomicProfile;
