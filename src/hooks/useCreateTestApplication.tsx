import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export const useCreateTestApplication = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async () => {
      if (!user) {
        throw new Error('Usuario no autenticado');
      }

      // Datos de prueba para "María Esperanza López" con valores corregidos
      const testApplicationData = {
        client_name: 'María Esperanza López',
        agent_id: user.id,
        last_step: 7,
        last_sub_step: 1,
        draft_data: {
          // Identificación básica
          applicationId: 'SCO_954424',
          applicationDate: new Date().toISOString(),
          fullName: 'María Esperanza López',
          firstName: 'María',
          secondName: 'Esperanza',
          thirdName: '',
          firstLastName: 'López',
          secondLastName: 'García',
          marriedLastName: '',
          
          // Documentación
          dpi: '9876543210987',
          dpiExtendedIn: 'Guatemala',
          nit: '87654321',
          cua: 'MEL54321',
          
          // Datos personales
          birthDate: '1990-03-22',
          age: 33,
          gender: 'MUJER',
          civilStatus: 'SOLTERO',
          ethnicity: '',
          hasDisability: false,
          disabilityDescription: '',
          dependents: '',
          
          // Contacto
          mobilePhone: '50987654',
          homePhone: '22334455',
          email: 'maria.lopez@testing.com',
          
          // Ubicación
          department: 'Guatemala',
          municipality: 'Guatemala',
          address: '12 Calle 8-45 Zona 1, Guatemala City',
          addressReference: '',
          residenceDepartment: 'Guatemala',
          residenceMunicipality: 'Guatemala',
          coordinates: {
            latitude: 14.6349,
            longitude: -90.5069,
            accuracy: 10
          },
          geolocation: null,
          
          // Vivienda - VALORES CORREGIDOS
          housingType: 'ALQUILADA',
          housingStability: 'MENOR A 1 AÑO',
          residentialStability: 'MENOR A 1 AÑO',
          
          // Educación y profesión - VALORES CORREGIDOS
          educationLevel: 'SUPERIOR',
          profession: 'MAESTRIA',
          occupation: 'Comerciante',
          economicActivity: 'Comercio al por menor',
          
          // Agencia y producto
          agency: 'Agencia Central',
          memberType: 'A',
          productType: 'Crédito Normal',
          requestedAmount: '25000',
          termMonths: '24',
          paymentPlan: 'nivelada',
          interestRate: '',
          
          // Destino del crédito
          creditPurpose: 'Vivienda',
          creditDestination: 'VIVIENDA',
          destinationGroup: 'Grupo Vivienda',
          destinationCategory: 'Mantenimiento',
          destinationDescription: '',
          destinationObservations: '',
          fundsOrigin: '',
          
          // Información laboral
          incomeSource: '',
          incomeSources: [],
          income: [
            {
              amount: 8000,
              source: 'Comercial',
              isMain: true,
              observations: 'Venta de productos textiles'
            }
          ],
          
          // Gastos
          food: '1500',
          utilities: '800',
          education: '300',
          transport: '500',
          housing: '0',
          other: '400',
          
          // Información financiera
          cashAndBanks: '5000',
          accountsPayable: '8000',
          merchandise: '15000',
          realEstate: '150000',
          
          // Referencias
          references: [
            {
              fullName: 'María González López',
              relationship: 'Amiga',
              phone: '50987654',
              address: '10ma Calle 5-67 Zona 9, Guatemala',
              rating: 'Excelente'
            },
            {
              fullName: 'Juan Carlos Morales',
              relationship: 'Proveedor',
              phone: '50456789',
              address: '15 Avenida 3-45 Zona 12, Guatemala',
              rating: 'Bueno'
            }
          ],
          
          // Otros campos necesarios
          spouseBirthDate: '',
          spouseFirstName: '',
          spouseSecondName: '',
          spouseFirstLastName: '',
          spouseSecondLastName: '',
          spouseWorkplace: '',
          spouseMobilePhone: '',
          spouseJobStability: '',
          
          // Aceptaciones
          termsAccepted: false,
          dataProcessingAccepted: false,
          creditCheckAccepted: false,
          
          // Observaciones
          characterObservations: ''
        }
      };

      // Verificar si ya existe una solicitud de prueba con el mismo nombre de cliente y agente
      const { data: existingApplication } = await supabase
        .from('application_drafts')
        .select('id')
        .eq('client_name', testApplicationData.client_name)
        .eq('agent_id', user.id)
        .single();

      if (existingApplication) {
        throw new Error('Ya existe una solicitud de prueba para este cliente. Elimínala primero.');
      }

      // Crear la nueva solicitud de prueba
      const { data, error } = await supabase
        .from('application_drafts')
        .insert(testApplicationData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      // Invalidar las queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['application-drafts'] });
      
      toast({
        title: "Solicitud de prueba creada",
        description: "Se ha creado exitosamente la solicitud de prueba con datos corregidos.",
      });

      // Navegar a la página de edición de la solicitud
      navigate(`/request-form/${data.id}`);
    },
    onError: (error: any) => {
      console.error('Error creating test application:', error);
      toast({
        title: "Error al crear solicitud de prueba",
        description: error.message || "Ocurrió un error inesperado",
        variant: "destructive",
      });
    },
  });
};