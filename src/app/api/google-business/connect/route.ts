import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';

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

    // For now, we'll create a mock profile since we don't have the actual Google API integration
    // In production, you would use the Google My Business API to fetch real data
    const mockProfile = {
      id: businessProfileId,
      name: "Harry's Barbers", // This would come from Google API
      address: "123 Main Street, London, UK",
      phone: "+44 20 1234 5678",
      website: "https://harrysbarbers.com",
      rating: 4.8,
      reviewCount: 127,
      reviews: [
        {
          id: "1",
          author: "Sarah M.",
          rating: 5,
          comment: "Excellent service, very professional! Will definitely return.",
          date: "2024-01-15",
          profilePhoto: "https://via.placeholder.com/32x32"
        },
        {
          id: "2",
          author: "James L.",
          rating: 5,
          comment: "Great haircut, friendly staff. Highly recommend!",
          date: "2024-01-14",
          profilePhoto: "https://via.placeholder.com/32x32"
        },
        {
          id: "3",
          author: "Mike R.",
          rating: 4,
          comment: "Good experience overall. Clean cuts and good atmosphere.",
          date: "2024-01-13",
          profilePhoto: "https://via.placeholder.com/32x32"
        },
        {
          id: "4",
          author: "Emma T.",
          rating: 5,
          comment: "Best barber in town! Always does an amazing job.",
          date: "2024-01-12",
          profilePhoto: "https://via.placeholder.com/32x32"
        },
        {
          id: "5",
          author: "David K.",
          rating: 5,
          comment: "Professional service and great conversation. 10/10!",
          date: "2024-01-11",
          profilePhoto: "https://via.placeholder.com/32x32"
        }
      ],
      hours: {
        "Monday": "9:00 AM - 6:00 PM",
        "Tuesday": "9:00 AM - 6:00 PM",
        "Wednesday": "9:00 AM - 6:00 PM",
        "Thursday": "9:00 AM - 6:00 PM",
        "Friday": "9:00 AM - 6:00 PM",
        "Saturday": "9:00 AM - 4:00 PM",
        "Sunday": "Closed"
      },
      photos: [
        "https://via.placeholder.com/400x300",
        "https://via.placeholder.com/400x300",
        "https://via.placeholder.com/400x300"
      ]
    };

    // Save the connection to Firestore
    const connectionRef = doc(db, 'googleBusinessConnections', businessId);
    await setDoc(connectionRef, {
      businessId,
      businessProfileId,
      apiKey: apiKey || '',
      isConnected: true,
      connectedAt: new Date(),
      profile: mockProfile
    });

    return NextResponse.json({
      success: true,
      message: 'Successfully connected to Google My Business',
      profile: mockProfile
    });

  } catch (error) {
    console.error('Error connecting to Google My Business:', error);
    return NextResponse.json(
      { error: 'Failed to connect to Google My Business' },
      { status: 500 }
    );
  }
} 