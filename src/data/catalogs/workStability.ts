export interface WorkStability {
  id: string;
  value: string;
}

export const workStabilities: WorkStability[] = [
  { id: "1", value: "MENOR A 1 AÑO" },
  { id: "2", value: "1 A 2 AÑOS" },
  { id: "3", value: "2 A 3 AÑOS" },
  { id: "4", value: "MAYOR A 3 AÑOS" }
];

// Helper function to get work stability by ID
export const getWorkStabilityById = (id: string): WorkStability | undefined => {
  return workStabilities.find(stability => stability.id === id);
};