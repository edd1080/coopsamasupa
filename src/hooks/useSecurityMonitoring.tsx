import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface SecurityEvent {
  event_type: string;
  user_id?: string;
  details: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
}

export const useSecurityMonitoring = () => {
  const { user } = useAuth();

  const logSecurityEvent = async (event: SecurityEvent) => {
    try {
      // In a production environment, you would send this to a logging service
      // For now, we'll use console logging with sanitized data
      const sanitizedEvent = {
        ...event,
        timestamp: new Date().toISOString(),
        user_id: user?.id || 'anonymous'
      };
      
      console.log('🔐 Security Event:', sanitizedEvent);
      
      // You could also store critical events in Supabase
      // await supabase.from('security_logs').insert(sanitizedEvent);
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  };

  const detectSuspiciousActivity = () => {
    // Monitor for rapid page changes
    let pageChangeCount = 0;
    const resetCount = () => { pageChangeCount = 0; };
    
    window.addEventListener('popstate', () => {
      pageChangeCount++;
      if (pageChangeCount > 10) {
        logSecurityEvent({
          event_type: 'suspicious_navigation',
          details: { 
            rapid_page_changes: pageChangeCount,
            message: 'Detected rapid page navigation - possible automated behavior'
          }
        });
      }
      
      // Reset counter after 5 seconds
      setTimeout(resetCount, 5000);
    });

    // Monitor for multiple failed form submissions
    let formFailureCount = 0;
    const resetFormFailures = () => { formFailureCount = 0; };
    
    window.addEventListener('formError', ((event: CustomEvent) => {
      formFailureCount++;
      if (formFailureCount > 5) {
        logSecurityEvent({
          event_type: 'multiple_form_failures',
          details: {
            failure_count: formFailureCount,
            last_error: event.detail?.error
          }
        });
      }
      
      // Reset counter after 10 minutes
      setTimeout(resetFormFailures, 600000);
    }) as EventListener);
  };

  useEffect(() => {
    detectSuspiciousActivity();
    
    // Log user login
    if (user) {
      logSecurityEvent({
        event_type: 'user_authenticated',
        details: { 
          user_email: user.email,
          auth_method: 'password'
        }
      });
    }
  }, [user]);

  return { logSecurityEvent };
};