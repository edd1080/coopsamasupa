import React, { useState } from 'react';
import { Eye, EyeOff, Lock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { toast } = useToast();
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error de validación",
        description: "Por favor ingresa email y contraseña",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);
      await signIn(email, password);
      console.log('🔄 Login successful - AuthRouter will handle navigation');
    } catch (error) {
      console.error('Auth error:', error);
      toast({
        title: "Error de inicio de sesión",
        description: error instanceof Error ? error.message : "Error en la autenticación",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">
          Iniciar sesión
        </h2>
        <p className="text-muted-foreground">
          Ingrese sus credenciales para acceder
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <User className="h-4 w-4 text-muted-foreground" />
            </div>
            <Input 
              id="email" 
              type="email" 
              placeholder="Correo electrónico" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="pl-10" 
              autoComplete="email" 
              disabled={isLoading} 
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Lock className="h-4 w-4 text-muted-foreground" />
            </div>
            <Input 
              id="password" 
              type={showPassword ? "text" : "password"} 
              placeholder="Contraseña" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="pl-10 pr-10" 
              autoComplete="current-password" 
              disabled={isLoading} 
            />
            <button 
              type="button" 
              className="absolute inset-y-0 right-0 flex items-center pr-3" 
              onClick={() => setShowPassword(!showPassword)} 
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
          </div>
        </div>
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;