
import { useState, useEffect, createContext, useContext, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  
  // Use ref to prevent unnecessary re-renders
  const mountedRef = useRef(true);
  const subscriptionRef = useRef<any>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    
    console.log('🏁 AuthProvider initializing...');
    initializedRef.current = true;
    
    // Auth state change handler - NO navigation here, just state updates
    const handleAuthChange = (event: string, session: Session | null) => {
      if (!mountedRef.current) return;
      
      console.log('🔐 Auth event:', event, 'Session:', !!session);
      
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    };

    // Get initial session and set up listener
    const initializeAuth = async () => {
      try {
        // Set up the listener first
        subscriptionRef.current = supabase.auth.onAuthStateChange(handleAuthChange);
        
        // Then get initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('❌ Error getting initial session:', error);
        } else {
          console.log('📋 Initial session loaded:', !!session);
          if (mountedRef.current) {
            setSession(session);
            setUser(session?.user ?? null);
          }
        }
      } catch (error) {
        console.error('❌ Error in initializeAuth:', error);
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Cleanup function
    return () => {
      console.log('🛑 AuthProvider cleanup');
      mountedRef.current = false;
      // DON'T reset initializedRef - we want to stay initialized
      if (subscriptionRef.current) {
        subscriptionRef.current.data.subscription.unsubscribe();
      }
    };
  }, []); // Empty dependency array - this effect should only run once

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
