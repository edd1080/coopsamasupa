
import React, { useState } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { AlertTriangle } from "lucide-react";
import { useCancelApplication } from '@/hooks/useApplicationActions';

interface CancelApplicationBottomSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  applicationId: string;
  clientName: string;
}

const CancelApplicationBottomSheet: React.FC<CancelApplicationBottomSheetProps> = ({
  open,
  onOpenChange,
  applicationId,
  clientName
}) => {
  const [reason, setReason] = useState('');
  const [comments, setComments] = useState('');
  const cancelMutation = useCancelApplication();

  const handleCancel = () => {
    if (!reason) return;
    
    const fullReason = comments ? `${reason}: ${comments}` : reason;
    cancelMutation.mutate(
      { applicationId, reason: fullReason },
      {
        onSuccess: () => {
          onOpenChange(false);
          setReason('');
          setComments('');
        }
      }
    );
  };

  const handleClose = () => {
    onOpenChange(false);
    setReason('');
    setComments('');
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[70vh]">
        <SheetHeader className="text-left">
          <SheetTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Cancelar Solicitud
          </SheetTitle>
          <SheetDescription>
            ¿Por qué deseas cancelar la solicitud de {clientName}?
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6 space-y-6">
          <div>
            <Label className="text-base font-medium">Motivo de cancelación</Label>
            <RadioGroup value={reason} onValueChange={setReason} className="mt-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Cliente no responde" id="no-response" />
                <Label htmlFor="no-response">Cliente no responde</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Documentación incompleta" id="incomplete-docs" />
                <Label htmlFor="incomplete-docs">Documentación incompleta</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Cliente desistió" id="client-withdrew" />
                <Label htmlFor="client-withdrew">Cliente desistió</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="No cumple requisitos" id="requirements" />
                <Label htmlFor="requirements">No cumple con los requisitos</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Otro" id="other" />
                <Label htmlFor="other">Otro motivo</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="comments" className="text-base font-medium">
              Comentarios adicionales (opcional)
            </Label>
            <Textarea
              id="comments"
              placeholder="Agrega más detalles sobre la cancelación..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="mt-2"
              rows={3}
            />
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <Button
            variant="outline"
            onClick={handleClose}
            className="flex-1"
            disabled={cancelMutation.isPending}
          >
            Volver
          </Button>
          <Button
            onClick={handleCancel}
            disabled={!reason || cancelMutation.isPending}
            className="flex-1 bg-orange-500 hover:bg-orange-600"
          >
            {cancelMutation.isPending ? "Cancelando..." : "Confirmar cancelación"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CancelApplicationBottomSheet;
