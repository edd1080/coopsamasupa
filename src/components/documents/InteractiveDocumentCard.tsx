
import React, { useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Camera, 
  Upload, 
  Eye, 
  X, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Image 
} from 'lucide-react';
import { DocumentItem } from '@/hooks/useDocumentManager';

interface InteractiveDocumentCardProps {
  document: DocumentItem;
  isLoading?: boolean;
  onUploadFile: (file: File) => void;
  onTakePhoto: () => void;
  onRemove: () => void;
  onView?: () => void;
  showActions?: boolean;
}

const InteractiveDocumentCard: React.FC<InteractiveDocumentCardProps> = ({
  document,
  isLoading = false,
  onUploadFile,
  onTakePhoto,
  onRemove,
  onView,
  showActions = true
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showPreview, setShowPreview] = React.useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUploadFile(e.target.files[0]);
    }
  };

  const getStatusIcon = () => {
    if (isLoading) {
      return <Loader2 className="h-4 w-4 text-primary animate-spin" />;
    }
    
    switch(document.status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      default:
        return <FileText className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = () => {
    switch(document.status) {
      case 'success':
        return 'border-green-200 bg-green-50/50 dark:bg-green-950/10';
      case 'error':
        return 'border-red-200 bg-red-50/50 dark:bg-red-950/10';
      default:
        return '';
    }
  };

  return (
    <>
      <Card className={`transition-all hover:shadow-md cursor-pointer ${getStatusColor()}`}>
        <CardContent className="p-3">
          {/* Document preview si está disponible */}
          {document.status === 'success' && document.thumbnailUrl && (
            <div 
              className="w-full h-20 bg-cover bg-center rounded-md mb-3 relative group"
              style={{ backgroundImage: `url(${document.thumbnailUrl})` }}
              onClick={() => setShowPreview(true)}
            >
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-all rounded-md flex items-center justify-center">
                <Eye className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          )}
          
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-sm truncate">{document.title}</span>
                {document.required && (
                  <Badge variant="destructive" className="text-xs px-1 py-0">
                    Requerido
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {document.description}
              </p>
            </div>
            <div className="ml-2 flex-shrink-0">
              {getStatusIcon()}
            </div>
          </div>
          
          {showActions && (
            <div className="flex gap-1 mt-3">
              {document.status === 'empty' || document.status === 'error' ? (
                <>
                  {document.type === 'photo' && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 text-xs h-7"
                      onClick={onTakePhoto}
                      disabled={isLoading}
                    >
                      <Camera className="h-3 w-3 mr-1" />
                      Foto
                    </Button>
                  )}
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex-1 text-xs h-7"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                  >
                    <Upload className="h-3 w-3 mr-1" />
                    {document.type === 'signature' ? 'Firmar' : 'Subir'}
                  </Button>
                </>
              ) : document.status === 'success' ? (
                <div className="flex w-full gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPreview(true)}
                    className="flex-1 text-xs h-7"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    Ver
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onRemove}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 text-xs h-7"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : null}
            </div>
          )}
          
          {isLoading && (
            <div className="flex items-center justify-center mt-2">
              <Loader2 className="h-4 w-4 animate-spin text-primary mr-2" />
              <span className="text-xs text-muted-foreground">Procesando...</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept={document.type === 'signature' ? 'image/*' : '.jpg,.jpeg,.png,.pdf'}
        onChange={handleFileSelect}
      />

      {/* Preview dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{document.title}</DialogTitle>
          </DialogHeader>
          
          {document.thumbnailUrl && (
            <div className="flex justify-center p-4">
              <img 
                src={document.thumbnailUrl} 
                alt={document.title}
                className="max-h-[500px] max-w-full object-contain rounded-md" 
              />
            </div>
          )}
          
          <div className="flex justify-end gap-3">
            <Button 
              variant="ghost" 
              onClick={() => setShowPreview(false)}
            >
              <X className="mr-2 h-4 w-4" />
              Cerrar
            </Button>
            <Button 
              variant="outline" 
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => {
                onRemove();
                setShowPreview(false);
              }}
            >
              <X className="mr-2 h-4 w-4" />
              Eliminar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InteractiveDocumentCard;
