
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Clock } from 'lucide-react';

interface CoordinateDisplayProps {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

const CoordinateDisplay: React.FC<CoordinateDisplayProps> = ({ latitude, longitude, accuracy }) => {
  // Validate coordinates
  const isValidCoordinate = (lat: number, lng: number): boolean => {
    return !isNaN(lat) && !isNaN(lng) && 
           lat >= -90 && lat <= 90 && 
           lng >= -180 && lng <= 180;
  };

  if (!isValidCoordinate(latitude, longitude)) {
    return (
      <div className="h-32 w-full border rounded-lg flex items-center justify-center bg-muted">
        <p className="text-sm text-muted-foreground">Coordenadas inválidas</p>
      </div>
    );
  }


  return (
    <Card className="w-full border border-gray-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <MapPin className="h-4 w-4 text-blue-600" />
          Coordenadas de Ubicación
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Coordinates Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div>
              <span className="text-xs font-medium text-muted-foreground">Latitud</span>
            </div>
            <p className="font-mono text-sm bg-muted text-foreground p-2 rounded border">
              {latitude.toFixed(6)}
            </p>
          </div>
          <div className="space-y-1">
            <div>
              <span className="text-xs font-medium text-muted-foreground">Longitud</span>
            </div>
            <p className="font-mono text-sm bg-muted text-foreground p-2 rounded border">
              {longitude.toFixed(6)}
            </p>
          </div>
        </div>

        {/* Accuracy Information */}
        {accuracy && (
          <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-800 dark:text-blue-300">Precisión</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono text-blue-800 dark:text-blue-300">{Math.round(accuracy)}m</span>
            </div>
          </div>
        )}

      </CardContent>
    </Card>
  );
};

export default CoordinateDisplay;
