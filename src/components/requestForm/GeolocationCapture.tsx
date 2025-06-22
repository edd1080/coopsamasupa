
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Loader2, AlertCircle, CheckCircle, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import InteractiveMap from './InteractiveMap';
import LocationShare from './LocationShare';

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
  const { toast } = useToast();

  const captureLocation = () => {
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

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000 // 5 minutes
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const locationData: GeolocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: Date.now()
        };

        onLocationCaptured(locationData);
        setIsCapturing(false);
        
        toast({
          title: "Ubicación Capturada",
          description: `Precisión: ${Math.round(position.coords.accuracy)} metros`,
          className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
        });
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
        
        setError(errorMsg);
        setIsCapturing(false);
        
        toast({
          title: "Error de Geolocalización",
          description: errorMsg,
          variant: "destructive",
        });
      },
      options
    );
  };

  const getAccuracyStatus = (accuracy: number) => {
    if (accuracy <= 10) return { label: 'Excelente', color: 'text-green-600', icon: CheckCircle };
    if (accuracy <= 50) return { label: 'Buena', color: 'text-yellow-600', icon: CheckCircle };
    return { label: 'Regular', color: 'text-orange-600', icon: AlertCircle };
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
              className="w-full"
              variant="outline"
            >
              {isCapturing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Obteniendo ubicación...
                </>
              ) : (
                <>
                  <MapPin className="h-4 w-4 mr-2" />
                  Capturar Ubicación
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-green-700">Ubicación Capturada</span>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <LocationShare 
                  latitude={currentLocation.latitude} 
                  longitude={currentLocation.longitude} 
                />
              </div>
            </div>

            {/* Interactive Map */}
            <InteractiveMap 
              latitude={currentLocation.latitude}
              longitude={currentLocation.longitude}
              accuracy={currentLocation.accuracy}
            />
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-muted-foreground">Latitud:</span>
                <p className="font-mono">
                  {typeof currentLocation.latitude === 'number' ? currentLocation.latitude.toFixed(6) : 'N/A'}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Longitud:</span>
                <p className="font-mono">
                  {typeof currentLocation.longitude === 'number' ? currentLocation.longitude.toFixed(6) : 'N/A'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-xs">
              <div>
                <span className="text-muted-foreground">Precisión:</span>
                <span className={`ml-1 font-medium ${typeof currentLocation.accuracy === 'number' ? getAccuracyStatus(currentLocation.accuracy).color : 'text-gray-500'}`}>
                  {typeof currentLocation.accuracy === 'number' 
                    ? `${Math.round(currentLocation.accuracy)}m (${getAccuracyStatus(currentLocation.accuracy).label})`
                    : 'N/A'
                  }
                </span>
              </div>
              <Button
                onClick={captureLocation}
                disabled={isCapturing}
                size="sm"
                variant="secondary"
                className="h-7 px-3 text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200"
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                Recapturar
              </Button>
            </div>
            
            <div className="text-xs text-muted-foreground">
              Capturada: {typeof currentLocation.timestamp === 'number' 
                ? new Date(currentLocation.timestamp).toLocaleString('es-GT')
                : 'N/A'
              }
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
