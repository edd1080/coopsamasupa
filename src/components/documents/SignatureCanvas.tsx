
import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RotateCcw, Check, X } from 'lucide-react';

interface SignatureCanvasProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (signature: File) => void;
}

const SignatureCanvas: React.FC<SignatureCanvasProps> = ({
  open,
  onOpenChange,
  onSave
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  useEffect(() => {
    if (open && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Configurar canvas
        canvas.width = 400;
        canvas.height = 200;
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }
  }, [open]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    setHasSignature(true);
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.beginPath();
        ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
      }
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        ctx.stroke();
      }
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        setHasSignature(false);
      }
    }
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (canvas && hasSignature) {
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `signature_${Date.now()}.png`, { type: 'image/png' });
          onSave(file);
          onOpenChange(false);
        }
      }, 'image/png');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Firma Digital</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="border-2 border-dashed border-muted-foreground/30 rounded-md p-4">
            <canvas
              ref={canvasRef}
              className="border border-gray-300 rounded cursor-crosshair w-full"
              style={{ maxWidth: '100%', height: 'auto' }}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
            />
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Firme en el área de arriba usando el mouse o touch
            </p>
          </div>
          
          <div className="flex justify-between gap-3">
            <Button 
              variant="outline" 
              onClick={clearSignature}
              disabled={!hasSignature}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Limpiar
            </Button>
            
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                onClick={() => onOpenChange(false)}
              >
                <X className="mr-2 h-4 w-4" />
                Cancelar
              </Button>
              <Button 
                onClick={saveSignature}
                disabled={!hasSignature}
              >
                <Check className="mr-2 h-4 w-4" />
                Guardar Firma
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SignatureCanvas;
