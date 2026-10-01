import { IRawCartItem } from './cart.js';

export interface ICheckoutSessionPayload {
  shippingAddressId: number;
  items: {
    productId: number;
    quantity: number;
  }[];
}

export interface IRawPaymentResponse {
  url: string;
}

export class PaymentSessionModel {
  public readonly checkoutUrl: string;

  constructor(raw: IRawPaymentResponse) {
    if (!raw.url) {
      throw new Error('Payment Session Initialization Failed: Missing secure checkout URL anchor.');
    }
    this.checkoutUrl = raw.url;
  }

  public redirectToStripe(): void {
    window.location.href = this.checkoutUrl;
  }
}
