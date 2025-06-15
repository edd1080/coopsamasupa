
import React from 'react';

interface SplashScreenProps {
  isVisible: boolean;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-background to-primary/5">
      {/* Logo Container */}
      <div className="mb-8">
        <div className="w-52 h-20 bg-white rounded-2xl flex items-center justify-center p-4">
          <img
            src="/lovable-uploads/0d66778d-afe5-4d46-a1eb-0e6cf610456f.png"
            alt="Coopsama Logo"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* App Name */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Coopsama App
        </h1>
        <p className="text-muted-foreground">
          Portal de Agentes
        </p>
      </div>

      {/* Animated Loader */}
      <div className="flex flex-col items-center gap-4">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
        <p className="text-sm text-muted-foreground animate-pulse">
          Cargando aplicación...
        </p>
      </div>
    </div>
  );
};

export default SplashScreen;
