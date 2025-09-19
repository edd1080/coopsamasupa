export interface FundsOrigin {
  id: string;
  value: string;
}

export const fundsOrigins: FundsOrigin[] = [
  { id: "1", value: "Fideicomiso Fondo de Desarrollo de la Microempresa Pequeña y Mediana Empresa" },
  { id: "2", value: "Propios" },
  { id: "3", value: "SWV" },
  { id: "4", value: "Fondo de Crédito de Apoyo a los Pequeños y Medianos Productores Agrícolas" }
];

// Helper function to get funds origin by ID
export const getFundsOriginById = (id: string): FundsOrigin | undefined => {
  return fundsOrigins.find(origin => origin.id === id);
};