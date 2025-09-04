
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Plus, Check, Clock, Edit, Trash2 } from 'lucide-react';
import { useFormContext } from './RequestFormProvider';
import GuarantorBasicInfo from './guarantors/GuarantorBasicInfo';

interface GuarantorsSectionProps {
  formData: Record<string, any>;
  updateFormData: (field: string, value: any) => void;
}

const GuarantorsSection: React.FC<GuarantorsSectionProps> = ({
  formData,
  updateFormData
}) => {
  const { 
    guarantors, 
    currentGuarantorIndex, 
    setCurrentGuarantorIndex,
    guarantorFormStep,
    setGuarantorFormStep,
    addGuarantor,
    removeGuarantor,
    isInGuarantorForm,
    setIsInGuarantorForm
  } = useFormContext();

  const handleEditGuarantor = (index: number) => {
    setCurrentGuarantorIndex(index);
    setGuarantorFormStep(0);
    setIsInGuarantorForm(true);
  };

  const handleBackToList = () => {
    setIsInGuarantorForm(false);
    setGuarantorFormStep(0);
  };

  const handleCompleteGuarantor = () => {
    handleBackToList();
  };

  const getGuarantorStatus = (guarantor: any) => {
    if (guarantor.basicInfoCompleted) {
      return 'complete';
    }
    return 'pending';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'complete':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"><Check className="h-3 w-3 mr-1" />Completo</Badge>;
      default:
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pendiente</Badge>;
    }
  };

  const currentGuarantor = guarantors[currentGuarantorIndex];

  if (isInGuarantorForm) {
    return (
      <div className="space-y-6">
        {/* Form Header with improved contrast */}
        <div className="bg-green-600 text-white p-4 rounded-lg">
          <h2 className="text-xl font-semibold text-white">
            Información Básica - Referencia {currentGuarantorIndex + 1}
          </h2>
          <p className="text-green-100">
            Complete la información personal de la referencia
          </p>
        </div>

        {/* Form Content */}
        <GuarantorBasicInfo guarantorIndex={currentGuarantorIndex} />

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6">
          <Button 
            variant="outline" 
            onClick={handleBackToList}
          >
            Volver a Lista
          </Button>
          
          <Button 
            onClick={handleCompleteGuarantor}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Completar Referencia
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h2 className="text-xl font-semibold">Referencias Personales</h2>
        <p className="text-muted-foreground">
          Agregue las referencias personales del solicitante
        </p>
      </div>

      {/* Guarantors List */}
      <div className="space-y-4">
        {guarantors.map((guarantor, index) => {
          const status = getGuarantorStatus(guarantor);
          
          return (
            <Card key={guarantor.id} className="relative">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Referencia {index + 1}
                    {guarantor.fullName && (
                      <span className="text-base font-normal text-muted-foreground">
                        - {guarantor.fullName}
                      </span>
                    )}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(status)}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeGuarantor(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {guarantor.fullName ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">DPI:</span> {guarantor.cui || 'No proporcionado'}
                      </div>
                      <div>
                        <span className="font-medium">Email:</span> {guarantor.email || 'No proporcionado'}
                      </div>
                      <div>
                        <span className="font-medium">Teléfono:</span> {guarantor.phone || 'No proporcionado'}
                      </div>
                      <div>
                        <span className="font-medium">Profesión:</span> {guarantor.profession || 'No proporcionado'}
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Sin información completada</p>
                  )}
                  
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditGuarantor(index)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Editar Información
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Add Guarantor Button */}
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-8">
          <Plus className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-muted-foreground mb-4">
            Agregar nueva referencia
          </p>
          <Button onClick={addGuarantor} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Agregar Referencia
          </Button>
        </CardContent>
      </Card>

      {/* Status Summary */}
      <Card className="bg-blue-50 dark:bg-blue-950">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Estado de Referencias</h4>
              <p className="text-sm text-muted-foreground">
                {guarantors.filter(g => getGuarantorStatus(g) === 'complete').length} de {guarantors.length} referencias completadas
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Actuales: {guarantors.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GuarantorsSection;
