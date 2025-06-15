
import { useState, useEffect, createContext, useContext, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: any) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Use ref to prevent multiple navigations
  const hasNavigatedRef = useRef(false);

  useEffect(() => {
    console.log('🏁 AuthProvider initializing...');
    let mounted = true;

    // Simple auth state change handler without dependencies
    const handleAuthChange = (event: string, session: Session | null) => {
      if (!mounted) return;
      
      console.log('🔐 Auth event:', event, 'User ID:', session?.user?.id);
      
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      // Handle navigation only for successful sign in
      if (event === 'SIGNED_IN' && session?.user && !hasNavigatedRef.current) {
        const currentPath = window.location.pathname;
        console.log('🚀 User signed in, current path:', currentPath);
        
        if (currentPath === '/login') {
          console.log('🔄 Navigating from login to dashboard');
          hasNavigatedRef.current = true;
          navigate('/', { replace: true });
        }
      }
      
      // Reset navigation flag on sign out
      if (event === 'SIGNED_OUT') {
        console.log('👋 User signed out');
        hasNavigatedRef.current = false;
      }
    };

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('❌ Error getting initial session:', error);
          if (mounted) setLoading(false);
          return;
        }
        
        if (mounted) {
          console.log('📋 Initial session loaded:', !!session, 'User:', session?.user?.id);
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
        }
      } catch (error) {
        console.error('❌ Error in getInitialSession:', error);
        if (mounted) setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthChange);

    return () => {
      console.log('🛑 AuthProvider cleanup');
      mounted = false;
      subscription.unsubscribe();
    };
  }, []); // Empty dependency array to prevent re-runs

  const signIn = async (email: string, password: string) => {
    console.log('🔑 Attempting sign in for:', email);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('❌ Sign in error:', error);
      throw new Error(error.message);
    }

    console.log('✅ Sign in successful');
    toast({
      title: "¡Inicio de sesión exitoso!",
      description: "Bienvenido/a a Coopsama App"
    });
  };

  const signUp = async (email: string, password: string, userData: any) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });

    if (error) {
      throw new Error(error.message);
    }

    toast({
      title: "Registro exitoso",
      description: "Se ha enviado un email de confirmación"
    });
  };

  const signOut = async () => {
    console.log('👋 Signing out');
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }

    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión exitosamente"
    });
    
    hasNavigatedRef.current = false;
    navigate('/login', { replace: true });
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
