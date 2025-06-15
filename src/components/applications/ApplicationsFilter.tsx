
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface StatusCounts {
  all: number;
  active: number;
  verification: number;
  approved: number;
  rejected: number;
}

interface ApplicationsFilterProps {
  activeStatusFilter: string;
  onStatusFilterChange: (value: string) => void;
  statusCounts: StatusCounts;
  children: React.ReactNode;
}

const ApplicationsFilter: React.FC<ApplicationsFilterProps> = ({
  activeStatusFilter,
  onStatusFilterChange,
  statusCounts,
  children
}) => {
  return (
    <Tabs value={activeStatusFilter} onValueChange={onStatusFilterChange} className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="all">
          Todas ({statusCounts.all})
        </TabsTrigger>
        <TabsTrigger value="active">
          Activas ({statusCounts.active})
        </TabsTrigger>
        <TabsTrigger value="verification">
          En Verificación ({statusCounts.verification})
        </TabsTrigger>
        <TabsTrigger value="approved">
          Aprobadas ({statusCounts.approved})
        </TabsTrigger>
        <TabsTrigger value="rejected">
          Rechazadas ({statusCounts.rejected})
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value={activeStatusFilter} className="mt-0">
        {children}
      </TabsContent>
    </Tabs>
  );
};

export default ApplicationsFilter;
