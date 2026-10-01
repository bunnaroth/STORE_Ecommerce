export interface CheckoutLineItem {
  productId: number;
  quantity: number;
}

export interface CheckoutPayload {
  shippingAddressId: number;
  items: CheckoutLineItem[];
}
