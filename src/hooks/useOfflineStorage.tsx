import { useState, useEffect } from 'react';
import localforage from 'localforage';
import { useToast } from '@/hooks/use-toast';

// Configure localforage instance for offline data
const offlineStorage = localforage.createInstance({
  name: 'coopsama',
  storeName: 'offlineData'
});

interface OfflineFormData {
  [key: string]: any;
}

export const useOfflineStorage = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const { toast } = useToast();

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      toast({
        title: "Conexión restaurada",
        description: "Los datos se sincronizarán automáticamente",
        variant: "success",
        duration: 3000
      });
    };

    const handleOffline = () => {
      setIsOffline(true);
      toast({
        title: "Sin conexión",
        description: "Los datos se guardarán localmente",
        variant: "warning",
        duration: 4000
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [toast]);

  const saveOfflineData = async (key: string, data: OfflineFormData): Promise<void> => {
    try {
      await offlineStorage.setItem(key, {
        ...data,
        _offline_timestamp: Date.now(),
        _offline_saved: true
      });
      
      if (isOffline) {
        toast({
          title: "Datos guardados offline",
          description: "Se sincronizarán cuando tengas conexión",
          variant: "warning",
          duration: 3000
        });
      }
    } catch (error) {
      console.error('Error saving offline data:', error);
      toast({
        title: "Error al guardar",
        description: "No se pudieron guardar los datos localmente",
        variant: "destructive",
        duration: 5000
      });
    }
  };

  const getOfflineData = async (key: string): Promise<OfflineFormData | null> => {
    try {
      const data = await offlineStorage.getItem<OfflineFormData>(key);
      return data;
    } catch (error) {
      console.error('Error retrieving offline data:', error);
      return null;
    }
  };

  const removeOfflineData = async (key: string): Promise<void> => {
    try {
      await offlineStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing offline data:', error);
    }
  };

  const getAllOfflineKeys = async (): Promise<string[]> => {
    try {
      return await offlineStorage.keys();
    } catch (error) {
      console.error('Error getting offline keys:', error);
      return [];
    }
  };

  const clearAllOfflineData = async (): Promise<void> => {
    try {
      await offlineStorage.clear();
    } catch (error) {
      console.error('Error clearing offline data:', error);
    }
  };

  return {
    isOffline,
    saveOfflineData,
    getOfflineData,
    removeOfflineData,
    getAllOfflineKeys,
    clearAllOfflineData
  };
};