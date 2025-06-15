
import { useState, useEffect, createContext, useContext, useCallback, useRef } from 'react';
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
  const [initialized, setInitialized] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Use refs to avoid dependency issues
  const currentUserIdRef = useRef<string | null>(null);
  const currentSessionTokenRef = useRef<string | null>(null);
  const hasNavigatedRef = useRef(false);

  // Memoize the auth state change handler with minimal dependencies
  const handleAuthChange = useCallback((event: string, session: Session | null) => {
    console.log('🔐 Auth event:', event, 'User ID:', session?.user?.id, 'Has session:', !!session);
    
    const newUserId = session?.user?.id || null;
    const newSessionToken = session?.access_token || null;
    
    // Only update state if there's an actual change using refs for comparison
    const userChanged = currentUserIdRef.current !== newUserId;
    const sessionChanged = currentSessionTokenRef.current !== newSessionToken;
    
    if (userChanged || sessionChanged) {
      console.log('📝 Auth state updating - User changed:', userChanged, 'Session changed:', sessionChanged);
      
      currentUserIdRef.current = newUserId;
      currentSessionTokenRef.current = newSessionToken;
      
      setSession(session);
      setUser(session?.user ?? null);
    }
    
    // Handle initialization
    if (!initialized) {
      console.log('✅ Auth initialized');
      setLoading(false);
      setInitialized(true);
      hasNavigatedRef.current = false;
    }

    // Handle navigation only for successful sign in and prevent multiple navigations
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
  }, [navigate, initialized]);

  useEffect(() => {
    let mounted = true;
    console.log('🏁 AuthProvider initializing...');

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('❌ Error getting initial session:', error);
          return;
        }
        
        if (mounted) {
          console.log('📋 Initial session loaded:', !!session, 'User:', session?.user?.id);
          
          // Update refs first
          currentUserIdRef.current = session?.user?.id || null;
          currentSessionTokenRef.current = session?.access_token || null;
          
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
          setInitialized(true);
        }
      } catch (error) {
        console.error('❌ Error in getInitialSession:', error);
        if (mounted) {
          setLoading(false);
          setInitialized(true);
        }
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
  }, [handleAuthChange]);

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
