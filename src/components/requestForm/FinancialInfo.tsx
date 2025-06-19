import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { PlusCircle, MinusCircle, Upload, DollarSign, Calendar, Store, Package, TrendingUp, Calculator, PieChart } from 'lucide-react';

// Import the new components
import FinancialAnalysis from './FinancialAnalysis';
import PatrimonialStatement from './PatrimonialStatement';

interface FinancialInfoProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

const months = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const FinancialInfo: React.FC<FinancialInfoProps> = ({ formData, updateFormData }) => {
  const [activeScreen, setActiveScreen] = useState('financial-analysis');
  const [products, setProducts] = useState<any[]>(formData.products || [{ 
    name: '', 
    unit: '', 
    quantity: '', 
    price: '',
    total: '',
    profit: ''
  }]);
  const [selectedBestMonths, setSelectedBestMonths] = useState<string[]>(formData.bestMonths || []);
  const [selectedWorstMonths, setSelectedWorstMonths] = useState<string[]>(formData.worstMonths || []);
  
  // Visible screens array - only showing first 2 tabs
  const visibleScreens = [
    { id: 'financial-analysis', name: 'Análisis Financiero', icon: <Calculator className="w-4 h-4 mr-2" /> },
    { id: 'patrimonial-statement', name: 'Estado Patrimonial', icon: <PieChart className="w-4 h-4 mr-2" /> }
  ];
  
  const calculateTotal = (index: number) => {
    const product = products[index];
    if (product.quantity && product.price) {
      const total = Number(product.quantity) * Number(product.price);
      const updatedProducts = [...products];
      updatedProducts[index].total = total.toString();
      setProducts(updatedProducts);
      updateFormData('products', updatedProducts);
    }
  };
  
  const addProduct = () => {
    if (products.length < 10) {
      setProducts([...products, { 
        name: '', 
        unit: '', 
        quantity: '', 
        price: '',
        total: '',
        profit: ''
      }]);
    }
  };
  
  const removeProduct = (index: number) => {
    if (products.length > 1) {
      const updatedProducts = [...products];
      updatedProducts.splice(index, 1);
      setProducts(updatedProducts);
      updateFormData('products', updatedProducts);
    }
  };
  
  const updateProduct = (index: number, field: string, value: string) => {
    const updatedProducts = [...products];
    updatedProducts[index][field] = value;
    setProducts(updatedProducts);
    updateFormData('products', updatedProducts);
    
    // Calculate total when quantity or price changes
    if (field === 'quantity' || field === 'price') {
      calculateTotal(index);
    }
  };
  
  const toggleBestMonth = (month: string) => {
    if (selectedBestMonths.includes(month)) {
      const updated = selectedBestMonths.filter(m => m !== month);
      setSelectedBestMonths(updated);
      updateFormData('bestMonths', updated);
    } else if (selectedBestMonths.length < 6) {
      const updated = [...selectedBestMonths, month];
      setSelectedBestMonths(updated);
      updateFormData('bestMonths', updated);
    }
  };
  
  const toggleWorstMonth = (month: string) => {
    if (selectedWorstMonths.includes(month)) {
      const updated = selectedWorstMonths.filter(m => m !== month);
      setSelectedWorstMonths(updated);
      updateFormData('worstMonths', updated);
    } else if (selectedWorstMonths.length < 6) {
      const updated = [...selectedWorstMonths, month];
      setSelectedWorstMonths(updated);
      updateFormData('worstMonths', updated);
    }
  };
  
  // CSS styles for hide-scrollbar
  const hideScrollbarStyle = {
    msOverflowStyle: 'none',
    scrollbarWidth: 'none',
    '::-webkit-scrollbar': {
      display: 'none'
    }
  } as React.CSSProperties;

  return (
    <div className="space-y-6">
      {/* Screen Navigation - Now showing only visible screens */}
      <div className="flex overflow-x-auto pb-2 -mx-1" style={hideScrollbarStyle}>
        {visibleScreens.map((screen) => (
          <button
            key={screen.id}
            onClick={() => setActiveScreen(screen.id)}
            className={`
              mr-2 px-4 py-2 rounded-lg flex items-center whitespace-nowrap text-sm font-medium transition-colors
              ${activeScreen === screen.id ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-muted/50 hover:bg-muted'}
            `}
          >
            {screen.icon}
            {screen.name}
          </button>
        ))}
      </div>
      
      <Separator />
      
      {/* Financial Analysis Screen */}
      {activeScreen === 'financial-analysis' && (
        <FinancialAnalysis formData={formData} updateFormData={updateFormData} />
      )}
      
      {/* Patrimonial Statement Screen */}
      {activeScreen === 'patrimonial-statement' && (
        <PatrimonialStatement formData={formData} updateFormData={updateFormData} />
      )}
      
      {/* Business Information Screen */}
      {activeScreen === 'business-info' && (
        <div className="space-y-5">
          <h3 className="text-lg font-semibold flex items-center">
            <Store className="mr-2 h-5 w-5" />
            Información General del Negocio
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="businessName">Nombre del negocio</Label>
              <Input 
                id="businessName" 
                placeholder="Ingrese el nombre del negocio"
                value={formData.businessName || ''}
                onChange={(e) => updateFormData('businessName', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="businessAddress">Dirección del negocio</Label>
              <Input 
                id="businessAddress" 
                placeholder="Ingrese la dirección del negocio"
                value={formData.businessAddress || ''}
                onChange={(e) => updateFormData('businessAddress', e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="monthlySales">Total de ventas mensuales</Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                  Q
                </span>
                <Input 
                  id="monthlySales" 
                  className="pl-7"
                  type="number"
                  placeholder="0.00"
                  value={formData.monthlySales || ''}
                  onChange={(e) => updateFormData('monthlySales', e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cashSales">Ventas al contado</Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                  Q
                </span>
                <Input 
                  id="cashSales" 
                  className="pl-7"
                  type="number"
                  placeholder="0.00"
                  value={formData.cashSales || ''}
                  onChange={(e) => updateFormData('cashSales', e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="creditSales">Ventas al crédito</Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                  Q
                </span>
                <Input 
                  id="creditSales" 
                  className="pl-7"
                  type="number"
                  placeholder="0.00"
                  value={formData.creditSales || ''}
                  onChange={(e) => updateFormData('creditSales', e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <div className="pt-4 flex justify-end">
            <Button 
              onClick={() => setActiveScreen('products')}
              className="flex items-center gap-1"
            >
              Siguiente: Productos
              <TrendingUp className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
      
      {/* Products Screen */}
      {activeScreen === 'products' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center">
              <Package className="mr-2 h-5 w-5" />
              Productos Principales
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={addProduct}
              disabled={products.length >= 10}
              className="flex items-center gap-1"
            >
              <PlusCircle className="h-4 w-4 mr-1" />
              Agregar producto ({products.length}/10)
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Ingrese los productos principales de su negocio (máximo 10 productos).
          </p>
          
          {products.map((product, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Producto {index + 1}</h4>
                  {products.length > 1 && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeProduct(index)}
                      className="text-destructive hover:text-destructive flex items-center"
                    >
                      <MinusCircle className="h-4 w-4 mr-1" />
                      Eliminar
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`product-name-${index}`}>Nombre del producto</Label>
                    <Input 
                      id={`product-name-${index}`}
                      value={product.name}
                      onChange={(e) => updateProduct(index, 'name', e.target.value)}
                      placeholder="Ej: Maíz, Frijol, etc."
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`product-unit-${index}`}>Unidad de medida</Label>
                    <Input 
                      id={`product-unit-${index}`}
                      value={product.unit}
                      onChange={(e) => updateProduct(index, 'unit', e.target.value)}
                      placeholder="Ej: libras, cajas, quintales, etc."
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`product-quantity-${index}`}>Cantidad del producto</Label>
                    <Input 
                      id={`product-quantity-${index}`}
                      type="number"
                      value={product.quantity}
                      onChange={(e) => updateProduct(index, 'quantity', e.target.value)}
                      placeholder="Cantidad"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`product-price-${index}`}>Precio de venta por unidad (Q)</Label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                        Q
                      </span>
                      <Input 
                        id={`product-price-${index}`}
                        className="pl-7"
                        type="number"
                        value={product.price}
                        onChange={(e) => updateProduct(index, 'price', e.target.value)}
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`product-total-${index}`}>Total mensual vendido en Q</Label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                        Q
                      </span>
                      <Input 
                        id={`product-total-${index}`}
                        className="pl-7"
                        type="number"
                        value={product.total}
                        onChange={(e) => updateProduct(index, 'total', e.target.value)}
                        placeholder="0.00"
                        readOnly={Boolean(product.quantity && product.price)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`product-profit-${index}`}>Utilidad bruta aproximada</Label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                        Q
                      </span>
                      <Input 
                        id={`product-profit-${index}`}
                        className="pl-7"
                        type="number"
                        value={product.profit}
                        onChange={(e) => updateProduct(index, 'profit', e.target.value)}
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          <div className="pt-4 flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => setActiveScreen('business-info')}
            >
              Atrás
            </Button>
            <Button 
              onClick={() => setActiveScreen('seasonality')}
            >
              Siguiente: Estacionalidad
            </Button>
          </div>
        </div>
      )}
      
      {/* Seasonality Screen */}
      {activeScreen === 'seasonality' && (
        <div className="space-y-5">
          <h3 className="text-lg font-semibold flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Estacionalidad
          </h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-base">Mejores meses de venta (Seleccione entre 2 y 6 meses)</Label>
              <p className="text-sm text-muted-foreground mb-2">
                Seleccionados: {selectedBestMonths.length}/6
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {months.map((month) => (
                  <Button
                    key={month}
                    type="button"
                    variant={selectedBestMonths.includes(month) ? "default" : "outline"}
                    className={`h-auto py-2 px-3 ${
                      selectedBestMonths.includes(month) ? "bg-primary text-primary-foreground" : ""
                    } ${
                      selectedBestMonths.length >= 6 && !selectedBestMonths.includes(month) 
                        ? "opacity-50 cursor-not-allowed" 
                        : ""
                    }`}
                    onClick={() => toggleBestMonth(month)}
                    disabled={selectedBestMonths.length >= 6 && !selectedBestMonths.includes(month)}
                  >
                    {month}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label className="text-base">Peores meses de venta (Seleccione entre 2 y 6 meses)</Label>
              <p className="text-sm text-muted-foreground mb-2">
                Seleccionados: {selectedWorstMonths.length}/6
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {months.map((month) => (
                  <Button
                    key={month}
                    type="button"
                    variant={selectedWorstMonths.includes(month) ? "destructive" : "outline"}
                    className={`h-auto py-2 px-3 ${
                      selectedWorstMonths.length >= 6 && !selectedWorstMonths.includes(month) 
                        ? "opacity-50 cursor-not-allowed" 
                        : ""
                    }`}
                    onClick={() => toggleWorstMonth(month)}
                    disabled={selectedWorstMonths.length >= 6 && !selectedWorstMonths.includes(month)}
                  >
                    {month}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="bestMonthsAmount">Monto en sus mejores meses</Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                  Q
                </span>
                <Input 
                  id="bestMonthsAmount" 
                  className="pl-7"
                  type="number"
                  placeholder="0.00"
                  value={formData.bestMonthsAmount || ''}
                  onChange={(e) => updateFormData('bestMonthsAmount', e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="worstMonthsAmount">Monto en sus peores meses</Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                  Q
                </span>
                <Input 
                  id="worstMonthsAmount" 
                  className="pl-7"
                  type="number"
                  placeholder="0.00"
                  value={formData.worstMonthsAmount || ''}
                  onChange={(e) => updateFormData('worstMonthsAmount', e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-2 mt-4">
            <div className="flex items-start space-x-3">
              <Checkbox 
                id="attachProductPhoto" 
                checked={formData.attachProductPhoto || false}
                onCheckedChange={(checked) => updateFormData('attachProductPhoto', checked)}
              />
              <div className="grid gap-1.5 leading-none">
                <Label htmlFor="attachProductPhoto" className="text-base font-medium">
                  Desea adjuntar una foto del producto (opcional)
                </Label>
              </div>
            </div>
            
            {formData.attachProductPhoto && (
              <Button variant="outline" className="mt-2 flex items-center">
                <Upload className="w-4 h-4 mr-2" />
                Seleccionar archivo
              </Button>
            )}
          </div>
          
          <div className="pt-4 flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => setActiveScreen('products')}
            >
              Atrás
            </Button>
            <Button 
              onClick={() => setActiveScreen('expenses')}
            >
              Siguiente: Gastos
            </Button>
          </div>
        </div>
      )}
      
      {/* Expenses Screen */}
      {activeScreen === 'expenses' && (
        <div className="space-y-5">
          <h3 className="text-lg font-semibold flex items-center">
            <DollarSign className="mr-2 h-5 w-5" />
            Gastos Administrativos
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
            <div className="space-y-2">
              <Label htmlFor="bonuses">Bonos y aguinaldos</Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                  Q
                </span>
                <Input 
                  id="bonuses" 
                  className="pl-7"
                  type="number"
                  placeholder="0.00"
                  value={formData.bonuses || ''}
                  onChange={(e) => updateFormData('bonuses', e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ownerSalary">Sueldo del empresario</Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                  Q
                </span>
                <Input 
                  id="ownerSalary" 
                  className="pl-7"
                  type="number"
                  placeholder="0.00"
                  value={formData.ownerSalary || ''}
                  onChange={(e) => updateFormData('ownerSalary', e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="adminSalary">Sueldo de administración</Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                  Q
                </span>
                <Input 
                  id="adminSalary" 
                  className="pl-7"
                  type="number"
                  placeholder="0.00"
                  value={formData.adminSalary || ''}
                  onChange={(e) => updateFormData('adminSalary', e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="localRent">¿Cuánto paga por alquiler de local?</Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                  Q
                </span>
                <Input 
                  id="localRent" 
                  className="pl-7"
                  type="number"
                  placeholder="0.00"
                  value={formData.localRent || ''}
                  onChange={(e) => updateFormData('localRent', e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="electricity">¿Cuánto paga por energía eléctrica?</Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                  Q
                </span>
                <Input 
                  id="electricity" 
                  className="pl-7"
                  type="number"
                  placeholder="0.00"
                  value={formData.electricity || ''}
                  onChange={(e) => updateFormData('electricity', e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="telecom">¿Cuánto paga por teléfono/internet?</Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                  Q
                </span>
                <Input 
                  id="telecom" 
                  className="pl-7"
                  type="number"
                  placeholder="0.00"
                  value={formData.telecom || ''}
                  onChange={(e) => updateFormData('telecom', e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="water">¿Cuánto paga por agua?</Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                  Q
                </span>
                <Input 
                  id="water" 
                  className="pl-7"
                  type="number"
                  placeholder="0.00"
                  value={formData.water || ''}
                  onChange={(e) => updateFormData('water', e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="transport">Cuanto paga por fletes/combustible</Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                  Q
                </span>
                <Input 
                  id="transport" 
                  className="pl-7"
                  type="number"
                  placeholder="0.00"
                  value={formData.transport || ''}
                  onChange={(e) => updateFormData('transport', e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="otherExpenses">Otros gastos</Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                  Q
                </span>
                <Input 
                  id="otherExpenses" 
                  className="pl-7"
                  type="number"
                  placeholder="0.00"
                  value={formData.otherExpenses || ''}
                  onChange={(e) => updateFormData('otherExpenses', e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <div className="pt-4 mt-4 border-t">
            <div className="space-y-2">
              <Label htmlFor="totalExpenses" className="text-base font-medium">¿Cuál es el total de gastos de administración?</Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground font-medium">
                  Q
                </span>
                <Input 
                  id="totalExpenses" 
                  className="pl-7 font-medium text-lg"
                  type="number"
                  placeholder="0.00"
                  value={formData.totalExpenses || ''}
                  onChange={(e) => updateFormData('totalExpenses', e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <div className="pt-4 flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => setActiveScreen('seasonality')}
            >
              Atrás
            </Button>
            <Button>
              Guardar información financiera
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialInfo;
