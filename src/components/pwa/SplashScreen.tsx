
import React, { useState } from 'react';

interface SplashScreenProps {
  isVisible: boolean;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ isVisible }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  if (!isVisible) return null;

  const handleImageLoad = () => {
    console.log('✅ Splash screen image loaded successfully');
    setImageLoaded(true);
  };

  const handleImageError = () => {
    console.error('❌ Failed to load splash screen image');
    setImageError(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-background to-primary/5">
      {/* Logo Container */}
      <div className="mb-12">
        {!imageError ? (
          <img
            src="/lovable-uploads/3a7e44fe-eeee-4096-b06f-ed880c04cc99.png"
            alt="Coopsama Logo"
            className="w-52 h-20 object-contain"
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        ) : (
          <div className="w-52 h-20 flex items-center justify-center bg-primary/10 rounded-lg border-2 border-primary/20">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-primary">COOPSAMA</h2>
              <p className="text-xs text-primary/70">Portal de Agentes</p>
            </div>
          </div>
        )}
      </div>

      {/* Animated Loader - Solo puntos sin texto */}
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>

      {/* Debug info - only in development */}
      {import.meta.env.DEV && (
        <div className="absolute bottom-4 left-4 text-xs text-muted-foreground">
          Image: {imageError ? 'Error' : imageLoaded ? 'Loaded' : 'Loading...'}
        </div>
      )}
    </div>
  );
};

export default SplashScreen;
