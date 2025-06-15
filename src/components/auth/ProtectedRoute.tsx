
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const [sessionChecked, setSessionChecked] = useState(false);
  const checkInProgress = useRef(false);

  useEffect(() => {
    // Avoid multiple simultaneous session checks
    if (loading || checkInProgress.current || sessionChecked) {
      return;
    }

    const checkSession = async () => {
      checkInProgress.current = true;
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log('ProtectedRoute session check:', session);
        setSessionChecked(true);
      } catch (error) {
        console.error('Error checking session:', error);
        setSessionChecked(true);
      } finally {
        checkInProgress.current = false;
      }
    };
    
    checkSession();
  }, [loading, sessionChecked]);

  if (loading || !sessionChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('No user found, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  console.log('User authenticated, rendering protected content');
  return <>{children}</>;
};

export default ProtectedRoute;
