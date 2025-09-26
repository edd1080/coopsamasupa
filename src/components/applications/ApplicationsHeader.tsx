
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus, RefreshCw } from 'lucide-react';

interface ApplicationsHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

const ApplicationsHeader: React.FC<ApplicationsHeaderProps> = ({ 
  searchTerm, 
  onSearchChange,
  onRefresh,
  isRefreshing = false
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
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex-1" 
            onClick={onRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Actualizando...' : 'Actualizar'}
          </Button>
          
          <Button className="flex-1" onClick={() => navigate('/applications/new')}>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Solicitud
          </Button>
        </div>
      </div>
    </>
  );
};

export default ApplicationsHeader;
