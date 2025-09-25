export interface FundsOrigin {
  id: string;
  value: string;
  displayValue: string; // Versión para mostrar en el UI (con <br/>)
  payloadValue: string; // Versión para el payload (sin <br/>)
}

export const fundsOrigins: FundsOrigin[] = [
  { 
    id: "1", 
    value: "Fideicomiso Fondo de Desarrollo de la Microempresa Pequeña y Mediana Empresa",
    displayValue: "Fideicomiso Fondo de Desarrollo de la<br/>Microempresa Pequeña y Mediana Empresa",
    payloadValue: "Fideicomiso Fondo de Desarrollo de la Microempresa Pequeña y Mediana Empresa"
  },
  { 
    id: "2", 
    value: "Propios",
    displayValue: "Propios",
    payloadValue: "Propios"
  },
  { 
    id: "3", 
    value: "SWV",
    displayValue: "SWV",
    payloadValue: "SWV"
  },
  { 
    id: "4", 
    value: "Fondo de Crédito de Apoyo a los Pequeños y Medianos Productores Agrícolas",
    displayValue: "Fondo de Crédito de Apoyo a los<br/>Pequeños y Medianos Productores Agrícolas",
    payloadValue: "Fondo de Crédito de Apoyo a los Pequeños y Medianos Productores Agrícolas"
  }
];

// Helper function to get funds origin by ID
export const getFundsOriginById = (id: string): FundsOrigin | undefined => {
  return fundsOrigins.find(origin => origin.id === id);
};