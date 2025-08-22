import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Simple environment variable check
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✅ Set' : '❌ Missing',
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? '✅ Set' : '❌ Missing',
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? '✅ Set' : '❌ Missing'
    };

    return NextResponse.json({
      message: 'Simple Firebase Test',
      firebase: firebaseConfig,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    return NextResponse.json({
      error: 'Test failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 