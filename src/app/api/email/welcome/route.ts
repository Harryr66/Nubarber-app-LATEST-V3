import { NextRequest, NextResponse } from 'next/server';
import { EmailService } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      email,
      userName,
      businessName,
      loginUrl
    } = body;

    // Validate required fields
    if (!email || !userName || !businessName || !loginUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Send welcome email
    const emailService = new EmailService();
    const emailSent = await emailService.sendWelcomeEmail({
      email,
      userName,
      businessName,
      loginUrl
    });

    if (emailSent) {
      return NextResponse.json({
        success: true,
        message: 'Welcome email sent successfully'
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to send welcome email' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error sending welcome email:', error);
    return NextResponse.json(
      { error: 'An error occurred while sending the email' },
      { status: 500 }
    );
  }
} 