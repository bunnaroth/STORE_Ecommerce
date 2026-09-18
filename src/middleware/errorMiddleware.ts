export interface CheckoutLineItem { 
    productId: number; 
    quantity: number; 
}

export interface CheckoutPayload { 
    shippingAddress: number; 
    items: CheckoutLineItem[]; 
}