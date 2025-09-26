import { AlertTriangle, Wifi, WifiOff } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useNetworkSync } from '@/hooks/useNetworkSync';

export const OfflineBanner = () => {
  const { isOnline, isSyncing } = useNetworkSync();

  // Log banner state for debugging
  console.log('🚨 OFFLINE BANNER STATE:', { 
    isOnline, 
    isSyncing, 
    willShow: !isOnline || isSyncing
  });

  if (isOnline && !isSyncing) return null;

  return (
    <Alert className="fixed top-0 left-0 right-0 z-[60] rounded-none border-b border-orange-400 bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100 py-1 h-8">
      <div className="flex items-center gap-1.5 px-2 h-full">
        {isSyncing ? (
          <Wifi className="h-2.5 w-2.5 animate-pulse" />
        ) : (
          <WifiOff className="h-2.5 w-2.5" />
        )}
        <AlertDescription className="text-[10px] font-medium leading-tight">
          {isSyncing 
            ? "Sincronizando datos..." 
            : "Modo offline - Los cambios se sincronizarán al reconectar"
          }
        </AlertDescription>
      </div>
    </Alert>
  );
};