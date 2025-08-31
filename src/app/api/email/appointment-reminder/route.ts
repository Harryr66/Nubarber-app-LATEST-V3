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
      businessPhone
    } = body;

    // Validate required fields
    if (!email || !customerName || !businessName || !serviceName || !appointmentDate || !appointmentTime) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Send appointment reminder email
    const emailService = new EmailService();
    const emailSent = await emailService.sendAppointmentReminder({
      email,
      customerName,
      businessName,
      serviceName,
      appointmentDate,
      appointmentTime,
      barberName: barberName || 'Your Barber',
      businessAddress: businessAddress || 'Business Address',
      businessPhone: businessPhone || 'Business Phone'
    });

    if (emailSent) {
      return NextResponse.json({
        success: true,
        message: 'Appointment reminder email sent successfully'
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to send appointment reminder email' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error sending appointment reminder email:', error);
    return NextResponse.json(
      { error: 'An error occurred while sending the email' },
      { status: 500 }
    );
  }
} 