import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";

interface TenantSelectorProps {
  selectedTenant: string;
  onTenantSelect: (tenant: string) => void;
}

const tenants = [
  { id: 'coopsama', name: 'COOPSAMA', description: 'Cooperativa de Ahorro y Crédito San Martín de Porres' },
  { id: 'cosmos', name: 'COSMOS', description: 'Cooperativa de Servicios Múltiples' },
  { id: 'cch', name: 'CCH', description: 'Cooperativa de Crédito y Habitacional' },
  { id: 'ptc', name: 'PTC', description: 'Programa de Transferencias Condicionadas' }
];

export const TenantSelector = ({ selectedTenant, onTenantSelect }: TenantSelectorProps) => {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-foreground">Selecciona tu organización</h3>
        <p className="text-sm text-muted-foreground">Elige la cooperativa o entidad a la que perteneces</p>
      </div>
      
      <div className="grid gap-3">
        {tenants.map((tenant) => (
          <Card 
            key={tenant.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedTenant === tenant.id 
                ? 'ring-2 ring-primary bg-primary/5' 
                : 'hover:bg-accent/50'
            }`}
            onClick={() => onTenantSelect(tenant.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${
                  selectedTenant === tenant.id 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  <Building2 className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">{tenant.name}</h4>
                  <p className="text-sm text-muted-foreground">{tenant.description}</p>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 ${
                  selectedTenant === tenant.id
                    ? 'bg-primary border-primary'
                    : 'border-muted-foreground'
                }`}>
                  {selectedTenant === tenant.id && (
                    <div className="w-full h-full bg-primary-foreground rounded-full scale-50" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};