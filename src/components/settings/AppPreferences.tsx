import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Smartphone } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

const AppPreferences = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <Card style={{ backgroundColor: '#EFF7FF' }}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smartphone className="h-5 w-5 text-primary" />
          Preferencias del app
        </CardTitle>
        <CardDescription>
          Personaliza tu experiencia en la aplicación
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between py-2">
          <div>
            <p className="font-medium">Tema oscuro</p>
            <p className="text-sm text-muted-foreground">Activa el modo oscuro</p>
          </div>
          <Switch 
            checked={theme === 'dark'} 
            onCheckedChange={toggleTheme} 
          />
        </div>
        <div className="flex items-center justify-between py-2">
          <div>
            <p className="font-medium">Alta resolución</p>
            <p className="text-sm text-muted-foreground">Mejora la calidad visual</p>
          </div>
          <Switch defaultChecked />
        </div>
      </CardContent>
    </Card>
  );
};

export default AppPreferences;
