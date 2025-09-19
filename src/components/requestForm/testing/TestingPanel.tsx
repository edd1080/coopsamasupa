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
import { generateTestData, dataPresets } from '@/utils/testDataGenerator';
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
  const [selectedProfile, setSelectedProfile] = useState<'random' | 'agricultor' | 'comerciante' | 'servicios'>('random');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateTestData = async (profile: typeof selectedProfile) => {
    setIsGenerating(true);
    try {
      const testData = dataPresets[profile]();
      
      // Aplicar los datos generados al formulario
      Object.entries(testData).forEach(([key, value]) => {
        updateFormData(key, value);
      });
      
      onGenerateTestData(testData);
      
      toast({
        variant: "success",
        title: "Datos de prueba generados",
        description: `Se ha generado un perfil de ${profile} con datos coherentes.`
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

  const profileDescriptions = {
    random: "Genera un perfil aleatorio con datos variados",
    agricultor: "Perfil de agricultor con finca y actividades agrícolas", 
    comerciante: "Comerciante con negocio establecido y ventas regulares",
    servicios: "Proveedor de servicios profesionales"
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
                      {profile.charAt(0).toUpperCase() + profile.slice(1)}
                    </Button>
                    <p className="text-xs text-muted-foreground">{description}</p>
                  </div>
                ))}
              </div>
              
              <Separator />
              
              <Button
                onClick={() => handleGenerateTestData(selectedProfile)}
                disabled={isGenerating}
                className="w-full bg-orange-600 hover:bg-orange-700"
                size="lg"
              >
                <Shuffle className="h-4 w-4 mr-2" />
                {isGenerating ? 'Generando...' : `Generar Solicitud de ${selectedProfile.charAt(0).toUpperCase() + selectedProfile.slice(1)}`}
              </Button>
              
              <div className="text-xs text-muted-foreground bg-white p-3 rounded border">
                <strong>Nota:</strong> Los datos generados incluyen DPIs válidos guatemaltecos, 
                nombres reales, direcciones coherentes y montos apropiados para cada perfil.
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