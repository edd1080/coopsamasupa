import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Send, CheckCircle, AlertCircle, Clock, Code } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { toOfficial } from '@/utils/fieldMapper';
import FieldMappingAnalyzer from './FieldMappingAnalyzer';

interface TestIntegrationButtonProps {
  applicationId: string;
  formData: any;
}

const TestIntegrationButton: React.FC<TestIntegrationButtonProps> = ({ 
  applicationId, 
  formData 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [showMapping, setShowMapping] = useState(false);
  const { toast } = useToast();

  const handleTestIntegration = async () => {
    setIsLoading(true);
    try {
      console.log('🔄 Testing Coopsama integration for application:', applicationId);
      
      // Transform data to official format
      const officialData = toOfficial(formData);
      
      console.log('📋 Original form data:', formData);
      console.log('🔄 Transformed official data:', officialData);
      
      const response = await supabase.functions.invoke('coopsama-integration', {
        body: { 
          applicationId,
          officialData
        }
      });
      
      console.log('📡 Coopsama response:', response);
      
      setResult(response);
      
      if (response.error) {
        toast({
          title: "Error en integración",
          description: response.error.message || "Error desconocido",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Integración ejecutada",
          description: "Revisa los logs para ver los detalles",
          variant: "default",
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

  const officialData = toOfficial(formData);

  return (
    <div className="space-y-4">
      <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-orange-900 dark:text-orange-100">
            <Code className="h-5 w-5" />
            Test de Integración Coopsama
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={handleTestIntegration}
              disabled={isLoading}
              className={`${getStatusColor()} hover:opacity-90 text-white`}
            >
              {getStatusIcon()}
              {isLoading ? 'Enviando...' : 'Probar Integración'}
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => setShowMapping(!showMapping)}
              className="border-orange-300 text-orange-700 hover:bg-orange-100"
            >
              <Code className="h-4 w-4 mr-2" />
              {showMapping ? 'Ocultar' : 'Ver'} Mapeo de Campos
            </Button>
          </div>

          {result && (
            <div className="mt-4 p-3 rounded-lg bg-background border">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                {result.error ? (
                  <>
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    Error de Integración
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Resultado de Integración
                  </>
                )}
              </h4>
              
              {result.error && (
                <div className="bg-red-50 border border-red-200 rounded p-2 text-sm text-red-800">
                  {result.error.message}
                </div>
              )}
              
              {result.data && (
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      Status: {result.data.success ? 'Éxito' : 'Error'}
                    </Badge>
                    {result.data.operationId && (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                        Operation ID: {result.data.operationId}
                      </Badge>
                    )}
                    {result.data.externalReferenceId && (
                      <Badge variant="outline" className="bg-purple-50 text-purple-700">
                        External Ref: {result.data.externalReferenceId}
                      </Badge>
                    )}
                  </div>
                  
                  {result.data.message && (
                    <div className="bg-blue-50 border border-blue-200 rounded p-2 text-sm text-blue-800">
                      {result.data.message}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <p className="text-sm text-orange-700 dark:text-orange-300">
            Este botón envía los datos actuales al microservicio Coopsama para verificar la integración.
            Revisa los logs de la función Edge para detalles completos.
          </p>
        </CardContent>
      </Card>

      {showMapping && (
        <FieldMappingAnalyzer 
          formData={formData} 
          officialData={officialData} 
        />
      )}
    </div>
  );
};

export default TestIntegrationButton;