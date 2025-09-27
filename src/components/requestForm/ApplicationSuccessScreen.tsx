import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ApplicationSuccessScreenProps {
  applicationId?: string;
  externalReferenceId?: string;
  onGoToApplications: () => void;
}

const ApplicationSuccessScreen: React.FC<ApplicationSuccessScreenProps> = ({
  applicationId,
  externalReferenceId,
  onGoToApplications
}) => {
  console.log('✅ ApplicationSuccessScreen received:', { applicationId, externalReferenceId });
  
  useEffect(() => {
    // Trigger confetti animation
    const triggerConfetti = () => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b']
      });
    };

    // Initial confetti
    triggerConfetti();
    
    // Additional confetti bursts
    const timer1 = setTimeout(triggerConfetti, 500);
    const timer2 = setTimeout(triggerConfetti, 1000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-50 to-blue-50">
      <Card className="w-full max-w-md border-0 shadow-lg">
        <CardContent className="p-8 text-center space-y-6">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-scale-in">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          
          <div className="space-y-3">
            <h1 className="text-2xl font-bold text-gray-900">
              ¡Solicitud Enviada!
            </h1>
            <p className="text-gray-600">
              La solicitud de crédito ha sido enviada exitosamente
            </p>
            {(applicationId || externalReferenceId) && (
              <p className="text-sm text-gray-500">
                ID de Solicitud: <span className="font-mono font-bold text-primary">{applicationId || externalReferenceId}</span>
              </p>
            )}
          </div>


          <Button 
            onClick={onGoToApplications}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            size="lg"
          >
            Volver a Solicitudes
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplicationSuccessScreen;
