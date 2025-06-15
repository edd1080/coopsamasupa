
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
          <div className="flex justify-center mb-4">
            <div className="w-24 h-16 bg-white rounded-xl flex items-center justify-center shadow-lg p-3">
              <img
                src="/lovable-uploads/8517c16c-a94c-48da-9b01-9cabbde80b84.png"
                alt="Coopsama Logo"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-primary">Coopsama App</h1>
          <p className="mt-1 text-muted-foreground">Portal de Agentes</p>
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
