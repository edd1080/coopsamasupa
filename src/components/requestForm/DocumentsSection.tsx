
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Upload, X, FileText, CheckCircle, AlertCircle } from 'lucide-react';

interface DocumentsSectionProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

interface DocumentItem {
  id: string;
  name: string;
  description: string;
  required: boolean;
  file?: File | null;
  status: 'pending' | 'uploaded' | 'error';
}

const DocumentsSection: React.FC<DocumentsSectionProps> = ({ formData, updateFormData }) => {
  const [documents, setDocuments] = useState<DocumentItem[]>([
    {
      id: 'id_document',
      name: 'Identificación Oficial',
      description: 'INE, pasaporte o cédula profesional vigente',
      required: true,
      file: null,
      status: 'pending'
    },
    {
      id: 'proof_address',
      name: 'Comprobante de Domicilio',
      description: 'No mayor a 3 meses de antigüedad',
      required: true,
      file: null,
      status: 'pending'
    },
    {
      id: 'income_proof',
      name: 'Comprobante de Ingresos',
      description: 'Recibos de nómina o estados de cuenta de los últimos 3 meses',
      required: true,
      file: null,
      status: 'pending'
    },
    {
      id: 'bank_statements',
      name: 'Estados de Cuenta Bancarios',
      description: 'De los últimos 3 meses',
      required: true,
      file: null,
      status: 'pending'
    },
    {
      id: 'tax_return',
      name: 'Declaración de Impuestos',
      description: 'Del último año fiscal',
      required: false,
      file: null,
      status: 'pending'
    }
  ]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, documentId: string) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const updatedDocuments = documents.map(doc => {
        if (doc.id === documentId) {
          return {
            ...doc,
            file: file,
            status: 'uploaded' as const // Fixed type issue by using const assertion
          };
        }
        return doc;
      });
      
      setDocuments(updatedDocuments);
      
      // Update form data with file information
      const filesData = updatedDocuments.reduce((acc, doc) => {
        acc[doc.id] = doc.file;
        return acc;
      }, {} as Record<string, File | null>);
      
      updateFormData('documents', filesData);
    }
  };

  const removeFile = (documentId: string) => {
    const updatedDocuments = documents.map(doc => {
      if (doc.id === documentId) {
        return {
          ...doc,
          file: null,
          status: 'pending' as const // Fixed type issue by using const assertion
        };
      }
      return doc;
    });
    
    setDocuments(updatedDocuments);
    
    // Update form data with file information
    const filesData = updatedDocuments.reduce((acc, doc) => {
      acc[doc.id] = doc.file;
      return acc;
    }, {} as Record<string, File | null>);
    
    updateFormData('documents', filesData);
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'uploaded':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      default:
        return null;
    }
  };

  return (
    <Card className="border-0 shadow-none">
      <CardContent className="p-0 space-y-4">
        <h3 className="font-semibold text-lg">Documentos</h3>
        <p className="text-muted-foreground text-sm">
          Sube los documentos requeridos para procesar tu solicitud.
        </p>
        
        <div className="space-y-4">
          {documents.map((document) => (
            <div key={document.id} className="border rounded-md p-4">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <span className="font-medium">{document.name}</span>
                </div>
                {getStatusIcon(document.status)}
              </div>
              
              <p className="text-sm text-muted-foreground mb-4">{document.description}</p>
              
              {!document.file ? (
                <div className="mt-2">
                  <input
                    type="file"
                    id={`file-${document.id}`}
                    className="hidden"
                    onChange={(e) => handleFileChange(e, document.id)}
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                  <Label htmlFor={`file-${document.id}`} className="cursor-pointer">
                    <div className="border-2 border-dashed border-muted-foreground/30 rounded-md p-4 flex flex-col items-center justify-center hover:bg-muted/50 transition-colors">
                      <Upload className="h-6 w-6 text-muted-foreground mb-2" />
                      <p className="text-sm font-medium mb-1">Haz clic para subir</p>
                      <p className="text-xs text-muted-foreground">PDF, JPG o PNG (Max. 5MB)</p>
                    </div>
                  </Label>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-muted/30 rounded-md p-2 mt-2">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="text-sm truncate max-w-[200px]">{document.file.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => removeFile(document.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentsSection;
