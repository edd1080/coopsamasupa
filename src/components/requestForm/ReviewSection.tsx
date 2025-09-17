
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, AlertCircle, Send, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFormContext } from './RequestFormProvider';
import SubformHeader from '@/components/forms/SubformHeader';
import { toOfficial, validateCoverage } from '@/utils/fieldMapper';
import { toast } from '@/hooks/use-toast';

interface ReviewSectionProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ formData, updateFormData }) => {
  const { handleSubmit } = useFormContext();
  const [validationResult, setValidationResult] = useState<any>(null);

  const formatCurrency = (amount: number | string) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('es-GT', { 
      style: 'currency', 
      currency: 'GTQ',
      minimumFractionDigits: 2 
    }).format(num || 0);
  };

  const formatDate = (date: Date | string) => {
    if (!date) return 'No especificada';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('es-GT');
  };

  // Map of field names to user-friendly labels - updated with correct field names
  const fieldLabels: { [key: string]: string } = {
    // Identificación básica
    firstName: 'Nombres',
    gender: 'Género',
    civilStatus: 'Estado Civil',
    dpi: 'DPI (13 dígitos)',
    dpiExtendedIn: 'DPI Extendido en',
    cua: 'CUA - T24',
    
    nit: 'NIT',
    // Contacto
    mobilePhone: 'Teléfono Móvil',
    email: 'Correo Electrónico',
    address: 'Dirección',
    // Información del crédito
    creditPurpose: 'Destino del Crédito',
    requestedAmount: 'Monto Solicitado',
    termMonths: 'Plazo en Meses'
  };

  const getCompletionStatus = () => {
    // Ya no hay campos requeridos - todos son opcionales
    const allFields = Object.keys(formData).filter(key => 
      formData[key] && 
      formData[key] !== '' && 
      formData[key] !== null && 
      formData[key] !== undefined
    );
    
    // Estimar total basado en las secciones principales del formulario
    const estimatedTotalFields = 50;
    
    const completionPercentage = Math.min((allFields.length / estimatedTotalFields) * 100, 100);
    
    return {
      percentage: Math.round(completionPercentage),
      completed: allFields.length,
      total: estimatedTotalFields,
      isComplete: false // Siempre permitir envío
    };
  };

  const completion = getCompletionStatus();

  const handleValidateMapping = () => {
    try {
      const officialPayload = toOfficial(formData);
      const validation = validateCoverage(officialPayload);
      setValidationResult(validation);
      
      if (validation.isValid) {
        toast({
          title: "Validación exitosa",
          description: "El mapeo de campos está completo y correcto.",
          variant: "success"
        });
      } else {
        toast({
          title: "Problemas encontrados",
          description: `${validation.issues.length} problemas críticos encontrados.`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error validating mapping:', error);
      toast({
        title: "Error de validación",
        description: "No se pudo validar el mapeo de campos.",
        variant: "destructive"
      });
    }
  };

  const handleSendApplication = () => {
    // Marcar términos como aceptados antes del envío
    updateFormData('termsAccepted', true);
    updateFormData('dataProcessingAccepted', true);
    updateFormData('creditCheckAccepted', true);
    
    // Llamar a la función de envío del contexto
    handleSubmit();
  };

  return (
    <Card className="border-0 shadow-none">
      <CardContent className="p-0 space-y-6">
        <SubformHeader
          icon={<CheckCircle className="w-5 h-5" />}
          title="Revisión Final"
          subtitle="Revise toda la información antes de enviar la solicitud."
          variant="applicant"
        />

        {/* Estado de Completitud */}
        <div className="border rounded-md p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Estado de Completitud</h4>
            <Badge 
              variant="secondary"
              className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
            >
              {completion.percentage}% Completo
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="text-sm">
              {completion.completed} campos completados
            </span>
          </div>
        </div>


        {/* Botón de Enviar Solicitud - siempre disponible */}
        <div className="border rounded-md p-4 bg-blue-50 border-blue-200">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 text-blue-700">
              <CheckCircle className="h-6 w-6" />
              <span className="font-medium text-lg">Enviar Solicitud</span>
            </div>
            <p className="text-sm text-blue-600 text-center">
              Puede enviar la solicitud en cualquier momento. Los campos faltantes se pueden completar posteriormente.
            </p>
            <Button 
              onClick={handleSendApplication}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
              size="lg"
            >
              <Send className="h-4 w-4 mr-2" />
              Enviar Solicitud
            </Button>
          </div>
        </div>

        {/* Información Personal */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Identificación y Contacto</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Agencia</dt>
              <dd className="text-sm font-medium text-gray-900">{formData.agency || 'No especificada'}</dd>
            </div>
            <div className="space-y-1">
              <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Fecha Solicitud</dt>
              <dd className="text-sm font-medium text-gray-900">{formatDate(formData.applicationDate)}</dd>
            </div>
            <div className="space-y-1">
              <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">DPI</dt>
              <dd className="text-sm font-medium text-gray-900">{formData.dpi || 'No especificado'}</dd>
            </div>
            <div className="space-y-1">
              <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Nombre Completo</dt>
              <dd className="text-sm font-medium text-gray-900">{formData.firstName || 'No especificado'} {formData.lastName || ''}</dd>
            </div>
            <div className="space-y-1">
              <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Estado Civil</dt>
              <dd className="text-sm font-medium text-gray-900">{formData.civilStatus || 'No especificado'}</dd>
            </div>
            <div className="space-y-1">
              <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Teléfono</dt>
              <dd className="text-sm font-medium text-gray-900">{formData.mobilePhone || 'No especificado'}</dd>
            </div>
            <div className="space-y-1">
              <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email</dt>
              <dd className="text-sm font-medium text-gray-900">{formData.email || 'No especificado'}</dd>
            </div>
            <div className="space-y-1">
              <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Tipo Vivienda</dt>
              <dd className="text-sm font-medium text-gray-900">{formData.housingType || 'No especificado'}</dd>
            </div>
          </div>
          
          {formData.address && (
            <div className="space-y-1">
              <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Dirección</dt>
              <dd className="text-sm font-medium text-gray-900">{formData.address}</dd>
            </div>
          )}
        </div>

        <Separator />

        {/* Información del Crédito */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Información del Crédito</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Monto Solicitado</dt>
              <dd className="text-base font-semibold text-green-600">{formatCurrency(formData.requestedAmount)}</dd>
            </div>
            <div className="space-y-1">
              <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Plazo</dt>
              <dd className="text-sm font-medium text-gray-900">{formData.termMonths || 0} meses</dd>
            </div>
            <div className="space-y-1">
              <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Destino</dt>
              <dd className="text-sm font-medium text-gray-900">{formData.creditPurpose || 'No especificado'}</dd>
            </div>
            <div className="space-y-1">
              <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Forma de Pago</dt>
              <dd className="text-sm font-medium text-gray-900">{formData.paymentPlan || 'No especificada'}</dd>
            </div>
            <div className="space-y-1">
              <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Tipo de Socio</dt>
              <dd className="text-sm font-medium text-gray-900">{formData.memberType || 'No especificado'}</dd>
            </div>
          </div>
        </div>

        <Separator />

        {/* Información Financiera */}
        {(formData.cashSales || formData.creditSales) && (
          <>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Información Financiera</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Ventas Contado</dt>
                  <dd className="text-sm font-medium text-gray-900">{formatCurrency(formData.cashSales)}</dd>
                </div>
                <div className="space-y-1">
                  <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Ventas Crédito</dt>
                  <dd className="text-sm font-medium text-gray-900">{formatCurrency(formData.creditSales)}</dd>
                </div>
                <div className="space-y-1">
                  <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Ventas</dt>
                  <dd className="text-base font-semibold text-blue-600">{formatCurrency((parseFloat(formData.cashSales || 0) + parseFloat(formData.creditSales || 0)))}</dd>
                </div>
              </div>
            </div>
            <Separator />
          </>
        )}

        {/* Información del Negocio */}
        {formData.businessName && (
          <>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Negocio y Perfil Económico</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Nombre Negocio:</span> {formData.businessName}
                </div>
                <div>
                  <span className="font-medium">Tipo Actividad:</span> {formData.activityType || 'No especificado'}
                </div>
                <div>
                  <span className="font-medium">Años Experiencia:</span> {formData.experienceYears || 0}
                </div>
              </div>
              
              {formData.businessAddress && (
                <div className="text-sm">
                  <span className="font-medium">Dirección Negocio:</span> {formData.businessAddress}
                </div>
              )}

              {/* Productos */}
              {formData.products && formData.products.length > 0 && (
                <div>
                  <span className="font-medium text-sm">Productos:</span>
                  <div className="mt-2 space-y-1">
                    {formData.products.map((product: any, index: number) => (
                      <div key={product.id} className="text-sm text-muted-foreground">
                        {index + 1}. {product.name} - {formatCurrency(product.total)}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <Separator />
          </>
        )}

        {/* Fiadores */}
        {formData.guarantors && formData.guarantors.length > 0 && (
          <>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Fiadores y Referencias</h3>
              <div className="space-y-2">
                {formData.guarantors.map((guarantor: any, index: number) => (
                  <div key={guarantor.id} className="text-sm">
                    <span className="font-medium">Fiador {index + 1}:</span> {guarantor.name} - {guarantor.coveragePercentage}% cobertura
                  </div>
                ))}
              </div>
            </div>
            <Separator />
          </>
        )}

        {/* Documentos */}
        {formData.documents && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Documentos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              {Object.entries(formData.documents).map(([key, doc]: [string, any]) => (
                <div key={key} className="flex items-center gap-2">
                  {doc.status === 'success' ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span>{key.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Observaciones */}
        {formData.characterObservations && (
          <>
            <Separator />
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Observaciones</h3>
              <p className="text-sm text-muted-foreground">{formData.characterObservations}</p>
            </div>
          </>
        )}

      </CardContent>
    </Card>
  );
};

export default ReviewSection;
