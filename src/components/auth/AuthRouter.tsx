
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

// Pages
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Applications from "@/pages/Applications";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";
import RequestForm from "@/pages/RequestForm";
import ApplicationDetails from "@/pages/ApplicationDetails";
import Prequalifications from "@/pages/Prequalifications";
import PersonalInfo from "@/pages/PersonalInfo";
import ChangePassword from "@/pages/ChangePassword";
import ReportProblem from "@/pages/ReportProblem";

const AuthRouter = () => {
  const { user, loading } = useAuth();

  console.log('🔀 AuthRouter - Loading:', loading, 'User:', !!user);

  // Show loading while checking auth state
  if (loading) {
    console.log('⏳ AuthRouter showing loading state');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated, show protected routes
  if (user) {
    console.log('✅ User authenticated, showing protected routes');
    return (
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/applications/new" element={<RequestForm />} />
        <Route path="/applications/:id" element={<ApplicationDetails />} />
        <Route path="/applications/:id/edit" element={<RequestForm />} />
        <Route path="/applications/:id/guarantors/new" element={<RequestForm />} />
        <Route path="/applications/:id/guarantors/:guarantorId" element={<ApplicationDetails />} />
        <Route path="/applications/:id/guarantors/:guarantorId/edit" element={<RequestForm />} />
        <Route path="/prequalifications" element={<Prequalifications />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/settings/personal-info" element={<PersonalInfo />} />
        <Route path="/settings/change-password" element={<ChangePassword />} />
        <Route path="/settings/report-problem" element={<ReportProblem />} />
        <Route path="/login" element={<Index />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    );
  }

  // If user is not authenticated, only show login route
  console.log('🚫 User not authenticated, showing login routes');
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<Login />} />
    </Routes>
  );
};

export default AuthRouter;
