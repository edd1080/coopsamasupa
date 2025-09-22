import { CapacitorConfig } from '@capacitor/core';

const config: CapacitorConfig = {
  appId: 'app.lovable.c018926e40254894ae52122f75906f16',
  appName: 'coopsamasupa',
  webDir: 'dist',
  server: {
    url: 'https://c018926e-4025-4894-ae52-122f75906f16.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    StatusBar: {
      backgroundColor: '#19418A',
      style: 'light',
      overlaysWebView: false
    },
    NavigationBar: {
      backgroundColor: '#19418A'
    },
    SplashScreen: {
      backgroundColor: '#19418A',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true
    },
    Camera: {
      permissions: ['camera', 'photos']
    }
  }
};

export default config;