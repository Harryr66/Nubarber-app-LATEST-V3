import { NextRequest, NextResponse } from 'next/server';
import { EmailService } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { testEmail } = body;

    if (!testEmail) {
      return NextResponse.json(
        { error: 'Test email address is required' },
        { status: 400 }
      );
    }

    // Test email service
    const emailService = new EmailService();
    
    // Send a test email
    const emailSent = await emailService.sendEmail({
      to: testEmail,
      subject: 'NuBarber Email Test',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1f2937;">✅ Email System Test Successful!</h2>
          <p>Your NuBarber email system is working correctly.</p>
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Test Details:</h3>
            <ul>
              <li>✅ SMTP connection established</li>
              <li>✅ Email sent successfully</li>
              <li>✅ Template rendering working</li>
              <li>✅ Configuration valid</li>
            </ul>
          </div>
          <p style="color: #6b7280; font-size: 14px;">
            This is a test email from your NuBarber platform. You can now send real emails to customers!
          </p>
        </div>
      `,
      text: `
        Email System Test Successful!
        
        Your NuBarber email system is working correctly.
        
        Test Details:
        - SMTP connection established
        - Email sent successfully
        - Template rendering working
        - Configuration valid
        
        This is a test email from your NuBarber platform. You can now send real emails to customers!
      `
    });

    if (emailSent) {
      return NextResponse.json({
        success: true,
        message: 'Test email sent successfully! Check your inbox.',
        details: {
          smtpHost: process.env.SMTP_HOST,
          smtpPort: process.env.SMTP_PORT,
          smtpUser: process.env.SMTP_USER,
          smtpFrom: process.env.SMTP_FROM
        }
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to send test email. Check your SMTP configuration.' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error testing email:', error);
    return NextResponse.json(
      { error: 'Email test failed. Check your configuration and try again.' },
      { status: 500 }
    );
  }
} 