
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { AlertCircle, Camera, CheckCircle, FileText, Image, Loader2, UploadCloud, X, RefreshCw, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useDocumentManager, guatemalanDocuments } from '@/hooks/useDocumentManager';
import InteractiveDocumentCard from '@/components/documents/InteractiveDocumentCard';
import SubformHeader from '@/components/forms/SubformHeader';
import NativeCameraCapture from './NativeCameraCapture';

interface PhotoDocumentUploadProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

const PhotoDocumentUpload: React.FC<PhotoDocumentUploadProps> = ({
  formData,
  updateFormData
}) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeCameraId, setActiveCameraId] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState<any>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [showNativeCamera, setShowNativeCamera] = useState<string | null>(null);

  const {
    documents,
    loadingDocument,
    uploadDocument,
    removeDocument,
  } = useDocumentManager();

  // Get applicationId from formData
  const applicationId = formData?.applicationId || formData?.id;

  // Update form data when documents change
  React.useEffect(() => {
    const documentsData = documents.reduce((acc, doc) => {
      acc[doc.id] = {
        file: doc.file,
        status: doc.status,
        thumbnailUrl: doc.thumbnailUrl
      };
      return acc;
    }, {} as Record<string, any>);
    updateFormData('documents', documentsData);
  }, [documents]);

  const startCamera = async (documentId: string) => {
    // Check if running in native app (Capacitor)
    if (typeof window !== 'undefined' && (window as any).Capacitor) {
      setShowNativeCamera(documentId);
      return;
    }
    
    // Fallback to web camera for browser
    try {
      setActiveCameraId(documentId);
      setIsCameraReady(false);
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'environment'
        }
      });
      
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => {
          setIsCameraReady(true);
        };
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: "Error de cámara",
        description: "No se pudo acceder a la cámara. Verifica los permisos.",
        variant: "destructive",
      });
      setActiveCameraId(null);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setActiveCameraId(null);
    setIsCameraReady(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current || !activeCameraId) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');
    
    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `photo_${Date.now()}.jpg`, { type: 'image/jpeg' });
        uploadDocument(activeCameraId, file, applicationId);
        stopCamera();
      }
    }, 'image/jpeg', 0.9);
  };

  const handleFileSelection = (e: React.ChangeEvent<HTMLInputElement>, documentId: string) => {
    if (e.target.files && e.target.files[0]) {
      uploadDocument(documentId, e.target.files[0], applicationId);
    }
  };

  const handleFileUpload = (documentId: string) => {
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute('data-document-id', documentId);
      fileInputRef.current.click();
    }
  };

  const handleOpenPreview = (document: any) => {
    setShowPreview(document);
  };

  // Agrupar documentos en filas de 2
  const documentRows = [];
  for (let i = 0; i < documents.length; i += 2) {
    documentRows.push(documents.slice(i, i + 2));
  }

  return (
    <div className="space-y-6">
      <SubformHeader
        icon={<FileText className="w-5 h-5" />}
        title="Documentos Requeridos"
        subtitle="Sube los siguientes documentos requeridos para procesar la solicitud de crédito."
        variant="applicant"
      />
      
      {/* Debug Information */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <h4 className="text-sm font-medium text-yellow-800 mb-2">Debug Info</h4>
          <div className="text-xs text-yellow-700 space-y-1">
            <p>Application ID: {applicationId || 'No disponible'}</p>
            <p>Online: {navigator.onLine ? 'Sí' : 'No'}</p>
            <p>Capacitor: {typeof window !== 'undefined' && (window as any).Capacitor ? 'Disponible' : 'No disponible'}</p>
            <p>Camera Plugin: {typeof window !== 'undefined' && (window as any).Capacitor?.Plugins?.Camera ? 'Disponible' : 'No disponible'}</p>
            <p>Documentos cargados: {documents.filter(d => d.status === 'success').length}/{documents.length}</p>
               <p>Storage: Local (se subirá al enviar solicitud)</p>
               <p className="text-blue-600">
                 📱 Documentos almacenados localmente hasta envío
               </p>
          </div>
        </div>
      )}
      
      {/* Document Grid */}
      {documentRows.map((row, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {row.map(document => (
            <InteractiveDocumentCard
              key={document.id}
              document={document}
              isLoading={loadingDocument === document.id}
              onUploadFile={(file) => uploadDocument(document.id, file, applicationId)}
              onTakePhoto={() => startCamera(document.id)}
              onRemove={() => removeDocument(document.id)}
              onView={() => handleOpenPreview(document)}
              showActions={true}
            />
          ))}
        </div>
      ))}
      
      {/* Hidden file input for uploads */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".jpg,.jpeg,.png,.pdf"
        onChange={(e) => {
          const documentId = fileInputRef.current?.getAttribute('data-document-id') || '';
          handleFileSelection(e, documentId);
        }}
      />
      
      {/* Native Camera Dialog */}
      <Dialog open={showNativeCamera !== null} onOpenChange={(open) => !open && setShowNativeCamera(null)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Capturar Documento</DialogTitle>
          </DialogHeader>
          
          {showNativeCamera && (
            <NativeCameraCapture
              documentTitle={documents.find(d => d.id === showNativeCamera)?.title || ''}
              onPhotoCapture={(file) => {
                uploadDocument(showNativeCamera, file, applicationId);
                setShowNativeCamera(null);
              }}
              onFileUpload={() => {
                handleFileUpload(showNativeCamera);
                setShowNativeCamera(null);
              }}
              onCancel={() => setShowNativeCamera(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Web Camera dialog */}
      <Dialog open={activeCameraId !== null} onOpenChange={(open) => !open && stopCamera()}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Tomar fotografía</DialogTitle>
            <DialogDescription>
              Asegúrate que la imagen sea clara y tenga buena iluminación
            </DialogDescription>
          </DialogHeader>
          
          <div className="p-4 bg-muted/50 rounded-md flex flex-col items-center justify-center">
            <div className="aspect-video w-full bg-black rounded-md mb-4 flex items-center justify-center overflow-hidden">
              {!isCameraReady ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-8 w-8 text-white animate-spin" />
                  <p className="text-white text-sm">Iniciando cámara...</p>
                </div>
              ) : (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover rounded"
                />
              )}
            </div>
            
            <canvas ref={canvasRef} className="hidden" />
            
            {/* Camera controls */}
            <div className="flex gap-3">
              <Button variant="ghost" onClick={stopCamera}>
                <X className="mr-2 h-4 w-4" />
                Cancelar
              </Button>
              <Button 
                onClick={capturePhoto}
                disabled={!isCameraReady}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Camera className="mr-2 h-4 w-4" />
                Capturar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Preview dialog */}
      <Dialog open={showPreview !== null} onOpenChange={() => setShowPreview(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{showPreview?.title}</DialogTitle>
          </DialogHeader>
          
          {showPreview?.thumbnailUrl && (
            <div className="flex justify-center p-4">
              <img
                src={showPreview.thumbnailUrl}
                alt={showPreview.title}
                className="max-h-[500px] max-w-full object-contain rounded-md"
              />
            </div>
          )}
          
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setShowPreview(null)}>
              <X className="mr-2 h-4 w-4" />
              Cerrar
            </Button>
            <Button
              variant="outline"
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => {
                if (showPreview) {
                  removeDocument(showPreview.id);
                  setShowPreview(null);
                }
              }}
            >
              <X className="mr-2 h-4 w-4" />
              Eliminar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PhotoDocumentUpload;
