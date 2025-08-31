import nodemailer from 'nodemailer';

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export interface EmailData {
  to: string;
  from?: string;
  subject: string;
  html: string;
  text?: string;
}

export interface PasswordResetData {
  email: string;
  resetToken: string;
  resetUrl: string;
  businessName: string;
  userName: string;
}

export interface AppointmentReminderData {
  email: string;
  customerName: string;
  businessName: string;
  serviceName: string;
  appointmentDate: string;
  appointmentTime: string;
  barberName: string;
  businessAddress: string;
  businessPhone: string;
}

export interface BookingConfirmationData {
  email: string;
  customerName: string;
  businessName: string;
  serviceName: string;
  appointmentDate: string;
  appointmentTime: string;
  barberName: string;
  businessAddress: string;
  businessPhone: string;
  totalAmount: number;
  depositAmount?: number;
}

export interface WelcomeEmailData {
  email: string;
  userName: string;
  businessName: string;
  loginUrl: string;
}

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Create transporter using environment variables
    this.transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  /**
   * Send a generic email
   */
  async sendEmail(emailData: EmailData): Promise<boolean> {
    try {
      const mailOptions = {
        from: emailData.from || process.env.SMTP_FROM || 'noreply@nubarber.com',
        to: emailData.to,
        subject: emailData.subject,
        html: emailData.html,
        text: emailData.text || this.htmlToText(emailData.html),
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Email sent successfully to ${emailData.to}`);
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }

  /**
   * Send password reset email
   */
  async sendPasswordReset(data: PasswordResetData): Promise<boolean> {
    const template = this.getPasswordResetTemplate(data);
    return this.sendEmail({
      to: data.email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }

  /**
   * Send appointment reminder email
   */
  async sendAppointmentReminder(data: AppointmentReminderData): Promise<boolean> {
    const template = this.getAppointmentReminderTemplate(data);
    return this.sendEmail({
      to: data.email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }

  /**
   * Send booking confirmation email
   */
  async sendBookingConfirmation(data: BookingConfirmationData): Promise<boolean> {
    const template = this.getBookingConfirmationTemplate(data);
    return this.sendEmail({
      to: data.email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }

  /**
   * Send welcome email
   */
  async sendWelcomeEmail(data: WelcomeEmailData): Promise<boolean> {
    const template = this.getWelcomeEmailTemplate(data);
    return this.sendEmail({
      to: data.email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });
  }

  /**
   * Generate password reset email template
   */
  private getPasswordResetTemplate(data: PasswordResetData): EmailTemplate {
    const subject = `Reset Your Password - ${data.businessName}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1f2937; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
          .warning { background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 6px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${data.businessName}</h1>
            <p>Password Reset Request</p>
          </div>
          <div class="content">
            <h2>Hello ${data.userName},</h2>
            <p>We received a request to reset your password for your account at <strong>${data.businessName}</strong>.</p>
            
            <p>Click the button below to reset your password:</p>
            <a href="${data.resetUrl}" class="button">Reset Password</a>
            
            <div class="warning">
              <strong>Important:</strong> This link will expire in 1 hour for security reasons.
            </div>
            
            <p>If you didn't request this password reset, please ignore this email. Your password will remain unchanged.</p>
            
            <p>If you have any questions, please contact us.</p>
            
            <p>Best regards,<br>The ${data.businessName} Team</p>
          </div>
          <div class="footer">
            <p>This email was sent to ${data.email}</p>
            <p>&copy; ${new Date().getFullYear()} ${data.businessName}. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      Password Reset Request - ${data.businessName}
      
      Hello ${data.userName},
      
      We received a request to reset your password for your account at ${data.businessName}.
      
      Click the link below to reset your password:
      ${data.resetUrl}
      
      Important: This link will expire in 1 hour for security reasons.
      
      If you didn't request this password reset, please ignore this email.
      
      Best regards,
      The ${data.businessName} Team
    `;

    return { subject, html, text };
  }

  /**
   * Generate appointment reminder email template
   */
  private getAppointmentReminderTemplate(data: AppointmentReminderData): EmailTemplate {
    const subject = `Appointment Reminder - ${data.businessName}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Appointment Reminder</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #059669; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .appointment-details { background: white; border: 1px solid #e5e7eb; padding: 20px; border-radius: 6px; margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #f3f4f6; }
          .detail-label { font-weight: bold; color: #374151; }
          .detail-value { color: #111827; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${data.businessName}</h1>
            <p>Appointment Reminder</p>
          </div>
          <div class="content">
            <h2>Hello ${data.customerName},</h2>
            <p>This is a friendly reminder about your upcoming appointment at <strong>${data.businessName}</strong>.</p>
            
            <div class="appointment-details">
              <h3>Appointment Details</h3>
              <div class="detail-row">
                <span class="detail-label">Service:</span>
                <span class="detail-value">${data.serviceName}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Date:</span>
                <span class="detail-value">${data.appointmentDate}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Time:</span>
                <span class="detail-value">${data.appointmentTime}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Barber:</span>
                <span class="detail-value">${data.barberName}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Address:</span>
                <span class="detail-value">${data.businessAddress}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Phone:</span>
                <span class="detail-value">${data.businessPhone}</span>
              </div>
            </div>
            
            <p>Please arrive 5-10 minutes before your scheduled time.</p>
            
            <p>If you need to reschedule or cancel, please contact us as soon as possible.</p>
            
            <p>We look forward to seeing you!</p>
            
            <p>Best regards,<br>The ${data.businessName} Team</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} ${data.businessName}. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      Appointment Reminder - ${data.businessName}
      
      Hello ${data.customerName},
      
      This is a friendly reminder about your upcoming appointment at ${data.businessName}.
      
      Appointment Details:
      - Service: ${data.serviceName}
      - Date: ${data.appointmentDate}
      - Time: ${data.appointmentTime}
      - Barber: ${data.barberName}
      - Address: ${data.businessAddress}
      - Phone: ${data.businessPhone}
      
      Please arrive 5-10 minutes before your scheduled time.
      
      We look forward to seeing you!
      
      Best regards,
      The ${data.businessName} Team
    `;

    return { subject, html, text };
  }

  /**
   * Generate booking confirmation email template
   */
  private getBookingConfirmationTemplate(data: BookingConfirmationData): EmailTemplate {
    const subject = `Booking Confirmation - ${data.businessName}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Booking Confirmation</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #3b82f6; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .appointment-details { background: white; border: 1px solid #e5e7eb; padding: 20px; border-radius: 6px; margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #f3f4f6; }
          .detail-label { font-weight: bold; color: #374151; }
          .detail-value { color: #111827; }
          .payment-info { background: #f0f9ff; border: 1px solid #0ea5e9; padding: 15px; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${data.businessName}</h1>
            <p>Booking Confirmation</p>
          </div>
          <div class="content">
            <h2>Hello ${data.customerName},</h2>
            <p>Thank you for booking with <strong>${data.businessName}</strong>! Your appointment has been confirmed.</p>
            
            <div class="appointment-details">
              <h3>Appointment Details</h3>
              <div class="detail-row">
                <span class="detail-label">Service:</span>
                <span class="detail-value">${data.serviceName}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Date:</span>
                <span class="detail-value">${data.appointmentDate}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Time:</span>
                <span class="detail-value">${data.appointmentTime}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Barber:</span>
                <span class="detail-value">${data.barberName}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Address:</span>
                <span class="detail-value">${data.businessAddress}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Phone:</span>
                <span class="detail-value">${data.businessPhone}</span>
              </div>
            </div>
            
            <div class="payment-info">
              <h4>Payment Information</h4>
              <div class="detail-row">
                <span class="detail-label">Total Amount:</span>
                <span class="detail-value">$${data.totalAmount.toFixed(2)}</span>
              </div>
              ${data.depositAmount ? `
              <div class="detail-row">
                <span class="detail-label">Deposit Paid:</span>
                <span class="detail-value">$${data.depositAmount.toFixed(2)}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Remaining Balance:</span>
                <span class="detail-value">$${(data.totalAmount - data.depositAmount).toFixed(2)}</span>
              </div>
              ` : ''}
            </div>
            
            <p>Please arrive 5-10 minutes before your scheduled time.</p>
            
            <p>If you need to reschedule or cancel, please contact us at least 24 hours in advance.</p>
            
            <p>We look forward to seeing you!</p>
            
            <p>Best regards,<br>The ${data.businessName} Team</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} ${data.businessName}. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      Booking Confirmation - ${data.businessName}
      
      Hello ${data.customerName},
      
      Thank you for booking with ${data.businessName}! Your appointment has been confirmed.
      
      Appointment Details:
      - Service: ${data.serviceName}
      - Date: ${data.appointmentDate}
      - Time: ${data.appointmentTime}
      - Barber: ${data.barberName}
      - Address: ${data.businessAddress}
      - Phone: ${data.businessPhone}
      
      Payment Information:
      - Total Amount: $${data.totalAmount.toFixed(2)}
      ${data.depositAmount ? `
      - Deposit Paid: $${data.depositAmount.toFixed(2)}
      - Remaining Balance: $${(data.totalAmount - data.depositAmount).toFixed(2)}
      ` : ''}
      
      Please arrive 5-10 minutes before your scheduled time.
      
      We look forward to seeing you!
      
      Best regards,
      The ${data.businessName} Team
    `;

    return { subject, html, text };
  }

  /**
   * Generate welcome email template
   */
  private getWelcomeEmailTemplate(data: WelcomeEmailData): EmailTemplate {
    const subject = `Welcome to ${data.businessName}!`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #8b5cf6; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #8b5cf6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${data.businessName}</h1>
            <p>Welcome to Our Platform!</p>
          </div>
          <div class="content">
            <h2>Hello ${data.userName},</h2>
            <p>Welcome to <strong>${data.businessName}</strong>! We're excited to have you on board.</p>
            
            <p>Your account has been successfully created and you can now:</p>
            <ul>
              <li>Access your dashboard</li>
              <li>Manage your business settings</li>
              <li>View and manage bookings</li>
              <li>Connect with customers</li>
            </ul>
            
            <p>Click the button below to access your account:</p>
            <a href="${data.loginUrl}" class="button">Access Your Account</a>
            
            <p>If you have any questions or need assistance, please don't hesitate to contact us.</p>
            
            <p>Welcome aboard!</p>
            
            <p>Best regards,<br>The ${data.businessName} Team</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} ${data.businessName}. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      Welcome to ${data.businessName}!
      
      Hello ${data.userName},
      
      Welcome to ${data.businessName}! We're excited to have you on board.
      
      Your account has been successfully created and you can now:
      - Access your dashboard
      - Manage your business settings
      - View and manage bookings
      - Connect with customers
      
      Access your account here: ${data.loginUrl}
      
      Welcome aboard!
      
      Best regards,
      The ${data.businessName} Team
    `;

    return { subject, html, text };
  }

  /**
   * Convert HTML to plain text
   */
  private htmlToText(html: string): string {
    return html
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .trim();
  }
} 