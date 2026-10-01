import { ICheckoutSessionPayload, IRawPaymentResponse, PaymentSessionModel } from '../types/payment.js';

const BASE_URL = 'http://localhost:5000/api/payment';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
};

export const paymentApi = {
  createCheckoutSession: async (payload: ICheckoutSessionPayload): Promise<PaymentSessionModel> => {
    const response = await fetch(`${BASE_URL}/create-session`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Stripe session initialization failed: HTTP ${response.status}`);
    }

    return new PaymentSessionModel(data as IRawPaymentResponse);
  },
};
