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
import SubformHeader from '@/components/forms/SubformHeader';
import { Store, Package, TrendingUp, Calendar } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  unit: string;
  quantity: number;
  price: number;
  total: number;
  profit: number;
  bestMonths: string[];
  worstMonths: string[];
}

interface BusinessEconomicProfileProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

const months = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

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
    if (applicantType === 'asalariado') {
      setInternalSubStep(0);
    }
  }, [applicantType, updateFormData]);

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

  useEffect(() => {
    if (applicantType === 'negocio_propio') {
      setTimeout(centerActiveTab, 100);
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
      profit: 0,
      bestMonths: [],
      worstMonths: []
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
        if (field === 'quantity' || field === 'price') {
          updated.total = updated.quantity * updated.price;
        }
        return updated;
      }
      return p;
    }));
  };

  const toggleMonth = (productId: string, month: string, type: 'best' | 'worst') => {
    setProducts(products.map(product => {
      if (product.id === productId) {
        const currentArray = type === 'best' ? product.bestMonths : product.worstMonths;
        const maxSelection = 3;
        
        if (currentArray.includes(month)) {
          return {
            ...product,
            [type === 'best' ? 'bestMonths' : 'worstMonths']: currentArray.filter(m => m !== month)
          };
        } else if (currentArray.length < maxSelection) {
          return {
            ...product,
            [type === 'best' ? 'bestMonths' : 'worstMonths']: [...currentArray, month]
          };
        }
      }
      return product;
    }));
  };

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
            className="w-full overflow-x-auto hide-scrollbar bg-transparent p-1 gap-2"
          >
            <TabsTrigger value="0" className="flex-shrink-0 px-4 py-2 rounded-full">
              Info general
            </TabsTrigger>
            <TabsTrigger value="1" className="flex-shrink-0 px-4 py-2 rounded-full">
              Productos
            </TabsTrigger>
            <TabsTrigger value="2" className="flex-shrink-0 px-4 py-2 rounded-full">
              Gastos administrativos
            </TabsTrigger>
            <TabsTrigger value="3" className="flex-shrink-0 px-4 py-2 rounded-full">
              Análisis del negocio
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    );
  };

  const renderSubStepContent = () => {
    if (!applicantType || applicantType === 'asalariado') {
      return (
        <div className="space-y-4">
          <Label className="text-base font-medium">Tipo de Solicitante *</Label>
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
      if (internalSubStep === 0) {
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label className="text-base font-medium">Tipo de Solicitante *</Label>
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

            <div className="space-y-2">
              <Label htmlFor="businessName">Nombre del Negocio *</Label>
              <Input 
                id="businessName"
                value={formData.businessName || ''} 
                onChange={(e) => updateFormData('businessName', e.target.value)}
                placeholder="Nombre comercial del negocio"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="activityType">Tipo de Actividad *</Label>
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
                <Label htmlFor="experienceYears">Años de Experiencia *</Label>
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
              <Label htmlFor="businessAddress">Dirección del Negocio *</Label>
              <Textarea 
                id="businessAddress"
                value={formData.businessAddress || ''} 
                onChange={(e) => updateFormData('businessAddress', e.target.value)}
                placeholder="Dirección completa del negocio"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cashSales">Ventas Mensuales de Contado Q *</Label>
                <CurrencyInput
                  id="cashSales"
                  value={formData.cashSales || ''}
                  onValueChange={(value) => updateFormData('cashSales', value)}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="creditSales">Ventas Mensuales a Crédito Q *</Label>
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

      if (internalSubStep === 1) {
        return (
          <div className="space-y-6">
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
                          <Label>Nombre *</Label>
                          <Input 
                            value={product.name}
                            onChange={(e) => updateProduct(product.id, 'name', e.target.value)}
                            placeholder="Nombre del producto"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Unidad *</Label>
                          <Input 
                            value={product.unit}
                            onChange={(e) => updateProduct(product.id, 'unit', e.target.value)}
                            placeholder="kg, unidad, litro, etc."
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Cantidad *</Label>
                          <Input 
                            type="text"
                            inputMode="decimal"
                            pattern="[0-9]*\.?[0-9]*"
                            value={product.quantity}
                            onChange={(e) => updateProduct(product.id, 'quantity', parseFloat(normalizeDecimalInput(e.target.value)) || 0)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Precio Unitario Q *</Label>
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
                            onValueChange={() => {}}
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

                      {/* Product-specific seasonality */}
                      <div className="space-y-4 border-t pt-4">
                        <h6 className="font-medium text-sm">Estacionalidad - {product.name || `Producto ${index + 1}`}</h6>
                        
                        <div className="space-y-3">
                          <div>
                            <Label className="text-sm">Mejores meses (máximo 3)</Label>
                            <p className="text-xs text-muted-foreground mb-2">
                              Seleccionados: {product.bestMonths.length}/3
                            </p>
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-1">
                              {months.map((month) => (
                                <Button
                                  key={month}
                                  type="button"
                                  variant={product.bestMonths.includes(month) ? "default" : "outline"}
                                  size="sm"
                                  className={`h-8 px-2 text-xs ${
                                    product.bestMonths.includes(month) ? "bg-primary text-primary-foreground" : ""
                                  } ${
                                    product.bestMonths.length >= 3 && !product.bestMonths.includes(month) 
                                      ? "opacity-50 cursor-not-allowed" 
                                      : ""
                                  }`}
                                  onClick={() => toggleMonth(product.id, month, 'best')}
                                  disabled={product.bestMonths.length >= 3 && !product.bestMonths.includes(month)}
                                >
                                  {month.slice(0, 3)}
                                </Button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <Label className="text-sm">Peores meses (máximo 3)</Label>
                            <p className="text-xs text-muted-foreground mb-2">
                              Seleccionados: {product.worstMonths.length}/3
                            </p>
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-1">
                              {months.map((month) => (
                                <Button
                                  key={month}
                                  type="button"
                                  variant={product.worstMonths.includes(month) ? "destructive" : "outline"}
                                  size="sm"
                                  className={`h-8 px-2 text-xs ${
                                    product.worstMonths.length >= 3 && !product.worstMonths.includes(month) 
                                      ? "opacity-50 cursor-not-allowed" 
                                      : ""
                                  }`}
                                  onClick={() => toggleMonth(product.id, month, 'worst')}
                                  disabled={product.worstMonths.length >= 3 && !product.worstMonths.includes(month)}
                                >
                                  {month.slice(0, 3)}
                                </Button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      }

      if (internalSubStep === 2) {
        return (
          <div className="space-y-6">
            <SubformHeader
              icon={<TrendingUp className="h-5 w-5" />}
              title="Gastos Administrativos Mensuales"
              subtitle="Complete los gastos administrativos mensuales de su negocio"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bonificaciones">Bonificaciones Q</Label>
                <CurrencyInput
                  id="bonificaciones"
                  value={formData.bonificaciones || ''}
                  onValueChange={(value) => updateFormData('bonificaciones', value)}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sueldos">Sueldos Q</Label>
                <CurrencyInput
                  id="sueldos"
                  value={formData.sueldos || ''}
                  onValueChange={(value) => updateFormData('sueldos', value)}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="alquiler">Alquiler Q</Label>
                <CurrencyInput
                  id="alquiler"
                  value={formData.alquiler || ''}
                  onValueChange={(value) => updateFormData('alquiler', value)}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="servicios">Servicios Q</Label>
                <CurrencyInput
                  id="servicios"
                  value={formData.servicios || ''}
                  onValueChange={(value) => updateFormData('servicios', value)}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="transporte">Transporte Q</Label>
                <CurrencyInput
                  id="transporte"
                  value={formData.transporte || ''}
                  onValueChange={(value) => updateFormData('transporte', value)}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="otrosGastos">Otros Gastos Q</Label>
                <CurrencyInput
                  id="otrosGastos"
                  value={formData.otrosGastos || ''}
                  onValueChange={(value) => updateFormData('otrosGastos', value)}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="space-y-2">
                <Label className="text-base font-medium">Total Gastos Administrativos</Label>
                <div className="text-2xl font-bold text-primary">
                  Q {(
                    parseFloat(formData.bonificaciones || '0') +
                    parseFloat(formData.sueldos || '0') +
                    parseFloat(formData.alquiler || '0') +
                    parseFloat(formData.servicios || '0') +
                    parseFloat(formData.transporte || '0') +
                    parseFloat(formData.otrosGastos || '0')
                  ).toLocaleString('es-GT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
            </div>
          </div>
        );
      }

      if (internalSubStep === 3) {
        return (
          <div className="space-y-6">
            <SubformHeader
              icon={<TrendingUp className="h-5 w-5" />}
              title="Análisis del Negocio"
              subtitle="Evaluación integral del negocio para determinar viabilidad crediticia"
            />

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="riesgoIngresos" className="flex items-center gap-2">
                  Riesgo de Ingresos
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Evalúe los factores que podrían afectar los ingresos del negocio</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <Textarea 
                  id="riesgoIngresos"
                  value={formData.riesgoIngresos || ''} 
                  onChange={(e) => updateFormData('riesgoIngresos', e.target.value)}
                  placeholder="Describa los principales riesgos que podrían afectar los ingresos"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="oportunidades" className="flex items-center gap-2">
                  Oportunidades
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Identifique oportunidades de crecimiento para el negocio</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <Textarea 
                  id="oportunidades"
                  value={formData.oportunidades || ''} 
                  onChange={(e) => updateFormData('oportunidades', e.target.value)}
                  placeholder="Describa las oportunidades de crecimiento identificadas"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mitigacionRiesgos" className="flex items-center gap-2">
                  Mitigación de Riesgos
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Describa las estrategias para mitigar los riesgos identificados</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <Textarea 
                  id="mitigacionRiesgos"
                  value={formData.mitigacionRiesgos || ''} 
                  onChange={(e) => updateFormData('mitigacionRiesgos', e.target.value)}
                  placeholder="Estrategias propuestas para reducir riesgos"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="evaluacionMercado" className="flex items-center gap-2">
                  Evaluación del Mercado
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Analice las condiciones actuales del mercado objetivo</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <Textarea 
                  id="evaluacionMercado"
                  value={formData.evaluacionMercado || ''} 
                  onChange={(e) => updateFormData('evaluacionMercado', e.target.value)}
                  placeholder="Análisis del mercado objetivo y competencia"
                  rows={3}
                />
              </div>
            </div>
          </div>
        );
      }
    }

    return null;
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Main header for the entire section - always shown first */}
      <SubformHeader
        icon={<Store className="h-5 w-5" />}
        title="Negocio y Perfil Económico"
        subtitle={applicantType === 'negocio_propio' 
          ? "Complete toda la información relacionada con su negocio" 
          : "Seleccione el tipo de solicitante para continuar"}
      />
      
      {/* Tabs only shown for business type */}
      {renderTabsHeader()}
      
      {/* Content */}
      {renderSubStepContent()}
    </div>
  );
};

export default BusinessEconomicProfile;