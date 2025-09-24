// Utility functions for standardized date formatting

export const formatDateToGuatemalan = (date: Date | string | number): string => {
  try {
    // Handle null, undefined, or empty values
    if (date === null || date === undefined || date === '' || date === 'null' || date === 'undefined') {
      return 'Sin fecha';
    }
    
    const dateObj = new Date(date);
    
    // Check if the date is valid (not NaN) and not epoch time (1970-01-01)
    if (isNaN(dateObj.getTime()) || dateObj.getTime() === 0) {
      return 'Sin fecha';
    }
    
    // Force Guatemala format DD/MM/YYYY
    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObj.getFullYear();
    
    return `${day}/${month}/${year}`;
  } catch (error) {
    return 'Sin fecha';
  }
};

export const formatDateTimeToGuatemalan = (date: Date | string | number): string => {
  try {
    // Handle null, undefined, or empty values
    if (date === null || date === undefined || date === '' || date === 'null' || date === 'undefined') {
      return 'Sin fecha';
    }
    
    const dateObj = new Date(date);
    
    // Check if the date is valid (not NaN) and not epoch time (1970-01-01)
    if (isNaN(dateObj.getTime()) || dateObj.getTime() === 0) {
      return 'Sin fecha';
    }
    
    // Force Guatemala format DD/MM/YYYY HH:mm
    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObj.getFullYear();
    const hours = dateObj.getHours().toString().padStart(2, '0');
    const minutes = dateObj.getMinutes().toString().padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  } catch (error) {
    return 'Sin fecha';
  }
};

export const formatShortDateTimeToGuatemalan = (date: Date | string | number): string => {
  try {
    // Handle null, undefined, or empty values
    if (date === null || date === undefined || date === '' || date === 'null' || date === 'undefined') {
      return 'Sin fecha';
    }
    
    const dateObj = new Date(date);
    
    // Check if the date is valid (not NaN) and not epoch time (1970-01-01)
    if (isNaN(dateObj.getTime()) || dateObj.getTime() === 0) {
      return 'Sin fecha';
    }
    
    // Force compact Guatemala format DD/MM/YY HH:mm
    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObj.getFullYear().toString().slice(-2);
    const hours = dateObj.getHours().toString().padStart(2, '0');
    const minutes = dateObj.getMinutes().toString().padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  } catch (error) {
    return 'Sin fecha';
  }
};