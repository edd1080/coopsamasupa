
import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface InteractiveMapProps {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ latitude, longitude, accuracy }) => {
  const position: [number, number] = [latitude, longitude];

  return (
    <div className="h-48 w-full rounded-lg overflow-hidden border">
      <MapContainer
        center={position}
        zoom={16}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            Ubicación capturada
            {accuracy && (
              <div className="text-xs text-muted-foreground">
                Precisión: {Math.round(accuracy)}m
              </div>
            )}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default InteractiveMap;
