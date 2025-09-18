
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';

export const useCreateTestApplication = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  return useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('Usuario no autenticado');
      
      console.log('🧪 Creating test application "María Esperanza López"');
      
      const testApplicationData = {
        agent_id: user.id,
        client_name: 'María Esperanza López',
        draft_data: {
          // Identificación personal
          fullName: 'María Esperanza López',
          firstName: 'María',
          secondName: 'Esperanza',
          lastName: 'López',
          secondLastName: 'García',
          gender: 'MUJER',
          civilStatus: 'SOLTERO',
          dpi: '9876543210987',
          dpiExtendedIn: 'Guatemala',
          cua: 'MEL54321',
          birthDate: '1990-03-22',
          age: 33,
          
          // Contacto
          nit: '87654321',
          mobilePhone: '50987654',
          homePhone: '22334455', // Teléfono fijo para probar fallback
          email: 'maria.lopez@testing.com',
          address: '12 Calle 8-45 Zona 1, Guatemala City',
          department: 'Guatemala',
          municipality: 'Guatemala',
          residenceDepartment: 'Guatemala',
          residenceMunicipality: 'Guatemala',
          
          // Vivienda
          housingType: 'ALQUILADA',
          housingStability: 'DE 1 A 3 AÑOS',
          residentialStability: 'DE 1 A 3 AÑOS',
          
          // Educación y profesión
          educationLevel: 'UNIVERSITARIA',
          profession: 'LICENCIATURA',
          occupation: 'Comerciante',
          economicActivity: 'Comercio al por menor',
          
          // Crédito
          creditPurpose: 'Vivienda',
          requestedAmount: '25000',
          termMonths: '24',
          paymentPlan: 'nivelada',
          destinationGroup: 'Grupo Vivienda',
          creditDestination: 'VIVIENDA',
          destinationCategory: 'Mantenimiento',
          
          // Ubicación (coordenadas de Guatemala)
          coordinates: {
            latitude: 14.6349,
            longitude: -90.5069,
            accuracy: 10
          },
          
          // Ingresos
          income: [{
            source: 'Comercial',
            amount: 8000,
            isMain: true,
            observations: 'Venta de productos textiles'
          }],
          
          // Gastos (campos individuales como espera el fieldMapper)
          food: '1500',
          utilities: '800',
          transport: '500',
          housing: '0', // Casa propia
          education: '300',
          other: '400',
          
          // Estados financieros
          cashAndBanks: '5000',
          merchandise: '15000',
          realEstate: '150000',
          accountsPayable: '8000',
          
          // Referencias
          references: [{
            fullName: 'María González López',
            relationship: 'Amiga',
            phone: '50987654',
            address: '10ma Calle 5-67 Zona 9, Guatemala',
            rating: 'Excelente'
          }, {
            fullName: 'Juan Carlos Morales',
            relationship: 'Proveedor',
            phone: '50456789',
            address: '15 Avenida 3-45 Zona 12, Guatemala',
            rating: 'Bueno'
          }],
          
          // Agencia y membresía
          agency: 'Agencia Central',
          memberType: 'A',
          productType: 'Crédito Normal',
          
          // Fechas y estado
          applicationDate: new Date().toISOString(),
          termsAccepted: false,
          dataProcessingAccepted: false,
          creditCheckAccepted: false
        },
        last_step: 5,
        last_sub_step: 0,
        updated_at: new Date().toISOString()
      };
      
      // Primero verificar si ya existe
      const { data: existing } = await supabase
        .from('application_drafts')
        .select('id')
        .eq('client_name', 'María Esperanza López')
        .eq('agent_id', user.id)
        .maybeSingle();
        
      if (existing) {
        throw new Error('La solicitud de prueba "María Esperanza López" ya existe para este usuario');
      }
      
      // Crear la nueva solicitud
      const { data, error } = await supabase
        .from('application_drafts')
        .insert(testApplicationData)
        .select()
        .single();
        
      if (error) {
        console.error('❌ Error creating test application:', error);
        throw error;
      }
      
      console.log('✅ Test application created successfully');
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['application-drafts'] });
      
      toast({
        title: "Solicitud de prueba creada",
        description: "La solicitud 'María Esperanza López' ha sido creada exitosamente",
        variant: "default",
        className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
        duration: 3000,
      });
      
      // Navegar a la solicitud creada
      navigate(`/applications/${data.id}/edit`);
    },
    onError: (error: any) => {
      console.error('❌ Error creating test application:', error);
      
      toast({
        title: "Error al crear solicitud de prueba",
        description: error.message || "No se pudo crear la solicitud de prueba",
        variant: "destructive",
        duration: 5000
      });
    },
  });
};
