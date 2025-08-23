import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/firebase';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';

export async function GET(
  request: NextRequest,
  { params }: { params: { customerId: string } }
) {
  try {
    const { customerId } = params;

    console.log('📅 Fetching bookings for customer:', customerId);

    if (!customerId) {
      return NextResponse.json(
        { error: 'Customer ID is required' },
        { status: 400 }
      );
    }

    // Get customer's bookings from Firestore
    const bookingsRef = collection(db, 'bookings');
    const q = query(
      bookingsRef, 
      where('customerId', '==', customerId),
      orderBy('appointmentDate', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const bookings: Array<{
      id: string;
      service: string;
      barber: string;
      date: string;
      time: string;
      status: string;
      createdAt: any;
      appointmentDateTime: any;
    }> = [];

    querySnapshot.forEach((doc) => {
      const bookingData = doc.data();
      bookings.push({
        id: doc.id,
        service: bookingData.service,
        barber: bookingData.barber,
        date: bookingData.appointmentDate,
        time: bookingData.appointmentTime,
        status: bookingData.status,
        createdAt: bookingData.createdAt,
        appointmentDateTime: bookingData.appointmentDateTime
      });
    });

    console.log('✅ Found bookings:', bookings.length);

    return NextResponse.json({
      success: true,
      bookings: bookings
    });

  } catch (error) {
    console.error('❌ Failed to fetch customer bookings:', error);
    
    return NextResponse.json({
      error: 'Failed to fetch bookings',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 