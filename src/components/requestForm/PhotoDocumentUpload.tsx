
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { AlertCircle, Camera, CheckCircle, FileText, Image, Loader2, UploadCloud, X, RefreshCw, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useDocumentManager, guatemalanDocuments } from '@/hooks/useDocumentManager';
import InteractiveDocumentCard from '@/components/documents/InteractiveDocumentCard';
import SignatureCanvas from '@/components/documents/SignatureCanvas';

interface PhotoDocumentUploadProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

const PhotoDocumentUpload: React.FC<PhotoDocumentUploadProps> = ({ formData, updateFormData }) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeCameraId, setActiveCameraId] = useState<string | null>(null);
  const [showSignatureCanvas, setShowSignatureCanvas] = useState(false);
  const [showPreview, setShowPreview] = useState<any>(null);

  const { documents, loadingDocument, uploadDocument, removeDocument, updateDocument } = useDocumentManager();

  // Update form data when documents change
  const updateDocumentsInFormData = () => {
    const documentsData = documents.reduce((acc, doc) => {
      acc[doc.id] = {
        file: doc.file,
        status: doc.status,
        thumbnailUrl: doc.thumbnailUrl
      };
      return acc;
    }, {} as Record<string, any>);
    
    updateFormData('documents', documentsData);
  };

  React.useEffect(() => {
    updateDocumentsInFormData();
  }, [documents]);

  const handleCaptureStart = (documentId: string) => {
    setActiveCameraId(documentId);
  };

  const handleFileCapture = async (documentId: string, file: File) => {
    setActiveCameraId(null);
    await uploadDocument(documentId, file);
  };

  const handleFileSelection = (e: React.ChangeEvent<HTMLInputElement>, documentId: string) => {
    if (e.target.files && e.target.files[0]) {
      handleFileCapture(documentId, e.target.files[0]);
    }
  };

  const handleFileUpload = (documentId: string) => {
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute('data-document-id', documentId);
      fileInputRef.current.click();
    }
  };

  const handleDocumentAction = (documentId: string, file: File) => {
    if (documentId === 'firmaCanvas') {
      setShowSignatureCanvas(false);
    }
    uploadDocument(documentId, file);
  };

  const handleOpenPreview = (document: any) => {
    setShowPreview(document);
  };

  const handleSignatureClick = () => {
    setShowSignatureCanvas(true);
  };

  // Agrupar documentos en filas de 2
  const documentRows = [];
  for (let i = 0; i < documents.length; i += 2) {
    documentRows.push(documents.slice(i, i + 2));
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="font-semibold text-xl mb-2">Documentos Requeridos</h3>
        <p className="text-muted-foreground">
          Sube los documentos específicos requeridos para procesar tu solicitud de crédito en Guatemala.
        </p>
      </div>
      
      {/* Información de documentos requeridos */}
      <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/10">
        <CardContent className="p-4">
          <h4 className="font-medium mb-2 text-blue-900 dark:text-blue-100">
            Documentos Obligatorios para Solicitud de Crédito:
          </h4>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>• DPI (ambos lados) - Documento Personal de Identificación vigente</li>
            <li>• Fotografía del solicitante (selfie frontal)</li>
            <li>• Recibos de servicios públicos (máximo 3 meses de antigüedad)</li>
            <li>• Fotografía con el agente de negocios</li>
            <li>• Firma digital del solicitante</li>
          </ul>
        </CardContent>
      </Card>
      
      {/* Document Grid */}
      {documentRows.map((row, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {row.map((document) => (
            <InteractiveDocumentCard
              key={document.id}
              document={document}
              isLoading={loadingDocument === document.id}
              onUploadFile={(file) => {
                if (document.id === 'firmaCanvas') {
                  handleSignatureClick();
                } else {
                  uploadDocument(document.id, file);
                }
              }}
              onTakePhoto={() => {
                if (document.id === 'firmaCanvas') {
                  handleSignatureClick();
                } else {
                  handleCaptureStart(document.id);
                }
              }}
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
      
      {/* Camera dialog */}
      <Dialog open={activeCameraId !== null} onOpenChange={() => setActiveCameraId(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              Tomar fotografía
            </DialogTitle>
            <DialogDescription>
              Asegúrate que la imagen sea clara y tenga buena iluminación
            </DialogDescription>
          </DialogHeader>
          
          <div className="p-4 bg-muted/50 rounded-md flex flex-col items-center justify-center">
            <div className="aspect-video w-full bg-black rounded-md mb-4 flex items-center justify-center">
              <Camera className="h-12 w-12 text-gray-500" />
            </div>
            <p className="text-muted-foreground text-sm mb-4 text-center">
              Esta es una simulación de cámara. En la aplicación real, aquí se mostraría la vista previa de la cámara.
            </p>
            
            {/* Mock camera actions */}
            <div className="flex gap-3">
              <Button 
                variant="ghost" 
                onClick={() => setActiveCameraId(null)}
              >
                <X className="mr-2 h-4 w-4" />
                Cancelar
              </Button>
              <Button
                onClick={() => {
                  // Mock a file capture by creating a canvas image
                  const canvas = document.createElement('canvas');
                  canvas.width = 400;
                  canvas.height = 300;
                  const ctx = canvas.getContext('2d');
                  if (ctx) {
                    // Draw a simple image for demonstration
                    ctx.fillStyle = '#f0f0f0';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.fillStyle = '#3498db';
                    ctx.fillRect(50, 50, 300, 200);
                    ctx.fillStyle = '#ffffff';
                    ctx.font = '20px sans-serif';
                    ctx.fillText('Mock Photo', 150, 150);
                    
                    // Convert to blob and then to file
                    canvas.toBlob((blob) => {
                      if (blob && activeCameraId) {
                        const file = new File([blob], `photo_${Date.now()}.jpg`, { type: 'image/jpeg' });
                        handleFileCapture(activeCameraId, file);
                      }
                    }, 'image/jpeg');
                  }
                }}
              >
                <Camera className="mr-2 h-4 w-4" />
                Capturar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Signature Canvas */}
      <SignatureCanvas
        open={showSignatureCanvas}
        onOpenChange={setShowSignatureCanvas}
        onSave={(file) => handleDocumentAction('firmaCanvas', file)}
      />
      
      {/* Preview dialog */}
      <Dialog open={showPreview !== null} onOpenChange={() => setShowPreview(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {showPreview?.title}
            </DialogTitle>
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
            <Button 
              variant="ghost" 
              onClick={() => setShowPreview(null)}
            >
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
