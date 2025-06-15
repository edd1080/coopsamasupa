
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '@/components/auth/LoginForm';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { useAuth } from '@/hooks/useAuth';

const Login = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const hasRedirectedRef = useRef(false);

  // Simple redirect for authenticated users - only once
  useEffect(() => {
    if (!loading && user && !hasRedirectedRef.current) {
      console.log('🔄 User already authenticated, redirecting to dashboard');
      hasRedirectedRef.current = true;
      navigate('/', { replace: true });
    }
  }, [user, loading, navigate]);

  // Show loading while checking auth state
  if (loading) {
    console.log('⏳ Login page showing loading state');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  // Don't render login form if user is authenticated or has been redirected
  if (user || hasRedirectedRef.current) {
    return null;
  }

  console.log('📝 Rendering login form');
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-background/95">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="w-full max-w-md space-y-6 animate-fade-in">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary">Coopsama App</h1>
          <p className="mt-1 text-muted-foreground">Portal de Agentes</p>
        </div>
        
        <div className="bg-card p-5 rounded-lg border border-border shadow-sm">
          <h2 className="text-xl font-semibold mb-5 text-card-foreground">Iniciar Sesión</h2>
          <LoginForm />
        </div>
        
        <div className="text-center text-xs text-muted-foreground">
          <p>© 2025 Coopsama App. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
