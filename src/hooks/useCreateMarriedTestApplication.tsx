import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export const useCreateMarriedTestApplication = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async () => {
      if (!user) {
        throw new Error('Usuario no autenticado');
      }

      // Datos completos para persona CASADA - Carlos Manuel Rodríguez
      const testApplicationData = {
        client_name: 'Carlos Manuel Rodríguez',
        agent_id: user.id,
        last_step: 7,
        last_sub_step: 1,
        draft_data: {
          // Identificación básica
          applicationId: `SCO_${Date.now().toString().slice(-6)}`,
          applicationDate: new Date().toISOString(),
          fullName: 'Carlos Manuel Rodríguez',
          firstName: 'Carlos',
          secondName: 'Manuel',
          thirdName: '',
          firstLastName: 'Rodríguez',
          secondLastName: 'Morales',
          marriedLastName: '',
          
          // Documentación
          dpi: '1234567890123',
          dpiExtendedIn: 'Guatemala',
          nit: '12345678',
          cua: 'CMR12345',
          
          // Datos personales COMPLETOS
          birthDate: '1985-07-15',
          age: 40,
          gender: 'HOMBRE',
          civilStatus: 'CASADO',
          ethnicity: 'Mestizo',
          hasDisability: false,
          disabilityDescription: '',
          dependents: '2',
          
          // Contacto
          mobilePhone: '50123456',
          homePhone: '23456789',
          email: 'carlos.rodriguez@testing.com',
          
          // Ubicación
          department: 'Guatemala',
          municipality: 'Guatemala',
          address: '5ta Avenida 12-34 Zona 10, Guatemala City',
          addressReference: 'A dos cuadras del centro comercial',
          residenceDepartment: 'Guatemala',
          residenceMunicipality: 'Guatemala',
          coordinates: {
            latitude: 14.6118,
            longitude: -90.5142,
            accuracy: 15
          },
          geolocation: {
            latitude: 14.6118,
            longitude: -90.5142,
            timestamp: Date.now()
          },
          
          // Vivienda
          housingType: 'PROPIA',
          housingStability: 'MAS DE 5 AÑOS',
          residentialStability: 'MAS DE 5 AÑOS',
          
          // Educación y profesión
          educationLevel: 'SUPERIOR',
          profession: 'INGENIERIA',
          occupation: 'Ingeniero',
          economicActivity: 'Servicios profesionales',
          
          // Agencia y producto
          agency: 'Agencia Central',
          memberType: 'A',
          productType: 'Crédito Normal',
          requestedAmount: '50000',
          termMonths: '36',
          paymentPlan: 'nivelada',
          interestRate: '11.5',
          
          // Destino del crédito
          creditPurpose: 'Negocio',
          creditDestination: 'NEGOCIO',
          destinationGroup: 'Grupo Comercio',
          destinationCategory: 'Ampliación',
          destinationDescription: 'Ampliación de oficina de consultoría',
          destinationObservations: 'Expansión del negocio familiar',
          fundsOrigin: 'Utilidades del negocio',
          
          // Información laboral
          incomeSource: 'Profesional',
          incomeSources: ['Profesional', 'Negocio'],
          income: [
            {
              amount: 15000,
              source: 'Profesional',
              isMain: true,
              observations: 'Consultoría en ingeniería'
            },
            {
              amount: 5000,
              source: 'Negocio',
              isMain: false,
              observations: 'Ingresos adicionales del negocio'
            }
          ],
          
          // Gastos
          food: '2500',
          utilities: '1200',
          education: '800',
          transport: '700',
          housing: '0',
          other: '600',
          
          // Información financiera
          cashAndBanks: '15000',
          accountsPayable: '12000',
          merchandise: '25000',
          realEstate: '350000',
          
          // Referencias
          references: [
            {
              fullName: 'Pedro García Ruiz',
              relationship: 'Socio comercial',
              phone: '50111222',
              address: '8va Calle 15-20 Zona 1, Guatemala',
              rating: 'Excelente'
            },
            {
              fullName: 'Ana Lucía Fernández',
              relationship: 'Cliente',
              phone: '50333444',
              address: '12 Avenida 8-90 Zona 14, Guatemala',
              rating: 'Muy bueno'
            }
          ],
          
          // CAMPOS COMPLETOS DEL CÓNYUGE
          spouseFirstName: 'Ana',
          spouseSecondName: 'Patricia',
          spouseThirdName: '',
          spouseFirstLastName: 'Morales',
          spouseSecondLastName: 'González',
          spouseBirthDate: '1988-11-25',
          spouseWorkplace: 'Hospital Roosevelt',
          spouseMobilePhone: '50654321',
          spouseJobStability: 'MAS DE 2 AÑOS',
          
          // Aceptaciones
          termsAccepted: true,
          dataProcessingAccepted: true,
          creditCheckAccepted: true,
          
          // Información laboral adicional
          workPlace: 'Consultora Rodríguez & Asociados',
          jobPosition: 'Ingeniero Senior',
          jobStability: 'MAS DE 5 AÑOS',
          workAddress: '6ta Avenida 10-25 Zona 9, Guatemala City',
          workPhone: '23456789',
          
          // Observaciones
          characterObservations: 'Cliente con excelente historial crediticio y estabilidad financiera'
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
        throw new Error('Ya existe una solicitud de prueba para Carlos Rodríguez. Elimínala primero.');
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
        title: "Solicitud de prueba (Casado) creada",
        description: "Se ha creado exitosamente la solicitud de prueba para persona casada.",
      });

      // Navegar a la página de edición de la solicitud
      navigate(`/request-form/${data.id}`);
    },
    onError: (error: any) => {
      console.error('Error creating married test application:', error);
      toast({
        title: "Error al crear solicitud de prueba (Casado)",
        description: error.message || "Ocurrió un error inesperado",
        variant: "destructive",
      });
    },
  });
};