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

    // Get the Google Business connection from Firestore
    const connectionRef = doc(db, 'googleBusinessConnections', businessId);
    const connectionSnap = await getDoc(connectionRef);

    if (!connectionSnap.exists()) {
      return NextResponse.json({
        success: true,
        reviews: []
      });
    }

    const connection = connectionSnap.data();
    
    if (!connection.isConnected || !connection.profile) {
      return NextResponse.json({
        success: true,
        reviews: []
      });
    }

    // Return the reviews from the connected profile
    return NextResponse.json({
      success: true,
      reviews: connection.profile.reviews || []
    });

  } catch (error) {
    console.error('Error fetching Google reviews:', error);
    return NextResponse.json({
      success: true,
      reviews: []
    });
  }
} 