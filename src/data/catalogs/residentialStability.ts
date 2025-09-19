export interface ResidentialStability {
  id: string;
  value: string;
}

export const residentialStabilities: ResidentialStability[] = [
  { id: "1", value: "MENOR A 1 AÑO" },
  { id: "2", value: "1 A 2 AÑOS" },
  { id: "3", value: "2 A 3 AÑOS" },
  { id: "4", value: "MAYOR A 3 AÑOS" }
];

// Helper function to get residential stability by ID
export const getResidentialStabilityById = (id: string): ResidentialStability | undefined => {
  return residentialStabilities.find(stability => stability.id === id);
};