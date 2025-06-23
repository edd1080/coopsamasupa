
import React from 'react';
import Header from '@/components/layout/Header';
import BottomNavigation from '@/components/layout/BottomNavigation';
import ApplicationsHeader from '@/components/applications/ApplicationsHeader';
import ApplicationsList from '@/components/applications/ApplicationsList';
import BreadcrumbNavigation from '@/components/navigation/BreadcrumbNavigation';
import { useApplicationData } from '@/hooks/useApplicationData';

const Applications = () => {
  const { data: applications, isLoading } = useApplicationData();

  // Mock functions for now since they were removed from the hook
  const editApplication = (id: string) => {
    console.log('Edit application:', id);
  };

  const cancelApplication = (id: string) => {
    console.log('Cancel application:', id);
  };

  const deleteApplication = (id: string) => {
    console.log('Delete application:', id);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6 pb-20 max-w-5xl">
        <div className="mb-4">
          <BreadcrumbNavigation />
        </div>
        
        <ApplicationsHeader />
        <ApplicationsList 
          applications={applications || []}
          isLoading={isLoading}
          onEdit={editApplication}
          onCancel={cancelApplication}
          onDelete={deleteApplication}
        />
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default Applications;
