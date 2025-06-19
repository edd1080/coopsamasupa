
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, DollarSign, Briefcase, FileText, FileCheck, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FieldPlaceholder from '../placeholders/FieldPlaceholder';

interface SummaryTabProps {
  application: any;
  onNavigateToSection: (sectionId: string) => void;
  onNavigateToDocuments: () => void;
}

const SummaryTab: React.FC<SummaryTabProps> = ({
  application,
  onNavigateToSection,
  onNavigateToDocuments
}) => {
  const formatCurrency = (amount: number | undefined | null) => {
    if (!amount || amount === 0) return null;
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: 'GTQ'
    }).format(amount);
  };

  // Función para validar si un valor existe y no está vacío
  const hasValue = (value: any) => {
    return value !== null && value !== undefined && value !== '' && value !== 0;
  };

  // Función simplificada para obtener valores directamente del objeto de datos
  const getSafeValue = (fieldName: string, fallback: string = 'Por ingresar') => {
    // Obtener el objeto de datos correcto
    const dataSource = application?.data || application?.draft_data || application;
    
    if (!dataSource) return fallback;
    
    // Búsqueda directa en el nivel raíz
    const value = dataSource[fieldName];
    return hasValue(value) ? value : fallback;
  };

  // Función específica para obtener el nombre completo
  const getFullName = () => {
    const dataSource = application?.data || application?.draft_data || application;
    
    if (!dataSource) return 'Por ingresar';
    
    // Intentar obtener el nombre completo directamente
    const fullName = dataSource.fullName;
    if (hasValue(fullName)) return fullName;
    
    // Si no hay fullName, construir desde firstName y lastName
    const firstName = dataSource.firstName;
    const lastName = dataSource.lastName;
    
    if (hasValue(firstName) && hasValue(lastName)) {
      return `${firstName} ${lastName}`;
    }
    
    if (hasValue(firstName)) return firstName;
    
    // Fallback al client_name si existe
    if (hasValue(application?.client_name)) return application.client_name;
    
    return 'Por ingresar';
  };

  // Función para calcular gastos mensuales totales
  const calculateMonthlyExpenses = () => {
    const dataSource = application?.data || application?.draft_data || application;
    
    if (!dataSource) return null;
    
    // Sumar todos los gastos individuales
    const expenses = [
      dataSource.rentExpense,
      dataSource.foodExpense,
      dataSource.transportExpense,
      dataSource.servicesExpense,
      dataSource.educationExpense,
      dataSource.healthExpense,
      dataSource.otherExpense
    ];
    
    const total = expenses.reduce((sum, expense) => {
      const value = parseFloat(expense) || 0;
      return sum + value;
    }, 0);
    
    return total > 0 ? total : null;
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center">
              <User className="h-4 w-4 mr-2 text-primary" />
              Identificación
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <FieldPlaceholder
                label="Nombre"
                value={getFullName()}
                onEdit={() => onNavigateToSection('identification')}
                required={true}
              />
              <FieldPlaceholder
                label="DPI"
                value={getSafeValue('dpi')}
                onEdit={() => onNavigateToSection('identification')}
                required={true}
              />
              <FieldPlaceholder
                label="NIT"
                value={getSafeValue('nit')}
                onEdit={() => onNavigateToSection('identification')}
              />
              <FieldPlaceholder
                label="Teléfono"
                value={getSafeValue('mobilePhone')}
                onEdit={() => onNavigateToSection('identification')}
                required={true}
              />
              <FieldPlaceholder
                label="Email"
                value={getSafeValue('email')}
                onEdit={() => onNavigateToSection('identification')}
              />
              <FieldPlaceholder
                label="Agencia"
                value={getSafeValue('agency')}
                onEdit={() => onNavigateToSection('identification')}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center">
              <DollarSign className="h-4 w-4 mr-2 text-primary" />
              Finanzas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <FieldPlaceholder
                label="Ingresos Principales"
                value={formatCurrency(getSafeValue('ingresoPrincipal', null))}
                onEdit={() => onNavigateToSection('finances')}
                required={true}
              />
              <FieldPlaceholder
                label="Gastos Mensuales"
                value={formatCurrency(calculateMonthlyExpenses())}
                onEdit={() => onNavigateToSection('finances')}
              />
              <FieldPlaceholder
                label="Patrimonio Neto"
                value="Por ingresar"
                onEdit={() => onNavigateToSection('finances')}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center">
              <Briefcase className="h-4 w-4 mr-2 text-primary" />
              Trabajo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <FieldPlaceholder
                label="Situación Laboral"
                value={getSafeValue('occupation')}
                onEdit={() => onNavigateToSection('business')}
              />
              <FieldPlaceholder
                label="Empresa/Negocio"
                value={getSafeValue('companyName') || getSafeValue('businessName')}
                onEdit={() => onNavigateToSection('business')}
              />
              <FieldPlaceholder
                label="Experiencia"
                value={getSafeValue('experienceYears') !== 'Por ingresar' ? `${getSafeValue('experienceYears')} años` : 'Por ingresar'}
                onEdit={() => onNavigateToSection('business')}
              />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mb-4 border-primary/20 bg-primary/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center">
            <FileText className="h-4 w-4 mr-2 text-primary" />
            Solicitud de Crédito
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-background rounded-md">
              <p className="text-xs text-muted-foreground mb-1">Monto Solicitado</p>
              <p className="font-bold text-lg">
                {getSafeValue('requestedAmount') !== 'Por ingresar' 
                  ? formatCurrency(getSafeValue('requestedAmount', null)) || "Por definir"
                  : "Por definir"
                }
              </p>
            </div>
            <div className="text-center p-3 bg-background rounded-md">
              <p className="text-xs text-muted-foreground mb-1">Plazo</p>
              <p className="font-bold text-lg">
                {getSafeValue('termMonths') !== 'Por ingresar' 
                  ? `${getSafeValue('termMonths')} meses`
                  : "Por definir"
                }
              </p>
            </div>
            <div className="text-center p-3 bg-background rounded-md">
              <p className="text-xs text-muted-foreground mb-1">Tipo de Crédito</p>
              <p className="font-bold text-sm">
                {getSafeValue('creditType', 'Por definir')}
              </p>
            </div>
            <div className="text-center p-3 bg-background rounded-md">
              <p className="text-xs text-muted-foreground mb-1">Propósito</p>
              <p className="font-bold text-sm">
                {getSafeValue('creditPurpose', 'Por definir')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="cursor-pointer hover:shadow-md transition-shadow duration-200" onClick={onNavigateToDocuments}>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center justify-between">
            <div className="flex items-center">
              <FileCheck className="h-4 w-4 mr-2 text-primary" />
              Estado de Documentos
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {/* Mostrar documentos si existen, de lo contrario mostrar estado por defecto */}
            {application?.documents && Object.keys(application.documents).length > 0 ? (
              Object.entries(application.documents).map(([key, value]: [string, any]) => (
                <div key={key} className="flex flex-col items-center p-2 rounded-md border">
                  {value?.status === 'complete' ? (
                    <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-2">
                      <FileCheck className="h-5 w-5" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-2">
                      <FileText className="h-5 w-5" />
                    </div>
                  )}
                  <span className="text-xs text-center">
                    {key === 'dpiFrontal' && 'DPI Frontal'}
                    {key === 'dpiTrasero' && 'DPI Trasero'}
                    {key === 'fotoSolicitante' && 'Foto Solicitante'}
                    {key === 'recibosServicios' && 'Recibos Servicios'}
                    {key === 'firmaCanvas' && 'Firma Digital'}
                  </span>
                  {value?.status !== 'complete' && (
                    <p className="text-xs text-amber-600 mt-1">Por subir</p>
                  )}
                </div>
              ))
            ) : (
              // Mostrar documentos por defecto cuando no hay documentos
              ['DPI Frontal', 'DPI Trasero', 'Foto Solicitante', 'Recibos Servicios', 'Firma Digital'].map((docName) => (
                <div key={docName} className="flex flex-col items-center p-2 rounded-md border">
                  <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-2">
                    <FileText className="h-5 w-5" />
                  </div>
                  <span className="text-xs text-center">{docName}</span>
                  <p className="text-xs text-amber-600 mt-1">Por subir</p>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryTab;
