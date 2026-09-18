import { Request, Response, NextFunction } from 'express';

export const validatePaymentPayload = (req: Request, res: Response, next: NextFunction): void => {
  const { shippingAddressId, items } = req.body;

  if (!shippingAddressId || !items) {
    res.status(400).json({ error: 'Validation failed: Missing shipping destination target or product list metrics.' });
    return;
  }

  if (!Array.isArray(items) || items.length === 0) {
    res.status(400).json({ error: 'Validation failed: Checkout inventory items must be mapped inside a populated framework array.' });
    return;
  }

  for (const item of items) {
    if (!item.productId || !item.quantity) {
      res.status(400).json({ error: 'Validation failed: Missing productId or quantity tracking details within session configurations.' });
      return;
    }
  }

  next();
};
