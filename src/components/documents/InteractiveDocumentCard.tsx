
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, Camera, FileText, Eye, Trash2, Loader2 } from 'lucide-react';
import { DocumentItem } from '@/hooks/useDocumentManager';

interface InteractiveDocumentCardProps {
  document: DocumentItem;
  onUpload: (file: File) => void;
  onRemove: () => void;
  isLoading?: boolean;
}

const InteractiveDocumentCard: React.FC<InteractiveDocumentCardProps> = ({
  document,
  onUpload,
  onRemove,
  isLoading = false
}) => {
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  const handleCameraCapture = () => {
    // Camera capture logic
    console.log('Camera capture for:', document.id);
  };

  const getStatusColor = () => {
    switch (document.status) {
      case 'success':
        return 'bg-green-100 border-green-300';
      case 'error':
        return 'bg-red-100 border-red-300';
      case 'loading':
        return 'bg-yellow-100 border-yellow-300';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = () => {
    switch (document.status) {
      case 'success':
        return <FileText className="h-4 w-4 text-green-600" />;
      case 'error':
        return <Upload className="h-4 w-4 text-red-600" />;
      case 'loading':
        return <Loader2 className="h-4 w-4 text-yellow-600 animate-spin" />;
      default:
        return <Upload className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <Card className={`p-4 transition-all duration-200 ${getStatusColor()}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium text-sm">{document.title}</h3>
            {document.required && (
              <Badge variant="destructive" className="text-xs">
                Requerido
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{document.description}</p>
        </div>
        {getStatusIcon()}
      </div>

      {document.thumbnailUrl && (
        <div className="mb-3">
          <img
            src={document.thumbnailUrl}
            alt={document.title}
            className="w-full h-24 object-cover rounded border"
          />
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {document.status === 'empty' && (
          <>
            <input
              type="file"
              id={`file-${document.id}`}
              className="hidden"
              accept={document.type === 'photo' ? 'image/*' : '*'}
              onChange={handleFileSelect}
              disabled={isLoading}
            />
            <label htmlFor={`file-${document.id}`}>
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                asChild
                disabled={isLoading}
              >
                <span>
                  <Upload className="h-3 w-3 mr-1" />
                  Subir
                </span>
              </Button>
            </label>
            
            {document.type === 'photo' && (
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={handleCameraCapture}
                disabled={isLoading}
              >
                <Camera className="h-3 w-3 mr-1" />
                Cámara
              </Button>
            )}
          </>
        )}

        {document.status === 'success' && (
          <>
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => console.log('View document')}
            >
              <Eye className="h-3 w-3 mr-1" />
              Ver
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs text-red-600 hover:text-red-700"
              onClick={onRemove}
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Eliminar
            </Button>
          </>
        )}

        {document.status === 'error' && (
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => console.log('Retry upload')}
            disabled={isLoading}
          >
            <Upload className="h-3 w-3 mr-1" />
            Reintentar
          </Button>
        )}
      </div>

      {isLoading && (
        <div className="mt-2 text-xs text-muted-foreground flex items-center">
          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
          Subiendo...
        </div>
      )}
    </Card>
  );
};

export default InteractiveDocumentCard;
