import React from 'react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Button } from '@/components/ui/button';
import { Camera as CameraIcon, Upload, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAndroidPermissions } from '@/hooks/useAndroidPermissions';

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
  const { permissions, requestCameraPermission } = useAndroidPermissions();

  const isNativeAvailable = () => {
    return typeof window !== 'undefined' && 
           (window as any).Capacitor && 
           (window as any).Capacitor.Plugins && 
           (window as any).Capacitor.Plugins.Camera;
  };

  const takePicture = async () => {
    try {
      console.log('📸 Starting camera capture...');
      
      if (!isNativeAvailable()) {
        console.warn('⚠️ Native camera not available, falling back to file upload');
        toast({
          title: "Cámara no disponible",
          description: "Use la función de subir archivo en su lugar.",
          variant: "destructive"
        });
        return;
      }

      // Verificar y solicitar permisos de cámara
      if (!permissions.camera) {
        console.log('📱 Soliciting camera permission...');
        const granted = await requestCameraPermission();
        if (!granted) {
          toast({
            title: "Permiso de cámara requerido",
            description: "Necesita permitir el acceso a la cámara para tomar fotos.",
            variant: "destructive"
          });
          return;
        }
      }

      console.log('📷 Native camera available, taking picture...');
      
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
      });

      console.log('📸 Camera response received:', { hasDataUrl: !!image.dataUrl, format: image.format });

      if (image.dataUrl) {
        console.log('🔄 Converting data URL to File...');
        
        // Convert data URL to File
        const response = await fetch(image.dataUrl);
        const blob = await response.blob();
        const file = new File([blob], `photo_${Date.now()}.jpg`, { type: 'image/jpeg' });
        
        console.log('✅ File created successfully:', { fileName: file.name, fileSize: file.size, fileType: file.type });
        
        onPhotoCapture(file);
        
        toast({
          title: "Foto capturada",
          description: "La foto se ha tomado exitosamente.",
          variant: "success"
        });
      } else {
        console.error('❌ No data URL received from camera');
        throw new Error('No se recibió imagen de la cámara');
      }
    } catch (error: any) {
      console.error('❌ Error taking picture:', error);
      
      let errorMessage = error?.message || 'Error desconocido';
      
      // Translate specific Capacitor error messages to Spanish
      if (errorMessage.includes('user canceled photos app')) {
        errorMessage = 'No se pudo tomar la foto, el usuario canceló la acción';
      } else if (errorMessage.includes('user canceled')) {
        errorMessage = 'No se pudo tomar la foto, el usuario canceló la acción';
      } else if (errorMessage.includes('camera not available')) {
        errorMessage = 'Cámara no disponible';
      } else if (errorMessage.includes('permission denied')) {
        errorMessage = 'Permiso de cámara denegado';
      }
      
      console.error('🚨 Camera error details:', { error: errorMessage, stack: error?.stack });
      
      toast({
        title: "Error de cámara",
        description: errorMessage,
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