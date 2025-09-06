import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { MapPin } from 'lucide-react';
import GeolocationCapture from '../GeolocationCapture';
import { formatPhone, validatePhoneFormat } from '@/utils/formatters';
import SubformHeader from '@/components/forms/SubformHeader';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ContactHousingFormProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
}

const ContactHousingForm: React.FC<ContactHousingFormProps> = ({ formData, updateFormData }) => {
  const [selectedDepartment, setSelectedDepartment] = useState(formData.residenceDepartment || '');

  useEffect(() => {
    // Reset municipality when department changes
    if (selectedDepartment !== formData.residenceDepartment) {
      updateFormData('residenceMunicipality', '');
    }
  }, [selectedDepartment, formData.residenceDepartment, updateFormData]);

  // Guatemala departments and municipalities
  const departmentsMunicipalities = {
    'guatemala': ['Guatemala', 'Mixco', 'Villa Nueva', 'San José Pinula', 'Santa Catarina Pinula', 'Fraijanes', 'Amatitlán', 'Villa Canales', 'Palencia', 'Chinautla', 'San Pedro Ayampuc', 'San Juan Sacatepéquez', 'San Raymundo', 'Chuarrancho', 'San Pedro Sacatepéquez', 'San José del Golfo', 'Petapa'],
    'alta_verapaz': ['Cobán', 'Santa Cruz Verapaz', 'San Cristóbal Verapaz', 'Tactic', 'Tamahú', 'Tucurú', 'Panzós', 'Senahú', 'San Pedro Carchá', 'San Juan Chamelco', 'Lanquín', 'Santa María Cahabón', 'Chisec', 'Chahal', 'Fray Bartolomé de las Casas', 'La Tinta'],
    'baja_verapaz': ['Salamá', 'San Miguel Chicaj', 'Rabinal', 'Cubulco', 'Granados', 'Santa Cruz el Chol', 'San Jerónimo', 'Purulhá'],
    'chimaltenango': ['Chimaltenango', 'San José Poaquil', 'San Martín Jilotepeque', 'Comalapa', 'Santa Apolonia', 'Tecpán', 'Patzún', 'Pochuta', 'Patzicía', 'Santa Cruz Balanyá', 'Acatenango', 'Yepocapa', 'San Andrés Itzapa', 'Parramos', 'Zaragoza', 'El Tejar'],
    'chiquimula': ['Chiquimula', 'San José la Arada', 'San Juan Ermita', 'Jocotán', 'Camotán', 'Olopa', 'Esquipulas', 'Concepción Las Minas', 'Quezaltepeque', 'San Jacinto', 'Ipala'],
    'el_progreso': ['Guastatoya', 'Morazán', 'San Agustín Acasaguastlán', 'San Cristóbal Acasaguastlán', 'El Jícaro', 'Sansare', 'Sanarate', 'San Antonio La Paz'],
    'escuintla': ['Escuintla', 'Santa Lucía Cotzumalguapa', 'La Democracia', 'Siquinalá', 'Masagua', 'Tiquisate', 'La Gomera', 'Guanagazapa', 'San José', 'Iztapa', 'Palín', 'San Vicente Pacaya', 'Nueva Concepción'],
    'huehuetenango': ['Huehuetenango', 'Chiantla', 'Malacatancito', 'Cuilco', 'Nentón', 'San Pedro Necta', 'Jacaltenango', 'San Pedro Soloma', 'San Ildefonso Ixtahuacán', 'Santa Bárbara', 'La Libertad', 'La Democracia', 'San Miguel Acatán', 'San Rafael La Independencia', 'Todos Santos Cuchumatán', 'San Juan Atitán', 'Santa Eulalia', 'San Mateo Ixtatán', 'Colotenango', 'San Sebastián Huehuetenango', 'Tectitán', 'Concepción Huista', 'San Juan Ixcoy', 'San Antonio Huista', 'San Sebastián Coatán', 'Barillas', 'Aguacatán', 'San Rafael Petzal', 'San Gaspar Ixchil', 'Santiago Chimaltenango', 'Santa Ana Huista'],
    'izabal': ['Puerto Barrios', 'Livingston', 'El Estor', 'Morales', 'Los Amates'],
    'jalapa': ['Jalapa', 'San Pedro Pinula', 'San Luis Jilotepeque', 'San Manuel Chaparrón', 'San Carlos Alzatate', 'Monjas', 'Mataquescuintla'],
    'jutiapa': ['Jutiapa', 'El Progreso', 'Santa Catarina Mita', 'Agua Blanca', 'Asunción Mita', 'Yupiltepeque', 'Atescatempa', 'Jerez', 'El Adelanto', 'Zapotitlán', 'Comapa', 'Jalpatagua', 'Conguaco', 'Moyuta', 'Pasaco', 'San José Acatempa', 'Quesada'],
    'peten': ['Flores', 'San José', 'San Benito', 'San Andrés', 'La Libertad', 'San Francisco', 'Santa Ana', 'Dolores', 'San Luis', 'Sayaxché', 'Melchor de Mencos', 'Poptún'],
    'quetzaltenango': ['Quetzaltenango', 'Salcajá', 'Olintepeque', 'San Carlos Sija', 'Sibilia', 'Cabricán', 'Cajolá', 'San Miguel Sigüilá', 'Ostuncalco', 'San Mateo', 'Concepción Chiquirichapa', 'San Martín Sacatepéquez', 'Almolonga', 'Cantel', 'Huitán', 'Zunil', 'Colomba Costa Cuca', 'San Francisco La Unión', 'El Palmar', 'Coatepeque', 'Génova', 'Flores Costa Cuca', 'La Esperanza', 'Palestina de Los Altos'],
    'quiche': ['Santa Cruz del Quiché', 'Chiché', 'Chinique', 'Zacualpa', 'Chajul', 'Chichicastenango', 'Patzité', 'San Antonio Ilotenango', 'San Pedro Jocopilas', 'Cunén', 'San Juan Cotzal', 'Joyabaj', 'Nebaj', 'San Andrés Sajcabajá', 'Uspantán', 'Sacapulas', 'San Bartolomé Jocotenango', 'Canillá', 'Playa Grande Ixcán', 'Pachalum', 'San Miguel Uspantán'],
    'retalhuleu': ['Retalhuleu', 'San Sebastián', 'Santa Cruz Muluá', 'San Martín Zapotitlán', 'San Felipe', 'San Andrés Villa Seca', 'Champerico', 'Nuevo San Carlos', 'El Asintal'],
    'sacatepequez': ['Antigua Guatemala', 'Jocotenango', 'Pastores', 'Sumpango', 'Santo Domingo Xenacoj', 'Santiago Sacatepéquez', 'San Bartolomé Milpas Altas', 'San Lucas Sacatepéquez', 'Santa Lucía Milpas Altas', 'Magdalena Milpas Altas', 'Santa María de Jesús', 'Ciudad Vieja', 'San Miguel Dueñas', 'Alotenango', 'San Antonio Aguas Calientes', 'Santa Catarina Barahona'],
    'san_marcos': ['San Marcos', 'San Pedro Sacatepéquez', 'San Antonio Sacatepéquez', 'Comitancillo', 'San Miguel Ixtahuacán', 'Concepción Tutuapa', 'Tacaná', 'Sibinal', 'Tajumulco', 'Tejutla', 'San Rafael Pie de la Cuesta', 'Nuevo Progreso', 'El Tumbador', 'El Rodeo', 'Malacatán', 'Catarina', 'Ayutla', 'Ocós', 'San Pablo', 'El Quetzal', 'La Reforma', 'Pajapita', 'Ixchiguán', 'San José Ojetenam', 'San Cristóbal Cucho', 'Sipacapa', 'Esquipulas Palo Gordo', 'Río Blanco', 'San Lorenzo'],
    'santa_rosa': ['Cuilapa', 'Barberena', 'Santa Rosa de Lima', 'Casillas', 'San Rafael Las Flores', 'Oratorio', 'San Juan Tecuaco', 'Chiquimulilla', 'Taxisco', 'Santa María Ixhuatán', 'Guazacapán', 'Santa Cruz Naranjo', 'Pueblo Nuevo Viñas', 'Nueva Santa Rosa'],
    'solola': ['Sololá', 'San José Chacayá', 'Santa María Visitación', 'Santa Lucía Utatlán', 'Nahualá', 'Santa Catarina Ixtahuacán', 'Santa Clara La Laguna', 'Concepción', 'San Andrés Semetabaj', 'Panajachel', 'Santa Catarina Palopó', 'San Antonio Palopó', 'San Lucas Tolimán', 'Santa Cruz La Laguna', 'San Pablo La Laguna', 'San Marcos La Laguna', 'San Juan La Laguna', 'San Pedro La Laguna', 'Santiago Atitlán'],
    'suchitepequez': ['Mazatenango', 'Cuyotenango', 'San Francisco Zapotitlán', 'San Bernardino', 'San José El Ídolo', 'Santo Domingo Suchitepéquez', 'San Lorenzo', 'Samayac', 'San Pablo Jocopilas', 'San Antonio Suchitepéquez', 'San Miguel Panán', 'San Gabriel', 'Chicacao', 'Patulul', 'Santa Bárbara', 'San Juan Bautista', 'Santo Tomás La Unión', 'Zunilito', 'Pueblo Nuevo', 'Río Bravo'],
    'totonicapan': ['Totonicapán', 'San Cristóbal Totonicapán', 'San Francisco El Alto', 'San Andrés Xecul', 'Momostenango', 'Santa María Chiquimula', 'Santa Lucía La Reforma', 'San Bartolo'],
    'zacapa': ['Zacapa', 'Estanzuela', 'Río Hondo', 'Gualán', 'Teculután', 'Usumatlán', 'Cabañas', 'San Diego', 'La Unión', 'Huité']
  };

  const getStabilityBadge = (stability: string) => {
    switch (stability) {
      case 'mayor_3':
        return <Badge variant="default" className="bg-green-100 text-green-800 ml-2">Excelente</Badge>;
      case '2_3':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 ml-2">Buena</Badge>;
      case '1_2':
        return <Badge variant="outline" className="bg-orange-100 text-orange-800 ml-2">Regular</Badge>;
      case 'menor_1':
        return <Badge variant="outline" className="bg-red-100 text-red-800 ml-2">Bajo</Badge>;
      default:
        return null;
    }
  };

  const handlePhoneChange = (field: string, value: string) => {
    const formatted = formatPhone(value);
    updateFormData(field, formatted);
  };

  const handleLocationCaptured = (location: any) => {
    updateFormData('geolocation', location);
  };

  return (
    <div className="space-y-6">
      <SubformHeader
        icon={<MapPin className="w-5 h-5" />}
        title="Contacto y Vivienda"
        subtitle="Complete la información de contacto y vivienda del solicitante."
        variant="applicant"
      />
      
      <div className="space-y-6">
        {/* Teléfonos y Email */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="mobilePhone">Teléfono Móvil</Label>
            <Input 
              id="mobilePhone"
              type="tel"
              inputMode="tel"
              value={formData.mobilePhone || ''} 
              onChange={(e) => handlePhoneChange('mobilePhone', e.target.value)}
              placeholder="0000 0000"
              maxLength={9}
              className={!validatePhoneFormat(formData.mobilePhone || '') && formData.mobilePhone ? 'border-red-500' : ''}
            />
            {formData.mobilePhone && !validatePhoneFormat(formData.mobilePhone) && (
              <p className="text-xs text-red-500">Formato: 0000 0000 (8 dígitos)</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="homePhone">Teléfono de Casa</Label>
            <Input 
              id="homePhone"
              type="tel"
              inputMode="tel"
              value={formData.homePhone || ''} 
              onChange={(e) => handlePhoneChange('homePhone', e.target.value)}
              placeholder="0000 0000"
              maxLength={9}
              className={formData.homePhone && !validatePhoneFormat(formData.homePhone) ? 'border-red-500' : ''}
            />
            {formData.homePhone && !validatePhoneFormat(formData.homePhone) && (
              <p className="text-xs text-red-500">Formato: 0000 0000 (8 dígitos)</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input 
              id="email"
              type="email"
              value={formData.email || ''} 
              onChange={(e) => updateFormData('email', e.target.value)}
              placeholder="correo@ejemplo.com"
            />
          </div>
        </div>

        {/* Dirección */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">Dirección</Label>
            <Textarea 
              id="address"
              value={formData.address || ''} 
              onChange={(e) => updateFormData('address', e.target.value)}
              placeholder="Dirección completa y detallada (mínimo 10 caracteres)"
              rows={3}
              minLength={10}
            />
          </div>

          {/* Referencia para la Dirección - MOVIDO ARRIBA */}
          <div className="space-y-2">
            <Label htmlFor="addressReference">Referencia para la Dirección</Label>
            <Input 
              id="addressReference"
              value={formData.addressReference || ''} 
              onChange={(e) => updateFormData('addressReference', e.target.value)}
              placeholder="Punto de referencia para ubicar la dirección (opcional)"
            />
          </div>

          {/* Geolocalización Component */}
          <GeolocationCapture 
            onLocationCaptured={handleLocationCaptured}
            currentLocation={formData.geolocation}
          />
        </div>

        {/* Departamento y Municipio */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="residenceDepartment">Departamento de Residencia</Label>
            <Select 
              value={formData.residenceDepartment || ''} 
              onValueChange={(value) => {
                updateFormData('residenceDepartment', value);
                setSelectedDepartment(value);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar departamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="guatemala">Guatemala</SelectItem>
                <SelectItem value="alta_verapaz">Alta Verapaz</SelectItem>
                <SelectItem value="baja_verapaz">Baja Verapaz</SelectItem>
                <SelectItem value="chimaltenango">Chimaltenango</SelectItem>
                <SelectItem value="chiquimula">Chiquimula</SelectItem>
                <SelectItem value="el_progreso">El Progreso</SelectItem>
                <SelectItem value="escuintla">Escuintla</SelectItem>
                <SelectItem value="huehuetenango">Huehuetenango</SelectItem>
                <SelectItem value="izabal">Izabal</SelectItem>
                <SelectItem value="jalapa">Jalapa</SelectItem>
                <SelectItem value="jutiapa">Jutiapa</SelectItem>
                <SelectItem value="peten">Petén</SelectItem>
                <SelectItem value="quetzaltenango">Quetzaltenango</SelectItem>
                <SelectItem value="quiche">Quiché</SelectItem>
                <SelectItem value="retalhuleu">Retalhuleu</SelectItem>
                <SelectItem value="sacatepequez">Sacatepéquez</SelectItem>
                <SelectItem value="san_marcos">San Marcos</SelectItem>
                <SelectItem value="santa_rosa">Santa Rosa</SelectItem>
                <SelectItem value="solola">Sololá</SelectItem>
                <SelectItem value="suchitepequez">Suchitepéquez</SelectItem>
                <SelectItem value="totonicapan">Totonicapán</SelectItem>
                <SelectItem value="zacapa">Zacapa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="residenceMunicipality">Municipio de Residencia</Label>
            <Select 
              value={formData.residenceMunicipality || ''} 
              onValueChange={(value) => updateFormData('residenceMunicipality', value)}
              disabled={!selectedDepartment}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar municipio" />
              </SelectTrigger>
              <SelectContent>
                {selectedDepartment && departmentsMunicipalities[selectedDepartment as keyof typeof departmentsMunicipalities]?.map((municipality) => (
                  <SelectItem key={municipality} value={municipality.toLowerCase().replace(/ /g, '_')}>
                    {municipality}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Vivienda y Estabilidad */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="housingType">Vivienda</Label>
            <Select value={formData.housingType || ''} onValueChange={(value) => updateFormData('housingType', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo de vivienda" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="alquilada">Alquilada</SelectItem>
                <SelectItem value="familiar">Familiar</SelectItem>
                <SelectItem value="pagando">Pagando</SelectItem>
                <SelectItem value="propia">Propia</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="residenceStability">Estabilidad Domiciliar</Label>
            <div className="flex items-center">
              <Select 
                value={formData.residenceStability || ''} 
                onValueChange={(value) => updateFormData('residenceStability', value)}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Tiempo en la dirección actual" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="menor_1">Menor a 1 año</SelectItem>
                  <SelectItem value="1_2">1 a 2 años</SelectItem>
                  <SelectItem value="2_3">2 a 3 años</SelectItem>
                  <SelectItem value="mayor_3">Mayor a 3 años</SelectItem>
                </SelectContent>
              </Select>
              {formData.residenceStability && getStabilityBadge(formData.residenceStability)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactHousingForm;
