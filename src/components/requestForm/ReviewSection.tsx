
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface ReviewSectionProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ formData }) => {
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

  // Map of field names to user-friendly labels
  const fieldLabels: { [key: string]: string } = {
    agency: 'Agencia',
    cui: 'CUI/DPI',
    fullName: 'Nombre Completo',
    birthDate: 'Fecha de Nacimiento',
    civilStatus: 'Estado Civil',
    educationLevel: 'Nivel de Educación',
    mobilePhone: 'Teléfono Móvil',
    email: 'Correo Electrónico',
    housingType: 'Tipo de Vivienda',
    address: 'Dirección',
    profession: 'Profesión',
    requestedAmount: 'Monto Solicitado',
    termMonths: 'Plazo en Meses'
  };

  const getCompletionStatus = () => {
    const requiredFields = [
      'agency', 'cui', 'fullName', 'birthDate', 'civilStatus', 
      'educationLevel', 'mobilePhone', 'email', 'housingType', 
      'address', 'profession', 'requestedAmount', 'termMonths'
    ];
    
    const completedFields = requiredFields.filter(field => formData[field]);
    const missingFields = requiredFields.filter(field => !formData[field]);
    const completionPercentage = (completedFields.length / requiredFields.length) * 100;
    
    return {
      percentage: Math.round(completionPercentage),
      completed: completedFields.length,
      total: requiredFields.length,
      missingFields: missingFields.map(field => fieldLabels[field] || field)
    };
  };

  const completion = getCompletionStatus();

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
              variant={completion.percentage === 100 ? "default" : "secondary"}
              className={completion.percentage === 100 ? "" : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"}
            >
              {completion.percentage}% Completo
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            {completion.percentage === 100 ? (
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
              <span className="font-medium">CUI:</span> {formData.cui || 'No especificado'}
            </div>
            <div>
              <span className="font-medium">Nombre:</span> {formData.fullName || 'No especificado'}
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

        {/* Mensaje de Estado */}
        <div className="border rounded-md p-4 bg-muted/20">
          {completion.percentage === 100 ? (
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">La solicitud está lista para enviar</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">Faltan campos requeridos por completar</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewSection;
