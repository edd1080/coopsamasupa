import { useEffect } from 'react';
import { getCSPHeaders } from '@/utils/securityUtils';

export const useSecurityHeaders = () => {
  useEffect(() => {
    // Apply security headers via meta tags for client-side enhancement
    const addMetaTag = (name: string, content: string) => {
      const existing = document.querySelector(`meta[name="${name}"]`);
      if (existing) {
        existing.setAttribute('content', content);
      } else {
        const meta = document.createElement('meta');
        meta.name = name;
        meta.content = content;
        document.head.appendChild(meta);
      }
    };

    // Content Security Policy
    const cspHeaders = getCSPHeaders();
    addMetaTag('Content-Security-Policy', cspHeaders['Content-Security-Policy']);

    // Additional security headers
    addMetaTag('X-Content-Type-Options', 'nosniff');
    addMetaTag('X-Frame-Options', 'DENY');
    addMetaTag('X-XSS-Protection', '1; mode=block');
    addMetaTag('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    // Remove X-Powered-By if present
    const poweredBy = document.querySelector('meta[name="X-Powered-By"]');
    if (poweredBy) {
      poweredBy.remove();
    }

  }, []);
};