export interface ReferenceType {
  id: string;
  value: string;
}

export const referenceTypes: ReferenceType[] = [
  { id: "1", value: "PERSONAL" },
  { id: "2", value: "COMERCIAL" }
];

// Helper function to get reference type by ID
export const getReferenceTypeById = (id: string): ReferenceType | undefined => {
  return referenceTypes.find(type => type.id === id);
};