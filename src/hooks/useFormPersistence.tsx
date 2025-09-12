import { useEffect } from 'react';
import { useOfflineStorage } from '@/hooks/useOfflineStorage';
import { useToast } from '@/hooks/use-toast';

interface UseFormPersistenceProps {
  applicationId?: string;
  formData: any;
  setFormData: (data: any) => void;
}

export const useFormPersistence = ({ 
  applicationId, 
  formData, 
  setFormData 
}: UseFormPersistenceProps) => {
  const { getOfflineData, saveOfflineData, isOffline } = useOfflineStorage();
  const { toast } = useToast();

  // Load persisted data on mount
  useEffect(() => {
    const loadPersistedData = async () => {
      if (!applicationId) return;

      const offlineKey = `draft_${applicationId}`;
      const persistedData = await getOfflineData(offlineKey);

      if (persistedData && persistedData.draft_data) {
        // Merge persisted data with current form data
        const mergedData = {
          ...formData,
          ...persistedData.draft_data,
          applicationId: applicationId // Ensure ID is preserved
        };

        setFormData(mergedData);
        
        // Notify user that offline data was loaded
        if (isOffline || persistedData._offline_saved) {
          toast({
            title: "Datos offline cargados",
            description: "Se recuperaron los datos guardados localmente",
            variant: "default",
            duration: 3000
          });
        }
      }
    };

    loadPersistedData();
  }, [applicationId]);

  // Auto-save data periodically
  useEffect(() => {
    if (!applicationId || !formData) return;

    const autoSave = async () => {
      const offlineKey = `draft_${applicationId}`;
      await saveOfflineData(offlineKey, {
        id: applicationId,
        draft_data: formData,
        last_updated: Date.now()
      });
    };

    // Auto-save every 30 seconds if there's data
    const interval = setInterval(autoSave, 30000);

    return () => clearInterval(interval);
  }, [applicationId, formData, saveOfflineData]);

  return {
    isOffline
  };
};