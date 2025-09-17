export interface Agency {
  id: string;
  value: string;
  name: string;
}

export const agencies: Agency[] = [
  { id: "1", value: "AGENCIA CENTRAL", name: "Agencia Central" },
  { id: "2", value: "AGENCIA SANTA MARIA", name: "Agencia Santa María" },
  { id: "3", value: "AGENCIA GUASTATOYA", name: "Agencia Guastatoya" },
  { id: "4", value: "AGENCIA ASUNCION MITA", name: "Agencia Asunción Mita" },
  { id: "5", value: "AGENCIA ZACAPA", name: "Agencia Zacapa" },
  { id: "6", value: "AGENCIA CHIQUIMULA", name: "Agencia Chiquimula" },
  { id: "7", value: "AGENCIA JALAPA", name: "Agencia Jalapa" },
  { id: "8", value: "AGENCIA MATAQUESCUINTLA", name: "Agencia Mataquescuintla" },
  { id: "9", value: "AGENCIA MONJAS", name: "Agencia Monjas" },
  { id: "10", value: "AGENCIA JUTIAPA", name: "Agencia Jutiapa" },
  { id: "11", value: "AGENCIA NUEVA SANTA ROSA", name: "Agencia Nueva Santa Rosa" },
  { id: "12", value: "AGENCIA PUERTO BARRIOS", name: "Agencia Puerto Barrios" },
  { id: "13", value: "AGENCIA EL PROGRESO", name: "Agencia El Progreso" }
];

// Helper function to find agency by name or value
export const findAgencyByName = (searchName: string): Agency | undefined => {
  if (!searchName) return undefined;
  
  const normalizedSearch = searchName.toLowerCase().trim();
  
  return agencies.find(agency => 
    agency.name.toLowerCase().includes(normalizedSearch) ||
    agency.value.toLowerCase().includes(normalizedSearch) ||
    normalizedSearch.includes(agency.name.toLowerCase())
  );
};

// Helper function to get agency by ID
export const getAgencyById = (id: string): Agency | undefined => {
  return agencies.find(agency => agency.id === id);
};