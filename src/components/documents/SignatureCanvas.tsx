
import React, { useRef, useEffect, useState, useCallback } from 'react';
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
  const [lastPoint, setLastPoint] = useState<{x: number, y: number} | null>(null);

  const initializeCanvas = useCallback(() => {
    if (!open || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    
    // Scale context for high DPI displays
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    
    // Set canvas style size
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    
    // Configure drawing context
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, [open]);

  useEffect(() => {
    initializeCanvas();
  }, [initializeCanvas]);

  const getEventPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0]?.clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0]?.clientY : e.clientY;
    
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width) / window.devicePixelRatio,
      y: (clientY - rect.top) * (canvas.height / rect.height) / window.devicePixelRatio
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDrawing(true);
    setHasSignature(true);
    
    const pos = getEventPos(e);
    setLastPoint(pos);
    
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
      }
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing || !lastPoint) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const pos = getEventPos(e);
    
    ctx.beginPath();
    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    
    setLastPoint(pos);
  };

  const stopDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDrawing(false);
    setLastPoint(null);
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
          clearSignature();
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
              className="border border-gray-300 rounded cursor-crosshair w-full h-40 touch-none"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
            />
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Firme en el área de arriba usando el mouse o toque
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
