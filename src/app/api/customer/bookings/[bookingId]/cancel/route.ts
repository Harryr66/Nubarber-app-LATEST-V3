import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/firebase';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { bookingId: string } }
) {
  try {
    const { bookingId } = params;

    console.log('❌ Cancelling booking:', bookingId);

    if (!bookingId) {
      return NextResponse.json(
        { error: 'Booking ID is required' },
        { status: 400 }
      );
    }

    // Get the booking details
    const bookingRef = doc(db, 'bookings', bookingId);
    const bookingSnap = await getDoc(bookingRef);

    if (!bookingSnap.exists()) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    const bookingData = bookingSnap.data();
    const appointmentDateTime = new Date(bookingData.appointmentDateTime);
    const now = new Date();
    const hoursDifference = (appointmentDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    // Check 24-hour cancellation rule
    if (hoursDifference < 24) {
      return NextResponse.json(
        { error: 'Bookings can only be cancelled at least 24 hours before the appointment' },
        { status: 400 }
      );
    }

    // Update booking status to cancelled instead of deleting
    await updateDoc(bookingRef, {
      status: 'cancelled',
      cancelledAt: new Date(),
      cancelledBy: 'customer'
    });

    console.log('✅ Booking cancelled successfully:', bookingId);

    return NextResponse.json({
      success: true,
      message: 'Booking cancelled successfully'
    });

  } catch (error) {
    console.error('❌ Failed to cancel booking:', error);
    
    return NextResponse.json({
      error: 'Failed to cancel booking',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 