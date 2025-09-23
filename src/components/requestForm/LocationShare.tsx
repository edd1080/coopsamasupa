
import React from 'react';
import { Button } from '@/components/ui/button';
import { Share, Navigation, MapPin } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface LocationShareProps {
  latitude: number;
  longitude: number;
}

const LocationShare: React.FC<LocationShareProps> = ({ latitude, longitude }) => {
  const openInGoogleMaps = () => {
    const url = `https://maps.google.com/?q=${latitude},${longitude}`;
    window.open(url, '_blank');
  };

  const openInWaze = () => {
    const url = `https://waze.com/ul?ll=${latitude}%2C${longitude}&navigate=yes`;
    window.open(url, '_blank');
  };

  const openInAppleMaps = () => {
    const url = `https://maps.apple.com/?ll=${latitude},${longitude}`;
    window.open(url, '_blank');
  };

  const copyCoordinates = () => {
    const coordinates = `${latitude}, ${longitude}`;
    navigator.clipboard.writeText(coordinates);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1 h-6 px-2 text-xs">
          <Share className="h-3 w-3" />
          Compartir
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48 bg-white dark:bg-gray-800 border shadow-md">
        <DropdownMenuItem onClick={openInGoogleMaps} className="flex items-center gap-2 cursor-pointer">
          <MapPin className="h-4 w-4" />
          Google Maps
        </DropdownMenuItem>
        <DropdownMenuItem onClick={openInWaze} className="flex items-center gap-2 cursor-pointer">
          <Navigation className="h-4 w-4" />
          Waze
        </DropdownMenuItem>
        <DropdownMenuItem onClick={openInAppleMaps} className="flex items-center gap-2 cursor-pointer">
          <MapPin className="h-4 w-4" />
          Apple Maps
        </DropdownMenuItem>
        <DropdownMenuItem onClick={copyCoordinates} className="flex items-center gap-2 cursor-pointer">
          <Share className="h-4 w-4" />
          Copiar Coordenadas
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LocationShare;
