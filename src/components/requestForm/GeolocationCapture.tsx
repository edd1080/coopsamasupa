
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Loader2, AlertCircle, CheckCircle, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import CoordinateDisplay from './CoordinateDisplay';
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

            {/* Coordinate Display */}
            <CoordinateDisplay 
              latitude={currentLocation.latitude}
              longitude={currentLocation.longitude}
              accuracy={currentLocation.accuracy}
            />
            
            <div className="flex items-center justify-between text-xs">
              <div className="text-muted-foreground">
                Capturada: {typeof currentLocation.timestamp === 'number' 
                  ? new Date(currentLocation.timestamp).toLocaleString('es-GT')
                  : 'N/A'
                }
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
