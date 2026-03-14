// Email utility for sending transactional emails
// In production, integrate with SendGrid, Mailgun, or AWS SES

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

// In production, replace with actual email service
export async function sendEmail(options: EmailOptions) {
  const { to, subject, html } = options;
  
  // Log email for development
  console.log('=== EMAIL SENT ===');
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Body: ${html}`);
  console.log('====================');
  
  // In production, integrate with email service like SendGrid
  // const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
  //   method: 'POST',
  //   headers: {
  //     'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     personalizations: [{ to: [{ email: to }] }],
  //     from: { email: 'noreply@sapphura.com', name: 'Sapphura' },
  //     subject,
  //     content: [{ type: 'text/html', value: html }],
  //   }),
  // });
  
  return { success: true, message: 'Email logged (development mode)' };
}

// Email Templates
export function getOrderConfirmationEmail(order: {
  orderId: string;
  customerName: string;
  total: number;
  items: { name: string; quantity: number; price: number }[];
  shippingAddress: string;
}) {
  const itemsHtml = order.items
    .map(item => `<tr><td>${item.name}</td><td>${item.quantity}</td><td>$${item.price}</td></tr>`)
    .join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; background: #0a0a23; color: #fff; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #1a1a40; border-radius: 10px; padding: 30px; }
        .header { text-align: center; border-bottom: 2px solid #d4af37; padding-bottom: 20px; margin-bottom: 20px; }
        h1 { color: #d4af37; }
        .gold-text { color: #d4af37; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #d4af37/30; }
        th { color: #d4af37; }
        .total { font-size: 24px; color: #d4af37; font-weight: bold; }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #d4af37/30; color: #888; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Order Confirmed!</h1>
          <p>Thank you for shopping with <span class="gold-text">SAPPURA</span></p>
        </div>
        <p>Hi ${order.customerName},</p>
        <p>Your order has been confirmed. Here are the details:</p>
        <p><strong>Order ID:</strong> ${order.orderId}</p>
        
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Qty</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
        
        <p class="total">Total: $${order.total.toFixed(2)}</p>
        <p><strong>Shipping to:</strong> ${order.shippingAddress}</p>
        
        <p>We'll notify you once your order is shipped. You can track your order status in your account.</p>
        
        <div class="footer">
          <p>© 2024 SAPPURA - Luxury Shopping</p>
          <p>This email was sent to ${order.customerName}</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function getOTPEmail(otp: string, name: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; background: #0a0a23; color: #fff; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #1a1a40; border-radius: 10px; padding: 30px; text-align: center; }
        .otp { font-size: 40px; letter-spacing: 10px; color: #d4af37; font-weight: bold; margin: 30px 0; }
        .footer { color: #888; font-size: 12px; margin-top: 30px; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1 style="color: #d4af37;">Verify Your Email</h1>
        <p>Hi ${name},</p>
        <p>Your verification code is:</p>
        <div class="otp">${otp}</div>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <div class="footer">© 2024 SAPPURA</div>
      </div>
    </body>
    </html>
  `;
}

export function getPasswordResetEmail(resetLink: string, name: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; background: #0a0a23; color: #fff; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #1a1a40; border-radius: 10px; padding: 30px; text-align: center; }
        .button { display: inline-block; background: #d4af37; color: #0a0a23; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
        .footer { color: #888; font-size: 12px; margin-top: 30px; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1 style="color: #d4af37;">Reset Your Password</h1>
        <p>Hi ${name},</p>
        <p>Click the button below to reset your password:</p>
        <a href="${resetLink}" class="button">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <div class="footer">© 2024 SAPPURA</div>
      </div>
    </body>
    </html>
  `;
}