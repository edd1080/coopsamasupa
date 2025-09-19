export interface ReferenceRating {
  id: string;
  value: string;
}

export const referenceRatings: ReferenceRating[] = [
  { id: "1", value: "EXCELENTE" },
  { id: "2", value: "BUENO" },
  { id: "3", value: "REGULAR" },
  { id: "4", value: "MALO" }
];

// Helper function to get reference rating by ID
export const getReferenceRatingById = (id: string): ReferenceRating | undefined => {
  return referenceRatings.find(rating => rating.id === id);
};