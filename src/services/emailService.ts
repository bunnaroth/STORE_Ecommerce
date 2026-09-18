import nodemailer from 'nodemailer';

export class EmailService {
  
  private static getTransport() {
    
    const host = process.env.EMAIL_HOST || 'smtp.mailtrap.io';
    const port = parseInt(process.env.EMAIL_PORT || '2525', 10);
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;

    return nodemailer.createTransport({
      host,
      port,
      auth: user && pass ? { user, pass } : undefined,
    });
  }

  
  static async sendOrderConfirmation(
    toEmail: string,
    orderId: number,
    totalAmount: number,
    items: { name: string; quantity: number; price: number }[]
  ): Promise<boolean> {
    try {
      const transporter = this.getTransport();

      const itemsListHtml = items
        .map(item => `<li><strong>${item.name}</strong> x ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}</li>`)
        .join('');

      const mailOptions = {
        from: `"E-Commerce" <${process.env.EMAIL_FROM || 'noreply@yourstore.com'}>`,
        to: toEmail.toLowerCase().trim(),
        subject: `Invoice Receipt for Order #${orderId} Confirmed!`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #333;">
            <h2>Thank you for your purchase, dude!</h2>
            <p>Your transaction went through perfectly. We are currently processing your package rules.</p>
            <hr style="border: 0; border-top: 1px solid #eee;" />
            <h3>Order Summary (ID: #${orderId})</h3>
            <ul>
              ${itemsListHtml}
            </ul>
            <p style="font-size: 16px; margin-top: 15px;"><strong>Total Amount Settled: $${totalAmount.toFixed(2)}</strong></p>
            <hr style="border: 0; border-top: 1px solid #eee;" />
            <p style="color: #666; font-size: 12px;">If you have any questions, simply contact support tracking rails.</p>
          </div>
        `,
      };

      const info = await transporter.sendMail(mailOptions);
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`✉️ Transaction receipt sent successfully to ${toEmail}. Message ID: ${info.messageId}`);
      }
      return true;
    } catch (error) {
      console.error('Critical Notification Fault: Email delivery failed:', error);
      return false;
    }
  }
}
