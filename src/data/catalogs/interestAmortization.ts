export interface InterestAmortization {
  id: string;
  value: string;
}

export const interestAmortizations: InterestAmortization[] = [
  { id: "1", value: "MENSUAL" },
  { id: "2", value: "BIMENSUAL" },
  { id: "3", value: "TRIMESTRAL" },
  { id: "4", value: "SEMESTRAL" },
  { id: "5", value: "ANUAL" },
  { id: "8", value: "AL VENCIMIENTO" },
  { id: "9", value: "FONDO REVOLVENTE" }
];

// Helper function to get interest amortization by ID
export const getInterestAmortizationById = (id: string): InterestAmortization | undefined => {
  return interestAmortizations.find(amortization => amortization.id === id);
};