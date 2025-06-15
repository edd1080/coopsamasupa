
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import React, { useState } from "react";

// PWA Components
import SplashScreen from "@/components/pwa/SplashScreen";
import UpdatePrompt from "@/components/pwa/UpdatePrompt";
import { usePWA } from "@/hooks/usePWA";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Applications from "./pages/Applications";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import RequestForm from "./pages/RequestForm";
import ApplicationDetails from "./pages/ApplicationDetails";
import Prequalifications from "./pages/Prequalifications";
import PersonalInfo from "./pages/PersonalInfo";
import ChangePassword from "./pages/ChangePassword";
import ReportProblem from "./pages/ReportProblem";

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
          
          {/* Main App Content */}
          {!isLoading && (
            <BrowserRouter>
              <AuthProvider>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/" element={
                    <ProtectedRoute>
                      <Index />
                    </ProtectedRoute>
                  } />
                  <Route path="/applications" element={
                    <ProtectedRoute>
                      <Applications />
                    </ProtectedRoute>
                  } />
                  <Route path="/applications/new" element={
                    <ProtectedRoute>
                      <RequestForm />
                    </ProtectedRoute>
                  } />
                  <Route path="/applications/:id" element={
                    <ProtectedRoute>
                      <ApplicationDetails />
                    </ProtectedRoute>
                  } />
                  <Route path="/applications/:id/edit" element={
                    <ProtectedRoute>
                      <RequestForm />
                    </ProtectedRoute>
                  } />
                  <Route path="/applications/:id/guarantors/new" element={
                    <ProtectedRoute>
                      <RequestForm />
                    </ProtectedRoute>
                  } />
                  <Route path="/applications/:id/guarantors/:guarantorId" element={
                    <ProtectedRoute>
                      <ApplicationDetails />
                    </ProtectedRoute>
                  } />
                  <Route path="/applications/:id/guarantors/:guarantorId/edit" element={
                    <ProtectedRoute>
                      <RequestForm />
                    </ProtectedRoute>
                  } />
                  <Route path="/prequalifications" element={
                    <ProtectedRoute>
                      <Prequalifications />
                    </ProtectedRoute>
                  } />
                  <Route path="/settings" element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  } />
                  <Route path="/settings/personal-info" element={
                    <ProtectedRoute>
                      <PersonalInfo />
                    </ProtectedRoute>
                  } />
                  <Route path="/settings/change-password" element={
                    <ProtectedRoute>
                      <ChangePassword />
                    </ProtectedRoute>
                  } />
                  <Route path="/settings/report-problem" element={
                    <ProtectedRoute>
                      <ReportProblem />
                    </ProtectedRoute>
                  } />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AuthProvider>
            </BrowserRouter>
          )}
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
