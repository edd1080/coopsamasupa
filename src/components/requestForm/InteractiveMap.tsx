
import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
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
  // Validate coordinates
  const isValidCoordinate = (lat: number, lng: number): boolean => {
    return !isNaN(lat) && !isNaN(lng) && 
           lat >= -90 && lat <= 90 && 
           lng >= -180 && lng <= 180;
  };

  if (!isValidCoordinate(latitude, longitude)) {
    return (
      <div className="h-48 w-full border rounded-lg flex items-center justify-center bg-gray-50">
        <p className="text-sm text-muted-foreground">Coordenadas inválidas</p>
      </div>
    );
  }

  const position: LatLngExpression = [latitude, longitude];

  return (
    <div className="h-48 w-full rounded-lg overflow-hidden border">
      <MapContainer
        center={position}
        zoom={16}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
        scrollWheelZoom={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={position}>
          <Popup>
            <div className="text-center space-y-1">
              <p className="font-medium">Ubicación Capturada</p>
              <div className="text-xs text-muted-foreground space-y-1">
                <div>Lat: {latitude.toFixed(6)}</div>
                <div>Lng: {longitude.toFixed(6)}</div>
                {accuracy && (
                  <div>Precisión: {Math.round(accuracy)}m</div>
                )}
              </div>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default InteractiveMap;
