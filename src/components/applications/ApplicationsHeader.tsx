
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, FileSpreadsheet } from 'lucide-react';

const ApplicationsHeader: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <div>
        <h1 className="text-title mb-1">Tus solicitudes asignadas</h1>
        <p className="text-muted-foreground">Gestiona y administra en tiempo real</p>
      </div>
      
      <div className="flex flex-col gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar solicitudes..." className="pl-10" />
        </div>
        
        <Button className="w-full" onClick={() => navigate('/applications/new')}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Nueva Solicitud
        </Button>
      </div>
    </>
  );
};

export default ApplicationsHeader;
