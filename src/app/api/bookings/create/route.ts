import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      customerId, 
      customerEmail, 
      serviceId, 
      serviceName, 
      barberId, 
      barberName, 
      appointmentDate, 
      appointmentTime,
      appointmentDateTime 
    } = body;

    console.log('📅 Creating new booking:', { customerId, serviceName, barberName, appointmentDate });

    // Basic validation
    if (!customerId || !serviceId || !barberId || !appointmentDate || !appointmentTime) {
      return NextResponse.json(
        { error: 'Missing required booking information' },
        { status: 400 }
      );
    }

    // Create booking data
    const bookingData = {
      customerId,
      customerEmail,
      serviceId,
      serviceName,
      barberId,
      barberName,
      appointmentDate,
      appointmentTime,
      appointmentDateTime: new Date(appointmentDateTime),
      status: 'confirmed',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    // Add booking to Firestore
    const bookingsRef = collection(db, 'bookings');
    const bookingRef = await addDoc(bookingsRef, bookingData);

    console.log('✅ Booking created successfully:', bookingRef.id);

    // Return booking confirmation
    return NextResponse.json({
      success: true,
      booking: {
        id: bookingRef.id,
        ...bookingData,
        createdAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Failed to create booking:', error);
    
    return NextResponse.json({
      error: 'Failed to create booking',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 