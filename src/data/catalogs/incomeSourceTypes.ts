export interface IncomeSourceType {
  id: string;
  value: string;
}

export const incomeSourceTypes: IncomeSourceType[] = [
  { id: "1", value: "NOMINAL" },
  { id: "2", value: "COMERCIAL" },
  { id: "3", value: "AGRICOLA" },
  { id: "4", value: "CONYUGE" },
  { id: "5", value: "OTROS" }
];

// Helper function to get income source type by ID
export const getIncomeSourceTypeById = (id: string): IncomeSourceType | undefined => {
  return incomeSourceTypes.find(type => type.id === id);
};