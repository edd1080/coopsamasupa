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
import { AlertTriangle, XCircle, Info } from 'lucide-react';
import { getErrorInfo, formatErrorMessage, getRecommendedAction } from '@/utils/errorMapping';

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
  const errorInfo = getErrorInfo(errorMessage);
  const formattedMessage = formatErrorMessage(errorMessage);
  const recommendedAction = getRecommendedAction(errorMessage);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-[500px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Error en el Envío a Coopsama
          </AlertDialogTitle>
          <AlertDialogDescription className="text-left">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                La solicitud no pudo ser procesada correctamente por el sistema de Coopsama. 
                Por favor, revisa los detalles del error y corrige la información necesaria.
              </p>
              
              {/* Error message from Coopsama */}
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-2">
                  <XCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                  <div className="space-y-2">
                    <p className="text-sm text-destructive font-medium">
                      {formattedMessage}
                    </p>
                    {errorInfo && (
                      <div className="text-xs text-destructive/80">
                        <span className="font-medium">Categoría:</span> {errorInfo.category}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Recommended action */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-blue-800 mb-1">
                        Acción recomendada:
                      </p>
                      <p className="text-xs text-blue-700">
                        {recommendedAction}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground">
                Puedes corregir la información en el formulario y volver a intentar el envío, 
                o regresar a la lista de solicitudes.
              </p>
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
