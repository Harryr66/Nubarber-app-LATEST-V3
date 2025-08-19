import { NextRequest, NextResponse } from 'next/server';
import { createConnectAccount, createAccountLink } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  // Check if Stripe is configured
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: 'Stripe is not configured. Please set up your environment variables.' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { email, country = 'US' } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Create a new Connect account
    const account = await createConnectAccount(email, country);

    // Create account link for onboarding
    const accountLink = await createAccountLink(
      account.id,
      `${process.env.NEXT_PUBLIC_APP_URL}/settings?tab=stripe&refresh=true`,
      `${process.env.NEXT_PUBLIC_APP_URL}/settings?tab=stripe&success=true`
    );

    return NextResponse.json({
      success: true,
      accountId: account.id,
      accountLink: accountLink.url,
      message: 'Stripe Connect account created successfully'
    });

  } catch (error: any) {
    console.error('Stripe Connect error:', error);
    
    if (error.type === 'StripeInvalidRequestError') {
      return NextResponse.json(
        { error: 'Invalid request. Please check your information.' },
        { status: 400 }
      );
    }
    
    if (error.type === 'StripeAuthenticationError') {
      return NextResponse.json(
        { error: 'Authentication failed. Please check your Stripe configuration.' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create Stripe Connect account. Please try again.' },
      { status: 500 }
    );
  }
} 