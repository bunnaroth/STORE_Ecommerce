import { Request, Response } from "express";
import { stripe} from '../config/payment.js'; 
import { StripeService} from '../services/stripeService.js'; 
import { OrderModel } from "../models/Order.js";
import { CartModel } from "../models/Cart.js";
import { ProductModel } from "../models/Product.js";
import { UserModel } from '../models/User.js';
import { EmailService } from '../services/emailService.js';

export const checkoutSessionController = async (req: Request, res: Response): Promise<void> => { 
    try { 
        const userId = req.user!.id; 
        const { shippingAddressId, items} = req.body; 

        if (!shippingAddressId || !items || !Array.isArray(items) || items.length === 0) { 
            res.status(400).json({error: 'Payload missing required shiipingAddressId or items.'})
            return;
        }

        const session = await StripeService.createCheckoutSession(userId, parseInt(shippingAddressId, 10), items); 

        res.status(200).json({url: session.url});
    } catch (error: any) { 
        res.status(400).json({error: error.message});
    }
};

export const stripeWebhookController = async (req: Request, res: Response): Promise<void> => { 
    const sig = req.headers['strip-signature']; 
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    // Enforce structural boundary safegaurd before running validation porcesses
    if (!sig || !req.rawBody || !webhookSecret) { 
        res.status(400).send('Webhook parsing aborted.');
        return;
    }
    let event;

    try { 
        event = stripe.webhooks.constructEvent(req.rawBody, sig, webhookSecret); 
    } catch (err: any) { 
        console.error(`Webhook cryptographic validation error: ${err.message}`); 
        res.status(400).json(`Signature verification failed: $${err.message}`); 
        return; 
    }

    // Handle the target payment confirmation 
    if (event.type === 'checkout.session.completed') { 
        const session = event.data.object as any; 

        // Extract custom tracking tokens 
        const userId = parseInt(session.metadata.userId, 10); 
        const shippingAddressId = parseInt(session.metadata.shippingAddressId, 10); 
        const cartItems = JSON.parse(session.metadata.cartItemsJson); 
        const totalAmount = session.amount_total / 100; // from cents to dollars

        try { 
            const orderItems = [];

            for (const item of cartItems) { 
                const product = await ProductModel.findById(item.productId); 

                if (!product) continue; 

                await ProductModel.updateStock(item.productId, -item.quantity);

                orderItems.push({ 
                    productId: item.productId, 
                    quantity: item.quantity, 
                    priceAtPurchase: product.price,
                });
            }

            // write order history invoice
            const orderId = await OrderModel.createOrder({
                userId,
                shippingAddressId,
                totalAmount, 
                stripeSessionId: session.id, 
                items: orderItems,
            });

            const userRow = await UserModel.findById(userId);
            if (userRow) {
                const invoiceItems = orderItems.map(oi => ({
                    name: 'Storefront Item',
                    quantity: oi.quantity,
                    price: oi.priceAtPurchase,
                }));
                await EmailService.sendOrderConfirmation(userRow.email, orderId, totalAmount, invoiceItems);
            }

            // flip order status to paid
            const queryText = `UPDATE orders SET status = 'paid' WHERE stripe_session_id = $1;`; 
            const { db } = await import('../config/db.js'); 
            await db.query(queryText, [session.id]); 

            await CartModel.clearCart(userId); 

            res.status(200).json({received: true, fulfilled: true});
        } catch (dbError) { 
            console.error('Critical database fulfillment erorr: ', dbError); 
            res.status(500).send('Internal data system fulfillment execution faults.');
        }
    } else { 
        res.status(200).json({received: true});
    }
};
