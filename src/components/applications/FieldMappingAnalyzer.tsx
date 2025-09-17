import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface FieldMappingAnalyzerProps {
  formData: any;
  officialData: any;
}

const FieldMappingAnalyzer: React.FC<FieldMappingAnalyzerProps> = ({ formData, officialData }) => {
  const analyzeMapping = (original: any, mapped: any, expected: string) => {
    if (!mapped) return { status: 'error', message: 'Campo faltante' };
    if (mapped.id && mapped.value) return { status: 'success', message: 'Mapeo correcto' };
    return { status: 'warning', message: 'Mapeo incompleto' };
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const mappings = [
    {
      category: 'Identificación Personal',
      fields: [
        {
          name: 'Género',
          original: formData?.gender,
          mapped: officialData?.process?.profile?.personalDocument?.gender,
          expected: 'MUJER/HOMBRE con ID válido'
        },
        {
          name: 'Estado Civil',
          original: formData?.civilStatus,
          mapped: officialData?.process?.profile?.personalDocument?.maritalStatus,
          expected: 'SOLTERO/CASADO/etc con ID válido'
        },
        {
          name: 'Ocupación',
          original: formData?.occupation,
          mapped: officialData?.process?.profile?.personalDocument?.occupation,
          expected: 'COMERCIANTE para "Comercio"'
        }
      ]
    },
    {
      category: 'Educación',
      fields: [
        {
          name: 'Nivel Educativo',
          original: formData?.educationLevel,
          mapped: officialData?.process?.profile?.personData?.academicDegree,
          expected: 'SUPERIOR para universitario'
        },
        {
          name: 'Título Académico',
          original: formData?.profession,
          mapped: officialData?.process?.profile?.personalDocument?.academicTitle,
          expected: 'Título universitario específico'
        }
      ]
    },
    {
      category: 'Vivienda',
      fields: [
        {
          name: 'Estabilidad de Vivienda',
          original: formData?.housingStability || formData?.residentialStability,
          mapped: officialData?.process?.profile?.personalDocument?.housingStability,
          expected: 'MAYOR A 3 AÑOS'
        }
      ]
    },
    {
      category: 'Destino del Crédito',
      fields: [
        {
          name: 'Grupo de Destino',
          original: formData?.destinationGroup,
          mapped: officialData?.process?.profile?.productDetail?.fundsDestination?.group,
          expected: 'Grupo con ID y valor'
        },
        {
          name: 'Destino',
          original: formData?.creditDestination,
          mapped: officialData?.process?.profile?.productDetail?.fundsDestination?.destination,
          expected: 'COMERCIO con ID válido'
        },
        {
          name: 'Categoría',
          original: formData?.destinationCategory,
          mapped: officialData?.process?.profile?.productDetail?.fundsDestination?.destinationCategory,
          expected: 'Capital de trabajo con ID'
        }
      ]
    }
  ];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Análisis de Mapeo de Campos
          </CardTitle>
          <CardDescription>
            Comparación entre datos originales y datos mapeados para el microservicio
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {mappings.map((category, categoryIndex) => (
            <div key={categoryIndex} className="space-y-3">
              <h4 className="font-semibold text-lg border-b pb-2">{category.category}</h4>
              {category.fields.map((field, fieldIndex) => {
                const analysis = analyzeMapping(field.original, field.mapped, field.expected);
                return (
                  <div key={fieldIndex} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 bg-muted/30 rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(analysis.status)}
                        <span className="font-medium">{field.name}</span>
                      </div>
                      <Badge variant={analysis.status === 'success' ? 'default' : 'destructive'}>
                        {analysis.message}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <span className="text-sm text-muted-foreground">Original:</span>
                      <div className="text-sm font-mono bg-background p-1 rounded">
                        {typeof field.original === 'object' 
                          ? JSON.stringify(field.original, null, 2)
                          : field.original || 'N/A'
                        }
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-sm text-muted-foreground">Mapeado:</span>
                      <div className="text-sm font-mono bg-background p-1 rounded">
                        {typeof field.mapped === 'object' 
                          ? JSON.stringify(field.mapped, null, 2)
                          : field.mapped || 'N/A'
                        }
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-sm text-muted-foreground">Esperado:</span>
                      <div className="text-sm text-muted-foreground">
                        {field.expected}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default FieldMappingAnalyzer;