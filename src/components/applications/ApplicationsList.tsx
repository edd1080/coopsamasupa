
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import ApplicationCard from './ApplicationCard';

interface Application {
  id: string;
  clientName: string;
  product: string;
  amount: string;
  status: string;
  date: string;
  progress: number;
  stage: string;
}

interface ApplicationsListProps {
  applications: Application[];
  isLoading: boolean;
  onEdit: (id: string, clientName: string, e?: React.MouseEvent) => void;
  onCancel: (id: string, clientName: string, e?: React.MouseEvent) => void;
  onDelete: (id: string, clientName: string, e?: React.MouseEvent) => void;
}

const ApplicationsList: React.FC<ApplicationsListProps> = ({
  applications,
  isLoading,
  onEdit,
  onCancel,
  onDelete
}) => {
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Cargando solicitudes...</p>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No hay solicitudes</h3>
        <p className="text-muted-foreground">
          No se encontraron solicitudes con el filtro seleccionado.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {applications.map(application => (
          <ApplicationCard
            key={application.id}
            application={application}
            onEdit={onEdit}
            onCancel={onCancel}
            onDelete={onDelete}
          />
        ))}
      </div>
      
      <div className="flex justify-center py-4">
        <Button variant="outline">Cargar más</Button>
      </div>
    </>
  );
};

export default ApplicationsList;
