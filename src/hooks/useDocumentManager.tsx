
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface DocumentItem {
  id: string;
  title: string;
  description: string;
  required: boolean;
  file?: File | null;
  status: 'empty' | 'success' | 'error' | 'loading';
  thumbnailUrl?: string;
  type: 'photo' | 'document' | 'signature';
}

// Documentos específicos para Guatemala
export const guatemalanDocuments: DocumentItem[] = [
  {
    id: 'dpiFrontal',
    title: 'DPI Frontal',
    description: 'Documento Personal de Identificación - frente',
    type: 'photo',
    required: true,
    status: 'empty'
  },
  {
    id: 'dpiTrasero',
    title: 'DPI Trasero', 
    description: 'Documento Personal de Identificación - reverso',
    type: 'photo',
    required: true,
    status: 'empty'
  },
  {
    id: 'fotoSolicitante',
    title: 'Fotografía del Solicitante',
    description: 'Selfie frontal del solicitante',
    type: 'photo',
    required: true,
    status: 'empty'
  },
  {
    id: 'recibosServicios',
    title: 'Recibos de Servicios',
    description: 'Luz, agua o teléfono (máximo 3 meses)',
    type: 'document',
    required: true,
    status: 'empty'
  },
  {
    id: 'fotoConAgente',
    title: 'Fotografía con Agente',
    description: 'Solicitante con agente de negocios',
    type: 'photo',
    required: true,
    status: 'empty'
  },
  {
    id: 'fotoNegocioVivienda',
    title: 'Fotografía del Negocio/Vivienda',
    description: 'Local comercial o lugar de residencia',
    type: 'photo',
    required: false,
    status: 'empty'
  },
  {
    id: 'firmaCanvas',
    title: 'Firma Digital',
    description: 'Firma del solicitante',
    type: 'signature',
    required: true,
    status: 'empty'
  }
];

export const useDocumentManager = (initialDocuments?: DocumentItem[]) => {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<DocumentItem[]>(
    initialDocuments || guatemalanDocuments
  );
  const [loadingDocument, setLoadingDocument] = useState<string | null>(null);

  const updateDocument = useCallback((documentId: string, updates: Partial<DocumentItem>) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === documentId ? { ...doc, ...updates } : doc
    ));
  }, []);

  const uploadDocument = useCallback(async (documentId: string, file: File) => {
    setLoadingDocument(documentId);
    
    try {
      // Crear thumbnail URL
      const thumbnailUrl = URL.createObjectURL(file);
      
      // Simular proceso de subida
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      updateDocument(documentId, {
        file,
        status: 'success',
        thumbnailUrl
      });
      
      toast({
        title: "Documento subido",
        description: "El documento se ha cargado correctamente.",
        duration: 3000,
      });
      
      return true;
    } catch (error) {
      updateDocument(documentId, {
        status: 'error'
      });
      
      toast({
        title: "Error al subir",
        description: "No se pudo cargar el documento. Intente de nuevo.",
        variant: "destructive",
        duration: 3000,
      });
      
      return false;
    } finally {
      setLoadingDocument(null);
    }
  }, [updateDocument, toast]);

  const removeDocument = useCallback((documentId: string) => {
    const document = documents.find(doc => doc.id === documentId);
    
    if (document?.thumbnailUrl) {
      URL.revokeObjectURL(document.thumbnailUrl);
    }
    
    updateDocument(documentId, {
      file: null,
      status: 'empty',
      thumbnailUrl: undefined
    });
    
    toast({
      title: "Documento eliminado",
      description: "El documento ha sido eliminado.",
      duration: 3000,
    });
  }, [documents, updateDocument, toast]);

  const getDocumentById = useCallback((documentId: string) => {
    return documents.find(doc => doc.id === documentId);
  }, [documents]);

  return {
    documents,
    loadingDocument,
    updateDocument,
    uploadDocument,
    removeDocument,
    getDocumentById
  };
};
