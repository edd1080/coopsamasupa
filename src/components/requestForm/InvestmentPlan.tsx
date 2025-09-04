import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Trash2, Edit, Plus, Calculator, DollarSign } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { useToast } from '@/hooks/use-toast';

interface InvestmentPlanItem {
  id: string;
  quantity: string;
  unit: string;
  description: string;
  unitPrice: string;
  total: string;
}

interface InvestmentPlanProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

const InvestmentPlan: React.FC<InvestmentPlanProps> = ({ formData, updateFormData }) => {
  const { toast } = useToast();
  
  // Form state for adding/editing items
  const [currentItem, setCurrentItem] = useState<Omit<InvestmentPlanItem, 'id' | 'total'>>({
    quantity: '',
    unit: '',
    description: '',
    unitPrice: ''
  });
  
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);

  // Get investment plan items from form data
  const investmentItems: InvestmentPlanItem[] = formData.investmentPlanItems || [];

  // Calculate total from current form inputs
  const calculateItemTotal = (quantity: string, unitPrice: string): string => {
    const qty = parseFloat(quantity) || 0;
    const price = parseFloat(unitPrice) || 0;
    return (qty * price).toFixed(2);
  };

  // Calculate current item total
  const currentItemTotal = useMemo(() => {
    return calculateItemTotal(currentItem.quantity, currentItem.unitPrice);
  }, [currentItem.quantity, currentItem.unitPrice]);

  // Calculate overall total
  const overallTotal = useMemo(() => {
    return investmentItems.reduce((sum, item) => sum + parseFloat(item.total || '0'), 0);
  }, [investmentItems]);

  // Update investment plan total in form data
  React.useEffect(() => {
    updateFormData('investmentPlanTotal', overallTotal.toFixed(2));
    updateFormData('requestedAmount', overallTotal.toFixed(2));
  }, [overallTotal, updateFormData]);

  // Validate form fields
  React.useEffect(() => {
    const isValid = 
      currentItem.quantity.trim() !== '' &&
      currentItem.unit.trim() !== '' &&
      currentItem.description.trim() !== '' &&
      currentItem.unitPrice.trim() !== '' &&
      parseFloat(currentItem.quantity) > 0 &&
      parseFloat(currentItem.unitPrice) > 0;
    
    setIsFormValid(isValid);
  }, [currentItem]);

  // Handle input changes
  const handleInputChange = (field: keyof typeof currentItem, value: string) => {
    if (field === 'quantity' || field === 'unitPrice') {
      // Only allow numeric values with decimals
      const numericValue = value.replace(/[^0-9.]/g, '');
      setCurrentItem(prev => ({ ...prev, [field]: numericValue }));
    } else {
      setCurrentItem(prev => ({ ...prev, [field]: value }));
    }
  };

  // Add or update item
  const handleAddOrUpdateItem = () => {
    if (!isFormValid) {
      toast({
        title: "Campos Incompletos",
        description: "Por favor complete todos los campos antes de agregar el ítem.",
        variant: "destructive"
      });
      return;
    }

    const newItem: InvestmentPlanItem = {
      id: editingIndex !== null ? investmentItems[editingIndex].id : Date.now().toString(),
      ...currentItem,
      total: currentItemTotal
    };

    let updatedItems: InvestmentPlanItem[];
    
    if (editingIndex !== null) {
      // Update existing item
      updatedItems = investmentItems.map((item, index) => 
        index === editingIndex ? newItem : item
      );
      setEditingIndex(null);
    } else {
      // Add new item
      updatedItems = [...investmentItems, newItem];
    }

    updateFormData('investmentPlanItems', updatedItems);

    // Reset form
    setCurrentItem({
      quantity: '',
      unit: '',
      description: '',
      unitPrice: ''
    });

    toast({
      title: editingIndex !== null ? "Ítem Actualizado" : "Ítem Agregado",
      description: `El ítem "${newItem.description}" ha sido ${editingIndex !== null ? 'actualizado' : 'agregado'} exitosamente.`,
    });
  };

  // Edit item
  const handleEditItem = (index: number) => {
    const item = investmentItems[index];
    setCurrentItem({
      quantity: item.quantity,
      unit: item.unit,
      description: item.description,
      unitPrice: item.unitPrice
    });
    setEditingIndex(index);
  };

  // Delete item
  const handleDeleteItem = (index: number) => {
    const itemToDelete = investmentItems[index];
    const updatedItems = investmentItems.filter((_, i) => i !== index);
    updateFormData('investmentPlanItems', updatedItems);
    
    // Reset editing if we're editing the deleted item
    if (editingIndex === index) {
      setEditingIndex(null);
      setCurrentItem({
        quantity: '',
        unit: '',
        description: '',
        unitPrice: ''
      });
    }

    toast({
      title: "Ítem Eliminado",
      description: `El ítem "${itemToDelete.description}" ha sido eliminado.`,
    });
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingIndex(null);
    setCurrentItem({
      quantity: '',
      unit: '',
      description: '',
      unitPrice: ''
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Calculator className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">Plan de Inversión</h2>
      </div>
      
      <p className="text-muted-foreground">
        Detalle cómo será utilizado el dinero solicitado, desglosado en ítems individuales.
      </p>

      {/* Read-only applicant data */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">Datos del Solicitante</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-xs text-muted-foreground">Solicitante</Label>
              <p className="font-medium">
                {[formData.firstName, formData.secondName, formData.firstLastName, formData.secondLastName]
                  .filter(Boolean).join(' ') || 'No especificado'}
              </p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Destino</Label>
              <p className="font-medium">{formData.creditPurpose || 'No especificado'}</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Lugar de la Inversión</Label>
              <p className="font-medium">
                {[formData.investmentPlaceDepartment, formData.investmentPlaceMunicipality]
                  .filter(Boolean).join(', ') || 'No especificado'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form for adding/editing items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            {editingIndex !== null ? 'Editar Ítem' : 'Agregar Ítem de Inversión'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Cantidad *</Label>
              <Input
                id="quantity"
                type="text"
                placeholder="Ej: 100"
                value={currentItem.quantity}
                onChange={(e) => handleInputChange('quantity', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unidad de Medida *</Label>
              <Input
                id="unit"
                placeholder="Ej: quintales, cabezas, unidades"
                value={currentItem.unit}
                onChange={(e) => handleInputChange('unit', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción *</Label>
            <Input
              id="description"
              placeholder="Ej: Compra de semillas de maíz"
              value={currentItem.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="unitPrice">Precio Unitario (Q) *</Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                  Q
                </span>
                <Input
                  id="unitPrice"
                  className="pl-7"
                  type="text"
                  placeholder="0.00"
                  value={currentItem.unitPrice}
                  onChange={(e) => handleInputChange('unitPrice', e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Total</Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                  Q
                </span>
                <Input
                  className="pl-7 bg-muted"
                  value={formatCurrency(currentItemTotal)}
                  readOnly
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button 
              onClick={handleAddOrUpdateItem}
              disabled={!isFormValid}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              {editingIndex !== null ? 'Actualizar Plan' : 'Agregar Plan'}
            </Button>
            {editingIndex !== null && (
              <Button 
                variant="outline" 
                onClick={handleCancelEdit}
              >
                Cancelar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Items table */}
      {investmentItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Ítems del Plan de Inversión</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No.</TableHead>
                  <TableHead>Cantidad</TableHead>
                  <TableHead>Unidad</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Precio Unitario</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {investmentItems.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.unit}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>Q {formatCurrency(item.unitPrice)}</TableCell>
                    <TableCell>Q {formatCurrency(item.total)}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditItem(index)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteItem(index)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Totals section */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-lg font-medium">TOTAL:</span>
            <span className="text-xl font-bold text-primary">Q {formatCurrency(overallTotal)}</span>
          </div>
          <Separator className="my-2" />
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium">Monto Solicitado:</span>
            <span className="text-xl font-bold">Q {formatCurrency(overallTotal)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Validation message */}
      {investmentItems.length === 0 && (
        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-destructive">
              <DollarSign className="h-4 w-4" />
              <span className="text-sm">
                Debe agregar al menos un ítem a su plan de inversión para continuar.
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InvestmentPlan;