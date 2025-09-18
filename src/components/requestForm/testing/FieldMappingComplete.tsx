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
    if (!mapped) return { status: 'error', message: 'Campo faltante' };
    if (mapped && typeof mapped === 'object' && mapped.id && mapped.value) {
      return { status: 'success', message: 'Mapeo correcto' };
    }
    if (mapped && typeof mapped === 'string' && mapped.trim() !== '') {
      return { status: 'success', message: 'Valor mapeado' };
    }
    if (mapped && typeof mapped === 'number') {
      return { status: 'success', message: 'Valor numérico' };
    }
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

  // Generate dynamic field mappings from all formData fields
  const generateDynamicFieldMappings = (formData: any, officialPayload: any) => {
    if (!formData) return [];
    
    const allFields = Object.keys(formData);
    const categories: { [key: string]: any[] } = {};
    
    // Helper function to find mapped value in officialPayload
    const findMappedValue = (fieldName: string, fieldValue: any) => {
      const payload = officialPayload?.data?.process?.profile;
      if (!payload) return null;
      
      // Common field mappings
      const mappings: { [key: string]: string } = {
        firstName: 'personalDocument.firstName',
        firstLastName: 'personalDocument.firstLastName',
        secondLastName: 'personalDocument.secondLastName',
        lastName: 'personalDocument.firstLastName',
        dpi: 'personalDocument.personalDocumentId',
        gender: 'personalDocument.gender',
        civilStatus: 'personalDocument.maritalStatus',
        birthDate: 'personalDocument.birthDate',
        age: 'personalDocument.age',
        mobilePhone: 'personData.mobile',
        homePhone: 'personData.telephone',
        email: 'personData.email[0].emailAddress',
        address: 'personalDocument.personalDocumentAddress.fullAddress',
        educationLevel: 'personData.academicDegree',
        profession: 'personalDocument.academicTitle',
        occupation: 'personalDocument.occupation',
        housingType: 'personalDocument.typeOfHousing',
        housingStability: 'personalDocument.housingStability',
        residentialStability: 'personalDocument.housingStability',
        requestedAmount: 'productDetail.requestedAmount',
        termMonths: 'productDetail.startingTerm',
        destinationGroup: 'productDetail.destinationGroup',
        creditDestination: 'productDetail.creditDestination',
        department: 'personalDocument.personalDocumentAddress.department',
        municipality: 'personalDocument.personalDocumentAddress.municipality'
      };
      
      const mappingPath = mappings[fieldName];
      if (mappingPath) {
        return mappingPath.split('.').reduce((obj, key) => {
          if (key.includes('[') && key.includes(']')) {
            const arrayKey = key.split('[')[0];
            const index = parseInt(key.split('[')[1].split(']')[0]);
            return obj?.[arrayKey]?.[index];
          }
          return obj?.[key];
        }, payload);
      }
      
      return null;
    };
    
    // Categorize fields
    allFields.forEach(fieldName => {
      const fieldValue = formData[fieldName];
      const mappedValue = findMappedValue(fieldName, fieldValue);
      
      let category = 'Otros';
      
      // Categorization logic
      if (['firstName', 'firstLastName', 'secondLastName', 'lastName', 'dpi', 'gender', 'civilStatus', 'birthDate', 'age', 'nationality', 'ethnicity'].includes(fieldName)) {
        category = 'Identificación Personal';
      } else if (['mobilePhone', 'homePhone', 'email', 'address', 'department', 'municipality'].includes(fieldName)) {
        category = 'Contacto y Ubicación';
      } else if (fieldName.startsWith('spouse')) {
        category = 'Información del Cónyuge';
      } else if (['educationLevel', 'profession', 'occupation'].includes(fieldName)) {
        category = 'Educación y Profesión';
      } else if (['housingType', 'housingStability', 'residentialStability', 'houseOwner'].includes(fieldName)) {
        category = 'Vivienda';
      } else if (['requestedAmount', 'termMonths', 'destinationGroup', 'creditDestination', 'product', 'productType'].includes(fieldName)) {
        category = 'Producto Crediticio';
      } else if (['income', 'cashAndBanks', 'realEstate', 'movableAssets', 'totalAssets', 'accountsPayable', 'creditLiabilities', 'totalLiabilities', 'netWorth'].includes(fieldName)) {
        category = 'Información Financiera';
      } else if (['workCompany', 'workPosition', 'workPhone', 'workAddress', 'workDepartment', 'workMunicipality', 'workStartDate', 'workType'].includes(fieldName)) {
        category = 'Información Laboral';
      } else if (['references', 'guarantors'].includes(fieldName)) {
        category = 'Referencias y Fiadores';
      } else if (['documents', 'signature', 'coordinates', 'location', 'photos'].includes(fieldName)) {
        category = 'Documentos y Verificación';
      }
      
      if (!categories[category]) {
        categories[category] = [];
      }
      
      categories[category].push({
        name: fieldName,
        original: fieldValue,
        mapped: mappedValue,
        expected: `Campo: ${fieldName} ${mappedValue ? '(Mapeado)' : '(No mapeado)'}`
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