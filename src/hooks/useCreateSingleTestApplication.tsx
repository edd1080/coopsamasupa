import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export const useCreateSingleTestApplication = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async () => {
      if (!user) {
        throw new Error('Usuario no autenticado');
      }

      // Datos completos para persona SOLTERA - María Esperanza López
      const testApplicationData = {
        client_name: 'María Esperanza López',
        agent_id: user.id,
        last_step: 7,
        last_sub_step: 1,
        draft_data: {
          // Identificación básica
          applicationId: `SCO_${Date.now().toString().slice(-6)}`,
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
          
          // Datos personales COMPLETOS
          birthDate: '1990-03-22',
          age: 35,
          gender: 'MUJER',
          civilStatus: 'SOLTERO',
          ethnicity: 'Ladino',
          hasDisability: false,
          disabilityDescription: '',
          dependents: '0',
          
          // Contacto
          mobilePhone: '50987654',
          homePhone: '22334455',
          email: 'maria.lopez@testing.com',
          
          // Ubicación
          department: 'Guatemala',
          municipality: 'Guatemala',
          address: '12 Calle 8-45 Zona 1, Guatemala City',
          addressReference: 'Frente al parque central',
          residenceDepartment: 'Guatemala',
          residenceMunicipality: 'Guatemala',
          coordinates: {
            latitude: 14.6349,
            longitude: -90.5069,
            accuracy: 10
          },
          geolocation: {
            latitude: 14.6349,
            longitude: -90.5069,
            timestamp: Date.now()
          },
          
          // Vivienda
          housingType: 'ALQUILADA',
          housingStability: 'MENOR A 1 AÑO',
          residentialStability: 'MENOR A 1 AÑO',
          
          // Educación y profesión
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
          interestRate: '12.5',
          
          // Destino del crédito
          creditPurpose: 'Vivienda',
          creditDestination: 'VIVIENDA',
          destinationGroup: 'Grupo Vivienda',
          destinationCategory: 'Mantenimiento',
          destinationDescription: 'Renovación de techos y pintura',
          destinationObservations: 'Mejoras urgentes en la vivienda',
          fundsOrigin: 'Ahorros personales',
          
          // Información laboral
          incomeSource: 'Comercial',
          incomeSources: ['Comercial'],
          income: [
            {
              amount: 8000,
              source: 'Comercial',
              isMain: true,
              observations: 'Venta de productos textiles en mercado local'
            }
          ],
          
          // Gastos
          food: '1500',
          utilities: '800',
          education: '300',
          transport: '500',
          housing: '1200',
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
          
          // NO incluir campos de cónyuge para persona soltera
          
          // Aceptaciones
          termsAccepted: true,
          dataProcessingAccepted: true,
          creditCheckAccepted: true,
          
          // Información laboral adicional
          workPlace: 'Mercado Central',
          jobPosition: 'Comerciante independiente',
          jobStability: 'MAS DE 2 AÑOS',
          workAddress: 'Mercado Central, Guatemala City',
          workPhone: '22334455',
          
          // Observaciones
          characterObservations: 'Cliente responsable con historial crediticio limpio'
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
        throw new Error('Ya existe una solicitud de prueba para María López. Elimínala primero.');
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
        title: "Solicitud de prueba (Soltero) creada",
        description: "Se ha creado exitosamente la solicitud de prueba para persona soltera.",
      });

      // Navegar a la página de edición de la solicitud
      navigate(`/request-form/${data.id}`);
    },
    onError: (error: any) => {
      console.error('Error creating single test application:', error);
      toast({
        title: "Error al crear solicitud de prueba (Soltero)",
        description: error.message || "Ocurrió un error inesperado",
        variant: "destructive",
      });
    },
  });
};