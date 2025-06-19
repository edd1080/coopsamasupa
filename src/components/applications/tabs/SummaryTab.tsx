
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

  // Función mejorada para obtener valores de diferentes fuentes
  const getSafeValue = (path: string, fallback: string = 'Por ingresar') => {
    // Si application es un borrador, los datos están en application.data
    const dataSource = application?.data || application?.draft_data || application;
    
    if (!dataSource) return fallback;
    
    const pathArray = path.split('.');
    let current = dataSource;
    
    // También verificar en la raíz del objeto si no se encuentra en el path
    if (pathArray.length === 2) {
      const directValue = dataSource[pathArray[1]];
      if (hasValue(directValue)) {
        return directValue;
      }
    }
    
    for (const key of pathArray) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        return fallback;
      }
    }
    
    return hasValue(current) ? current : fallback;
  };

  // Función específica para obtener el nombre completo
  const getFullName = () => {
    const dataSource = application?.data || application?.draft_data || application;
    
    if (!dataSource) return 'Por ingresar';
    
    // Intentar diferentes fuentes para el nombre completo
    const fullName = dataSource.fullName || 
                     dataSource.identification?.fullName ||
                     dataSource.personalInfo?.fullName ||
                     dataSource.basicData?.fullName;
    
    if (hasValue(fullName)) return fullName;
    
    // Si no hay fullName, construir desde firstName y lastName
    const firstName = dataSource.firstName || 
                      dataSource.identification?.firstName ||
                      dataSource.personalInfo?.firstName ||
                      dataSource.basicData?.firstName;
                      
    const lastName = dataSource.lastName || 
                     dataSource.identification?.lastName ||
                     dataSource.personalInfo?.lastName ||
                     dataSource.basicData?.lastName;
    
    if (hasValue(firstName) && hasValue(lastName)) {
      return `${firstName} ${lastName}`;
    }
    
    if (hasValue(firstName)) return firstName;
    
    // Fallback al client_name si existe
    if (hasValue(application?.client_name)) return application.client_name;
    
    return 'Por ingresar';
  };

  // Función para obtener información de la agencia
  const getAgencyInfo = () => {
    const dataSource = application?.data || application?.draft_data || application;
    
    if (!dataSource) return 'Por ingresar';
    
    const agency = dataSource.agency || 
                   dataSource.identification?.agency ||
                   dataSource.personalInfo?.agency ||
                   dataSource.basicData?.agency ||
                   dataSource.workInfo?.agency;
    
    return hasValue(agency) ? agency : 'Por ingresar';
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
                value={getSafeValue('identification.cui') || getSafeValue('cui')}
                onEdit={() => onNavigateToSection('identification')}
                required={true}
              />
              <FieldPlaceholder
                label="NIT"
                value={getSafeValue('identification.nit') || getSafeValue('nit')}
                onEdit={() => onNavigateToSection('identification')}
              />
              <FieldPlaceholder
                label="Teléfono"
                value={getSafeValue('identification.phone') || getSafeValue('phone')}
                onEdit={() => onNavigateToSection('identification')}
                required={true}
              />
              <FieldPlaceholder
                label="Email"
                value={getSafeValue('identification.email') || getSafeValue('email')}
                onEdit={() => onNavigateToSection('identification')}
              />
              <FieldPlaceholder
                label="Agencia"
                value={getAgencyInfo()}
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
                value={formatCurrency(getSafeValue('finances.primaryIncome', null) || getSafeValue('monthlyIncome', null))}
                onEdit={() => onNavigateToSection('finances')}
                required={true}
              />
              <FieldPlaceholder
                label="Gastos Mensuales"
                value={formatCurrency(getSafeValue('finances.totalExpenses', null) || getSafeValue('monthlyExpenses', null))}
                onEdit={() => onNavigateToSection('finances')}
              />
              <FieldPlaceholder
                label="Patrimonio Neto"
                value={formatCurrency(getSafeValue('finances.netWorth', null) || getSafeValue('netWorth', null))}
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
                value={getSafeValue('work.employmentStatus') || getSafeValue('employmentStatus')}
                onEdit={() => onNavigateToSection('business')}
              />
              <FieldPlaceholder
                label="Empresa/Negocio"
                value={getSafeValue('work.companyName') || getSafeValue('companyName') || getSafeValue('businessName')}
                onEdit={() => onNavigateToSection('business')}
              />
              <FieldPlaceholder
                label="Experiencia"
                value={getSafeValue('work.yearsEmployed') !== 'Por ingresar' ? `${getSafeValue('work.yearsEmployed')} años` : 'Por ingresar'}
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
                {getSafeValue('creditRequest.loanAmount') !== 'Por ingresar' 
                  ? formatCurrency(getSafeValue('creditRequest.loanAmount', null) || getSafeValue('requestedAmount', null)) || "Por definir"
                  : "Por definir"
                }
              </p>
            </div>
            <div className="text-center p-3 bg-background rounded-md">
              <p className="text-xs text-muted-foreground mb-1">Plazo</p>
              <p className="font-bold text-lg">
                {getSafeValue('creditRequest.termMonths') !== 'Por ingresar' 
                  ? `${getSafeValue('creditRequest.termMonths') || getSafeValue('termMonths')} meses`
                  : "Por definir"
                }
              </p>
            </div>
            <div className="text-center p-3 bg-background rounded-md">
              <p className="text-xs text-muted-foreground mb-1">Tipo de Crédito</p>
              <p className="font-bold text-sm">
                {getSafeValue('creditRequest.creditType', getSafeValue('creditType', 'Por definir'))}
              </p>
            </div>
            <div className="text-center p-3 bg-background rounded-md">
              <p className="text-xs text-muted-foreground mb-1">Propósito</p>
              <p className="font-bold text-sm">
                {getSafeValue('creditRequest.purpose', getSafeValue('creditPurpose', 'Por definir'))}
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
