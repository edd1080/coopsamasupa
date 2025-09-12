import { AlertTriangle, Wifi, WifiOff } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useNetworkSync } from '@/hooks/useNetworkSync';

export const OfflineBanner = () => {
  const { isOnline, isSyncing } = useNetworkSync();

  if (isOnline && !isSyncing) return null;

  return (
    <Alert className="fixed bottom-20 left-0 right-0 z-40 rounded-none border-t border-orange-400 bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100">
      <div className="flex items-center gap-2">
        {isSyncing ? (
          <Wifi className="h-4 w-4 animate-pulse" />
        ) : (
          <WifiOff className="h-4 w-4" />
        )}
        <AlertDescription className="text-sm font-medium">
          {isSyncing 
            ? "Sincronizando datos..." 
            : "Modo offline - Los cambios se sincronizarán al reconectar"
          }
        </AlertDescription>
      </div>
    </Alert>
  );
};