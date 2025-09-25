import { AlertTriangle, Wifi, WifiOff } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useNetworkSync } from '@/hooks/useNetworkSync';

export const OfflineBanner = () => {
  const { isOnline, isSyncing } = useNetworkSync();

  if (isOnline && !isSyncing) return null;

  return (
    <Alert className="fixed top-14 left-0 right-0 z-10 rounded-none border-b border-orange-400 bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100 py-1">
      <div className="flex items-center gap-2 px-2">
        {isSyncing ? (
          <Wifi className="h-3 w-3 animate-pulse" />
        ) : (
          <WifiOff className="h-3 w-3" />
        )}
        <AlertDescription className="text-xs font-medium">
          {isSyncing 
            ? "Sincronizando datos..." 
            : "Modo offline - Los cambios se sincronizarán al reconectar"
          }
        </AlertDescription>
      </div>
    </Alert>
  );
};