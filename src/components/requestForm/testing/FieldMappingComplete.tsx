import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, XCircle, AlertTriangle, ChevronDown, ChevronUp, Code, Eye } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { toOfficial, validateCoverage } from '@/utils/fieldMapper';

interface FieldMappingCompleteProps {
  formData: any;
}

const FieldMappingComplete: React.FC<FieldMappingCompleteProps> = ({ formData }) => {
  const [showPayloads, setShowPayloads] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  // Generate official payload
  const agentData = {
    dpi: '1234567890123',
    email: 'agente@test.com',
    full_name: 'Agente de Prueba'
  };
  
  const officialPayload = toOfficial(formData, agentData);
  const validation = validateCoverage(officialPayload);

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const analyzeMapping = (original: any, mapped: any, fieldName: string) => {
    // Field not mapped at all
    if (mapped === null || mapped === undefined) {
      return { status: 'error', message: 'No mapeado' };
    }
    
    // Successful mappings
    if (mapped && typeof mapped === 'object' && mapped.id && mapped.value) {
      return { status: 'success', message: 'Objeto con ID y valor' };
    }
    
    if (typeof mapped === 'string' && mapped.trim() !== '') {
      // Check if it's an exact or close match
      if (original && String(original).toLowerCase() === mapped.toLowerCase()) {
        return { status: 'success', message: 'Mapeo exacto' };
      }
      return { status: 'success', message: 'Cadena mapeada' };
    }
    
    if (typeof mapped === 'number' && !isNaN(mapped)) {
      return { status: 'success', message: 'Número mapeado' };
    }
    
    if (typeof mapped === 'boolean') {
      return { status: 'success', message: 'Booleano mapeado' };
    }
    
    if (Array.isArray(mapped) && mapped.length > 0) {
      return { status: 'success', message: 'Array con datos' };
    }
    
    // Warnings
    if (typeof mapped === 'string' && mapped.trim() === '') {
      return { status: 'warning', message: 'Cadena vacía' };
    }
    
    if (Array.isArray(mapped) && mapped.length === 0) {
      return { status: 'warning', message: 'Array vacío' };
    }
    
    if (typeof mapped === 'object' && Object.keys(mapped).length === 0) {
      return { status: 'warning', message: 'Objeto vacío' };
    }
    
    return { status: 'warning', message: 'Mapeo parcial' };
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

  // Generate dynamic field mappings from all formData fields
  const generateDynamicFieldMappings = (formData: any, officialPayload: any) => {
    if (!formData) return [];
    
    const allFields = Object.keys(formData);
    const categories: { [key: string]: any[] } = {};
    
    // Recursive function to find a value anywhere in the payload structure
    const findValueInPayload = (payload: any, searchValue: any, searchKey?: string): any => {
      if (!payload || typeof payload !== 'object') return null;
      
      // Direct match by key name
      if (searchKey && payload[searchKey] !== undefined) {
        return payload[searchKey];
      }
      
      // Search for value match
      for (const [key, value] of Object.entries(payload)) {
        if (value === searchValue) {
          return value;
        }
        
        // Recursive search in nested objects
        if (typeof value === 'object' && value !== null) {
          const found = findValueInPayload(value, searchValue, searchKey);
          if (found !== null) return found;
        }
      }
      
      return null;
    };
    
    // Enhanced mapping function that searches the entire payload
    const findMappedValue = (fieldName: string, fieldValue: any) => {
      if (!officialPayload?.data?.process?.profile) return null;
      
      const payload = officialPayload.data.process.profile;
      
      // First try direct field name mapping
      let mappedValue = findValueInPayload(payload, fieldValue, fieldName);
      
      // If not found, try common field transformations
      if (!mappedValue) {
        const fieldTransforms: { [key: string]: string[] } = {
          firstName: ['firstName', 'first_name', 'nombre'],
          firstLastName: ['firstLastName', 'first_last_name', 'apellido'],
          secondLastName: ['secondLastName', 'second_last_name', 'segundoApellido'],
          dpi: ['personalDocumentId', 'document_id', 'dpi', 'cui'],
          gender: ['gender', 'sexo', 'genero'],
          civilStatus: ['maritalStatus', 'civil_status', 'estado_civil'],
          birthDate: ['birthDate', 'birth_date', 'fecha_nacimiento'],
          age: ['age', 'edad'],
          mobilePhone: ['mobile', 'cellphone', 'telefono_movil'],
          homePhone: ['telephone', 'phone', 'telefono'],
          email: ['emailAddress', 'email', 'correo'],
          address: ['fullAddress', 'address', 'direccion'],
          educationLevel: ['academicDegree', 'education', 'educacion'],
          profession: ['academicTitle', 'profession', 'profesion'],
          occupation: ['occupation', 'ocupacion'],
          housingType: ['typeOfHousing', 'housing_type', 'tipo_vivienda'],
          housingStability: ['housingStability', 'housing_stability'],
          requestedAmount: ['requestedAmount', 'amount', 'monto'],
          termMonths: ['startingTerm', 'term', 'plazo'],
          department: ['department', 'departamento'],
          municipality: ['municipality', 'municipio']
        };
        
        const possibleKeys = fieldTransforms[fieldName] || [fieldName];
        for (const key of possibleKeys) {
          mappedValue = findValueInPayload(payload, fieldValue, key);
          if (mappedValue) break;
        }
      }
      
      // If still not found, search by value similarity
      if (!mappedValue && fieldValue !== null && fieldValue !== undefined && fieldValue !== '') {
        mappedValue = findValueInPayload(payload, fieldValue);
      }
      
      return mappedValue;
    };
    
    // Enhanced categorization logic
    allFields.forEach(fieldName => {
      const fieldValue = formData[fieldName];
      const mappedValue = findMappedValue(fieldName, fieldValue);
      
      let category = 'Otros';
      
      // More comprehensive categorization
      if (/^(first|second|last)?(name|Name|lastName|firstLastName|secondLastName)$/i.test(fieldName) || 
          ['dpi', 'cui', 'gender', 'civilStatus', 'birthDate', 'age', 'nationality', 'ethnicity'].includes(fieldName)) {
        category = 'Identificación Personal';
      } else if (/^(mobile|home|work)?[Pp]hone$/i.test(fieldName) || 
                 ['email', 'address', 'department', 'municipality', 'zone', 'coordinates'].includes(fieldName)) {
        category = 'Contacto y Ubicación';
      } else if (fieldName.toLowerCase().includes('spouse') || fieldName.startsWith('spouse')) {
        category = 'Información del Cónyuge';
      } else if (['educationLevel', 'profession', 'occupation', 'academicTitle', 'academicDegree'].includes(fieldName)) {
        category = 'Educación y Profesión';
      } else if (/housing|house|residence|residential/i.test(fieldName) || 
                 ['housingType', 'housingStability', 'residentialStability', 'houseOwner'].includes(fieldName)) {
        category = 'Vivienda';
      } else if (/^(requested|credit|loan|product)/i.test(fieldName) || 
                 ['requestedAmount', 'termMonths', 'destinationGroup', 'creditDestination', 'product', 'productType'].includes(fieldName)) {
        category = 'Producto Crediticio';
      } else if (/^(income|salary|wage|assets|liabilities|cash|bank|real)/i.test(fieldName) || 
                 ['totalAssets', 'totalLiabilities', 'netWorth', 'movableAssets', 'accountsPayable'].includes(fieldName)) {
        category = 'Información Financiera';
      } else if (/^work/i.test(fieldName) || 
                 ['workCompany', 'workPosition', 'workPhone', 'workAddress', 'workDepartment', 'workMunicipality', 'workStartDate', 'workType', 'employment'].includes(fieldName)) {
        category = 'Información Laboral';
      } else if (['references', 'guarantors'].includes(fieldName) || Array.isArray(fieldValue)) {
        category = 'Referencias y Fiadores';
      } else if (/document|signature|photo|file|upload/i.test(fieldName) || 
                 ['documents', 'signature', 'coordinates', 'location', 'photos'].includes(fieldName)) {
        category = 'Documentos y Verificación';
      } else if (fieldValue === null || fieldValue === undefined || fieldValue === '') {
        category = 'Campos Vacíos';
      }
      
      if (!categories[category]) {
        categories[category] = [];
      }
      
      // Enhanced field information
      const analysis = analyzeMapping(fieldValue, mappedValue, fieldName);
      categories[category].push({
        name: fieldName,
        original: fieldValue,
        mapped: mappedValue,
        expected: `${fieldName}: ${analysis.message}`,
        status: analysis.status
      });
    });
    
    // Convert to array format
    return Object.entries(categories).map(([categoryName, fields]) => ({
      category: categoryName,
      fields: fields
    }));
  };
  
  const fieldMappings = generateDynamicFieldMappings(formData, officialPayload);

  // Calculate summary statistics
  const totalFields = fieldMappings.reduce((sum, category) => sum + category.fields.length, 0);
  const successFields = fieldMappings.reduce((sum, category) => 
    sum + category.fields.filter(field => 
      analyzeMapping(field.original, field.mapped, field.name).status === 'success'
    ).length, 0
  );
  const errorFields = fieldMappings.reduce((sum, category) => 
    sum + category.fields.filter(field => 
      analyzeMapping(field.original, field.mapped, field.name).status === 'error'
    ).length, 0
  );
  const warningFields = totalFields - successFields - errorFields;

  return (
    <Card className="border-green-200 bg-green-50 dark:bg-green-950">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-green-900 dark:text-green-100">
          <Code className="h-5 w-5" />
          Mapeo Completo de Campos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary Statistics */}
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{successFields}</div>
            <div className="text-xs text-green-700">Correctos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{warningFields}</div>
            <div className="text-xs text-yellow-700">Advertencias</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{errorFields}</div>
            <div className="text-xs text-red-700">Errores</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">{totalFields}</div>
            <div className="text-xs text-gray-700">Total</div>
          </div>
        </div>

        <Separator />

        {/* Field Mappings by Category */}
        <div className="space-y-3">
          {fieldMappings.map((category, categoryIndex) => {
            const categoryStats = {
              success: category.fields.filter(f => analyzeMapping(f.original, f.mapped, f.name).status === 'success').length,
              error: category.fields.filter(f => analyzeMapping(f.original, f.mapped, f.name).status === 'error').length,
              warning: category.fields.filter(f => analyzeMapping(f.original, f.mapped, f.name).status === 'warning').length
            };

            return (
              <Collapsible key={categoryIndex}>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between p-3 h-auto"
                    onClick={() => toggleCategory(category.category)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{category.category}</span>
                      <div className="flex gap-2">
                        {categoryStats.success > 0 && (
                          <Badge variant="default" className="bg-green-100 text-green-800 text-xs">
                            {categoryStats.success} ✓
                          </Badge>
                        )}
                        {categoryStats.warning > 0 && (
                          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs">
                            {categoryStats.warning} ⚠
                          </Badge>
                        )}
                        {categoryStats.error > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {categoryStats.error} ✗
                          </Badge>
                        )}
                      </div>
                    </div>
                    {expandedCategories.has(category.category) ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-2 p-2">
                  {category.fields.map((field, fieldIndex) => {
                    const analysis = analyzeMapping(field.original, field.mapped, field.name);
                    return (
                      <div key={fieldIndex} className="grid grid-cols-1 md:grid-cols-4 gap-2 p-2 bg-white dark:bg-gray-800 rounded border">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(analysis.status)}
                          <span className="text-sm font-medium">{field.name}</span>
                        </div>
                        <div className="text-xs">
                          <div className="text-gray-500">Original:</div>
                          <div className="font-mono bg-gray-100 dark:bg-gray-700 p-1 rounded">
                            {typeof field.original === 'object' 
                              ? JSON.stringify(field.original, null, 2)
                              : String(field.original || 'N/A')
                            }
                          </div>
                        </div>
                        <div className="text-xs">
                          <div className="text-gray-500">Mapeado:</div>
                          <div className="font-mono bg-gray-100 dark:bg-gray-700 p-1 rounded">
                            {typeof field.mapped === 'object' 
                              ? JSON.stringify(field.mapped, null, 2)
                              : String(field.mapped || 'N/A')
                            }
                          </div>
                        </div>
                        <div className="text-xs text-gray-600">
                          {field.expected}
                        </div>
                      </div>
                    );
                  })}
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>

        <Separator />

        {/* Payload Viewers */}
        <div className="space-y-3">
          <Button
            variant="outline"
            onClick={() => setShowPayloads(!showPayloads)}
            className="w-full border-green-300 text-green-700 hover:bg-green-100"
          >
            <Eye className="h-4 w-4 mr-2" />
            {showPayloads ? 'Ocultar' : 'Ver'} Payloads Generados
          </Button>

          {showPayloads && (
            <div className="space-y-4">
              {/* Original Form Data */}
              <div>
                <h5 className="font-medium mb-2">Datos Originales del Formulario:</h5>
                <div className="max-h-60 overflow-y-auto bg-gray-100 dark:bg-gray-800 rounded p-3">
                  <pre className="text-xs font-mono">
                    {JSON.stringify(formData, null, 2)}
                  </pre>
                </div>
              </div>

              {/* Generated Official Payload */}
              <div>
                <h5 className="font-medium mb-2">Payload Generado para Microservicio:</h5>
                <div className="max-h-60 overflow-y-auto bg-gray-100 dark:bg-gray-800 rounded p-3">
                  <pre className="text-xs font-mono">
                    {JSON.stringify(officialPayload, null, 2)}
                  </pre>
                </div>
              </div>

              {/* Validation Summary */}
              <div>
                <h5 className="font-medium mb-2">Resumen de Validación:</h5>
                <div className="bg-gray-100 dark:bg-gray-800 rounded p-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Válido:</span>
                      <Badge variant={validation.isValid ? "default" : "destructive"}>
                        {validation.isValid ? 'Sí' : 'No'}
                      </Badge>
                    </div>
                    {validation.issues && validation.issues.length > 0 && (
                      <div>
                        <span className="font-medium">Problemas:</span>
                        <ul className="list-disc list-inside ml-4 text-xs">
                          {validation.issues.map((issue: string, index: number) => (
                            <li key={index} className="text-red-600">{issue}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {validation.warnings && validation.warnings.length > 0 && (
                      <div>
                        <span className="font-medium">Advertencias:</span>
                        <ul className="list-disc list-inside ml-4 text-xs">
                          {validation.warnings.map((warning: string, index: number) => (
                            <li key={index} className="text-yellow-600">{warning}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <p className="text-sm text-green-700 dark:text-green-300">
          Análisis completo del mapeo de campos y visualización de payloads generados.
        </p>
      </CardContent>
    </Card>
  );
};

export default FieldMappingComplete;