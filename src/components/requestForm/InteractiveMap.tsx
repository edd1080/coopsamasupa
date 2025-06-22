
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

interface InteractiveMapProps {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ latitude, longitude, accuracy }) => {
  return (
    <Card className="h-48 w-full border">
      <CardContent className="p-4 h-full flex flex-col items-center justify-center space-y-2">
        <MapPin className="h-8 w-8 text-primary" />
        <div className="text-center space-y-1">
          <p className="text-sm font-medium">Ubicación Capturada</p>
          <div className="text-xs text-muted-foreground space-y-1">
            <div>Lat: {latitude.toFixed(6)}</div>
            <div>Lng: {longitude.toFixed(6)}</div>
            {accuracy && (
              <div>Precisión: {Math.round(accuracy)}m</div>
            )}
          </div>
        </div>
        <p className="text-xs text-muted-foreground text-center mt-2">
          Mapa interactivo temporalmente no disponible
        </p>
      </CardContent>
    </Card>
  );
};

export default InteractiveMap;
