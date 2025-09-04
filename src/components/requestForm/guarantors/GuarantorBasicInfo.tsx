
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { User, Mail, Phone, MapPin, CreditCard } from 'lucide-react';
import { useFormContext } from '../RequestFormProvider';

interface GuarantorBasicInfoProps {
  guarantorIndex: number;
}

const GuarantorBasicInfo: React.FC<GuarantorBasicInfoProps> = ({ guarantorIndex }) => {
  const { guarantors, updateGuarantor } = useFormContext();
  const guarantor = guarantors[guarantorIndex];

  const handleInputChange = (field: string, value: string) => {
    updateGuarantor(guarantorIndex, field, value);
    
    // Check if basic info is completed
    const updatedGuarantor = { ...guarantor, [field]: value };
    const isCompleted = !!(
      updatedGuarantor.fullName && 
      updatedGuarantor.cui && 
      updatedGuarantor.email && 
      updatedGuarantor.phone && 
      updatedGuarantor.address
    );
    
    if (isCompleted !== guarantor.basicInfoCompleted) {
      updateGuarantor(guarantorIndex, 'basicInfoCompleted', isCompleted);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h3 className="text-lg font-semibold">Información Básica de la Referencia {guarantorIndex + 1}</h3>
        <p className="text-muted-foreground">
          Complete la información personal y de contacto de la referencia
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Datos Personales
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`fullName-${guarantorIndex}`}>Nombre Completo *</Label>
              <Input
                id={`fullName-${guarantorIndex}`}
                value={guarantor.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                placeholder="Nombre completo de la referencia"
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`cui-${guarantorIndex}`}>DPI/CUI *</Label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id={`cui-${guarantorIndex}`}
                  value={guarantor.cui}
                  onChange={(e) => handleInputChange('cui', e.target.value)}
                  placeholder="Número de DPI"
                  className="pl-10"
                  maxLength={13}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`email-${guarantorIndex}`}>Correo Electrónico *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id={`email-${guarantorIndex}`}
                  type="email"
                  value={guarantor.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="correo@ejemplo.com"
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`phone-${guarantorIndex}`}>Teléfono *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id={`phone-${guarantorIndex}`}
                  value={guarantor.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="5555-1234"
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`address-${guarantorIndex}`}>Dirección *</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Textarea
                id={`address-${guarantorIndex}`}
                value={guarantor.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Dirección completa de residencia"
                className="pl-10 min-h-[80px]"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GuarantorBasicInfo;
