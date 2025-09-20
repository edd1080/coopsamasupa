import React, { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Download, Eye, Loader2, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { toCoopsamaPayload } from '@/utils/fieldMapper';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface PayloadViewerProps {
  formData: any;
}

export const PayloadViewer: React.FC<PayloadViewerProps> = ({ formData }) => {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<'pretty' | 'compact'>('pretty');
  const [agentData, setAgentData] = useState<any>(null);

  useEffect(() => {
    const getAgentData = async () => {
      if (!user) {
        console.warn("🔍 PayloadViewer: No hay usuario autenticado");
        return;
      }

      try {
        console.log("🔍 PayloadViewer: Obteniendo perfil del usuario", user.email);
        
        const { data: userProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        const finalAgentData = {
          ...userProfile,
          email: user.email || userProfile?.email
        };

        console.log("🔍 PayloadViewer: Agent data obtenido:", finalAgentData);
        setAgentData(finalAgentData);
      } catch (error) {
        console.error("❌ PayloadViewer: Error obteniendo agent data:", error);
      }
    };

    getAgentData();
  }, [user]);

  const payload = useMemo(() => {
    if (!agentData?.email) {
      console.warn("🔍 PayloadViewer: No hay agentData disponible aún");
      return null;
    }

    try {
      console.log("🔍 PayloadViewer: Generando payload con agentData:", agentData);
      return toCoopsamaPayload(formData, agentData);
    } catch (error) {
      console.error('❌ PayloadViewer: Error generating payload:', error);
      return null;
    }
  }, [formData, agentData]);

  const jsonString = useMemo(() => {
    if (!payload) return '';
    return viewMode === 'pretty' 
      ? JSON.stringify(payload, null, 2)
      : JSON.stringify(payload);
  }, [payload, viewMode]);

  const handleCopyPayload = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      toast({
        variant: "success",
        title: "Payload copiado",
        description: "El payload JSON ha sido copiado al portapapeles."
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error al copiar",
        description: "No se pudo copiar el payload al portapapeles."
      });
    }
  };

  const handleDownloadPayload = () => {
    try {
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `coopsama-payload-${new Date().getTime()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        variant: "success",
        title: "Payload descargado",
        description: "El archivo JSON ha sido descargado."
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error al descargar",
        description: "No se pudo descargar el archivo."
      });
    }
  };

  const getPayloadStats = () => {
    if (!payload) return null;
    
    const stats = {
      totalFields: Object.keys(payload).length,
      processFields: payload.data?.process ? Object.keys(payload.data.process).length : 0,
      dataSize: new Blob([jsonString]).size
    };
    
    return stats;
  };

  const stats = getPayloadStats();

  // Show authentication warning if no user
  if (!user) {
    return (
      <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
        <p className="text-red-800 text-sm">
          Debe iniciar sesión para visualizar el payload
        </p>
      </div>
    );
  }

  // Show loading while getting agent data
  if (!agentData?.email) {
    return (
      <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-yellow-600" />
          <p className="text-yellow-800 text-sm">
            Cargando datos del agente...
          </p>
        </div>
      </div>
    );
  }

  if (!payload) {
    return (
      <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
        <p className="text-red-800 text-sm">
          Error al generar el payload. Verifique que los datos del formulario sean válidos.
        </p>
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

      {/* Estadísticas del Payload */}
      <div className="flex flex-wrap gap-2">
        <Badge variant="outline" className="text-xs">
          {stats?.processFields || 0} campos proceso
        </Badge>
        <Badge variant="outline" className="text-xs">
          {Math.round((stats?.dataSize || 0) / 1024 * 100) / 100} KB
        </Badge>
        <Badge variant="outline" className="text-xs">
          {viewMode === 'pretty' ? 'Formateado' : 'Compacto'}
        </Badge>
      </div>

      {/* Controles */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setViewMode(viewMode === 'pretty' ? 'compact' : 'pretty')}
        >
          <Eye className="h-3 w-3 mr-1" />
          {viewMode === 'pretty' ? 'Vista Compacta' : 'Vista Formateada'}
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyPayload}
        >
          <Copy className="h-3 w-3 mr-1" />
          Copiar JSON
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleDownloadPayload}
        >
          <Download className="h-3 w-3 mr-1" />
          Descargar
        </Button>
      </div>

      {/* Viewer del JSON */}
      <div className="relative">
        <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-auto max-h-96 border font-mono">
          <code>{jsonString}</code>
        </pre>
        
        {/* Indicador de scroll */}
        {jsonString.split('\n').length > 20 && (
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="text-xs">
              {jsonString.split('\n').length} líneas
            </Badge>
          </div>
        )}
      </div>

      {/* Estructura del payload */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <h4 className="text-sm font-medium text-blue-800 mb-2">Estructura del Payload:</h4>
        <div className="text-xs text-blue-700 space-y-1">
          <div>• <strong>process:</strong> Datos principales del proceso de solicitud</div>
          <div>• <strong>processControl:</strong> Control y metadatos del proceso</div>
          <div>• <strong>personalDocuments:</strong> Documentos de identificación</div>
          <div>• <strong>personData:</strong> Información personal del solicitante</div>
          <div>• <strong>productData:</strong> Detalles del producto crediticio</div>
          <div>• <strong>financialData:</strong> Información financiera y patrimonial</div>
        </div>
      </div>
    </div>
  );
};

export default PayloadViewer;