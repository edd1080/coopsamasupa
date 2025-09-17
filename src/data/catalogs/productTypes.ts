export interface ProductType {
  id: string;
  value: string;
  name: string;
  description: string;
}

export const productTypes: ProductType[] = [
  { 
    id: "1", 
    value: "CREDITO", 
    name: "Crédito Normal",
    description: "Créditos tradicionales y préstamos personales"
  },
  { 
    id: "2", 
    value: "AUTOMATICO", 
    name: "Crédito Automático",
    description: "Préstamos automatizados con aprobación rápida"
  },
  { 
    id: "3", 
    value: "TARJETA_CREDITO", 
    name: "Tarjeta de Crédito",
    description: "Líneas de crédito renovables mediante tarjetas"
  }
];

// Helper function to map credit type to product type
export const mapCreditTypeToProductType = (creditType: string): ProductType | undefined => {
  if (!creditType) return productTypes[0]; // Default to "Crédito Normal"
  
  const normalizedType = creditType.toLowerCase();
  
  // Map common credit types to our product types
  if (normalizedType.includes('tarjeta') || normalizedType.includes('card')) {
    return productTypes[2]; // Tarjeta de Crédito
  }
  
  if (normalizedType.includes('auto') || normalizedType.includes('rapido') || normalizedType.includes('quick')) {
    return productTypes[1]; // Automático
  }
  
  return productTypes[0]; // Default to Crédito Normal
};

// Helper function to get product type by ID
export const getProductTypeById = (id: string): ProductType | undefined => {
  return productTypes.find(type => type.id === id);
};