import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId');

    if (!businessId) {
      return NextResponse.json(
        { error: 'Business ID is required' },
        { status: 400 }
      );
    }

    // Get the connection from Firestore
    const connectionRef = doc(db, 'googleBusinessConnections', businessId);
    const connectionSnap = await getDoc(connectionRef);

    if (!connectionSnap.exists()) {
      return NextResponse.json(
        { error: 'Google My Business not connected' },
        { status: 404 }
      );
    }

    const connection = connectionSnap.data();
    
    if (!connection.isConnected) {
      return NextResponse.json(
        { error: 'Google My Business not connected' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      profile: connection.profile
    });

  } catch (error) {
    console.error('Error fetching Google Business profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Google Business profile' },
      { status: 500 }
    );
  }
} 