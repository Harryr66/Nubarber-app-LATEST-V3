import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/firebase';
import { doc, deleteDoc } from 'firebase/firestore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { businessId } = body;

    if (!businessId) {
      return NextResponse.json(
        { error: 'Business ID is required' },
        { status: 400 }
      );
    }

    // Remove the connection from Firestore
    const connectionRef = doc(db, 'googleBusinessConnections', businessId);
    await deleteDoc(connectionRef);

    // Also remove the config
    const configRef = doc(db, 'googleBusinessConfig', businessId);
    await deleteDoc(configRef);

    return NextResponse.json({
      success: true,
      message: 'Successfully disconnected from Google My Business'
    });

  } catch (error) {
    console.error('Error disconnecting from Google My Business:', error);
    return NextResponse.json(
      { error: 'Failed to disconnect from Google My Business' },
      { status: 500 }
    );
  }
} 