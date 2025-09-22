
/**
 * Extracts the first name and first last name from a full name string
 * @param fullName - The complete name string
 * @returns A string with "FirstName FirstLastName" format
 */
export const getFirstNameAndLastName = (fullName: string): string => {
  if (!fullName || typeof fullName !== 'string') {
    return '';
  }

  const nameParts = fullName.trim().split(/\s+/);
  
  if (nameParts.length === 0) {
    return '';
  }
  
  if (nameParts.length === 1) {
    return nameParts[0];
  }
  
  // Return first name and first last name
  return `${nameParts[0]} ${nameParts[1]}`;
};

/**
 * Extracts the first name and first last name for navigation bar display
 * @param fullName - The complete name string
 * @returns A string with "FirstName FirstLastName" format for nav bar
 */
export const getNavBarName = (fullName: string): string => {
  if (!fullName || typeof fullName !== 'string') {
    return '';
  }

  const nameParts = fullName.trim().split(/\s+/);
  
  if (nameParts.length === 0) {
    return '';
  }
  
  if (nameParts.length === 1) {
    return nameParts[0];
  }
  
  // For nav bar, always return first name + first last name
  return `${nameParts[0]} ${nameParts[1]}`;
};
