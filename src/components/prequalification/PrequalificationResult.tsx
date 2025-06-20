
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, AlertCircle, XCircle, ArrowLeft, FileSpreadsheet, UserPlus } from 'lucide-react';
import { PrequalificationData, PrequalificationResult as Result, formatCurrency } from '@/utils/prequalificationEngine';
import { useCreatePrequalification } from '@/hooks/useSupabaseQuery';
import { useToast } from '@/hooks/use-toast';

interface PrequalificationResultProps {
  data: PrequalificationData;
  result: Result;
  onStartApplication: () => void;
  onSaveAsProspect: () => void;
  onBack: () => void;
  onClose: () => void;
}

const PrequalificationResult: React.FC<PrequalificationResultProps> = ({
  data,
  result,
  onStartApplication,
  onSaveAsProspect,
  onBack,
  onClose
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const createPrequalificationMutation = useCreatePrequalification();

  const getStatusIcon = () => {
    switch (result.status) {
      case 'green':
        return <CheckCircle className="h-16 w-16 text-green-500" />;
      case 'yellow':
        return <AlertCircle className="h-16 w-16 text-yellow-500" />;
      case 'red':
        return <XCircle className="h-16 w-16 text-red-500" />;
    }
  };

  const getStatusTitle = () => {
    switch (result.status) {
      case 'green':
        return 'Precalificación Aprobada';
      case 'yellow':
        return 'Precalificación Condicional';
      case 'red':
        return 'Precalificación Rechazada';
    }
  };

  const getStatusDescription = () => {
    switch (result.status) {
      case 'green':
        return 'El cliente cumple con los criterios básicos para iniciar una solicitud de crédito.';
      case 'yellow':
        return 'El cliente puede proceder, pero se requiere información adicional durante la evaluación.';
      case 'red':
        return 'El cliente no cumple con los criterios mínimos. Se recomienda almacenar como prospecto para seguimiento futuro.';
    }
  };

  const getStatusColor = () => {
    switch (result.status) {
      case 'green':
        return 'bg-green-50 border-green-200';
      case 'yellow':
        return 'bg-yellow-50 border-yellow-200';
      case 'red':
        return 'bg-red-50 border-red-200';
    }
  };

  const handleSaveAndProceed = async (action: 'application' | 'prospect') => {
    try {
      // Guardar la precalificación en Supabase
      const prequalificationData = {
        ...data,
        result: result
      };

      await createPrequalificationMutation.mutateAsync(prequalificationData);
      
      toast({
        title: "Precalificación guardada",
        description: "Los datos se han guardado correctamente",
        duration: 3000
      });

      if (action === 'application') {
        // Navegar al formulario de solicitud
        navigate('/applications/new');
      } else {
        // Cerrar modal y mostrar mensaje de prospecto guardado
        toast({
          title: "Prospecto guardado",
          description: "El cliente ha sido guardado como prospecto para seguimiento futuro",
          duration: 3000
        });
        onClose();
      }
    } catch (error) {
      console.error('Error saving prequalification:', error);
      toast({
        title: "Error al guardar",
        description: "No se pudo guardar la precalificación. Inténtalo de nuevo.",
        variant: "destructive",
        duration: 3000
      });
    }
  };

  return (
    <div className="space-y-6 mt-6">
      <Button
        variant="ghost"
        onClick={onBack}
        className="flex items-center gap-2 mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al formulario
      </Button>

      <Card className={`${getStatusColor()} border-2`}>
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              {getStatusIcon()}
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-2">{getStatusTitle()}</h3>
              <p className="text-muted-foreground mb-4">{getStatusDescription()}</p>
              <p className="text-sm font-medium bg-white/50 p-3 rounded-lg">
                {result.reason}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h4 className="font-medium mb-3">Resumen de datos</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Cliente:</span>
              <span className="font-medium">{data.nombre_completo}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ingreso mensual:</span>
              <span className="font-medium">{formatCurrency(data.ingreso_mensual)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Monto solicitado:</span>
              <span className="font-medium">{formatCurrency(data.monto_solicitado)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Relación monto/ingreso:</span>
              <span className="font-medium">{(data.monto_solicitado / data.ingreso_mensual).toFixed(1)}x</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Destino:</span>
              <span className="font-medium capitalize">{data.destino_credito}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {result.canProceed && (
          <Button
            onClick={() => handleSaveAndProceed('application')}
            className="w-full flex items-center gap-2"
            disabled={createPrequalificationMutation.isPending}
          >
            <FileSpreadsheet className="h-4 w-4" />
            {result.requiresAdditionalData 
              ? 'Iniciar Solicitud (Requiere datos adicionales)'
              : 'Iniciar Solicitud de Crédito'
            }
          </Button>
        )}

        <Button
          variant="outline"
          onClick={() => handleSaveAndProceed('prospect')}
          className="w-full flex items-center gap-2"
          disabled={createPrequalificationMutation.isPending}
        >
          <UserPlus className="h-4 w-4" />
          Guardar como Prospecto
        </Button>

        <Button
          variant="ghost"
          onClick={onClose}
          className="w-full"
        >
          Cerrar
        </Button>
      </div>
    </div>
  );
};

export default PrequalificationResult;
