import nodemailer from 'nodemailer';

interface ContactMessage {
  name: string;
  email: string;
  topic: string;
  message: string;
}

export class EmailService {
  static async sendContactMessage({ name, email, topic, message }: ContactMessage): Promise<void> {
    const host = process.env.SMTP_HOST || process.env.EMAIL_HOST;
    const from = process.env.SMTP_FROM || process.env.EMAIL_FROM;
    const to = process.env.CONTACT_EMAIL_TO || process.env.EMAIL_TO;
    const user = process.env.SMTP_USER || process.env.EMAIL_USER;
    const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS;
    const port = Number.parseInt(process.env.SMTP_PORT || process.env.EMAIL_PORT || '587', 10);

    if (!host || !from || !to || !Number.isInteger(port) || port < 1 || port > 65535 || Boolean(user) !== Boolean(pass)) {
      throw new Error('Contact email SMTP settings are incomplete.');
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: user && pass ? { user, pass } : undefined,
    });

    await transporter.sendMail({
      from,
      to,
      replyTo: { name, address: email },
      subject: `Contact form: ${topic}`,
      text: `Name: ${name}\nEmail: ${email}\nTopic: ${topic}\n\n${message}`,
    });
  }
}