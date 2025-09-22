
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Loader2, AlertCircle, CheckCircle, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import CoordinateDisplay from './CoordinateDisplay';
import LocationShare from './LocationShare';
import { formatShortDateTimeToGuatemalan } from '@/utils/dateUtils';

interface GeolocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

interface GeolocationCaptureProps {
  onLocationCaptured: (location: GeolocationData) => void;
  currentLocation?: GeolocationData | null;
}

const GeolocationCapture: React.FC<GeolocationCaptureProps> = ({ 
  onLocationCaptured, 
  currentLocation 
}) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [captureProgress, setCaptureProgress] = useState<string>('');
  const [attemptCount, setAttemptCount] = useState(0);
  const { toast } = useToast();

  const captureLocation = async () => {
    if (!navigator.geolocation) {
      const errorMsg = 'La geolocalización no está soportada en este navegador';
      setError(errorMsg);
      toast({
        title: "Error de Geolocalización",
        description: errorMsg,
        variant: "destructive",
      });
      return;
    }

    setIsCapturing(true);
    setError(null);
    setAttemptCount(0);
    setCaptureProgress('Iniciando captura...');

    const maxAttempts = 3;
    const targetAccuracy = 50; // metros
    let bestLocation: GeolocationData | null = null;
    let bestAccuracy = Infinity;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      setAttemptCount(attempt);
      setCaptureProgress(`Intento ${attempt}/${maxAttempts} - Esperando estabilización del GPS...`);
      
      // Espera progresiva entre intentos para estabilización
      if (attempt > 1) {
        const waitTime = attempt * 2000; // 2s, 4s, 6s
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }

      try {
        const locationData = await new Promise<GeolocationData>((resolve, reject) => {
          const options = {
            enableHighAccuracy: true,
            timeout: 10000, // 10 segundos por intento
            maximumAge: 0 // No usar cache, siempre obtener nueva ubicación
          };

          navigator.geolocation.getCurrentPosition(
            (position) => {
              const data: GeolocationData = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy,
                timestamp: Date.now()
              };
              resolve(data);
            },
            (error) => {
              let errorMsg = 'Error desconocido al obtener la ubicación';
              
              switch (error.code) {
                case error.PERMISSION_DENIED:
                  errorMsg = 'Permiso de ubicación denegado. Por favor, habilite la ubicación en su navegador.';
                  break;
                case error.POSITION_UNAVAILABLE:
                  errorMsg = 'Información de ubicación no disponible.';
                  break;
                case error.TIMEOUT:
                  errorMsg = 'Tiempo de espera agotado al obtener la ubicación.';
                  break;
              }
              reject(new Error(errorMsg));
            },
            options
          );
        });

        // Verificar si esta es la mejor precisión encontrada
        if (locationData.accuracy < bestAccuracy) {
          bestLocation = locationData;
          bestAccuracy = locationData.accuracy;
          setCaptureProgress(`Mejor precisión encontrada: ±${Math.round(locationData.accuracy)}m`);
        }

        // Si alcanzamos la precisión objetivo, parar
        if (locationData.accuracy <= targetAccuracy) {
          setCaptureProgress(`Precisión objetivo alcanzada: ±${Math.round(locationData.accuracy)}m`);
          break;
        }

      } catch (error) {
        if (attempt === maxAttempts) {
          // Solo mostrar error en el último intento
          const errorMsg = error instanceof Error ? error.message : 'Error al obtener la ubicación';
          setError(errorMsg);
          setIsCapturing(false);
          setCaptureProgress('');
          
          toast({
            title: "Error de Geolocalización",
            description: errorMsg,
            variant: "destructive",
          });
          return;
        }
        // Continuar con el siguiente intento
        setCaptureProgress(`Intento ${attempt} falló, continuando...`);
      }
    }

    // Usar la mejor ubicación encontrada
    if (bestLocation) {
      onLocationCaptured(bestLocation);
      setIsCapturing(false);
      setCaptureProgress('');
      
      const accuracyText = bestAccuracy <= 10 ? 'GPS Preciso' : 'GPS Aprox.';
      toast({
        title: "Ubicación Capturada",
        description: `${accuracyText} ±${Math.round(bestAccuracy)}m`,
        className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
      });
    } else {
      setError('No se pudo obtener una ubicación válida después de todos los intentos');
      setIsCapturing(false);
      setCaptureProgress('');
    }
  };

  return (
    <Card className="border border-dashed border-gray-300">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Geolocalización de la Solicitud
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!currentLocation ? (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Capture la ubicación exacta donde se está realizando la solicitud
            </p>
            <Button
              onClick={captureLocation}
              disabled={isCapturing}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              {isCapturing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {captureProgress || 'Obteniendo ubicación...'}
                </>
              ) : (
                <>
                  <MapPin className="h-4 w-4 mr-2" />
                  Capturar Ubicación
                </>
              )}
            </Button>
            
            {/* Progress indicator */}
            {isCapturing && captureProgress && (
              <div className="text-xs text-center text-muted-foreground bg-blue-50 p-2 rounded">
                {captureProgress}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-green-700">
                Ubicación Capturada ({currentLocation.accuracy <= 10 ? 'GPS Preciso' : 'GPS Aprox.'} ±{Math.round(currentLocation.accuracy)}m)
              </span>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <LocationShare 
                  latitude={currentLocation.latitude} 
                  longitude={currentLocation.longitude} 
                />
              </div>
            </div>

            {/* Coordinate Display */}
            <CoordinateDisplay 
              latitude={currentLocation.latitude}
              longitude={currentLocation.longitude}
              accuracy={currentLocation.accuracy}
            />
            
            <div className="flex items-center justify-between text-xs">
              <div className="text-muted-foreground text-[11px] truncate max-w-[140px]">
                Capturada: {typeof currentLocation.timestamp === 'number' 
                  ? formatShortDateTimeToGuatemalan(currentLocation.timestamp)
                  : 'N/A'
                }
              </div>
              <Button
                onClick={captureLocation}
                disabled={isCapturing}
                size="sm"
                className="h-7 px-3 text-xs bg-green-600 hover:bg-green-700 text-white"
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                Recapturar
              </Button>
            </div>
          </div>
        )}
        
        {error && (
          <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GeolocationCapture;
