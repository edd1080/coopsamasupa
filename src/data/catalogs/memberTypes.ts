export interface MemberType {
  id: string;
  value: string;
}

export const memberTypes: MemberType[] = [
  { id: "1", value: "A" },
  { id: "2", value: "B" },
  { id: "3", value: "C" },
  { id: "4", value: "D" }
];

// Helper function to get member type by ID
export const getMemberTypeById = (id: string): MemberType | undefined => {
  return memberTypes.find(type => type.id === id);
};