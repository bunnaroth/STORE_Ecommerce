import { Request, Response, NextFunction } from 'express';

const validTopics = new Set(['Order question', 'Product question', 'Returns', 'Other']);
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateContactMessage = (req: Request, res: Response, next: NextFunction): void => {
  const { name, email, topic, message } = req.body ?? {};

  if (
    typeof name !== 'string' ||
    typeof email !== 'string' ||
    typeof topic !== 'string' ||
    typeof message !== 'string'
  ) {
    res.status(400).json({ error: 'Please provide your name, email, topic, and message.' });
    return;
  }

  const normalizedName = name.trim();
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedMessage = message.trim();

  if (!normalizedName || normalizedName.length > 100) {
    res.status(400).json({ error: 'Name must be between 1 and 100 characters.' });
    return;
  }

  if (normalizedEmail.length > 254 || !emailPattern.test(normalizedEmail)) {
    res.status(400).json({ error: 'Please provide a valid email address.' });
    return;
  }

  if (!validTopics.has(topic)) {
    res.status(400).json({ error: 'Please select a valid topic.' });
    return;
  }

  if (!normalizedMessage || normalizedMessage.length > 5000) {
    res.status(400).json({ error: 'Message must be between 1 and 5000 characters.' });
    return;
  }

  req.body = { name: normalizedName, email: normalizedEmail, topic, message: normalizedMessage };
  next();
};