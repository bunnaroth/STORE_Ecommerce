import { Request, Response, NextFunction } from 'express';

export const validateRegisterInput = (req: Request, res: Response, next: NextFunction): void => {
  const { email, password, firstName, lastName } = req.body;

  if (!email || !password || !firstName || !lastName) {
    res.status(400).json({ error: 'Validation failed: Missing required fields.' });
    return;
  }

  // Robust standard email structure evaluation regex matching pattern
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ error: 'Validation failed: Malformed email structure format.' });
    return;
  }

  // Enforce structural minimal length safeguards
  if (password.length < 6) {
    res.status(400).json({ error: 'Validation failed: Password length target must be at least 6 characters.' });
    return;
  }

  next();
};

export const validateLoginInput = (req: Request, res: Response, next: NextFunction): void => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'Validation failed: Missing email or password parameter strings.' });
    return;
  }

  next();
};
