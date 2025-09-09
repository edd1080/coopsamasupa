
import React from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { AlertTriangle } from 'lucide-react';

interface MinimumDataAlertProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContinue: () => void;
}

const MinimumDataAlert: React.FC<MinimumDataAlertProps> = ({
  open,
  onOpenChange,
  onContinue
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Información mínima requerida
          </AlertDialogTitle>
          <AlertDialogDescription>
            Para guardar el progreso de la solicitud, es necesario ingresar como mínimo:
            <br />
            • Nombre completo del solicitante (mínimo 2 caracteres)
            <br />
            • DPI (Documento Personal de Identificación) completo
            <br />
            <br />
            Por favor, complete estos campos antes de continuar.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onContinue}>
            Entendido
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default MinimumDataAlert;
