import { NextRequest, NextResponse } from 'next/server';
import { EmailService } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      email,
      customerName,
      businessName,
      serviceName,
      appointmentDate,
      appointmentTime,
      barberName,
      businessAddress,
      businessPhone,
      totalAmount,
      depositAmount
    } = body;

    // Validate required fields
    if (!email || !customerName || !businessName || !serviceName || !appointmentDate || !appointmentTime || !totalAmount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Send booking confirmation email
    const emailService = new EmailService();
    const emailSent = await emailService.sendBookingConfirmation({
      email,
      customerName,
      businessName,
      serviceName,
      appointmentDate,
      appointmentTime,
      barberName: barberName || 'Your Barber',
      businessAddress: businessAddress || 'Business Address',
      businessPhone: businessPhone || 'Business Phone',
      totalAmount: parseFloat(totalAmount),
      depositAmount: depositAmount ? parseFloat(depositAmount) : undefined
    });

    if (emailSent) {
      return NextResponse.json({
        success: true,
        message: 'Booking confirmation email sent successfully'
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to send booking confirmation email' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error sending booking confirmation email:', error);
    return NextResponse.json(
      { error: 'An error occurred while sending the email' },
      { status: 500 }
    );
  }
} 