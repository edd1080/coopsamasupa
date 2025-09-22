import { useEffect, useRef } from 'react';

/**
 * Hook para detectar clicks fuera de un elemento
 * Útil para cerrar dropdowns, modales, etc.
 */
export const useClickOutside = (
  isActive: boolean,
  onOutsideClick: () => void
) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onOutsideClick();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onOutsideClick();
      }
    };

    // Agregar event listeners
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      // Limpiar event listeners
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isActive, onOutsideClick]);

  return ref;
};
