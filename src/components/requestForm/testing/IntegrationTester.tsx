import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, Clock, Send, RefreshCw, Activity } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { toOfficial } from '@/utils/fieldMapper';

interface IntegrationTesterProps {
  formData: any;
  applicationId?: string;
}

const IntegrationTester: React.FC<IntegrationTesterProps> = ({ 
  formData, 
  applicationId = 'test-application' 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const { toast } = useToast();

  const handleTestIntegration = async () => {
    setIsLoading(true);
    setResult(null);
    setLogs([]);
    
    try {
      // Transform data to official format
      const agentData = {
        dpi: '1234567890123',
        email: 'agente@test.com',
        full_name: 'Agente de Prueba'
      };
      
      const officialData = toOfficial(formData, agentData);
      
      // Call integration function
      const response = await supabase.functions.invoke('coopsama-integration', {
        body: { 
          applicationId,
          officialData
        }
      });
      
      setResult(response);
      
      // Fetch recent logs from Supabase
      setTimeout(() => {
        fetchRecentLogs();
      }, 1000);
      
      if (response.error) {
        toast({
          title: "Error en integración",
          description: response.error.message || "Error desconocido",
          variant: "destructive",
        });
      } else if (response.data?.error_details) {
        const errorDetails = response.data.error_details;
        toast({
          title: `Error del Microservicio`,
          description: errorDetails.message,
          variant: "destructive",
        });
      } else {
        const hasBusinessError = response.data?.coopsama_response?.code !== 0;
        toast({
          title: hasBusinessError ? "Error en procesamiento" : "Integración completada",
          description: hasBusinessError 
            ? "Se produjo un error en el microservicio"
            : "Integración ejecutada correctamente",
          variant: hasBusinessError ? "destructive" : "default",
        });
      }
    } catch (error: any) {
      console.error('❌ Integration test error:', error);
      setResult({ error: { message: error.message } });
      toast({
        title: "Error al probar integración",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRecentLogs = async () => {
    try {
      // Fetch logs using edge function analytics query
      const { data, error } = await supabase.functions.invoke('analytics', {
        body: { 
          query: `select id, function_edge_logs.timestamp, event_message 
                  from function_edge_logs 
                  where function_name = 'coopsama-integration'
                  order by timestamp desc 
                  limit 10`
        }
      });
      
      if (!error && data) {
        setLogs(data.results || []);
      }
    } catch (error) {
      console.log('Could not fetch logs:', error);
    }
  };

  const getStatusIcon = () => {
    if (isLoading) return <Clock className="h-4 w-4 animate-spin" />;
    if (!result) return <Send className="h-4 w-4" />;
    if (result.error) return <AlertCircle className="h-4 w-4" />;
    return <CheckCircle className="h-4 w-4" />;
  };

  const getStatusColor = () => {
    if (isLoading) return "bg-blue-500";
    if (!result) return "bg-primary";
    if (result.error) return "bg-red-500";
    return "bg-green-500";
  };

  return (
    <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
          <Activity className="h-5 w-5" />
          Evaluador de Integración
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <Button 
            onClick={handleTestIntegration}
            disabled={isLoading}
            className={`${getStatusColor()} hover:opacity-90 text-white`}
          >
            {getStatusIcon()}
            {isLoading ? 'Probando...' : 'Probar Integración'}
          </Button>
          
          {result && (
            <Button 
              variant="outline"
              onClick={fetchRecentLogs}
              size="sm"
              className="border-blue-300 text-blue-700 hover:bg-blue-100"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Actualizar Logs
            </Button>
          )}
        </div>

        {/* Communication Status */}
        {result && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <h4 className="font-medium">Estado de Comunicación:</h4>
              {result.error ? (
                <Badge variant="destructive">Error de conexión</Badge>
              ) : result.data?.success ? (
                <Badge variant="default" className="bg-green-100 text-green-800">Exitosa</Badge>
              ) : (
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Con errores</Badge>
              )}
            </div>

            {/* Error Details */}
            {result.data?.error_details && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-red-800">
                      Error: {result.data.error_details.message}
                    </p>
                    {result.data.error_details.description && (
                      <p className="text-sm text-red-600 mt-1">
                        {result.data.error_details.description}
                      </p>
                    )}
                    {result.data.error_details.originalMessage && (
                      <p className="text-xs text-red-500 mt-1 font-mono">
                        Mensaje original: {result.data.error_details.originalMessage}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Microservice Response */}
            {result.data?.coopsama_response && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <h5 className="font-medium mb-2">Respuesta del Microservicio:</h5>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Código:</span>
                    <Badge variant={result.data.coopsama_response.code === 0 ? "default" : "destructive"}>
                      {result.data.coopsama_response.code}
                    </Badge>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Mensaje:</span> {result.data.coopsama_response.message}
                  </div>
                  {result.data.coopsama_response.data?.traceId && (
                    <div className="text-xs text-gray-600">
                      <span className="font-medium">Trace ID:</span> {result.data.coopsama_response.data.traceId}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Success Status */}
            {result.data?.success && !result.data?.error_details && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-green-800 font-medium">
                    Integración completada exitosamente
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Recent Logs */}
        {logs.length > 0 && (
          <div className="space-y-2">
            <h5 className="font-medium">Logs Recientes:</h5>
            <div className="max-h-40 overflow-y-auto space-y-1">
              {logs.slice(0, 5).map((log, index) => (
                <div key={index} className="text-xs bg-gray-100 rounded p-2 font-mono">
                  <span className="text-gray-500">
                    {new Date(log.created_at).toLocaleTimeString()}:
                  </span>
                  <span className="ml-2">{log.message || JSON.stringify(log)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="text-sm text-blue-700 dark:text-blue-300">
          Evalúa la comunicación con el microservicio y muestra detalles de errores o éxito.
        </p>
      </CardContent>
    </Card>
  );
};

export default IntegrationTester;