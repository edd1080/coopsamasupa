
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/hooks/useAuth";
import AuthRouter from "@/components/auth/AuthRouter";
import React, { useState } from "react";

// PWA Components
import SplashScreen from "@/components/pwa/SplashScreen";
import UpdatePrompt from "@/components/pwa/UpdatePrompt";
import InstallPrompt from "@/components/pwa/InstallPrompt";
import { usePWA } from "@/hooks/usePWA";

// Create a client
const queryClient = new QueryClient();

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
    <QueryClientProvider client={queryClient}>
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
              <BrowserRouter>
                <AuthRouter />
              </BrowserRouter>
            </AuthProvider>
          )}
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
