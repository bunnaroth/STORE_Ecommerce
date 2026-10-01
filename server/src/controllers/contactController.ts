import { Request, Response } from 'express';
import { EmailService } from '../services/emailService.js';

export const sendContactMessageController = async (req: Request, res: Response): Promise<void> => {
  try {
    await EmailService.sendContactMessage(req.body);
    res.status(200).json({ message: 'Your message has been sent.' });
  } catch (error) {
    console.error('Contact form email delivery failed:', error);
    res.status(503).json({ error: 'Your message could not be sent right now. Please try again later.' });
  }
};