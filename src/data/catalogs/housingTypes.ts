export interface HousingType {
  id: string;
  value: string;
}

export const housingTypes: HousingType[] = [
  { id: "1", value: "PROPIA" },
  { id: "2", value: "ALQUILADA" },
  { id: "3", value: "FAMILIAR" },
  { id: "4", value: "PAGANDO" }
];

// Helper function to get housing type by ID
export const getHousingTypeById = (id: string): HousingType | undefined => {
  return housingTypes.find(type => type.id === id);
};