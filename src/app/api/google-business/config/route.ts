import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

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

    // Get Google Business config from Firestore
    const configRef = doc(db, 'googleBusinessConfig', businessId);
    const configSnap = await getDoc(configRef);

    if (configSnap.exists()) {
      const config = configSnap.data();
      return NextResponse.json({
        success: true,
        ...config
      });
    } else {
      // Return default config if none exists
      return NextResponse.json({
        success: true,
        businessId,
        isConnected: false,
        businessProfileId: '',
        apiKey: '',
        showReviews: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

  } catch (error) {
    console.error('Error fetching Google Business config:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Google Business config' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { businessId, businessProfileId, apiKey } = body;

    if (!businessId || !businessProfileId) {
      return NextResponse.json(
        { error: 'Business ID and Business Profile ID are required' },
        { status: 400 }
      );
    }

    const config = {
      businessId,
      businessProfileId,
      apiKey: apiKey || '',
      isConnected: true,
      showReviews: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Save to Firestore
    const configRef = doc(db, 'googleBusinessConfig', businessId);
    await setDoc(configRef, config);

    return NextResponse.json({
      success: true,
      message: 'Google Business config saved successfully',
      config
    });

  } catch (error) {
    console.error('Error saving Google Business config:', error);
    return NextResponse.json(
      { error: 'Failed to save Google Business config' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { businessId, showReviews } = body;

    if (!businessId) {
      return NextResponse.json(
        { error: 'Business ID is required' },
        { status: 400 }
      );
    }

    // Update config in Firestore
    const configRef = doc(db, 'googleBusinessConfig', businessId);
    await updateDoc(configRef, {
      showReviews,
      updatedAt: new Date()
    });

    return NextResponse.json({
      success: true,
      message: 'Google Business config updated successfully'
    });

  } catch (error) {
    console.error('Error updating Google Business config:', error);
    return NextResponse.json(
      { error: 'Failed to update Google Business config' },
      { status: 500 }
    );
  }
} 