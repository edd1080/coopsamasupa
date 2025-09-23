
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
    
    // Auto-generate fullName from individual name fields
    if (['firstName', 'secondName', 'firstLastName', 'secondLastName'].includes(field)) {
      const updatedReference = { ...reference, [field]: value };
      const fullName = [
        updatedReference.firstName,
        updatedReference.secondName,
        updatedReference.firstLastName,
        updatedReference.secondLastName
      ].filter(Boolean).join(' ');
      updateReference(referenceIndex, 'fullName', fullName);
    }
    
    // Check if basic info is completed - no fields are required
    const updatedReference = { ...reference, [field]: value };
    const isCompleted = !!(
      updatedReference.referenceType || 
      updatedReference.firstName || 
      updatedReference.firstLastName || 
      updatedReference.mobile || 
      updatedReference.score
    );
    
    if (isCompleted !== reference.basicInfoCompleted) {
      updateReference(referenceIndex, 'basicInfoCompleted', isCompleted);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h3 className="text-base font-semibold">Información Básica de la Referencia {referenceIndex + 1}</h3>
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
              <Label htmlFor={`referenceType-${referenceIndex}`}>Tipo de Referencia</Label>
              <Select value={reference.referenceType} onValueChange={(value) => handleInputChange('referenceType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PERSONAL">Personal</SelectItem>
                  <SelectItem value="COMERCIAL">Comercial</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`firstName-${referenceIndex}`}>Primer Nombre</Label>
              <Input
                id={`firstName-${referenceIndex}`}
                value={reference.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                placeholder="Primer nombre"
                className="w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`secondName-${referenceIndex}`}>Segundo Nombre</Label>
              <Input
                id={`secondName-${referenceIndex}`}
                value={reference.secondName}
                onChange={(e) => handleInputChange('secondName', e.target.value)}
                placeholder="Segundo nombre (opcional)"
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`firstLastName-${referenceIndex}`}>Primer Apellido</Label>
              <Input
                id={`firstLastName-${referenceIndex}`}
                value={reference.firstLastName}
                onChange={(e) => handleInputChange('firstLastName', e.target.value)}
                placeholder="Primer apellido"
                className="w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`secondLastName-${referenceIndex}`}>Segundo Apellido</Label>
              <Input
                id={`secondLastName-${referenceIndex}`}
                value={reference.secondLastName}
                onChange={(e) => handleInputChange('secondLastName', e.target.value)}
                placeholder="Segundo apellido (opcional)"
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`fullName-${referenceIndex}`}>Nombre Completo (Auto-generado)</Label>
              <Input
                id={`fullName-${referenceIndex}`}
                value={reference.fullName}
                readOnly
                placeholder="Se genera automáticamente"
                className="w-full bg-muted"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`fullAddress-${referenceIndex}`}>Dirección</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Textarea
                  id={`fullAddress-${referenceIndex}`}
                  value={reference.fullAddress}
                  onChange={(e) => handleInputChange('fullAddress', e.target.value)}
                  placeholder="Dirección (opcional)"
                  className="pl-10 min-h-[80px]"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`relationship-${referenceIndex}`}>Relación</Label>
              <Input
                id={`relationship-${referenceIndex}`}
                value={reference.relationship}
                onChange={(e) => handleInputChange('relationship', e.target.value)}
                placeholder="Ej: Cliente, Proveedor, Amigo"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`mobile-${referenceIndex}`}>Teléfono</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id={`mobile-${referenceIndex}`}
                  value={reference.mobile}
                  onChange={(e) => handleInputChange('mobile', e.target.value)}
                  placeholder="5555-1234"
                  className="pl-10"
                  pattern="[0-9\-\s]*"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`score-${referenceIndex}`}>Calificación</Label>
              <div className="relative">
                <Star className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Select value={reference.score} onValueChange={(value) => handleInputChange('score', value)}>
                  <SelectTrigger className="pl-10">
                    <SelectValue placeholder="Seleccionar calificación" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EXCELENTE">Excelente</SelectItem>
                    <SelectItem value="BUENO">Bueno</SelectItem>
                    <SelectItem value="REGULAR">Regular</SelectItem>
                    <SelectItem value="MALO">Malo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`comments-${referenceIndex}`}>Comentarios</Label>
            <Textarea
              id={`comments-${referenceIndex}`}
              value={reference.comments}
              onChange={(e) => handleInputChange('comments', e.target.value)}
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
