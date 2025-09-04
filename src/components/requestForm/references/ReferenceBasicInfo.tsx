
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { User, Mail, Phone, MapPin, Star } from 'lucide-react';
import { useFormContext } from '../RequestFormProvider';

interface ReferenceBasicInfoProps {
  referenceIndex: number;
}

const ReferenceBasicInfo: React.FC<ReferenceBasicInfoProps> = ({ referenceIndex }) => {
  const { references, updateReference } = useFormContext();
  const reference = references[referenceIndex];

  const handleInputChange = (field: string, value: string) => {
    updateReference(referenceIndex, field, value);
    
    // Check if basic info is completed - only required fields
    const updatedReference = { ...reference, [field]: value };
    const isCompleted = !!(
      updatedReference.referenceType && 
      updatedReference.fullName && 
      updatedReference.phone && 
      updatedReference.rating
    );
    
    if (isCompleted !== reference.basicInfoCompleted) {
      updateReference(referenceIndex, 'basicInfoCompleted', isCompleted);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h3 className="text-lg font-semibold">Información Básica de la Referencia {referenceIndex + 1}</h3>
        <p className="text-muted-foreground">
          Complete la información de la referencia personal
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
              <Label htmlFor={`referenceType-${referenceIndex}`}>Tipo de Referencia *</Label>
              <Select value={reference.referenceType} onValueChange={(value) => handleInputChange('referenceType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="comercial">Comercial</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="familiar">Familiar</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`fullName-${referenceIndex}`}>Nombre Completo *</Label>
              <Input
                id={`fullName-${referenceIndex}`}
                value={reference.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                placeholder="Nombre completo de la referencia"
                className="w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`address-${referenceIndex}`}>Dirección</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Textarea
                  id={`address-${referenceIndex}`}
                  value={reference.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Dirección (opcional)"
                  className="pl-10 min-h-[80px]"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`relation-${referenceIndex}`}>Relación</Label>
              <Input
                id={`relation-${referenceIndex}`}
                value={reference.relation}
                onChange={(e) => handleInputChange('relation', e.target.value)}
                placeholder="Ej: Cliente, Proveedor, Amigo"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`phone-${referenceIndex}`}>Teléfono *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id={`phone-${referenceIndex}`}
                  value={reference.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="5555-1234"
                  className="pl-10"
                  pattern="[0-9\-\s]*"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`rating-${referenceIndex}`}>Calificación *</Label>
              <div className="relative">
                <Star className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Select value={reference.rating} onValueChange={(value) => handleInputChange('rating', value)}>
                  <SelectTrigger className="pl-10">
                    <SelectValue placeholder="Seleccionar calificación" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excelente">Excelente</SelectItem>
                    <SelectItem value="buena">Buena</SelectItem>
                    <SelectItem value="regular">Regular</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`comment-${referenceIndex}`}>Comentario</Label>
            <Textarea
              id={`comment-${referenceIndex}`}
              value={reference.comment}
              onChange={(e) => handleInputChange('comment', e.target.value)}
              placeholder="Observaciones adicionales (opcional)"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReferenceBasicInfo;
