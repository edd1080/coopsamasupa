import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AlertTriangle, XCircle } from 'lucide-react';

// Función para mapear códigos de error específicos
const getSpecificErrorMessage = (errorMessage: string): string => {
  // Extraer código de error del mensaje
  const errorCodeMatch = errorMessage.match(/código de error: (Erx\d+)/i);
  const errorCode = errorCodeMatch ? errorCodeMatch[1] : null;
  
  // Mapear códigos específicos
  const errorMappings: Record<string, string> = {
    'Erx001': 'Error en el guardado del plan de pagos',
    'Erx002': 'Error en el guardado del análisis financiero', 
    'Erx003': 'Error en alguno de los registros de las fuentes de ingreso',
    'Erx004': 'Error en la información adicional',
    'Erx005': 'Error en el guardado de la solicitud de crédito',
    'Erx006': 'Error en el guardado del balance patrimonial',
    'Erx007': 'Error en la calificación del asociado',
    'Erx008': 'Error al guardar las referencias personales y comerciales',
    'Erx009': 'Error al guardar el plan de inversión',
    'Erx010': 'Error al guardar la información del cliente'
  };
  
  if (errorCode && errorMappings[errorCode]) {
    return `${errorMappings[errorCode]} (${errorCode})`;
  }
  
  // Si no se encuentra el código específico, devolver el mensaje original
  return errorMessage;
};

interface CoopsamaErrorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  errorMessage: string;
  onRetry: () => void;
  onGoToApplications: () => void;
}

const CoopsamaErrorDialog: React.FC<CoopsamaErrorDialogProps> = ({
  open,
  onOpenChange,
  errorMessage,
  onRetry,
  onGoToApplications,
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-[500px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Error en el Envío a Coopsama
          </AlertDialogTitle>
          <AlertDialogDescription className="text-left">
            <div className="space-y-3">
              <div>
                La solicitud no pudo ser procesada correctamente por el sistema de Coopsama. 
                Por favor, revisa los detalles del error y corrige la información necesaria.
              </div>
              
              {/* Error message from Coopsama */}
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                <div className="text-sm text-destructive font-medium">
                  <strong>Detalle del error:</strong>
                </div>
                <div className="text-sm text-destructive mt-1">
                  {getSpecificErrorMessage(errorMessage)}
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground">
                Puedes corregir la información en el formulario y volver a intentar el envío, 
                o regresar a la lista de solicitudes.
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between">
          <AlertDialogAction
            onClick={onGoToApplications}
            className="w-full sm:w-auto bg-muted text-muted-foreground hover:bg-muted/80"
          >
            <XCircle className="mr-2 h-4 w-4" />
            Regresar a Solicitudes
          </AlertDialogAction>
          <AlertDialogAction
            onClick={onRetry}
            className="w-full sm:w-auto"
          >
            Corregir y Reintentar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CoopsamaErrorDialog;
