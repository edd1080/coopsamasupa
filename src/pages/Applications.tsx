
import React from 'react';
import Header from '@/components/layout/Header';
import BottomNavigation from '@/components/layout/BottomNavigation';
import ApplicationsHeader from '@/components/applications/ApplicationsHeader';
import ApplicationsList from '@/components/applications/ApplicationsList';
import BreadcrumbNavigation from '@/components/navigation/BreadcrumbNavigation';

const Applications = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6 pb-20 max-w-5xl">
        <div className="mb-4">
          <BreadcrumbNavigation />
        </div>
        
        <ApplicationsHeader />
        <ApplicationsList />
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default Applications;
