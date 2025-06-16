
import React, { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { X } from 'lucide-react';
import { PrequalificationData, evaluatePrequalification, formatCurrency } from '@/utils/prequalificationEngine';
import { validateDPI, formatDPI, validatePhone } from '@/utils/dpiValidation';
import PrequalificationResult from './PrequalificationResult';

interface PrequalificationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PrequalificationModal: React.FC<PrequalificationModalProps> = ({ open, onOpenChange }) => {
  const [formData, setFormData] = useState<PrequalificationData>({
    nombre_completo: '',
    dpi: '',
    telefono: '',
    actividad_economica: '',
    ingreso_mensual: 0,
    destino_credito: '',
    monto_solicitado: 0,
    historial: ''
  });

  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const actividadesEconomicas = [
    { value: 'formal', label: 'Comercio formal' },
    { value: 'informal', label: 'Comercio informal' },
    { value: 'agricultura', label: 'Agricultura' },
    { value: 'ganaderia', label: 'Ganadería' },
    { value: 'servicios', label: 'Servicios' },
    { value: 'artesania', label: 'Artesanía' },
    { value: 'transporte', label: 'Transporte' },
    { value: 'construccion', label: 'Construcción' },
    { value: 'desempleado', label: 'Desempleado' }
  ];

  const destinosCredito = [
    { value: 'capital de trabajo', label: 'Capital de trabajo' },
    { value: 'vivienda', label: 'Vivienda' },
    { value: 'educación', label: 'Educación' },
    { value: 'salud', label: 'Salud' },
    { value: 'vehículo', label: 'Vehículo' },
    { value: 'gastos personales', label: 'Gastos personales' },
    { value: 'pago de préstamo informal', label: 'Pago de préstamo informal' },
    { value: 'otros', label: 'Otros' }
  ];

  const historialOptions = [
    { value: 'bueno', label: 'Bueno (sin moras)' },
    { value: 'regular', label: 'Regular (moras anteriores)' },
    { value: 'bloqueado', label: 'Bloqueado/Mora activa' },
    { value: 'nuevo', label: 'Cliente nuevo' }
  ];

  const handleInputChange = (field: keyof PrequalificationData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre_completo.trim()) {
      newErrors.nombre_completo = 'El nombre es requerido';
    }

    const dpiValidation = validateDPI(formData.dpi);
    if (!dpiValidation.isValid) {
      newErrors.dpi = dpiValidation.error || 'DPI inválido';
    }

    const phoneValidation = validatePhone(formData.telefono);
    if (!phoneValidation.isValid) {
      newErrors.telefono = phoneValidation.error || 'Teléfono inválido';
    }

    if (!formData.actividad_economica) {
      newErrors.actividad_economica = 'Seleccione una actividad económica';
    }

    if (formData.ingreso_mensual <= 0) {
      newErrors.ingreso_mensual = 'El ingreso debe ser mayor a cero';
    }

    if (!formData.destino_credito) {
      newErrors.destino_credito = 'Seleccione el destino del crédito';
    }

    if (formData.monto_solicitado <= 0) {
      newErrors.monto_solicitado = 'El monto debe ser mayor a cero';
    }

    if (!formData.historial) {
      newErrors.historial = 'Seleccione el historial con la cooperativa';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEvaluate = () => {
    if (!validateForm()) return;

    const evaluationResult = evaluatePrequalification(formData);
    setResult(evaluationResult);
    setShowResult(true);
  };

  const handleReset = () => {
    setFormData({
      nombre_completo: '',
      dpi: '',
      telefono: '',
      actividad_economica: '',
      ingreso_mensual: 0,
      destino_credito: '',
      monto_solicitado: 0,
      historial: ''
    });
    setShowResult(false);
    setResult(null);
    setErrors({});
  };

  const handleClose = () => {
    handleReset();
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[85vh] overflow-hidden flex flex-col">
        <SheetHeader className="text-left pb-4 border-b flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle>Precalificación Rápida</SheetTitle>
              <SheetDescription>
                Complete los datos básicos para evaluar la elegibilidad del cliente
              </SheetDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          {!showResult ? (
            <div className="space-y-4 p-1">
              <div className="space-y-2">
                <Label htmlFor="nombre_completo">Nombre completo *</Label>
                <Input
                  id="nombre_completo"
                  value={formData.nombre_completo}
                  onChange={(e) => handleInputChange('nombre_completo', e.target.value)}
                  placeholder="Ingrese el nombre completo"
                />
                {errors.nombre_completo && (
                  <p className="text-sm text-red-500">{errors.nombre_completo}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="dpi">DPI *</Label>
                <Input
                  id="dpi"
                  value={formatDPI(formData.dpi)}
                  onChange={(e) => handleInputChange('dpi', e.target.value.replace(/[\s-]/g, ''))}
                  placeholder="0000 00000 0000"
                  maxLength={17}
                />
                {errors.dpi && (
                  <p className="text-sm text-red-500">{errors.dpi}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono *</Label>
                <Input
                  id="telefono"
                  value={formData.telefono}
                  onChange={(e) => handleInputChange('telefono', e.target.value.replace(/\D/g, ''))}
                  placeholder="12345678"
                  maxLength={8}
                />
                {errors.telefono && (
                  <p className="text-sm text-red-500">{errors.telefono}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Actividad económica *</Label>
                <Select
                  value={formData.actividad_economica}
                  onValueChange={(value) => handleInputChange('actividad_economica', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione la actividad" />
                  </SelectTrigger>
                  <SelectContent>
                    {actividadesEconomicas.map((actividad) => (
                      <SelectItem key={actividad.value} value={actividad.value}>
                        {actividad.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.actividad_economica && (
                  <p className="text-sm text-red-500">{errors.actividad_economica}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="ingreso_mensual">Ingreso mensual aproximado *</Label>
                <Input
                  id="ingreso_mensual"
                  type="number"
                  value={formData.ingreso_mensual || ''}
                  onChange={(e) => handleInputChange('ingreso_mensual', parseFloat(e.target.value) || 0)}
                  placeholder="2000"
                />
                {errors.ingreso_mensual && (
                  <p className="text-sm text-red-500">{errors.ingreso_mensual}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Destino del crédito *</Label>
                <Select
                  value={formData.destino_credito}
                  onValueChange={(value) => handleInputChange('destino_credito', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione el destino" />
                  </SelectTrigger>
                  <SelectContent>
                    {destinosCredito.map((destino) => (
                      <SelectItem key={destino.value} value={destino.value}>
                        {destino.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.destino_credito && (
                  <p className="text-sm text-red-500">{errors.destino_credito}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="monto_solicitado">Monto solicitado *</Label>
                <Input
                  id="monto_solicitado"
                  type="number"
                  value={formData.monto_solicitado || ''}
                  onChange={(e) => handleInputChange('monto_solicitado', parseFloat(e.target.value) || 0)}
                  placeholder="5000"
                />
                {errors.monto_solicitado && (
                  <p className="text-sm text-red-500">{errors.monto_solicitado}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Historial con la cooperativa *</Label>
                <Select
                  value={formData.historial}
                  onValueChange={(value) => handleInputChange('historial', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione el historial" />
                  </SelectTrigger>
                  <SelectContent>
                    {historialOptions.map((historial) => (
                      <SelectItem key={historial.value} value={historial.value}>
                        {historial.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.historial && (
                  <p className="text-sm text-red-500">{errors.historial}</p>
                )}
              </div>
            </div>
          ) : (
            <PrequalificationResult
              data={formData}
              result={result}
              onStartApplication={() => {
                // TODO: Integrar con formulario principal
                console.log('Iniciar solicitud con datos:', formData);
                handleClose();
              }}
              onSaveAsProspect={() => {
                // TODO: Integrar con sistema de prospectos
                console.log('Guardar como prospecto:', formData);
                handleClose();
              }}
              onBack={() => setShowResult(false)}
              onClose={handleClose}
            />
          )}
        </div>

        {!showResult && (
          <div className="flex-shrink-0 border-t pt-4">
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleClose} className="flex-1">
                Cancelar
              </Button>
              <Button onClick={handleEvaluate} className="flex-1">
                Evaluar
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default PrequalificationModal;
