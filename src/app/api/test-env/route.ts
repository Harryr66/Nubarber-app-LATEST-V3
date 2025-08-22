import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const envCheck = {
      NEXT_PUBLIC_FIREBASE_API_KEY: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: !!process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: !!process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      NEXT_PUBLIC_FIREBASE_APP_ID: !!process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      JWT_SECRET: !!process.env.JWT_SECRET
    };

    const criticalVars = [
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
    ];

    const allCriticalVarsPresent = criticalVars.every(v => !!v);

    return NextResponse.json({
      status: allCriticalVarsPresent ? 'ready' : 'missing_vars',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      critical: allCriticalVarsPresent ? '✅ READY' : '❌ MISSING',
      environmentVariables: envCheck,
      message: allCriticalVarsPresent
        ? 'Firebase environment variables are properly configured'
        : 'Some critical Firebase environment variables are missing'
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 