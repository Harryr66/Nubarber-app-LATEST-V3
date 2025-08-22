import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Check if environment variables are set
    const config = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✅ Set' : '❌ Missing',
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? '✅ Set' : '❌ Missing',
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? '✅ Set' : '❌ Missing',
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? '✅ Set' : '❌ Missing',
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? '✅ Set' : '❌ Missing',
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? '✅ Set' : '❌ Missing',
      jwtSecret: process.env.JWT_SECRET ? '✅ Set' : '❌ Missing'
    };

    return NextResponse.json({
      message: 'Firebase Configuration Status',
      config,
      instructions: [
        '1. Create a .env.local file in your project root',
        '2. Add the Firebase configuration variables',
        '3. Restart your development server',
        '4. Test this endpoint again'
      ],
      expectedRegions: [
        'default (USA - USD)',
        'nubarber-uk (UK - GBP)', 
        'nubarber-canada (Canada - CAD)',
        'nubarber-aus (Australia - AUD)',
        'nubarber-eu (Europe - EUR)'
      ]
    });

  } catch (error) {
    return NextResponse.json({
      error: 'Failed to check configuration',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 