import { NextRequest, NextResponse } from 'next/server';
import { getAccountDetails } from '@/lib/stripe';

export async function GET(request: NextRequest) {
  // Check if Stripe is configured
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/settings?tab=stripe&error=${encodeURIComponent('Stripe is not configured')}`
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get('account_id');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    if (error) {
      console.error('Stripe Connect error:', error, errorDescription);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/settings?tab=stripe&error=${encodeURIComponent(errorDescription || 'Connection failed')}`
      );
    }

    if (!accountId) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/settings?tab=stripe&error=${encodeURIComponent('No account ID received')}`
      );
    }

    // Get account details to verify the connection
    const account = await getAccountDetails(accountId);

    // Redirect back to settings with success and account info
    const successUrl = `${process.env.NEXT_PUBLIC_APP_URL}/settings?tab=stripe&success=true&accountId=${accountId}&chargesEnabled=${account.charges_enabled}&payoutsEnabled=${account.payouts_enabled}&detailsSubmitted=${account.details_submitted}`;
    
    return NextResponse.redirect(successUrl);

  } catch (error) {
    console.error('Stripe Connect callback error:', error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/settings?tab=stripe&error=${encodeURIComponent('Failed to complete connection')}`
    );
  }
} 