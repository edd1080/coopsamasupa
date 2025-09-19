import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { 
  TestTube, 
  Shuffle, 
  Copy, 
  Eye, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Zap,
  Database,
  Settings
} from 'lucide-react';
import { generateTestData, dataPresets, generateUltraCompleteApplication, errorPresets } from '@/utils/testDataGenerator';
import { PayloadViewer } from './PayloadViewer';
import { ConnectionTester } from './ConnectionTester';
import { PayloadValidator } from './PayloadValidator';
import { toast } from '@/hooks/use-toast';

interface TestingPanelProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
  onGenerateTestData: (data: any) => void;
}

export const TestingPanel: React.FC<TestingPanelProps> = ({
  formData,
  updateFormData,
  onGenerateTestData
}) => {
  const [selectedProfile, setSelectedProfile] = useState<'random' | 'agricultor' | 'comerciante' | 'servicios' | 'ultraCompleta'>('random');
  const [selectedErrorType, setSelectedErrorType] = useState<'errorFecha' | 'errorRequerido' | 'errorCatalogo' | 'errorMonto' | 'errorMoneda'>('errorFecha');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateTestData = async (profile: typeof selectedProfile) => {
    setIsGenerating(true);
    try {
      const testData = profile === 'ultraCompleta' ? generateUltraCompleteApplication() : dataPresets[profile]();
      
      // Aplicar los datos generados al formulario
      Object.entries(testData).forEach(([key, value]) => {
        updateFormData(key, value);
      });
      
      onGenerateTestData(testData);
      
      toast({
        variant: "success",
        title: "Datos de prueba generados",
        description: profile === 'ultraCompleta' 
          ? "¡Solicitud ultra completa generada! Todos los campos han sido llenados con datos coherentes." 
          : `Se ha generado un perfil de ${profile} con datos coherentes.`
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error al generar datos",
        description: "No se pudieron generar los datos de prueba."
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateErrorData = async (errorType: keyof typeof errorPresets) => {
    setIsGenerating(true);
    try {
      const errorData = errorPresets[errorType]();
      
      // Aplicar los datos con error al formulario
      Object.entries(errorData).forEach(([key, value]) => {
        updateFormData(key, value);
      });
      
      onGenerateTestData(errorData);
      
      toast({
        variant: "destructive",
        title: "Datos de error generados",
        description: `Se ha generado una solicitud con ${errorType.replace('error', '').toLowerCase()} para testing de errores. ⚠️`
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error al generar datos de prueba",
        description: "No se pudieron generar los datos con error."
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const profileDescriptions = {
    random: "Genera un perfil aleatorio con datos variados",
    agricultor: "Perfil de agricultor con finca y actividades agrícolas", 
    comerciante: "Comerciante con negocio establecido y ventas regulares",
    servicios: "Proveedor de servicios profesionales",
    ultraCompleta: "Solicitud completísima con TODOS los campos llenos"
  };

  const errorDescriptions = {
    errorFecha: "Error de formato DateOnly - envía timestamp completo",
    errorRequerido: "Campos obligatorios vacíos - falla validación",
    errorCatalogo: "IDs de catálogo inválidos - foreign key errors", 
    errorMonto: "Montos negativos - falla validación de negocio",
    errorMoneda: "Formato de moneda incorrecto - texto en campos numéricos"
  };

  return (
    <Card className="border-orange-200 bg-orange-50/50">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <TestTube className="h-5 w-5 text-orange-600" />
          <CardTitle className="text-lg text-orange-800">Herramientas de Testing</CardTitle>
          <Badge variant="outline" className="border-orange-300 text-orange-700">
            Modo Desarrollo
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Accordion type="multiple" className="w-full">
          
          {/* Generador de Datos de Prueba */}
          <AccordionItem value="data-generator" className="border-orange-200">
            <AccordionTrigger className="text-orange-800 hover:text-orange-900">
              <div className="flex items-center gap-2">
                <Shuffle className="h-4 w-4" />
                Generador de Datos de Prueba
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(profileDescriptions).map(([profile, description]) => (
                  <div key={profile} className="space-y-2">
                    <Button
                      variant={selectedProfile === profile ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedProfile(profile as any)}
                      className="w-full justify-start text-xs"
                    >
                      {profile === 'random' && <Shuffle className="h-3 w-3 mr-1" />}
                      {profile === 'agricultor' && <Database className="h-3 w-3 mr-1" />}
                      {profile === 'comerciante' && <Settings className="h-3 w-3 mr-1" />}
                      {profile === 'servicios' && <Zap className="h-3 w-3 mr-1" />}
                      {profile === 'ultraCompleta' && <CheckCircle className="h-3 w-3 mr-1" />}
                      {profile.charAt(0).toUpperCase() + profile.slice(1)}
                    </Button>
                    <p className="text-xs text-muted-foreground">{description}</p>
                  </div>
                ))}
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <Button
                  onClick={() => handleGenerateTestData(selectedProfile)}
                  disabled={isGenerating}
                  className="w-full bg-orange-600 hover:bg-orange-700"
                  size="lg"
                >
                  <Shuffle className="h-4 w-4 mr-2" />
                  {isGenerating ? 'Generando...' : `Generar Solicitud de ${selectedProfile.charAt(0).toUpperCase() + selectedProfile.slice(1)}`}
                </Button>
                
                {selectedProfile !== 'ultraCompleta' && (
                  <Button
                    onClick={() => handleGenerateTestData('ultraCompleta')}
                    disabled={isGenerating}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg"
                    size="lg"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {isGenerating ? 'Generando...' : 'Generar Solicitud Ultra Completa ✨'}
                  </Button>
                )}
              </div>
              
              <div className="text-xs text-muted-foreground bg-white p-3 rounded border">
                <strong>Nota:</strong> Los datos generados incluyen DPIs válidos guatemaltecos, 
                nombres reales, direcciones coherentes y montos apropiados para cada perfil.
                <br /><br />
                <strong>✨ Solicitud Ultra Completa:</strong> Llena TODOS los campos de TODOS los pasos 
                incluyendo información del cónyuge, análisis financiero completo, estado patrimonial, 
                referencias detalladas, geolocalización y documentación completa.
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Generador de Errores de Testing */}
          <AccordionItem value="error-generator" className="border-red-200">
            <AccordionTrigger className="text-red-800 hover:text-red-900">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Generador de Errores de Testing
                <Badge variant="destructive" className="text-xs">
                  Error Testing
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-2 text-red-800">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="font-medium">Herramientas para Testing de Errores</span>
                </div>
                <p className="text-sm text-red-700">
                  Genera solicitudes con errores específicos para probar el manejo de fallos 
                  y verificar que el <code className="bg-red-100 px-1 rounded">processId</code> se guarde correctamente en MongoDB.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {Object.entries(errorDescriptions).map(([errorType, description]) => (
                  <div key={errorType} className="space-y-2">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleGenerateErrorData(errorType as keyof typeof errorPresets)}
                      disabled={isGenerating}
                      className="w-full justify-start text-xs bg-red-600 hover:bg-red-700"
                    >
                      {errorType === 'errorFecha' && <AlertTriangle className="h-3 w-3 mr-1" />}
                      {errorType === 'errorRequerido' && <XCircle className="h-3 w-3 mr-1" />}
                      {errorType === 'errorCatalogo' && <Database className="h-3 w-3 mr-1" />}
                      {errorType === 'errorMonto' && <Settings className="h-3 w-3 mr-1" />}
                      {errorType === 'errorMoneda' && <Copy className="h-3 w-3 mr-1" />}
                      {isGenerating ? 'Generando...' : `Error de ${errorType.replace('error', '').charAt(0).toUpperCase() + errorType.replace('error', '').slice(1)}`}
                    </Button>
                    <p className="text-xs text-muted-foreground bg-white p-2 rounded border">
                      <strong>{errorType.replace('error', '').toUpperCase()}:</strong> {description}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="text-xs text-red-600 bg-red-50 p-3 rounded border border-red-200">
                <strong>💡 Uso de Testing de Errores:</strong>
                <ol className="list-decimal list-inside mt-1 space-y-1">
                  <li>Genera una solicitud con error específico</li>
                  <li>Envía la solicitud al microservicio</li>
                  <li>Verifica que Coopsama rechace con el error esperado</li>
                  <li>Confirma que el <strong>processId</strong> se guarde en la BD</li>
                  <li>Busca en MongoDB usando: <code className="bg-red-100 px-1 rounded">{"{ \"metadata.processId\": \"PRC-XXXXXX\" }"}</code></li>
                </ol>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Validador de Payload */}
          <AccordionItem value="payload-validator" className="border-orange-200">
            <AccordionTrigger className="text-orange-800 hover:text-orange-900">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Validador de Payload
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <PayloadValidator formData={formData} />
            </AccordionContent>
          </AccordionItem>

          {/* Visor de Payload */}
          <AccordionItem value="payload-viewer" className="border-orange-200">
            <AccordionTrigger className="text-orange-800 hover:text-orange-900">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Vista Previa del Payload
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <PayloadViewer formData={formData} />
            </AccordionContent>
          </AccordionItem>

          {/* Test de Conexión */}
          <AccordionItem value="connection-test" className="border-orange-200">
            <AccordionTrigger className="text-orange-800 hover:text-orange-900">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Test de Conexión con Microservicio
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ConnectionTester formData={formData} />
            </AccordionContent>
          </AccordionItem>

        </Accordion>
      </CardContent>
    </Card>
  );
};

export default TestingPanel;