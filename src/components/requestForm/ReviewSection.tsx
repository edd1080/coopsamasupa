
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, AlertCircle, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFormContext } from './RequestFormProvider';

interface ReviewSectionProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ formData, updateFormData }) => {
  const { handleSubmit } = useFormContext();

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
    cif: 'CIF',
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
    // Campos absolutamente requeridos basados en la estructura real del formulario
    const requiredFields = [
      // Identificación básica - campos que aparecen en BasicDataForm
      'firstName',
      'gender', 
      'civilStatus',
      'dpi',
      'dpiExtendedIn',
      'cua',
      'cif',
      'nit',
      // Contacto - campos que aparecen en ContactHousingForm
      'mobilePhone',
      'email',
      'address',
      // Información del crédito - campos que aparecen en CreditInfoForm
      'creditPurpose',
      'requestedAmount',
      'termMonths'
    ];
    
    const completedFields = requiredFields.filter(field => {
      const value = formData[field];
      // Para campos numéricos, verificar que sean mayor a 0
      if (field === 'requestedAmount' || field === 'termMonths') {
        return value && parseFloat(value) > 0;
      }
      // Para DPI, verificar que tenga exactamente 13 dígitos
      if (field === 'dpi') {
        return value && value.length === 13 && /^\d{13}$/.test(value);
      }
      // Para NIT, verificar que tenga al menos 8 dígitos
      if (field === 'nit') {
        return value && value.length >= 8 && /^\d+$/.test(value);
      }
      // Para otros campos, verificar que no estén vacíos
      return value && value.trim && value.trim().length > 0;
    });
    
    const missingFields = requiredFields.filter(field => {
      const value = formData[field];
      if (field === 'requestedAmount' || field === 'termMonths') {
        return !value || parseFloat(value) <= 0;
      }
      if (field === 'dpi') {
        return !value || value.length !== 13 || !/^\d{13}$/.test(value);
      }
      if (field === 'nit') {
        return !value || value.length < 8 || !/^\d+$/.test(value);
      }
      return !value || !value.trim || value.trim().length === 0;
    });
    
    const completionPercentage = (completedFields.length / requiredFields.length) * 100;
    
    return {
      percentage: Math.round(completionPercentage),
      completed: completedFields.length,
      total: requiredFields.length,
      missingFields: missingFields.map(field => fieldLabels[field] || field),
      isComplete: completionPercentage === 100
    };
  };

  const completion = getCompletionStatus();

  const handleSendApplication = () => {
    if (completion.isComplete) {
      // Marcar términos como aceptados antes del envío
      updateFormData('termsAccepted', true);
      updateFormData('dataProcessingAccepted', true);
      updateFormData('creditCheckAccepted', true);
      
      // Llamar a la función de envío del contexto
      handleSubmit();
    }
  };

  return (
    <Card className="border-0 shadow-none">
      <CardContent className="p-0 space-y-6">
        <div>
          <h3 className="font-semibold text-lg">Revisión Final</h3>
          <p className="text-muted-foreground text-sm">
            Revise toda la información antes de enviar la solicitud.
          </p>
        </div>

        {/* Estado de Completitud */}
        <div className="border rounded-md p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Estado de Completitud</h4>
            <Badge 
              variant={completion.isComplete ? "default" : "secondary"}
              className={completion.isComplete ? "" : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"}
            >
              {completion.percentage}% Completo
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            {completion.isComplete ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-500" />
            )}
            <span className="text-sm">
              {completion.completed} de {completion.total} campos requeridos completados
            </span>
          </div>
          
          {/* Lista de campos faltantes */}
          {completion.missingFields.length > 0 && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm font-medium text-red-800 mb-2">Campos requeridos faltantes:</p>
              <ul className="text-sm text-red-700 space-y-1">
                {completion.missingFields.map((field, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                    {field}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Botón de Enviar Solicitud - solo aparece cuando está 100% completo */}
        {completion.isComplete && (
          <div className="border rounded-md p-4 bg-green-50 border-green-200">
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle className="h-6 w-6" />
                <span className="font-medium text-lg">¡Solicitud Lista para Enviar!</span>
              </div>
              <p className="text-sm text-green-600 text-center">
                Todos los campos requeridos han sido completados. Puede proceder a enviar la solicitud.
              </p>
              <Button 
                onClick={handleSendApplication}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2"
                size="lg"
              >
                <Send className="h-4 w-4 mr-2" />
                Enviar Solicitud
              </Button>
            </div>
          </div>
        )}

        {/* Información Personal */}
        <div className="space-y-4">
          <h4 className="font-medium">1. Identificación y Contacto</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Agencia:</span> {formData.agency || 'No especificada'}
            </div>
            <div>
              <span className="font-medium">Fecha Solicitud:</span> {formatDate(formData.applicationDate)}
            </div>
            <div>
              <span className="font-medium">DPI:</span> {formData.dpi || 'No especificado'}
            </div>
            <div>
              <span className="font-medium">Nombre:</span> {formData.firstName || 'No especificado'} {formData.lastName || ''}
            </div>
            <div>
              <span className="font-medium">Estado Civil:</span> {formData.civilStatus || 'No especificado'}
            </div>
            <div>
              <span className="font-medium">Teléfono:</span> {formData.mobilePhone || 'No especificado'}
            </div>
            <div>
              <span className="font-medium">Email:</span> {formData.email || 'No especificado'}
            </div>
            <div>
              <span className="font-medium">Tipo Vivienda:</span> {formData.housingType || 'No especificado'}
            </div>
          </div>
          
          {formData.address && (
            <div className="text-sm">
              <span className="font-medium">Dirección:</span> {formData.address}
            </div>
          )}
        </div>

        <Separator />

        {/* Información del Crédito */}
        <div className="space-y-4">
          <h4 className="font-medium">Información del Crédito</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Monto Solicitado:</span> {formatCurrency(formData.requestedAmount)}
            </div>
            <div>
              <span className="font-medium">Plazo:</span> {formData.termMonths || 0} meses
            </div>
            <div>
              <span className="font-medium">Destino:</span> {formData.creditPurpose || 'No especificado'}
            </div>
            <div>
              <span className="font-medium">Forma Pago Capital:</span> {formData.capitalPayment || 'No especificada'}
            </div>
          </div>
        </div>

        <Separator />

        {/* Información Financiera */}
        {(formData.cashSales || formData.creditSales) && (
          <>
            <div className="space-y-4">
              <h4 className="font-medium">2. Información Financiera</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Ventas Contado:</span> {formatCurrency(formData.cashSales)}
                </div>
                <div>
                  <span className="font-medium">Ventas Crédito:</span> {formatCurrency(formData.creditSales)}
                </div>
                <div>
                  <span className="font-medium">Total Ventas:</span> {formatCurrency((parseFloat(formData.cashSales || 0) + parseFloat(formData.creditSales || 0)))}
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
              <h4 className="font-medium">3. Negocio y Perfil Económico</h4>
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
              <h4 className="font-medium">4. Fiadores y Referencias</h4>
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
            <h4 className="font-medium">5. Documentos</h4>
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
              <h4 className="font-medium">Observaciones</h4>
              <p className="text-sm text-muted-foreground">{formData.characterObservations}</p>
            </div>
          </>
        )}

        {/* Mensaje de Estado - solo aparece cuando NO está completo */}
        {!completion.isComplete && (
          <div className="border rounded-md p-4 bg-muted/20">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">Faltan campos requeridos por completar</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReviewSection;
