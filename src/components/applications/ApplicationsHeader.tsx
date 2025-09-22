
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus } from 'lucide-react';

interface ApplicationsHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const ApplicationsHeader: React.FC<ApplicationsHeaderProps> = ({ 
  searchTerm, 
  onSearchChange 
}) => {
  const navigate = useNavigate();

  return (
    <>
      <div>
        <h1 className="text-title mb-1">Tus solicitudes asignadas</h1>
        <p className="text-muted-foreground mb-4">Gestiona y administra en tiempo real</p>
      </div>
      
      <div className="flex flex-col gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar por nombre, DPI o número de solicitud..." 
            className="pl-10" 
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        
        <Button className="w-full" onClick={() => navigate('/applications/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Solicitud
        </Button>
      </div>
    </>
  );
};

export default ApplicationsHeader;
