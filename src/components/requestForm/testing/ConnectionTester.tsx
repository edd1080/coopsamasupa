import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Zap, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Loader2,
  Server,
  Clock,
  Info
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { toCoopsamaPayload } from '@/utils/fieldMapper';
import { useAuth } from '@/hooks/useAuth';

interface ConnectionTesterProps {
  formData: any;
}

interface TestResult {
  type: 'connectivity' | 'validation' | 'full';
  status: 'success' | 'error' | 'warning';
  message: string;
  duration?: number;
  details?: any;
  timestamp: Date;
}

export const ConnectionTester: React.FC<ConnectionTesterProps> = ({ formData }) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [currentTest, setCurrentTest] = useState<string>('');
  const [agentData, setAgentData] = useState<any>(null);

  useEffect(() => {
    const getAgentData = async () => {
      if (!user) {
        console.warn("🔍 ConnectionTester: No hay usuario autenticado");
        return;
      }

      try {
        console.log("🔍 ConnectionTester: Obteniendo perfil del usuario", user.email);
        
        const { data: userProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        const finalAgentData = {
          ...userProfile,
          email: user.email || userProfile?.email
        };

        console.log("🔍 ConnectionTester: Agent data obtenido:", finalAgentData);
        setAgentData(finalAgentData);
      } catch (error) {
        console.error("❌ ConnectionTester: Error obteniendo agent data:", error);
      }
    };

    getAgentData();
  }, [user]);

  const addTestResult = (result: Omit<TestResult, 'timestamp'>) => {
    setTestResults(prev => [...prev, { ...result, timestamp: new Date() }]);
  };

  const testConnectivity = async () => {
    const startTime = Date.now();
    setCurrentTest('Probando conectividad...');
    
    try {
      const response = await supabase.functions.invoke('coopsama-test', {
        body: { testType: 'connectivity' }
      });
      
      const duration = Date.now() - startTime;
      
      if (response.error) {
        addTestResult({
          type: 'connectivity',
          status: 'error',
          message: `Error de conectividad: ${response.error.message}`,
          duration
        });
        return false;
      }
      
      addTestResult({
        type: 'connectivity',
        status: 'success',
        message: 'Conexión exitosa con el microservicio',
        duration
      });
      return true;
    } catch (error) {
      addTestResult({
        type: 'connectivity',
        status: 'error',
        message: `Error de red: ${error.message}`,
        duration: Date.now() - startTime
      });
      return false;
    }
  };

  const testPayloadValidation = async () => {
    const startTime = Date.now();
    setCurrentTest('Validando estructura del payload...');
    
    if (!agentData?.email) {
      addTestResult({
        type: 'validation',
        status: 'error',
        message: 'No hay usuario autenticado o email del agente no disponible',
        duration: Date.now() - startTime
      });
      return false;
    }
    
    try {
      console.log("🔍 ConnectionTester: Generando payload con agentData:", agentData);
      const payload = toCoopsamaPayload(formData, agentData);
      
      const response = await supabase.functions.invoke('coopsama-test', {
        body: { 
          testType: 'validation',
          payload: payload
        }
      });
      
      const duration = Date.now() - startTime;
      
      if (response.error) {
        addTestResult({
          type: 'validation',
          status: 'error',
          message: `Error de validación: ${response.error.message}`,
          duration,
          details: response.error
        });
        return false;
      }
      
      const result = response.data;
      
      if (result.isValid) {
        addTestResult({
          type: 'validation',
          status: 'success',
          message: `Payload válido (${result.completeness}% completo)`,
          duration,
          details: result
        });
        return true;
      } else {
        addTestResult({
          type: 'validation',
          status: 'warning',
          message: `Payload con advertencias: ${result.issues.join(', ')}`,
          duration,
          details: result
        });
        return false;
      }
    } catch (error) {
      addTestResult({
        type: 'validation',
        status: 'error',
        message: `Error al validar payload: ${error.message}`,
        duration: Date.now() - startTime
      });
      return false;
    }
  };

  const testFullIntegration = async () => {
    const startTime = Date.now();
    setCurrentTest('Probando integración completa...');
    
    if (!agentData?.email) {
      addTestResult({
        type: 'full',
        status: 'error',
        message: 'No hay usuario autenticado o email del agente no disponible',
        duration: Date.now() - startTime
      });
      return false;
    }
    
    try {
      console.log("🔍 ConnectionTester: Generando payload para test completo con agentData:", agentData);
      const payload = toCoopsamaPayload(formData, agentData);
      
      const response = await supabase.functions.invoke('coopsama-test', {
        body: { 
          testType: 'full',
          payload: payload,
          formData: formData
        }
      });
      
      const duration = Date.now() - startTime;
      
      if (response.error) {
        addTestResult({
          type: 'full',
          status: 'error',
          message: `Error en integración: ${response.error.message}`,
          duration,
          details: response.error
        });
        return false;
      }
      
      const result = response.data;
      
      if (result.success) {
        addTestResult({
          type: 'full',
          status: 'success',
          message: `Integración exitosa. Respuesta del microservicio recibida`,
          duration,
          details: result.response
        });
      } else {
        addTestResult({
          type: 'full',
          status: 'error',
          message: `Error del microservicio: ${result.error || 'Error desconocido'}`,
          duration,
          details: result
        });
      }
      
      return result.success;
    } catch (error) {
      addTestResult({
        type: 'full',
        status: 'error',
        message: `Error en prueba completa: ${error.message}`,
        duration: Date.now() - startTime
      });
      return false;
    }
  };

  const runAllTests = async () => {
    setIsLoading(true);
    setTestResults([]);
    
    try {
      // Test 1: Conectividad
      const connectivityOk = await testConnectivity();
      
      if (connectivityOk) {
        // Test 2: Validación de payload
        const validationOk = await testPayloadValidation();
        
        // Test 3: Integración completa (solo si hay suficientes datos)
        if (validationOk) {
          await testFullIntegration();
        }
      }
      
      toast({
        variant: "success",
        title: "Tests completados",
        description: "Revise los resultados de las pruebas de conexión."
      });
      
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error en las pruebas",
        description: error.message
      });
    } finally {
      setIsLoading(false);
      setCurrentTest('');
    }
  };

  const getResultIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getResultBadge = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800 border-green-300">Exitoso</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">Advertencia</Badge>;
    }
  };

  // Show authentication warning if no user or agent data
  if (!user) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <XCircle className="h-4 w-4 text-red-600" />
          <span className="text-sm text-red-800">
            Debe iniciar sesión para probar la conexión al microservicio
          </span>
        </div>
      </div>
    );
  }

  if (!agentData?.email) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <Loader2 className="h-4 w-4 animate-spin text-yellow-600" />
          <span className="text-sm text-yellow-800">
            Cargando datos del agente...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Info del usuario autenticado */}
      <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-lg">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <span className="text-sm text-green-800">
          Usuario autenticado: {agentData.email}
        </span>
      </div>

      {/* Controles de Test */}
      <div className="flex gap-2 flex-wrap">
        <Button
          onClick={runAllTests}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Zap className="h-4 w-4 mr-2" />
          )}
          {isLoading ? 'Ejecutando Tests...' : 'Ejecutar Todas las Pruebas'}
        </Button>
        
        <Button
          variant="outline"
          onClick={testConnectivity}
          disabled={isLoading}
          size="sm"
        >
          <Server className="h-3 w-3 mr-1" />
          Solo Conectividad
        </Button>
      </div>

      {/* Estado Actual */}
      {isLoading && currentTest && (
        <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
          <span className="text-sm text-blue-800">{currentTest}</span>
        </div>
      )}

      {/* Resultados de Tests */}
      {testResults.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Resultados de Pruebas:</h4>
          
          {testResults.map((result, index) => (
            <Card key={index} className="border-l-4 border-l-gray-300 data-[status=success]:border-l-green-500 data-[status=error]:border-l-red-500 data-[status=warning]:border-l-yellow-500" data-status={result.status}>
              <CardContent className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2 flex-1">
                    {getResultIcon(result.status)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium capitalize">
                          {result.type === 'connectivity' ? 'Conectividad' :
                           result.type === 'validation' ? 'Validación' : 'Integración Completa'}
                        </span>
                        {getResultBadge(result.status)}
                      </div>
                      <p className="text-xs text-muted-foreground">{result.message}</p>
                      
                      {result.duration && (
                        <div className="flex items-center gap-1 mt-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{result.duration}ms</span>
                        </div>
                      )}
                      
                      {result.details && (
                        <details className="mt-2">
                          <summary className="text-xs cursor-pointer text-blue-600 hover:text-blue-800">
                            Ver detalles
                          </summary>
                          <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-auto">
                            {JSON.stringify(result.details, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                  
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {result.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Información de Ayuda */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <h4 className="text-sm font-medium text-blue-800 mb-2 flex items-center gap-2">
          <Info className="h-4 w-4" />
          Acerca de las Pruebas
        </h4>
        <div className="text-xs text-blue-700 space-y-1">
          <div>• <strong>Conectividad:</strong> Verifica que el microservicio esté disponible</div>
          <div>• <strong>Validación:</strong> Comprueba que el payload tenga la estructura correcta</div>
          <div>• <strong>Integración Completa:</strong> Envía los datos al microservicio sin guardarlos</div>
          <div>• Las pruebas no afectan los datos reales del sistema</div>
        </div>
      </div>
    </div>
  );
};

export default ConnectionTester;