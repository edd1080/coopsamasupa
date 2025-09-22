
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getBestStorageBucket } from '@/utils/storageUtils';

export interface DocumentItem {
  id: string;
  title: string;
  description: string;
  required: boolean;
  file?: File | null;
  status: 'empty' | 'success' | 'error' | 'loading';
  thumbnailUrl?: string;
  type: 'photo' | 'document';
}

// Documentos específicos para Guatemala (sin firmaCanvas)
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

  const uploadDocument = useCallback(async (documentId: string, file: File, applicationId?: string) => {
    setLoadingDocument(documentId);
    
    try {
      console.log('📸 Starting document upload:', { documentId, fileName: file.name, fileSize: file.size, applicationId });
      
      // Crear thumbnail URL local
      const thumbnailUrl = URL.createObjectURL(file);
      
      // Always store locally first - documents will be uploaded to Supabase when application is submitted
      console.log('📱 Storing document locally (will upload to Supabase when application is submitted)');
      
      updateDocument(documentId, {
        file,
        status: 'success',
        thumbnailUrl // Use local blob URL for preview
      });
      
      toast({
        title: "Documento cargado",
        description: "El documento se subirá a Supabase cuando envíes la solicitud.",
        duration: 3000,
      });
      
      // Always store in localforage for offline sync
      const localforage = (await import('localforage')).default;
      const { offlineQueue } = await import('@/utils/offlineQueue');
      
      const offlineTimestamp = Date.now();
      const offlineExtension = file.name.split('.').pop() || 'jpg';
      const offlineFileName = `${documentId}-${offlineTimestamp}.${offlineExtension}`;
      const offlineFilePath = applicationId 
        ? `${applicationId}/${offlineFileName}`
        : `documents/${offlineFileName}`;
      
      const blobKey = `document-blob-${documentId}-${Date.now()}`;
      await localforage.setItem(blobKey, file);
      
      await offlineQueue.enqueue({
        type: 'uploadDocument',
        payload: {
          path: offlineFilePath,
          blobKey,
          documentId,
          applicationId
        }
      });
      
      
      console.log('✅ Document upload completed successfully');
      return true;
    } catch (error: any) {
      console.error('❌ Document upload failed:', error);
      
      updateDocument(documentId, {
        status: 'error'
      });
      
      const errorMessage = error?.message || 'Error desconocido';
      console.error('🚨 Upload error details:', { documentId, error: errorMessage, stack: error?.stack });
      
      toast({
        title: "Error al subir",
        description: `No se pudo cargar el documento: ${errorMessage}`,
        variant: "destructive",
        duration: 5000,
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

  const uploadDocumentsToSupabase = useCallback(async (applicationId: string) => {
    console.log('📤 Starting batch upload to Supabase Storage for application:', applicationId);
    
    const documentsToUpload = documents.filter(doc => doc.file && doc.status === 'success');
    
    if (documentsToUpload.length === 0) {
      console.log('📭 No documents to upload');
      return { success: true, uploadedCount: 0 };
    }

    try {
      const { supabase } = await import('@/integrations/supabase/client');
      const bucketName = await getBestStorageBucket();
      
      if (!bucketName) {
        throw new Error('No hay buckets de almacenamiento disponibles');
      }

      console.log(`📤 Uploading ${documentsToUpload.length} documents to ${bucketName} bucket`);

      const uploadPromises = documentsToUpload.map(async (doc) => {
        if (!doc.file) return null;

        const timestamp = Date.now();
        const extension = doc.file.name.split('.').pop() || 'jpg';
        const fileName = `${doc.id}-${timestamp}.${extension}`;
        const filePath = `${applicationId}/${fileName}`;

        console.log(`📤 Uploading ${doc.id}:`, { filePath, fileSize: doc.file.size });

        const { data, error } = await supabase.storage
          .from(bucketName)
          .upload(filePath, doc.file, { upsert: true });

        if (error) {
          console.error(`❌ Failed to upload ${doc.id}:`, error);
          throw new Error(`Error uploading ${doc.id}: ${error.message}`);
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from(bucketName)
          .getPublicUrl(filePath);

        console.log(`✅ Uploaded ${doc.id}:`, data);

        return {
          documentId: doc.id,
          filePath,
          publicUrl,
          fileName
        };
      });

      const results = await Promise.all(uploadPromises);
      const successfulUploads = results.filter(result => result !== null);

      console.log(`✅ Successfully uploaded ${successfulUploads.length}/${documentsToUpload.length} documents`);

      toast({
        title: "Documentos subidos",
        description: `${successfulUploads.length} documentos se han subido correctamente a Supabase.`,
        duration: 3000,
      });

      return { 
        success: true, 
        uploadedCount: successfulUploads.length,
        results: successfulUploads
      };

    } catch (error: any) {
      console.error('❌ Batch upload failed:', error);
      
      toast({
        title: "Error al subir documentos",
        description: `No se pudieron subir los documentos: ${error.message}`,
        variant: "destructive",
        duration: 5000,
      });

      return { 
        success: false, 
        uploadedCount: 0,
        error: error.message
      };
    }
  }, [documents, toast]);

  return {
    documents,
    loadingDocument,
    updateDocument,
    uploadDocument,
    removeDocument,
    getDocumentById,
    uploadDocumentsToSupabase
  };
};
