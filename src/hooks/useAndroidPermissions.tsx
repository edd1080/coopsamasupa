import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { Camera, CameraPermissionType } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';
import { Filesystem, Directory } from '@capacitor/filesystem';

export interface PermissionStatus {
  camera: boolean;
  storage: boolean;
  location: boolean;
  allGranted: boolean;
}

export const useAndroidPermissions = () => {
  const [permissions, setPermissions] = useState<PermissionStatus>({
    camera: false,
    storage: false,
    location: false,
    allGranted: false
  });
  const [isChecking, setIsChecking] = useState(false);

  const checkPermissions = async () => {
    if (!Capacitor.isNativePlatform()) {
      // En web, siempre permitir
      setPermissions({
        camera: true,
        storage: true,
        location: true,
        allGranted: true
      });
      return;
    }

    setIsChecking(true);
    try {
      // Verificar permisos de cámara
      const cameraPermission = await Camera.checkPermissions();
      const cameraGranted = cameraPermission.camera === 'granted';

      // Verificar permisos de ubicación
      const locationPermission = await Geolocation.checkPermissions();
      const locationGranted = locationPermission.location === 'granted';

      // Verificar permisos de almacenamiento (simulado)
      // En Android, los permisos de almacenamiento se manejan automáticamente
      const storageGranted = true;

      const allGranted = cameraGranted && storageGranted && locationGranted;

      setPermissions({
        camera: cameraGranted,
        storage: storageGranted,
        location: locationGranted,
        allGranted
      });

      console.log('📱 Permisos verificados:', {
        camera: cameraGranted,
        storage: storageGranted,
        location: locationGranted,
        allGranted
      });

    } catch (error) {
      console.error('❌ Error verificando permisos:', error);
      setPermissions({
        camera: false,
        storage: false,
        location: false,
        allGranted: false
      });
    } finally {
      setIsChecking(false);
    }
  };

  const requestPermissions = async () => {
    if (!Capacitor.isNativePlatform()) {
      return true;
    }

    try {
      console.log('📱 Solicitando permisos...');
      
      // Solicitar permisos de cámara
      const cameraPermission = await Camera.requestPermissions();
      const cameraGranted = cameraPermission.camera === 'granted';

      // Solicitar permisos de ubicación
      const locationPermission = await Geolocation.requestPermissions();
      const locationGranted = locationPermission.location === 'granted';

      // Los permisos de almacenamiento se manejan automáticamente en Android
      const storageGranted = true;

      const allGranted = cameraGranted && storageGranted && locationGranted;

      setPermissions({
        camera: cameraGranted,
        storage: storageGranted,
        location: locationGranted,
        allGranted
      });

      console.log('📱 Permisos solicitados:', {
        camera: cameraGranted,
        storage: storageGranted,
        location: locationGranted,
        allGranted
      });

      return allGranted;

    } catch (error) {
      console.error('❌ Error solicitando permisos:', error);
      return false;
    }
  };

  const requestCameraPermission = async () => {
    if (!Capacitor.isNativePlatform()) {
      return true;
    }

    try {
      const permission = await Camera.requestPermissions();
      const granted = permission.camera === 'granted';
      
      setPermissions(prev => ({
        ...prev,
        camera: granted,
        allGranted: granted && prev.storage && prev.location
      }));

      return granted;
    } catch (error) {
      console.error('❌ Error solicitando permiso de cámara:', error);
      return false;
    }
  };

  const requestLocationPermission = async () => {
    if (!Capacitor.isNativePlatform()) {
      return true;
    }

    try {
      const permission = await Geolocation.requestPermissions();
      const granted = permission.location === 'granted';
      
      setPermissions(prev => ({
        ...prev,
        location: granted,
        allGranted: granted && prev.storage && prev.camera
      }));

      return granted;
    } catch (error) {
      console.error('❌ Error solicitando permiso de ubicación:', error);
      return false;
    }
  };

  // Verificar permisos al montar el componente
  useEffect(() => {
    checkPermissions();
  }, []);

  return {
    permissions,
    isChecking,
    checkPermissions,
    requestPermissions,
    requestCameraPermission,
    requestLocationPermission
  };
};
