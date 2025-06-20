
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import BottomNavigation from '@/components/layout/BottomNavigation';
import PrequalificationModal from '@/components/prequalification/PrequalificationModal';
import PrequalificationCard from '@/components/prequalification/PrequalificationCard';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, FileSpreadsheet } from 'lucide-react';
import { usePrequalifications } from '@/hooks/useSupabaseQuery';
import { useDeletePrequalification, useRepeatPrequalification } from '@/hooks/usePrequalificationActions';

const Prequalifications = () => {
  const [showPrequalificationModal, setShowPrequalificationModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { data: prequalifications = [], isLoading } = usePrequalifications();
  const deletePrequalificationMutation = useDeletePrequalification();
  const { repeatPrequalification } = useRepeatPrequalification();

  const filteredPrequalifications = prequalifications.filter(prequalification =>
    prequalification.client_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string, clientName: string) => {
    deletePrequalificationMutation.mutate(id);
  };

  const handleRepeat = (id: string) => {
    repeatPrequalification(id);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 px-4 py-4 pb-20 space-y-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </main>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 px-4 py-4 pb-20 space-y-6">
        <div>
          <h1 className="text-title mb-1">Precalificaciones</h1>
          <p className="text-muted-foreground">Historial de evaluaciones rápidas de elegibilidad</p>
        </div>

        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar precalificaciones..." 
            className="pl-10" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {filteredPrequalifications.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center space-y-4">
              <div className="text-muted-foreground">
                <FileSpreadsheet className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="font-bold text-base text-gray-800 mx-0 px-0">
                  {searchTerm ? 'No se encontraron precalificaciones' : 'No hay precalificaciones registradas'}
                </p>
                <p className="text-sm font-thin">
                  {searchTerm 
                    ? 'Intenta con un término de búsqueda diferente' 
                    : 'Puedes crear una nueva precalificación usando el botón de abajo'
                  }
                </p>
              </div>
              {!searchTerm && (
                <Button variant="success" className="w-full" onClick={() => setShowPrequalificationModal(true)}>
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Iniciar Pre-Calificación
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredPrequalifications.map(prequalification => (
              <PrequalificationCard
                key={prequalification.id}
                prequalification={prequalification}
                onDelete={handleDelete}
                onRepeat={handleRepeat}
              />
            ))}
          </div>
        )}
      </main>

      <BottomNavigation />
      
      <PrequalificationModal open={showPrequalificationModal} onOpenChange={setShowPrequalificationModal} />
    </div>
  );
};

export default Prequalifications;
