
import React from 'react';
import LoginForm from '@/components/auth/LoginForm';
import ThemeToggle from '@/components/ui/ThemeToggle';

const Login = () => {
  console.log('📝 Rendering login form');
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-background/95">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="w-full max-w-md space-y-6 animate-fade-in">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <img
              src="/lovable-uploads/6f5b7fdd-fb07-4628-9982-d947ed2dcd82.png"
              alt="COOPSAMA"
              className="h-20 w-auto object-contain"
            />
          </div>
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
