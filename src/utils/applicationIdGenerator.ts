
// Utility to generate application IDs in format SCO_######
export const generateApplicationId = (): string => {
  const randomNumber = Math.floor(100000 + Math.random() * 900000);
  return `SCO_${randomNumber}`;
};

// Function to extract just the number part for display
export const getApplicationNumber = (applicationId: string): string => {
  if (applicationId.startsWith('SCO_')) {
    return applicationId.replace('SCO_', '');
  }
  return applicationId;
};

// Function to format ID for display
export const formatApplicationId = (applicationId: string): string => {
  if (!applicationId.startsWith('SCO_')) {
    return `SCO_${applicationId}`;
  }
  return applicationId;
};
