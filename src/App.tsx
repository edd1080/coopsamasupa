
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient } from "@tanstack/react-query";

import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import localforage from "localforage";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/hooks/useAuth";
import AuthRouter from "@/components/auth/AuthRouter";
import React, { useState } from "react";

// PWA Components
import SplashScreen from "@/components/pwa/SplashScreen";
import UpdatePrompt from "@/components/pwa/UpdatePrompt";
import InstallPrompt from "@/components/pwa/InstallPrompt";
import { OfflineBanner } from "@/components/pwa/OfflineBanner";
import { usePWA } from "@/hooks/usePWA";

// Create a client with extended cache time for offline support
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 24 * 60 * 60 * 1000, // 24 hours (was cacheTime)
      retry: (failureCount, error) => {
        // Don't retry if offline
        if (!navigator.onLine) return false;
        return failureCount < 3;
      },
    },
    mutations: {
      networkMode: 'always', // <- permite ejecutar mutaciones estando offline
    },
  },
});

// Create persister for offline cache
const persister = {
  persistClient: async (client: any) => {
    await localforage.setItem('coopsama-query-cache', client);
  },
  restoreClient: async () => {
    const data = await localforage.getItem('coopsama-query-cache');
    return data as any;
  },
  removeClient: async () => {
    await localforage.removeItem('coopsama-query-cache');
  },
};

const App = () => {
  const { isLoading, updateAvailable, updateApp } = usePWA();
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);

  React.useEffect(() => {
    if (updateAvailable) {
      setShowUpdatePrompt(true);
    }
  }, [updateAvailable]);

  const handleUpdate = () => {
    updateApp();
    setShowUpdatePrompt(false);
  };

  const handleDismissUpdate = () => {
    setShowUpdatePrompt(false);
  };

  return (
    <PersistQueryClientProvider 
      client={queryClient} 
      persistOptions={{ persister }}
    >
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          
          {/* PWA Splash Screen */}
          <SplashScreen isVisible={isLoading} />
          
          {/* PWA Update Prompt */}
          <UpdatePrompt 
            isVisible={showUpdatePrompt}
            onUpdate={handleUpdate}
            onDismiss={handleDismissUpdate}
          />
          
          {/* PWA Install Prompt */}
          <InstallPrompt />
          
          {/* Main App Content */}
          {!isLoading && (
            <AuthProvider>
              {/* Offline Banner - needs auth context */}
              <OfflineBanner />
              <BrowserRouter>
                <AuthRouter />
              </BrowserRouter>
            </AuthProvider>
          )}
        </TooltipProvider>
      </ThemeProvider>
    </PersistQueryClientProvider>
  );
};

export default App;
