export interface Agency {
  id: string;
  value: string;
  name: string;
}

export const agencies: Agency[] = [
  { id: "1", value: "CENTRAL", name: "Central" },
  { id: "2", value: "SAN CRISTOBAL", name: "San Cristobal" },
  { id: "3", value: "PURULHA", name: "Purulha" },
  { id: "4", value: "CHISEC", name: "Chisec" },
  { id: "5", value: "PLAYA GRANDE", name: "Playa Grande" },
  { id: "6", value: "SAN PEDRO CARCHA", name: "San Pedro Carcha" },
  { id: "7", value: "TACTIC ASUNCION", name: "Tactic Asuncion" },
  { id: "8", value: "SAYAXCHE", name: "Sayaxche" },
  { id: "9", value: "SANTA CRUZ", name: "Santa Cruz" },
  { id: "10", value: "CHICAMAN", name: "Chicaman" },
  { id: "11", value: "LA LIBERTAD", name: "La Libertad" },
  { id: "12", value: "CC GRAN CARCHA", name: "CC Gran Carcha" },
  { id: "13", value: "RAXRUHA", name: "Raxruha" }
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