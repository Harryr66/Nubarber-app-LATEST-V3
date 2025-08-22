import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check environment variables
    const envCheck = {
      firebase: {
        apiKey: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        projectId: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        authDomain: !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
      },
      stripe: {
        secretKey: !!process.env.STRIPE_SECRET_KEY,
        publishableKey: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
        webhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET
      },
      jwt: {
        secret: !!process.env.JWT_SECRET
      }
    };

    // Check if all critical env vars are present
    const criticalVars = [
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      process.env.JWT_SECRET
    ];

    const allCriticalVarsPresent = criticalVars.every(v => !!v);

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      critical: allCriticalVarsPresent ? '✅ READY' : '❌ MISSING',
      environmentVariables: envCheck,
      message: allCriticalVarsPresent 
        ? 'NuBarber is ready for production!' 
        : 'Some environment variables are missing'
    });

  } catch (error) {
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 