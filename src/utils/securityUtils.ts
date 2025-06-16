
// Security utility functions
export const sanitizeConsoleOutput = (data: any): string => {
  // In production, sanitize or disable sensitive console outputs
  if (process.env.NODE_ENV === 'production') {
    return '[REDACTED]';
  }
  
  // In development, still sanitize sensitive data
  if (typeof data === 'object' && data !== null) {
    const sensitiveKeys = ['password', 'token', 'secret', 'key', 'auth'];
    const sanitized = { ...data };
    
    Object.keys(sanitized).forEach(key => {
      if (sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
        sanitized[key] = '[REDACTED]';
      }
    });
    
    return JSON.stringify(sanitized);
  }
  
  return String(data);
};

// Rate limiting helper (client-side basic implementation)
export class ClientRateLimit {
  private attempts: Map<string, number[]> = new Map();
  private readonly maxAttempts: number;
  private readonly timeWindow: number; // in milliseconds

  constructor(maxAttempts: number = 5, timeWindowMinutes: number = 15) {
    this.maxAttempts = maxAttempts;
    this.timeWindow = timeWindowMinutes * 60 * 1000;
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(identifier) || [];
    
    // Remove old attempts outside the time window
    const recentAttempts = attempts.filter(time => now - time < this.timeWindow);
    
    if (recentAttempts.length >= this.maxAttempts) {
      return false;
    }
    
    // Record this attempt
    recentAttempts.push(now);
    this.attempts.set(identifier, recentAttempts);
    
    return true;
  }

  getRemainingTime(identifier: string): number {
    const attempts = this.attempts.get(identifier) || [];
    if (attempts.length === 0) return 0;
    
    const oldestRecentAttempt = Math.min(...attempts);
    const timeRemaining = this.timeWindow - (Date.now() - oldestRecentAttempt);
    
    return Math.max(0, timeRemaining);
  }
}

// Create rate limiter instances
export const authRateLimit = new ClientRateLimit(5, 15); // 5 attempts per 15 minutes
export const formRateLimit = new ClientRateLimit(10, 5); // 10 submissions per 5 minutes

// Content Security Policy headers (for future implementation)
export const getCSPHeaders = () => ({
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "connect-src 'self' https://hwfjpqcdiottcqyxqhyd.supabase.co",
    "font-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; ')
});

// Secure session storage configuration
export const getSecureSessionConfig = () => ({
  autoRefreshToken: true,
  persistSession: true,
  detectSessionInUrl: true,
  storageKey: 'coopsama-auth-token',
  storage: {
    getItem: (key: string) => {
      if (typeof window !== 'undefined') {
        return window.localStorage.getItem(key);
      }
      return null;
    },
    setItem: (key: string, value: string) => {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, value);
      }
    },
    removeItem: (key: string) => {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    }
  }
});
