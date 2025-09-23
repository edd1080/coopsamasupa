import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { Camera } from '@capacitor/camera';
import { useToast } from '@/hooks/use-toast';

interface PermissionStatus {
  camera: boolean;
  photos: boolean;
  storage: boolean;
}

interface UseAndroidPermissionsReturn {
  permissions: PermissionStatus;
  requestPermissions: () => Promise<boolean>;
  checkPermissions: () => Promise<PermissionStatus>;
  isAndroid: boolean;
  hasAllPermissions: boolean;
}

export const useAndroidPermissions = (): UseAndroidPermissionsReturn => {
  const [permissions, setPermissions] = useState<PermissionStatus>({
    camera: false,
    photos: false,
    storage: false
  });
  
  const { toast } = useToast();
  const isAndroid = Capacitor.getPlatform() === 'android';

  const checkPermissions = async (): Promise<PermissionStatus> => {
    if (!isAndroid) {
      // En web, asumimos que los permisos están disponibles
      return { camera: true, photos: true, storage: true };
    }

    try {
      // Verificar permisos de cámara
      const cameraPermission = await Camera.checkPermissions();
      
      const currentPermissions: PermissionStatus = {
        camera: cameraPermission.camera === 'granted',
        photos: cameraPermission.photos === 'granted',
        storage: cameraPermission.photos === 'granted' // En Android, photos incluye storage
      };

      setPermissions(currentPermissions);
      return currentPermissions;
    } catch (error) {
      console.error('Error checking permissions:', error);
      return { camera: false, photos: false, storage: false };
    }
  };

  const requestPermissions = async (): Promise<boolean> => {
    if (!isAndroid) {
      return true; // En web no necesitamos solicitar permisos
    }

    try {
      console.log('🔐 Requesting Android permissions...');
      
      // Solicitar permisos de cámara (incluye photos)
      const cameraResult = await Camera.requestPermissions();
      
      const granted = cameraResult.camera === 'granted' && cameraResult.photos === 'granted';
      
      if (granted) {
        console.log('✅ All permissions granted');
        toast({
          title: "Permisos otorgados",
          description: "La aplicación ahora puede acceder a la cámara y galería.",
          variant: "success"
        });
        
        // Actualizar estado de permisos
        await checkPermissions();
      } else {
        console.log('❌ Permissions denied');
        toast({
          title: "Permisos requeridos",
          description: "La aplicación necesita permisos de cámara y galería para funcionar correctamente.",
          variant: "destructive"
        });
      }
      
      return granted;
    } catch (error) {
      console.error('Error requesting permissions:', error);
      toast({
        title: "Error de permisos",
        description: "No se pudieron solicitar los permisos. Verifica la configuración de la aplicación.",
        variant: "destructive"
      });
      return false;
    }
  };

  const hasAllPermissions = permissions.camera && permissions.photos && permissions.storage;

  useEffect(() => {
    if (isAndroid) {
      checkPermissions();
    } else {
      // En web, establecer permisos como disponibles
      setPermissions({ camera: true, photos: true, storage: true });
    }
  }, [isAndroid]);

  return {
    permissions,
    requestPermissions,
    checkPermissions,
    isAndroid,
    hasAllPermissions
  };
};
