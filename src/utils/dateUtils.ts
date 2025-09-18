// Utility functions for standardized date formatting

export const formatDateToGuatemalan = (date: Date | string | number): string => {
  try {
    const dateObj = new Date(date);
    
    // Force Guatemala format DD/MM/YYYY
    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObj.getFullYear();
    
    return `${day}/${month}/${year}`;
  } catch (error) {
    return 'Fecha inválida';
  }
};

export const formatDateTimeToGuatemalan = (date: Date | string | number): string => {
  try {
    const dateObj = new Date(date);
    
    // Force Guatemala format DD/MM/YYYY HH:mm
    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObj.getFullYear();
    const hours = dateObj.getHours().toString().padStart(2, '0');
    const minutes = dateObj.getMinutes().toString().padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  } catch (error) {
    return 'Fecha inválida';
  }
};

export const formatShortDateTimeToGuatemalan = (date: Date | string | number): string => {
  try {
    const dateObj = new Date(date);
    
    // Force compact Guatemala format DD/MM/YY HH:mm
    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObj.getFullYear().toString().slice(-2);
    const hours = dateObj.getHours().toString().padStart(2, '0');
    const minutes = dateObj.getMinutes().toString().padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  } catch (error) {
    return 'Fecha inválida';
  }
};