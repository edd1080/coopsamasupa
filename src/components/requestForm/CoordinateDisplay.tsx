
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Target, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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
      <div className="h-32 w-full border rounded-lg flex items-center justify-center bg-gray-50">
        <p className="text-sm text-muted-foreground">Coordenadas inválidas</p>
      </div>
    );
  }

  const getAccuracyStatus = (accuracy: number) => {
    if (accuracy <= 10) return { label: 'Excelente', color: 'bg-green-100 text-green-800' };
    if (accuracy <= 50) return { label: 'Buena', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'Regular', color: 'bg-orange-100 text-orange-800' };
  };

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
            <div className="flex items-center gap-1">
              <Target className="h-3 w-3 text-blue-500" />
              <span className="text-xs font-medium text-gray-600">Latitud</span>
            </div>
            <p className="font-mono text-sm bg-gray-50 p-2 rounded border">
              {latitude.toFixed(6)}
            </p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <Target className="h-3 w-3 text-blue-500" />
              <span className="text-xs font-medium text-gray-600">Longitud</span>
            </div>
            <p className="font-mono text-sm bg-gray-50 p-2 rounded border">
              {longitude.toFixed(6)}
            </p>
          </div>
        </div>

        {/* Accuracy Information */}
        {accuracy && (
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Precisión</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono text-blue-800">{Math.round(accuracy)}m</span>
              <Badge variant="secondary" className={getAccuracyStatus(accuracy).color}>
                {getAccuracyStatus(accuracy).label}
              </Badge>
            </div>
          </div>
        )}

        {/* Location Info */}
        <div className="text-xs text-center text-muted-foreground bg-gray-50 p-2 rounded">
          📍 Ubicación capturada con precisión GPS
        </div>
      </CardContent>
    </Card>
  );
};

export default CoordinateDisplay;
