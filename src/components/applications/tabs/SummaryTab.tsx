
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
  const formatCurrency = (amount: number | undefined) => {
    if (!amount) return undefined;
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: 'GTQ'
    }).format(amount);
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
                value={application.identification?.fullName}
                onEdit={() => onNavigateToSection('identification')}
              />
              <FieldPlaceholder
                label="CUI"
                value={application.identification?.cui}
                onEdit={() => onNavigateToSection('identification')}
              />
              <FieldPlaceholder
                label="NIT"
                value={application.identification?.nit}
                onEdit={() => onNavigateToSection('identification')}
              />
              <FieldPlaceholder
                label="Teléfono"
                value={application.identification?.phone}
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
                value={formatCurrency(application.finances?.primaryIncome)}
                onEdit={() => onNavigateToSection('finances')}
              />
              <FieldPlaceholder
                label="Gastos Mensuales"
                value={formatCurrency(application.finances?.totalExpenses)}
                onEdit={() => onNavigateToSection('finances')}
              />
              <FieldPlaceholder
                label="Patrimonio Neto"
                value={formatCurrency(application.finances?.netWorth)}
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
                value={application.work?.employmentStatus}
                onEdit={() => onNavigateToSection('business')}
              />
              <FieldPlaceholder
                label="Empresa/Negocio"
                value={application.work?.companyName}
                onEdit={() => onNavigateToSection('business')}
              />
              <FieldPlaceholder
                label="Experiencia"
                value={application.work?.yearsEmployed ? `${application.work.yearsEmployed} años` : undefined}
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
                {application.creditRequest?.loanAmount 
                  ? formatCurrency(application.creditRequest.loanAmount)
                  : "Por definir"
                }
              </p>
            </div>
            <div className="text-center p-3 bg-background rounded-md">
              <p className="text-xs text-muted-foreground mb-1">Plazo</p>
              <p className="font-bold text-lg">
                {application.creditRequest?.termMonths 
                  ? `${application.creditRequest.termMonths} meses`
                  : "Por definir"
                }
              </p>
            </div>
            <div className="text-center p-3 bg-background rounded-md">
              <p className="text-xs text-muted-foreground mb-1">Tipo de Crédito</p>
              <p className="font-bold text-sm">
                {application.creditRequest?.creditType || "Por definir"}
              </p>
            </div>
            <div className="text-center p-3 bg-background rounded-md">
              <p className="text-xs text-muted-foreground mb-1">Propósito</p>
              <p className="font-bold text-sm">
                {application.creditRequest?.purpose || "Por definir"}
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
            {Object.entries(application.documents || {}).map(([key, value]: [string, any]) => (
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
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryTab;
