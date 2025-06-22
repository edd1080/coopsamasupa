
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2, HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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

  useEffect(() => {
    updateFormData('products', products);
  }, [products, updateFormData]);

  useEffect(() => {
    updateFormData('applicantType', applicantType);
  }, [applicantType, updateFormData]);

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

  return (
    <Card className="border-0 shadow-none">
      <CardContent className="p-0 space-y-6">
        <div>
          <h3 className="font-semibold text-lg">Negocio y Perfil Económico</h3>
          <p className="text-muted-foreground text-sm">
            Información detallada sobre la actividad económica del solicitante.
          </p>
        </div>

        <div className="space-y-6">
          {/* Tipo de Solicitante - Radio Button */}
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

          {/* Show business fields only if "Negocio Propio" is selected */}
          {applicantType === 'negocio_propio' && (
            <>
              {/* Nombre del Negocio - Moved to top */}
              <div className="space-y-2">
                <Label htmlFor="businessName">Nombre del Negocio *</Label>
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
                    type="number"
                    min="0"
                    value={formData.experienceYears || ''} 
                    onChange={(e) => updateFormData('experienceYears', e.target.value)}
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

              {/* Ventas Mensuales */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cashSales">Ventas Mensuales de Contado Q *</Label>
                  <Input 
                    id="cashSales"
                    type="number"
                    min="0"
                    value={formData.cashSales || ''} 
                    onChange={(e) => updateFormData('cashSales', e.target.value)}
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="creditSales">Ventas Mensuales a Crédito Q *</Label>
                  <Input 
                    id="creditSales"
                    type="number"
                    min="0"
                    value={formData.creditSales || ''} 
                    onChange={(e) => updateFormData('creditSales', e.target.value)}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <Separator />

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
                              type="number"
                              min="0"
                              value={product.quantity}
                              onChange={(e) => updateProduct(product.id, 'quantity', parseFloat(e.target.value) || 0)}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Precio Unitario Q *</Label>
                            <Input 
                              type="number"
                              min="0"
                              step="0.01"
                              value={product.price}
                              onChange={(e) => updateProduct(product.id, 'price', parseFloat(e.target.value) || 0)}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Total Q</Label>
                            <Input 
                              type="number"
                              value={product.total}
                              readOnly
                              className="bg-muted"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Utilidad Q</Label>
                            <Input 
                              type="number"
                              min="0"
                              step="0.01"
                              value={product.profit}
                              onChange={(e) => updateProduct(product.id, 'profit', parseFloat(e.target.value) || 0)}
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
                    <Input 
                      id="highSeasonAmount"
                      type="number"
                      min="0"
                      value={formData.highSeasonAmount || ''} 
                      onChange={(e) => updateFormData('highSeasonAmount', e.target.value)}
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
                    <Input 
                      id="lowSeasonAmount"
                      type="number"
                      min="0"
                      value={formData.lowSeasonAmount || ''} 
                      onChange={(e) => updateFormData('lowSeasonAmount', e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Gastos Administrativos */}
              <div className="space-y-4">
                <h4 className="font-medium">Gastos Administrativos Mensuales</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bonuses">Bonificaciones Q</Label>
                    <Input 
                      id="bonuses"
                      type="number"
                      min="0"
                      value={formData.bonuses || ''} 
                      onChange={(e) => updateFormData('bonuses', e.target.value)}
                      placeholder="0.00"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="salaries">Sueldos Q</Label>
                    <Input 
                      id="salaries"
                      type="number"
                      min="0"
                      value={formData.salaries || ''} 
                      onChange={(e) => updateFormData('salaries', e.target.value)}
                      placeholder="0.00"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rent">Alquiler Q</Label>
                    <Input 
                      id="rent"
                      type="number"
                      min="0"
                      value={formData.rent || ''} 
                      onChange={(e) => updateFormData('rent', e.target.value)}
                      placeholder="0.00"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="utilities">Servicios Q</Label>
                    <Input 
                      id="utilities"
                      type="number"
                      min="0"
                      value={formData.utilities || ''} 
                      onChange={(e) => updateFormData('utilities', e.target.value)}
                      placeholder="0.00"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="transport">Transporte Q</Label>
                    <Input 
                      id="transport"
                      type="number"
                      min="0"
                      value={formData.transport || ''} 
                      onChange={(e) => updateFormData('transport', e.target.value)}
                      placeholder="0.00"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="otherExpenses">Otros Gastos Q</Label>
                    <Input 
                      id="otherExpenses"
                      type="number"
                      min="0"
                      value={formData.otherExpenses || ''} 
                      onChange={(e) => updateFormData('otherExpenses', e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Análisis Cualitativo */}
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
                      <Label htmlFor="incomeRisks">Riesgo de Ingresos *</Label>
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
                      <Label htmlFor="opportunities">Oportunidades *</Label>
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
                      <Label htmlFor="riskMitigation">Mitigación de Riesgos *</Label>
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
                      <Label htmlFor="marketEvaluation">Evaluación del Mercado *</Label>
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
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BusinessEconomicProfile;
