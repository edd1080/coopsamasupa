
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { XCircle, Save, AlertTriangle } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import MinimumDataAlert from './MinimumDataAlert';
import { useApplicationValidation } from '@/hooks/useDraftActions';

interface ExitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExit: (save: boolean) => void;
  hasUnsavedChanges?: boolean;
  formData?: any;
}

const ExitDialog: React.FC<ExitDialogProps> = ({ 
  open, 
  onOpenChange, 
  onExit, 
  hasUnsavedChanges = false,
  formData = {}
}) => {
  const [showMinimumDataAlert, setShowMinimumDataAlert] = useState(false);
  const { validateMinimumRequiredData } = useApplicationValidation();

  const handleExitWithSave = () => {
    const validation = validateMinimumRequiredData(formData);
    
    if (!validation.isValid) {
      setShowMinimumDataAlert(true);
      return;
    }
    
    onExit(true);
  };

  const handleExitWithoutSave = () => {
    onExit(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {hasUnsavedChanges && <AlertTriangle className="h-5 w-5 text-amber-500" />}
              ¿Desea salir de la solicitud?
            </DialogTitle>
            <DialogDescription>
              {hasUnsavedChanges ? (
                "Tienes cambios sin guardar. Puedes guardar tu progreso para continuar más tarde o salir sin guardar."
              ) : (
                "Puede guardar su progreso actual para continuar más tarde o salir sin guardar."
              )}
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleExitWithoutSave}
              className="w-full sm:w-auto"
            >
              <XCircle className="mr-2 h-4 w-4" />
              Salir sin guardar
            </Button>
            <Button 
              type="button"
              onClick={handleExitWithSave}
              className="w-full sm:w-auto"
            >
              <Save className="mr-2 h-4 w-4" />
              Guardar y salir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <MinimumDataAlert
        open={showMinimumDataAlert}
        onOpenChange={setShowMinimumDataAlert}
        onContinue={() => setShowMinimumDataAlert(false)}
      />
    </>
  );
};

export default ExitDialog;
