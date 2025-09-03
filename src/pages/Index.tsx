
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import BottomNavigation from '@/components/layout/BottomNavigation';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileSpreadsheet, Users, TrendingUp, CheckCircle, AlertCircle, Clock, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useApplicationMetrics } from '@/hooks/useApplicationMetrics';
import { useWeeklyApplications } from '@/hooks/useWeeklyApplications';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const Index = () => {
  const navigate = useNavigate();
  
  
  const { data: profile, isLoading: profileLoading } = useUserProfile();
  const { data: metrics, isLoading: metricsLoading } = useApplicationMetrics();
  const { data: weeklyData, isLoading: weeklyLoading } = useWeeklyApplications();

  // Determinar el saludo con nombre completo
  const getGreeting = () => {
    if (profileLoading) return 'Cargando...';
    
    // Priorizar mostrar el nombre completo
    if (profile?.full_name) {
      return `¡Hola, ${profile.full_name}!`;
    }
    
    // Fallback al primer nombre si no hay nombre completo
    if (profile?.first_name) {
      return `¡Hola, ${profile.first_name}!`;
    }
    
    return '¡Hola!';
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

        {/* Weekly Progress Chart */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Progreso Semanal
            </CardTitle>
          </CardHeader>
          <CardContent>
            {weeklyLoading ? (
              <div className="h-48 flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                  <p className="text-sm text-muted-foreground">Cargando datos...</p>
                </div>
              </div>
            ) : (
              <ChartContainer
                config={{
                  solicitudes: {
                    label: "Solicitudes",
                    color: "hsl(var(--primary))",
                  },
                }}
                className="h-48"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData}>
                    <XAxis 
                      dataKey="day" 
                      tick={{ fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar 
                      dataKey="solicitudes" 
                      fill="var(--color-solicitudes)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
            <div className="mt-3 text-center">
              <p className="text-sm text-muted-foreground">
                Solicitudes procesadas por día en la última semana
              </p>
            </div>
          </CardContent>
        </Card>
        
        <div className="mb-6">
          <div className="cursor-pointer" onClick={handleNewApplication}>
            <div className="mb-4">
              <h3 className="text-xl font-semibold flex items-center gap-2 mb-2 whitespace-normal break-words overflow-hidden" style={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                <FileSpreadsheet className="h-5 w-5 text-primary flex-shrink-0" />
                Nueva Solicitud
              </h3>
              <p className="text-muted-foreground mb-4 whitespace-normal break-words">Crear una nueva solicitud de crédito</p>
              <Button className="w-full" onClick={handleNewApplication}>
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Comenzar solicitud
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <BottomNavigation />
      
      
    </div>
  );
};

export default Index;
