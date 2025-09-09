
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Plus, Check, Clock, Edit, Trash2 } from 'lucide-react';
import { useFormContext } from './RequestFormProvider';
import ReferenceBasicInfo from './references/ReferenceBasicInfo';

interface ReferencesSectionProps {
  formData: Record<string, any>;
  updateFormData: (field: string, value: any) => void;
}

const ReferencesSection: React.FC<ReferencesSectionProps> = ({
  formData,
  updateFormData
}) => {
  const { 
    references, 
    currentReferenceIndex, 
    setCurrentReferenceIndex,
    referenceFormStep,
    setReferenceFormStep,
    addReference,
    removeReference,
    isInReferenceForm,
    setIsInReferenceForm
  } = useFormContext();

  const handleEditReference = (index: number) => {
    setCurrentReferenceIndex(index);
    setReferenceFormStep(0);
    setIsInReferenceForm(true);
  };

  const handleBackToList = () => {
    setIsInReferenceForm(false);
    setReferenceFormStep(0);
  };

  const handleCompleteReference = () => {
    handleBackToList();
  };

  const getReferenceStatus = (reference: any) => {
    if (reference.basicInfoCompleted) {
      return 'complete';
    }
    return 'pending';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'complete':
        return <Badge className="bg-primary/10 text-primary border-primary/20"><Check className="h-3 w-3 mr-1" />Completo</Badge>;
      default:
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pendiente</Badge>;
    }
  };

  const currentReference = references[currentReferenceIndex];

  if (isInReferenceForm) {
    return (
      <div className="space-y-6">
        {/* Form Header with improved contrast */}
        <div className="bg-primary text-primary-foreground p-4 rounded-lg">
          <h2 className="text-xl font-semibold">
            Información Básica - Referencia {currentReferenceIndex + 1}
          </h2>
          <p className="text-primary-foreground/80">
            Complete la información de la referencia
          </p>
        </div>

        {/* Form Content */}
        <ReferenceBasicInfo referenceIndex={currentReferenceIndex} />

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6">
          <Button 
            variant="outline" 
            onClick={handleBackToList}
          >
            Volver a Lista
          </Button>
          
          <Button 
            onClick={handleCompleteReference}
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

      {/* Add Reference Card (shown first when no references) */}
      {references.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Plus className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-muted-foreground mb-4">
              Agregar nueva referencia
            </p>
            <Button onClick={addReference} className="bg-green-600 hover:bg-green-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Agregar Referencia
            </Button>
          </CardContent>
        </Card>
      )}

      {/* References List */}
      <div className="space-y-4">
        {references.map((reference, index) => {
          const status = getReferenceStatus(reference);
          
          return (
            <Card key={reference.id} className="relative">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Referencia {index + 1}
                    {reference.fullName && (
                      <span className="text-base font-normal text-muted-foreground">
                        - {reference.fullName}
                      </span>
                    )}
                  </CardTitle>
                   <div className="flex items-center gap-2">
                     <Button
                       variant="ghost"
                       size="sm"
                       onClick={() => removeReference(index)}
                       className="text-red-600 hover:text-red-800"
                     >
                       <Trash2 className="h-4 w-4" />
                     </Button>
                   </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {reference.fullName ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Tipo:</span> {reference.referenceType || 'No proporcionado'}
                      </div>
                      <div>
                        <span className="font-medium">Teléfono:</span> {reference.phone || 'No proporcionado'}
                      </div>
                      <div>
                        <span className="font-medium">Relación:</span> {reference.relation || 'No proporcionado'}
                      </div>
                      <div>
                        <span className="font-medium">Calificación:</span> {reference.rating || 'No proporcionado'}
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Sin información completada</p>
                  )}
                  
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditReference(index)}
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

      {/* Add Reference Button (shown when there are existing references) */}
      {references.length > 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Plus className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-muted-foreground mb-4">
              Agregar nueva referencia
            </p>
            <Button onClick={addReference} className="bg-green-600 hover:bg-green-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Agregar Referencia
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ReferencesSection;
