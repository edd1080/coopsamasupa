import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Plus, Check, Clock, Edit, Trash2, User } from 'lucide-react';
import { useFormContext } from './RequestFormProvider';
import ReferenceBasicInfo from './references/ReferenceBasicInfo';
import SubformHeader from '@/components/forms/SubformHeader';

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
        return <Badge className="bg-success/10 text-success border-success/20"><Check className="h-3 w-3 mr-1" />Completo</Badge>;
      default:
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pendiente</Badge>;
    }
  };

  const currentReference = references[currentReferenceIndex];

  if (isInReferenceForm) {
    return (
      <div className="space-y-6">
        <SubformHeader
          icon={<User className="h-5 w-5" />}
          title={`Información Básica - Referencia ${currentReferenceIndex + 1}`}
          subtitle="Complete la información de la referencia personal"
          variant="reference"
        />

        <ReferenceBasicInfo referenceIndex={currentReferenceIndex} />

        <div className="flex justify-between pt-6">
          <Button 
            variant="outline" 
            onClick={handleBackToList}
          >
            Volver a Lista
          </Button>
          
          <Button 
            onClick={handleCompleteReference}
            className="bg-primary hover:bg-primary/90"
          >
            Completar Referencia
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SubformHeader
        icon={<Users className="h-5 w-5" />}
        title="Referencias Personales"
        subtitle="Agregue y gestione las referencias personales del solicitante"
        variant="reference"
      />

      <div className="space-y-4">
        {references.map((reference, index) => {
          const status = getReferenceStatus(reference);
          
          return (
            <Card key={reference.id} className="border border-border/50 hover:border-primary/30 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        Referencia {index + 1}
                        {getStatusBadge(status)}
                      </div>
                      {reference.fullName && (
                        <span className="text-sm font-normal text-muted-foreground">
                          {reference.fullName}
                        </span>
                      )}
                    </div>
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeReference(index)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    disabled={references.length <= 2}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  {reference.fullName ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-muted-foreground">Tipo:</span> 
                        <span>{reference.referenceType || 'No proporcionado'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-muted-foreground">Teléfono:</span> 
                        <span>{reference.phone || 'No proporcionado'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-muted-foreground">Relación:</span> 
                        <span>{reference.relation || 'No proporcionado'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-muted-foreground">Calificación:</span> 
                        <span>{reference.rating || 'No proporcionado'}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground italic">Sin información completada</p>
                  )}
                  
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditReference(index)}
                      className="bg-primary/5 hover:bg-primary/10 text-primary border-primary/20"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      {reference.fullName ? 'Editar' : 'Completar'} Información
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border-dashed border-muted-foreground/30 bg-muted/20">
        <CardContent className="flex flex-col items-center justify-center py-8">
          <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center mb-3">
            <Plus className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground mb-4 text-center">
            Agregar nueva referencia personal
          </p>
          <Button onClick={addReference} variant="outline" className="border-primary/30 text-primary hover:bg-primary/10">
            <Plus className="h-4 w-4 mr-2" />
            Agregar Referencia
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-primary">Estado de Referencias</h4>
              <p className="text-sm text-muted-foreground">
                {references.filter(r => getReferenceStatus(r) === 'complete').length} de {references.length} referencias completadas
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">
                {references.length}
              </div>
              <p className="text-xs text-muted-foreground">Total</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReferencesSection;