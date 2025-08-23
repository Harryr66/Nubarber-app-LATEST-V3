import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/firebase';
import { doc, getDoc, collection, query, where, orderBy, getDocs } from 'firebase/firestore';

export async function GET(
  request: NextRequest,
  { params }: { params: { customerId: string } }
) {
  try {
    const { customerId } = params;

    console.log('👤 Fetching customer details:', customerId);

    if (!customerId) {
      return NextResponse.json(
        { error: 'Customer ID is required' },
        { status: 400 }
      );
    }

    // Get customer details
    const customerRef = doc(db, 'customers', customerId);
    const customerSnap = await getDoc(customerRef);

    if (!customerSnap.exists()) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    const customerData = customerSnap.data();

    // Get customer's bookings
    const bookingsRef = collection(db, 'bookings');
    const q = query(
      bookingsRef, 
      where('customerId', '==', customerId),
      orderBy('appointmentDateTime', 'desc')
    );
    
    const bookingsSnapshot = await getDocs(q);
    const bookings: Array<{
      id: string;
      serviceName: string;
      barberName: string;
      appointmentDate: string;
      appointmentTime: string;
      status: string;
      createdAt: any;
    }> = [];

    bookingsSnapshot.forEach((doc) => {
      const bookingData = doc.data();
      bookings.push({
        id: doc.id,
        serviceName: bookingData.serviceName,
        barberName: bookingData.barberName,
        appointmentDate: bookingData.appointmentDate,
        appointmentTime: bookingData.appointmentTime,
        status: bookingData.status,
        createdAt: bookingData.createdAt
      });
    });

    console.log('✅ Found customer with bookings:', bookings.length);

    return NextResponse.json({
      success: true,
      customer: {
        id: customerSnap.id,
        email: customerData.email,
        createdAt: customerData.createdAt,
        isActive: customerData.isActive,
        lastLogin: customerData.lastLogin || null,
        totalBookings: bookings.length,
        totalSpent: bookings.reduce((total, booking) => {
          // This would need to be calculated based on service prices
          return total + 0; // Placeholder for now
        }, 0)
      },
      bookings: bookings
    });

  } catch (error) {
    console.error('❌ Failed to fetch customer details:', error);
    
    return NextResponse.json({
      error: 'Failed to fetch customer details',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 