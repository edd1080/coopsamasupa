
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

// Enhanced authentication hook with security features
export const useSecureAuth = () => {
  const { user, session, loading, signIn, signUp, signOut } = useAuth();
  const { toast } = useToast();
  const [isSecureSession, setIsSecureSession] = useState(false);

  useEffect(() => {
    // Validate session security
    if (session) {
      const now = Date.now() / 1000;
      const expiresAt = session.expires_at || 0;
      
      // Check if session is close to expiry (within 5 minutes)
      if (expiresAt - now < 300) {
        console.warn('🔒 Session expiring soon');
        toast({
          title: "Sesión por expirar",
          description: "Tu sesión expirará pronto. Guarda tu trabajo.",
          variant: "destructive",
          duration: 5000
        });
      }
      
      setIsSecureSession(true);
    } else {
      setIsSecureSession(false);
    }
  }, [session, toast]);

  const secureSignIn = async (email: string, password: string) => {
    try {
      // Input validation before authentication
      if (!email || !password) {
        throw new Error('Email y contraseña son requeridos');
      }
      
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error('Formato de email inválido');
      }

      await signIn(email, password);
      
      console.log('🔐 Secure sign in successful');
    } catch (error: any) {
      console.error('❌ Secure sign in error:', error.message);
      
      // Enhanced error handling without exposing system details
      const userFriendlyMessage = error.message.includes('Invalid login credentials') 
        ? 'Credenciales inválidas. Verifica tu email y contraseña.' 
        : 'Error de autenticación. Inténtalo de nuevo.';
        
      toast({
        title: "Error de autenticación",
        description: userFriendlyMessage,
        variant: "destructive",
        duration: 4000
      });
      
      throw new Error(userFriendlyMessage);
    }
  };

  const secureSignUp = async (email: string, password: string, userData: any) => {
    try {
      // Enhanced input validation
      if (!email || !password) {
        throw new Error('Email y contraseña son requeridos');
      }
      
      if (password.length < 8) {
        throw new Error('La contraseña debe tener al menos 8 caracteres');
      }
      
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error('Formato de email inválido');
      }

      await signUp(email, password, {
        ...userData,
        emailRedirectTo: `${window.location.origin}/login`
      });
      
      console.log('🔐 Secure sign up successful');
    } catch (error: any) {
      console.error('❌ Secure sign up error:', error.message);
      
      const userFriendlyMessage = error.message.includes('User already registered') 
        ? 'Este email ya está registrado. Intenta iniciar sesión.' 
        : error.message || 'Error de registro. Inténtalo de nuevo.';
        
      toast({
        title: "Error de registro",
        description: userFriendlyMessage,
        variant: "destructive",
        duration: 4000
      });
      
      throw new Error(userFriendlyMessage);
    }
  };

  const secureSignOut = async () => {
    try {
      await signOut();
      setIsSecureSession(false);
      console.log('🔐 Secure sign out successful');
    } catch (error: any) {
      console.error('❌ Secure sign out error:', error.message);
      toast({
        title: "Error al cerrar sesión",
        description: "Hubo un problema al cerrar la sesión.",
        variant: "destructive"
      });
    }
  };

  return {
    user,
    session,
    loading,
    isSecureSession,
    signIn: secureSignIn,
    signUp: secureSignUp,
    signOut: secureSignOut,
  };
};
