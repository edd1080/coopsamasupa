import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface ApplicationErrorScreenProps {
  errorMessage: string;
  applicationId?: string;
  onGoToApplications: () => void;
}

const ApplicationErrorScreen: React.FC<ApplicationErrorScreenProps> = ({
  errorMessage,
  applicationId,
  onGoToApplications,
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <AlertTriangle className="h-16 w-16 text-destructive mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">
              La solicitud no pudo ser enviada
            </h1>
            <p className="text-muted-foreground mb-4">
              Por favor verifica el error para intentar de nuevo
            </p>
            
            {/* Error message from microservice */}
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6">
              <p className="text-sm text-destructive font-medium">
                {errorMessage}
              </p>
            </div>
            
            {applicationId && (
              <p className="text-xs text-muted-foreground mb-6">
                Código de referencia: {applicationId}
              </p>
            )}
          </div>
          
          <Button 
            onClick={onGoToApplications}
            className="w-full"
            size="lg"
          >
            Regresar a las solicitudes
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplicationErrorScreen;