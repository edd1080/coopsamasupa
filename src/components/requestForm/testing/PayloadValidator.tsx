import React, { useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';
import { toCoopsamaPayload, validateCoopsamaPayload } from '@/utils/fieldMapper';

interface PayloadValidatorProps {
  formData: any;
}

export const PayloadValidator: React.FC<PayloadValidatorProps> = ({ formData }) => {
  const validationResult = useMemo(() => {
    try {
      const payload = toCoopsamaPayload(formData);
      return validateCoopsamaPayload(payload);
    } catch (error) {
      return {
        isValid: false,
        issues: [`Error al generar payload: ${error.message}`],
        warnings: [],
        completeness: 0
      };
    }
  }, [formData]);

  const getStatusIcon = (type: 'valid' | 'issue' | 'warning' | 'info') => {
    switch (type) {
      case 'valid':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'issue':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getStatusBadge = () => {
    if (validationResult.isValid) {
      return (
        <Badge className="bg-green-100 text-green-800 border-green-300">
          <CheckCircle className="h-3 w-3 mr-1" />
          Válido
        </Badge>
      );
    } else if (validationResult.issues.length > 0) {
      return (
        <Badge variant="destructive">
          <XCircle className="h-3 w-3 mr-1" />
          Errores Detectados
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Advertencias
        </Badge>
      );
    }
  };

  return (
    <div className="space-y-4">
      {/* Estado General */}
      <div className="flex items-center justify-between p-3 bg-white border rounded-lg">
        <div>
          <h4 className="font-medium text-sm">Estado de Validación</h4>
          <p className="text-xs text-muted-foreground">
            Completitud: {validationResult.completeness}%
          </p>
        </div>
        {getStatusBadge()}
      </div>

      {/* Barra de Progreso */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span>Completitud del Payload</span>
          <span>{validationResult.completeness}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${validationResult.completeness}%` }}
          />
        </div>
      </div>

      {/* Issues Críticos */}
      {validationResult.issues.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-red-800 flex items-center gap-2">
            {getStatusIcon('issue')}
            Errores Críticos ({validationResult.issues.length})
          </h4>
          <div className="space-y-1">
            {validationResult.issues.map((issue, index) => (
              <div key={index} className="flex items-start gap-2 p-2 bg-red-50 border border-red-200 rounded text-xs">
                <XCircle className="h-3 w-3 text-red-500 mt-0.5 flex-shrink-0" />
                <span className="text-red-800">{issue}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Advertencias */}
      {validationResult.warnings.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-yellow-800 flex items-center gap-2">
            {getStatusIcon('warning')}
            Advertencias ({validationResult.warnings.length})
          </h4>
          <div className="space-y-1">
            {validationResult.warnings.map((warning, index) => (
              <div key={index} className="flex items-start gap-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
                <AlertTriangle className="h-3 w-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                <span className="text-yellow-800">{warning}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Estado Válido */}
      {validationResult.isValid && validationResult.issues.length === 0 && validationResult.warnings.length === 0 && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 text-green-800">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Payload Válido</span>
          </div>
          <p className="text-xs text-green-700 mt-1">
            El payload está correctamente estructurado y listo para enviar al microservicio.
          </p>
        </div>
      )}

      {/* Información Adicional */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <h4 className="text-sm font-medium text-blue-800 mb-2 flex items-center gap-2">
          {getStatusIcon('info')}
          Información de Validación
        </h4>
        <div className="text-xs text-blue-700 space-y-1">
          <div>• Los campos marcados como críticos deben completarse antes del envío</div>
          <div>• Las advertencias no impiden el envío pero pueden causar problemas</div>
          <div>• La completitud se basa en campos requeridos por el microservicio</div>
          <div>• Algunos campos opcionales pueden mejorar la calidad de la solicitud</div>
        </div>
      </div>

      {/* Recomendaciones */}
      {(validationResult.completeness < 80 || validationResult.warnings.length > 0) && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <h4 className="text-sm font-medium text-amber-800 mb-2">Recomendaciones:</h4>
          <div className="text-xs text-amber-700 space-y-1">
            {validationResult.completeness < 80 && (
              <div>• Complete más campos para mejorar la calidad de la solicitud</div>
            )}
            {validationResult.warnings.length > 0 && (
              <div>• Revise las advertencias para evitar problemas durante el procesamiento</div>
            )}
            <div>• Use el generador de datos de prueba para obtener un payload completo</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayloadValidator;