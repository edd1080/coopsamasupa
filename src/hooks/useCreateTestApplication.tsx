
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
      
      console.log('🧪 Creating test application "Andrea Prueba"');
      
      const testApplicationData = {
        agent_id: user.id,
        client_name: 'Andrea Prueba',
        draft_data: {
          // Identificación personal
          fullName: 'Andrea Prueba',
          firstName: 'Andrea',
          lastName: 'Prueba',
          gender: 'Femenino',
          civilStatus: 'Soltera',
          dpi: '1234567890123',
          dpiExtendedIn: 'Guatemala',
          cua: 'AP12345',
          birthDate: '1995-06-15',
          age: 28,
          
          // Contacto
          nit: '12345678',
          mobilePhone: '50123456',
          email: 'andrea.prueba@test.com',
          address: '5ta Avenida 12-34 Zona 10, Ciudad de Guatemala',
          department: 'Guatemala',
          municipality: 'Guatemala',
          residenceDepartment: 'Guatemala',
          residenceMunicipality: 'Guatemala',
          
          // Vivienda
          housingType: 'Propia',
          housingStability: 'Más de 5 años',
          residentialStability: 'Más de 5 años',
          
          // Educación y profesión
          educationLevel: 'Universitario',
          profession: 'Empresaria',
          occupation: 'Comercio',
          economicActivity: 'Comercio',
          
          // Crédito
          creditPurpose: 'Capital de Trabajo',
          requestedAmount: '25000',
          termMonths: '24',
          paymentPlan: 'nivelada',
          destinationGroup: 'Grupo MicroCredito',
          creditDestination: 'COMERCIO',
          destinationCategory: 'Capital de trabajo',
          
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
          agency: 'Zona 1',
          memberType: 'Activo',
          
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
        .eq('client_name', 'Andrea Prueba')
        .eq('agent_id', user.id)
        .maybeSingle();
        
      if (existing) {
        throw new Error('La solicitud de prueba "Andrea Prueba" ya existe para este usuario');
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
        description: "La solicitud 'Andrea Prueba' ha sido creada exitosamente",
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
