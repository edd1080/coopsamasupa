import React from 'react';
import LoginForm from '@/components/auth/LoginForm';
import ThemeToggle from '@/components/ui/ThemeToggle';
const Login = () => {
  console.log('📝 Rendering login form');
  return <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-background/95">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="w-full max-w-md space-y-6 animate-fade-in">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary">Coopsama App</h1>
          <p className="mt-1 text-muted-foreground">Portal de Agentes</p>
        </div>
        
        <div className="bg-card p-5 rounded-lg border border-border shadow-sm">
          
          <LoginForm />
        </div>
        
        <div className="text-center text-xs text-muted-foreground">
          <p>© 2025 Coopsama App. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>;
};
export default Login;