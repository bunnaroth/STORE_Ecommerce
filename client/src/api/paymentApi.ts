import { ICheckoutSessionPayload, IRawPaymentResponse, PaymentSessionModel } from '../types/payment.js';
import { API_BASE_URL } from './config.js';

const BASE_URL = `${API_BASE_URL}/payment`;

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
};

export const paymentApi = {
  confirmCheckoutSession: async (sessionId: string): Promise<{ paid: boolean }> => {
    const response = await fetch(`${BASE_URL}/confirm-session`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ sessionId }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Stripe payment confirmation failed: HTTP ${response.status}`);
    }

    return data as { paid: boolean };
  },

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
