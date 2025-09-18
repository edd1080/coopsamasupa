import React from 'react';
import { Button } from '@/components/ui/button';
import { TestTube } from 'lucide-react';
import { useCreateTestApplication } from '@/hooks/useCreateTestApplication';

const CreateTestApplicationButton: React.FC = () => {
  const createTestMutation = useCreateTestApplication();
  
  return (
    <Button 
      onClick={() => createTestMutation.mutate()}
      disabled={createTestMutation.isPending}
      variant="outline"
      className="border-blue-200 text-blue-700 hover:bg-blue-50"
    >
      <TestTube className="h-4 w-4 mr-2" />
      {createTestMutation.isPending ? 'Creando...' : 'Crear Solicitud de Prueba'}
    </Button>
  );
};

export default CreateTestApplicationButton;