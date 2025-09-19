export interface RequestType {
  id: string;
  value: string;
}

export const requestTypes: RequestType[] = [
  { id: "1", value: "NUEVO" },
  { id: "2", value: "AMPLIACIÓN" },
  { id: "3", value: "REESTRUCTURACIÓN" },
  { id: "4", value: "NOVACIÓN" }
];

// Helper function to get request type by ID
export const getRequestTypeById = (id: string): RequestType | undefined => {
  return requestTypes.find(type => type.id === id);
};