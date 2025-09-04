
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
        id: 'ANDREA-PRUEBA-2024',
        agent_id: user.id,
        client_name: 'Andrea Prueba',
        draft_data: {
          applicationId: 'ANDREA-PRUEBA-2024',
          fullName: 'Andrea Prueba',
          firstName: 'Andrea',
          lastName: 'Prueba',
          gender: 'Femenino',
          civilStatus: 'Soltera',
          dpi: '1234567890123',
          dpiExtendedIn: 'Guatemala',
          cua: 'AP12345',
          
          nit: '12345678',
          mobilePhone: '50123456',
          email: 'andrea.prueba@test.com',
          address: '5ta Avenida 12-34 Zona 10, Ciudad de Guatemala',
          department: 'Guatemala',
          municipality: 'Guatemala',
          housingType: 'Propia',
          housingStability: 'Más de 5 años',
          creditPurpose: 'Capital de Trabajo',
          requestedAmount: '25000',
          termMonths: '24',
          paymentPlan: 'pago_mensual_fijo',
          agency: 'Zona 1',
          memberType: 'Activo',
          age: '28',
          profession: 'Empresaria',
          economicActivity: 'Comercio',
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
        .eq('id', 'ANDREA-PRUEBA-2024')
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
