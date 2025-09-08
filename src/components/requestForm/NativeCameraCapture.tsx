import React from 'react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Button } from '@/components/ui/button';
import { Camera as CameraIcon, Upload, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NativeCameraCaptureProps {
  onPhotoCapture: (file: File) => void;
  onFileUpload: () => void;
  onCancel: () => void;
  documentTitle: string;
}

const NativeCameraCapture: React.FC<NativeCameraCaptureProps> = ({
  onPhotoCapture,
  onFileUpload,
  onCancel,
  documentTitle
}) => {
  const { toast } = useToast();

  const isNativeAvailable = () => {
    return typeof window !== 'undefined' && 
           (window as any).Capacitor && 
           (window as any).Capacitor.Plugins && 
           (window as any).Capacitor.Plugins.Camera;
  };

  const takePicture = async () => {
    try {
      if (!isNativeAvailable()) {
        toast({
          title: "Cámara no disponible",
          description: "Use la función de subir archivo en su lugar.",
          variant: "destructive"
        });
        return;
      }

      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
      });

      if (image.dataUrl) {
        // Convert data URL to File
        const response = await fetch(image.dataUrl);
        const blob = await response.blob();
        const file = new File([blob], `photo_${Date.now()}.jpg`, { type: 'image/jpeg' });
        
        onPhotoCapture(file);
        
        toast({
          title: "Foto capturada",
          description: "La foto se ha tomado exitosamente.",
          variant: "success"
        });
      }
    } catch (error) {
      console.error('Error taking picture:', error);
      toast({
        title: "Error de cámara",
        description: "No se pudo tomar la foto. Intente de nuevo.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="p-6 space-y-4">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">{documentTitle}</h3>
        <p className="text-sm text-muted-foreground">
          Seleccione una opción para agregar el documento
        </p>
      </div>

      <div className="space-y-3">
        <Button
          onClick={takePicture}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          size="lg"
        >
          <CameraIcon className="w-5 h-5 mr-2" />
          Tomar Fotografía
        </Button>

        <Button
          onClick={onFileUpload}
          variant="outline"
          className="w-full"
          size="lg"
        >
          <Upload className="w-5 h-5 mr-2" />
          Subir Archivo
        </Button>

        <Button
          onClick={onCancel}
          variant="ghost"
          className="w-full"
        >
          <X className="w-4 h-4 mr-2" />
          Cancelar
        </Button>
      </div>
    </div>
  );
};

export default NativeCameraCapture;