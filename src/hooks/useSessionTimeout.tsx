import { useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface UseSessionTimeoutProps {
  timeoutDuration?: number; // in milliseconds, default 8 hours
  warningDuration?: number; // in milliseconds, default 30 minutes before timeout
  inactivityDuration?: number; // in milliseconds, default 12 hours
}

export const useSessionTimeout = ({
  timeoutDuration = 8 * 60 * 60 * 1000, // 8 hours
  warningDuration = 30 * 60 * 1000, // 30 minutes
  inactivityDuration = 12 * 60 * 60 * 1000, // 12 hours
}: UseSessionTimeoutProps = {}) => {
  const { user, session, signOut } = useAuth();
  const { toast } = useToast();
  const timeoutRef = useRef<NodeJS.Timeout>();
  const warningRef = useRef<NodeJS.Timeout>();
  const inactivityRef = useRef<NodeJS.Timeout>();
  const lastActivityRef = useRef<number>(Date.now());

  const resetTimers = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (warningRef.current) clearTimeout(warningRef.current);
    if (inactivityRef.current) clearTimeout(inactivityRef.current);
  };

  const updateLastActivity = () => {
    lastActivityRef.current = Date.now();
    resetTimers();
    
    if (user && session) {
      // Set warning timer
      warningRef.current = setTimeout(() => {
        toast({
          title: "Sesión por Expirar",
          description: "Su sesión expirará en 30 minutos por inactividad.",
          variant: "destructive",
        });
      }, timeoutDuration - warningDuration);

      // Set logout timer
      timeoutRef.current = setTimeout(() => {
        toast({
          title: "Sesión Expirada",
          description: "Su sesión ha expirado por seguridad. Por favor, inicie sesión nuevamente.",
          variant: "destructive",
        });
        signOut();
      }, timeoutDuration);

      // Set inactivity timer (fallback)
      inactivityRef.current = setTimeout(() => {
        toast({
          title: "Sesión Cerrada por Inactividad",
          description: "Su sesión se ha cerrado por inactividad prolongada.",
          variant: "destructive",
        });
        signOut();
      }, inactivityDuration);
    }
  };

  useEffect(() => {
    if (user && session) {
      updateLastActivity();

      // Track user activity
      const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
      
      const handleActivity = () => {
        const now = Date.now();
        const timeSinceLastActivity = now - lastActivityRef.current;
        
        // Only reset if more than 1 minute has passed since last activity
        if (timeSinceLastActivity > 60000) {
          updateLastActivity();
        }
      };

      events.forEach(event => {
        document.addEventListener(event, handleActivity, true);
      });

      return () => {
        events.forEach(event => {
          document.removeEventListener(event, handleActivity, true);
        });
        resetTimers();
      };
    } else {
      resetTimers();
    }
  }, [user, session, timeoutDuration, warningDuration, inactivityDuration]);

  return { updateLastActivity };
};