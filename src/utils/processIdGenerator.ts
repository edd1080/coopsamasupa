// Utility to generate process IDs in format PRC-000123
export const generateProcessId = (applicationId?: string): string => {
  // Use applicationId as seed or random number
  let seedNumber: number;
  
  if (applicationId) {
    // Extract number from SCO_123456 format or use hash
    const numberPart = applicationId.replace(/\D/g, '');
    seedNumber = numberPart ? parseInt(numberPart) : Math.floor(Math.random() * 999999);
  } else {
    seedNumber = Math.floor(Math.random() * 999999);
  }
  
  // Ensure it's within 6 digits and pad with zeros
  const processNumber = (seedNumber % 999999).toString().padStart(6, '0');
  return `PRC-${processNumber}`;
};

// Function to extract process number for display
export const getProcessNumber = (processId: string): string => {
  if (processId.startsWith('PRC-')) {
    return processId.replace('PRC-', '');
  }
  return processId;
};