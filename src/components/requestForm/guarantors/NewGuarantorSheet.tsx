import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';

interface GuarantorData {
  nombre: string;
  dpi: string;
  telefono: string;
  parentesco: string;
  salario: string;
  tipoEmpleo: string;
  empresa: string;
}

interface NewGuarantorSheetProps {
  trigger: React.ReactNode;
  onCreateGuarantor: (guarantor: GuarantorData) => void;
  onDiscard: () => void;
}

export const NewGuarantorSheet: React.FC<NewGuarantorSheetProps> = ({
  trigger,
  onCreateGuarantor,
  onDiscard
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<GuarantorData>({
    nombre: '',
    dpi: '',
    telefono: '',
    parentesco: '',
    salario: '',
    tipoEmpleo: '',
    empresa: ''
  });

  const handleInputChange = (field: keyof GuarantorData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    if (formData.nombre && formData.dpi && formData.telefono && formData.parentesco) {
      onCreateGuarantor(formData);
      setFormData({
        nombre: '',
        dpi: '',
        telefono: '',
        parentesco: '',
        salario: '',
        tipoEmpleo: '',
        empresa: ''
      });
      setIsOpen(false);
    }
  };

  const handleDiscard = () => {
    setFormData({
      nombre: '',
      dpi: '',
      telefono: '',
      parentesco: '',
      salario: '',
      tipoEmpleo: '',
      empresa: ''
    });
    setIsOpen(false);
    onDiscard();
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {trigger}
      </SheetTrigger>
      <SheetContent side="bottom" className="max-h-[90vh] overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle>Agregar Fiador</SheetTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDiscard}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>
        
        <div className="space-y-4 mt-6">
          <div>
            <Label htmlFor="nombre">Nombre Completo *</Label>
            <Input
              id="nombre"
              value={formData.nombre}
              onChange={(e) => handleInputChange('nombre', e.target.value)}
              placeholder="Ingrese el nombre completo"
            />
          </div>

          <div>
            <Label htmlFor="dpi">DPI *</Label>
            <Input
              id="dpi"
              value={formData.dpi}
              onChange={(e) => handleInputChange('dpi', e.target.value)}
              placeholder="1234567890123"
            />
          </div>

          <div>
            <Label htmlFor="telefono">Teléfono *</Label>
            <Input
              id="telefono"
              value={formData.telefono}
              onChange={(e) => handleInputChange('telefono', e.target.value)}
              placeholder="12345678"
            />
          </div>

          <div>
            <Label htmlFor="parentesco">Parentesco *</Label>
            <Select value={formData.parentesco} onValueChange={(value) => handleInputChange('parentesco', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione parentesco" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="padre">Padre</SelectItem>
                <SelectItem value="madre">Madre</SelectItem>
                <SelectItem value="hermano">Hermano/a</SelectItem>
                <SelectItem value="hijo">Hijo/a</SelectItem>
                <SelectItem value="conyuge">Cónyuge</SelectItem>
                <SelectItem value="amigo">Amigo/a</SelectItem>
                <SelectItem value="otro">Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="salario">Salario Aproximado</Label>
            <Input
              id="salario"
              type="number"
              value={formData.salario}
              onChange={(e) => handleInputChange('salario', e.target.value)}
              placeholder="5000"
            />
          </div>

          <div>
            <Label htmlFor="tipoEmpleo">Tipo de Empleo</Label>
            <Select value={formData.tipoEmpleo} onValueChange={(value) => handleInputChange('tipoEmpleo', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione tipo de empleo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asalariado">Asalariado</SelectItem>
                <SelectItem value="independiente">Independiente</SelectItem>
                <SelectItem value="comerciante">Comerciante</SelectItem>
                <SelectItem value="jubilado">Jubilado</SelectItem>
                <SelectItem value="otro">Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="empresa">Empresa</Label>
            <Input
              id="empresa"
              value={formData.empresa}
              onChange={(e) => handleInputChange('empresa', e.target.value)}
              placeholder="Nombre de la empresa"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={handleDiscard}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!formData.nombre || !formData.dpi || !formData.telefono || !formData.parentesco}
              className="flex-1 bg-[#E18E33] hover:bg-[#E18E33]/90 text-white border-0"
            >
              Agregar Fiador
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};