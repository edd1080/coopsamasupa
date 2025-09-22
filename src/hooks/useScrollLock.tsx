import { useEffect } from 'react';

/**
 * Hook para bloquear/desbloquear el scroll del body
 * Útil para modales, dropdowns y otros componentes que necesitan prevenir scroll
 */
export const useScrollLock = (isLocked: boolean) => {
  useEffect(() => {
    if (isLocked) {
      // Guardar el scroll actual
      const scrollY = window.scrollY;
      
      // Bloquear scroll
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      
      return () => {
        // Restaurar scroll
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        
        // Restaurar posición de scroll
        window.scrollTo(0, scrollY);
      };
    }
  }, [isLocked]);
};
