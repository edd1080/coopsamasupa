import React from 'react';
import { Button } from '@/components/ui/button';
import { TestTube, User, Users } from 'lucide-react';
import { useCreateSingleTestApplication } from '@/hooks/useCreateSingleTestApplication';
import { useCreateMarriedTestApplication } from '@/hooks/useCreateMarriedTestApplication';

const CreateTestApplicationButton: React.FC = () => {
  const createSingleMutation = useCreateSingleTestApplication();
  const createMarriedMutation = useCreateMarriedTestApplication();
  
  const isAnyLoading = createSingleMutation.isPending || createMarriedMutation.isPending;
  
  return (
    <div className="flex gap-2 flex-wrap">
      <Button 
        onClick={() => createSingleMutation.mutate()}
        disabled={isAnyLoading}
        variant="outline"
        className="border-blue-200 text-blue-700 hover:bg-blue-50"
        size="sm"
      >
        <User className="h-4 w-4 mr-2" />
        {createSingleMutation.isPending ? 'Creando...' : 'Solicitud Soltero'}
      </Button>
      
      <Button 
        onClick={() => createMarriedMutation.mutate()}
        disabled={isAnyLoading}
        variant="outline"
        className="border-green-200 text-green-700 hover:bg-green-50"
        size="sm"
      >
        <Users className="h-4 w-4 mr-2" />
        {createMarriedMutation.isPending ? 'Creando...' : 'Solicitud Casado'}
      </Button>
    </div>
  );
};

export default CreateTestApplicationButton;