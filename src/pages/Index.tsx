
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import BottomNavigation from '@/components/layout/BottomNavigation';
import PrequalificationModal from '@/components/prequalification/PrequalificationModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileSpreadsheet, Users, TrendingUp, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useApplicationMetrics } from '@/hooks/useApplicationMetrics';

const Index = () => {
  const navigate = useNavigate();
  const [showPrequalificationModal, setShowPrequalificationModal] = useState(false);
  
  const { data: profile, isLoading: profileLoading } = useUserProfile();
  const { data: metrics, isLoading: metricsLoading } = useApplicationMetrics();

  // Determinar el saludo y nombre
  const getGreeting = () => {
    if (profileLoading) return 'Cargando...';
    if (profile?.full_name) return `¡Bienvenido, ${profile.full_name.split(' ')[0]}!`;
    if (profile?.first_name) return `¡Bienvenido, ${profile.first_name}!`;
    return '¡Bienvenido!';
  };

  const getUserInfo = () => {
    if (profileLoading) return 'Cargando información...';
    const role = profile?.role || 'Asesor de créditos';
    const agency = profile?.agency || 'Agencia Central';
    return `${role} | ${agency}`;
  };

  const handleNewApplication = () => {
    console.log('🎯 Nueva solicitud button clicked');
    console.log('📍 Navigating to /applications/new');
    navigate('/applications/new');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 px-4 py-8 pb-20">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">{getGreeting()}</h1>
          <p className="text-muted-foreground">{getUserInfo()}</p>
        </div>
        
        {/* Metrics Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 mb-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">Solicitudes Activas</p>
                <h2 className="text-2xl font-bold">
                  {metricsLoading ? '...' : metrics?.active || 0}
                </h2>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <p className="text-sm text-muted-foreground">Aprobadas</p>
                <h2 className="text-2xl font-bold">
                  {metricsLoading ? '...' : metrics?.approved || 0}
                </h2>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10 mb-2">
                  <Clock className="h-5 w-5 text-amber-500" />
                </div>
                <p className="text-sm text-muted-foreground">En Revisión</p>
                <h2 className="text-2xl font-bold">
                  {metricsLoading ? '...' : metrics?.reviewing || 0}
                </h2>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10 mb-2">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                </div>
                <p className="text-sm text-muted-foreground">Rechazadas</p>
                <h2 className="text-2xl font-bold">
                  {metricsLoading ? '...' : metrics?.rejected || 0}
                </h2>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 gap-6 mb-6">
          <Card className="card-hover" onClick={handleNewApplication}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5 text-primary" />
                Nueva Solicitud
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Crear una nueva solicitud de crédito</p>
              <Button className="mt-4 w-full" onClick={handleNewApplication}>
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Comenzar solicitud
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <BottomNavigation />
      
      <PrequalificationModal open={showPrequalificationModal} onOpenChange={setShowPrequalificationModal} />
    </div>
  );
};

export default Index;
