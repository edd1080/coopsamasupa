export interface ProductType {
  id: string;
  value: string;
}

export const productTypes: ProductType[] = [
  { 
    id: "1", 
    value: "Crédito"
  },
  { 
    id: "2", 
    value: "Automatico"
  },
  { 
    id: "3", 
    value: "Tarjeta de Credito"
  }
];

// Helper function to map credit type to product type
export const mapCreditTypeToProductType = (creditType: string): ProductType | null => {
  const match = productTypes.find(type => 
    type.value.toLowerCase() === creditType.toLowerCase()
  );
  return match || null;
};

// Helper function to get product type by ID
export const getProductTypeById = (id: string): ProductType | null => {
  const match = productTypes.find(type => type.id === id);
  return match || null;
};