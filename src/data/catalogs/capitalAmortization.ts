export interface CapitalAmortization {
  id: string;
  value: string;
}

export const capitalAmortizations: CapitalAmortization[] = [
  { id: "1", value: "MENSUAL" },
  { id: "2", value: "BIMENSUAL" },
  { id: "3", value: "TRIMESTRAL" },
  { id: "4", value: "SEMESTRAL" },
  { id: "5", value: "ANUAL" },
  { id: "8", value: "AL VENCIMIENTO" },
  { id: "9", value: "FONDO REVOLVENTE" }
];

// Helper function to get capital amortization by ID
export const getCapitalAmortizationById = (id: string): CapitalAmortization | undefined => {
  return capitalAmortizations.find(amortization => amortization.id === id);
};