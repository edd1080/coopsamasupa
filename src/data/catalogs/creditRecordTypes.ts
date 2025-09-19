export interface CreditRecordType {
  id: string;
  value: string;
}

export const creditRecordTypes: CreditRecordType[] = [
  { id: "1", value: "INTERNO" },
  { id: "2", value: "EXTERNO" }
];

// Helper function to get credit record type by ID
export const getCreditRecordTypeById = (id: string): CreditRecordType | undefined => {
  return creditRecordTypes.find(type => type.id === id);
};