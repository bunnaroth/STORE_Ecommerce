import { stripe } from '../config/payment.js'; 
import { ProductModel } from '../models/Product.js';
import type { CheckoutLineItem } from '../middleware/errorMiddleware.js';

export class StripeService { 
    
    static async createCheckoutSession( 
        userId: number, 
        shippingAddressId: number, 
        items: CheckoutLineItem[]
    ) { 
        const lineItems = []; 

        for (const item of items) { 
            const product = await ProductModel.findById(item.productId); 

            if (!product) { 
                throw new Error('Checkout failed.');
            }

            if (product.stock < item.quantity) { 
                throw new Error('Checkout failed.')
            }

            lineItems.push({ 
                price_data: { 
                    currency: 'usd', 
                    product_data: { 
                        name: product.name, 
                        description: product.description || undefined, 
                        images: product.images, 
                        metadata: { 
                            productId: product.id.toString()
                        },
                    },

                    unit_amount: Math.round(product.price * 100), 
                }, 
                quantity: item.quantity, 
            });
        }

        // Initialize the checkout configuration layout
        const session = await stripe.checkout.sessions.create({ 
            payment_method_types: ['card'], 
            mode: 'payment', 
            line_items: lineItems, 

            // Stripe will redirect users here when the flow finishes 
            success_url: `${process.env.CLIENT_URL || 'http://localhost:5174'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL || 'http://localhost:5174'}/cart`, 
            metadata: { 
                userId: userId.toString(), 
                shippingAddressId: shippingAddressId.toString(), 
                // Metadata values must be simple string keys
                cartItemsJson: JSON.stringify(
                    items.map(i => ({ 
                        productId: i.productId, quantity: i.quantity
                    }))
                ),
            },
        });

        return session;
    }
}