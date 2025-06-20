import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, DollarSign, Briefcase, FileText, FileCheck, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FieldPlaceholder from '../placeholders/FieldPlaceholder';
import InteractiveDocumentCard from '@/components/documents/InteractiveDocumentCard';
import { useDocumentManager, guatemalanDocuments } from '@/hooks/useDocumentManager';

interface SummaryTabProps {
  application: any;
  onNavigateToSection: (sectionId: string, fieldName?: string) => void;
  onNavigateToDocuments: () => void;
}

const SummaryTab: React.FC<SummaryTabProps> = ({
  application,
  onNavigateToSection,
  onNavigateToDocuments
}) => {
  const { documents, loadingDocument, uploadDocument, removeDocument } = useDocumentManager();

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

  // Función simplificada para obtener valores directamente del objeto application
  const getSafeValue = (fieldName: string, fallback: string = 'Por ingresar') => {
    // application ya contiene los datos directos (draft_data o data)
    if (!application) return fallback;
    
    const value = application[fieldName];
    return hasValue(value) ? value : fallback;
  };

  // Función específica para obtener el nombre completo
  const getFullName = () => {
    if (!application) return 'Por ingresar';
    
    // Intentar obtener el nombre completo directamente
    const fullName = application.fullName;
    if (hasValue(fullName)) return fullName;
    
    // Si no hay fullName, construir desde firstName y lastName
    const firstName = application.firstName;
    const lastName = application.lastName;
    
    if (hasValue(firstName) && hasValue(lastName)) {
      return `${firstName} ${lastName}`;
    }
    
    if (hasValue(firstName)) return firstName;
    
    return 'Por ingresar';
  };

  // Función para calcular gastos mensuales totales
  const calculateMonthlyExpenses = () => {
    if (!application) return null;
    
    // Sumar todos los gastos individuales
    const expenses = [
      application.rentExpense,
      application.foodExpense,
      application.transportExpense,
      application.servicesExpense,
      application.educationExpense,
      application.healthExpense,
      application.otherExpense
    ];
    
    const total = expenses.reduce((sum, expense) => {
      const value = parseFloat(expense) || 0;
      return sum + value;
    }, 0);
    
    return total > 0 ? total : null;
  };

  // Helper function to handle field-specific navigation
  const handleFieldEdit = (fieldName: string, fallbackSection: string) => {
    onNavigateToSection(fallbackSection, fieldName);
  };

  const handleDocumentUpload = async (documentId: string, file: File) => {
    await uploadDocument(documentId, file);
  };

  const handleTakePhoto = (documentId: string) => {
    // Simular activación de cámara
    console.log('Activating camera for:', documentId);
    // En implementación real, aquí se activaría la cámara
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
                onEdit={() => handleFieldEdit('firstName', 'identification')}
                required={true}
              />
              <FieldPlaceholder
                label="DPI"
                value={getSafeValue('dpi')}
                onEdit={() => handleFieldEdit('dpi', 'identification')}
                required={true}
              />
              <FieldPlaceholder
                label="NIT"
                value={getSafeValue('nit')}
                onEdit={() => handleFieldEdit('nit', 'identification')}
              />
              <FieldPlaceholder
                label="Teléfono"
                value={getSafeValue('mobilePhone')}
                onEdit={() => handleFieldEdit('mobilePhone', 'identification')}
                required={true}
              />
              <FieldPlaceholder
                label="Email"
                value={getSafeValue('email')}
                onEdit={() => handleFieldEdit('email', 'identification')}
              />
              <FieldPlaceholder
                label="Agencia"
                value={getSafeValue('agency')}
                onEdit={() => handleFieldEdit('agency', 'identification')}
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
                onEdit={() => handleFieldEdit('ingresoPrincipal', 'finances')}
                required={true}
              />
              <FieldPlaceholder
                label="Gastos Mensuales"
                value={formatCurrency(calculateMonthlyExpenses())}
                onEdit={() => handleFieldEdit('rentExpense', 'finances')}
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
                onEdit={() => handleFieldEdit('occupation', 'business')}
              />
              <FieldPlaceholder
                label="Empresa/Negocio"
                value={getSafeValue('companyName') || getSafeValue('businessName')}
                onEdit={() => handleFieldEdit('companyName', 'business')}
              />
              <FieldPlaceholder
                label="Experiencia"
                value={getSafeValue('experienceYears') !== 'Por ingresar' ? `${getSafeValue('experienceYears')} años` : 'Por ingresar'}
                onEdit={() => handleFieldEdit('experienceYears', 'business')}
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
            <div className="text-center p-3 bg-background rounded-md cursor-pointer" onClick={() => handleFieldEdit('requestedAmount', 'identification')}>
              <p className="text-xs text-muted-foreground mb-1">Monto Solicitado</p>
              <p className="font-bold text-lg">
                {getSafeValue('requestedAmount') !== 'Por ingresar' 
                  ? formatCurrency(getSafeValue('requestedAmount', null)) || "Por definir"
                  : "Por definir"
                }
              </p>
            </div>
            <div className="text-center p-3 bg-background rounded-md cursor-pointer" onClick={() => handleFieldEdit('termMonths', 'identification')}>
              <p className="text-xs text-muted-foreground mb-1">Plazo</p>
              <p className="font-bold text-lg">
                {getSafeValue('termMonths') !== 'Por ingresar' 
                  ? `${getSafeValue('termMonths')} meses`
                  : "Por definir"
                }
              </p>
            </div>
            <div className="text-center p-3 bg-background rounded-md cursor-pointer" onClick={() => handleFieldEdit('creditType', 'identification')}>
              <p className="text-xs text-muted-foreground mb-1">Tipo de Crédito</p>
              <p className="font-bold text-sm">
                {getSafeValue('creditType', 'Por definir')}
              </p>
            </div>
            <div className="text-center p-3 bg-background rounded-md cursor-pointer" onClick={() => handleFieldEdit('creditPurpose', 'identification')}>
              <p className="text-xs text-muted-foreground mb-1">Propósito</p>
              <p className="font-bold text-sm">
                {getSafeValue('creditPurpose', 'Por definir')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="cursor-pointer hover:shadow-md transition-shadow duration-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="h-4 w-4 mr-2 text-primary" />
              Estado de Documentos
            </div>
            <Button variant="ghost" size="sm" onClick={onNavigateToDocuments}>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {documents.map((document) => (
              <InteractiveDocumentCard
                key={document.id}
                document={document}
                isLoading={loadingDocument === document.id}
                onUploadFile={(file) => handleDocumentUpload(document.id, file)}
                onTakePhoto={() => handleTakePhoto(document.id)}
                onRemove={() => removeDocument(document.id)}
                showActions={true}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryTab;
