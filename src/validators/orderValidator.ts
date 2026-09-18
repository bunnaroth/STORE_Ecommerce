import { Request, Response, NextFunction } from 'express';

export const validateOrderInput = (req: Request, res: Response, next: NextFunction): void => {
  const { shippingAddressId, items, totalAmount } = req.body;

  if (!shippingAddressId || !items || !totalAmount) {
    res.status(400).json({ error: 'Validation failed: Missing structural order layout properties.' });
    return;
  }

  if (!Array.isArray(items) || items.length === 0) {
    res.status(400).json({ error: 'Validation failed: Items parameter structure must be a populated array.' });
    return;
  }

  for (const item of items) {
    if (!item.productId || !item.quantity || !item.price) {
      res.status(400).json({ error: 'Validation failed: Malformed internal line item element tracking keys.' });
      return;
    }
  }

  next();
};
