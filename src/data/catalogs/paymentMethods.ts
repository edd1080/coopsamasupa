export interface PaymentMethod {
  id: string;
  value: string;
}

export const paymentMethods: PaymentMethod[] = [
  { id: "1", value: "DECRECIENTE" },
  { id: "2", value: "NIVELADA" }
];

// Helper function to get payment method by ID
export const getPaymentMethodById = (id: string): PaymentMethod | undefined => {
  return paymentMethods.find(method => method.id === id);
};