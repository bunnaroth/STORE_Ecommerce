import { Request, Response} from 'express'; 
import { OrderService } from '../services/orderService.js';
import { OrderModel } from '../models/Order.js';

export const createOrderController = async (req: Request, res: Response): Promise<void> => { 
    try { 
        const userId = (req as any).user.id;
        const { shippingAddressId, items, totalAmount } = req.body; 

        if (!shippingAddressId || !items || !totalAmount) { 
            res.status(400).json({error: 'Payload missing critical shipping, item matrix, or total parameters.'}); 
            return; 
        }

        const orderId = await OrderService.processOrder(userId, parseInt(shippingAddressId, 10), items, parseFloat(totalAmount)); 
        res.status(201).json({message: 'Order created successfully.', orderId}); 
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
}; 

export const getUserOrdersController = async (req: Request, res: Response): Promise<void> => { 
    try { 
        const userId = (req as any).user.id; 
        const orders = await OrderService.getUserOrderHistory(userId);
        res.status(200).json(orders);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const updateOrderStatusController = async (req: Request, res: Response): Promise<void> => { 
    try { 
        
        const orderIdParam = req.params.id;
        const orderId = parseInt(Array.isArray(orderIdParam) ? orderIdParam[0] : orderIdParam);
        
        const { status: targetStatus} = req.body; 
        const userRole = ( req as any).user.role; 

        if (isNaN(orderId) || !targetStatus) { 
            res.status(400).json({error: 'Missing order reference parameters.'}); 
            return; 
        }

        const querytext = `SELECT  status FROM orders WHERE id = $1;`; 
        const { db } = await import ('../config/db.js'); 
        const { rows } = await db.query(querytext, [orderId]); 

        if (rows.length === 0) { 
            res.status(404).json({ error: 'Target order record not found.' }); 
            return;
        }

        const currentStatus = rows[0].status; 

        await OrderService.transitionStatus(orderId, currentStatus, targetStatus, userRole); 
        res.status(200).json({ message: `Order status transitioned to ${targetStatus}`}); 
    } catch ( error: any) { 
        const statusCode = error.message.includes('Access Denied') ? 403 : 400; 
        res.status(statusCode).json({error: error.message});
    }
}; 