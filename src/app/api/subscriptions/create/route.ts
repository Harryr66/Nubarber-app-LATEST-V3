import { NextRequest, NextResponse } from 'next/server';
import { StripeService } from '@/lib/stripe';
import { FirestoreService } from '@/lib/firestore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { planId, region, customerId, userId } = body;

    // Validate required fields
    if (!planId || !region || !customerId || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields: planId, region, customerId, userId' },
        { status: 400 }
      );
    }

    // Validate region
    const validRegions = ['US', 'UK', 'CA', 'AU', 'EU'];
    if (!validRegions.includes(region)) {
      return NextResponse.json(
        { error: 'Invalid region. Must be one of: US, UK, CA, AU, EU' },
        { status: 400 }
      );
    }

    // Create subscription in Stripe
    const subscription = await StripeService.createSubscription(customerId, planId, region);

    // Update user in Firestore with subscription details
    await FirestoreService.createSubscription(userId, planId, subscription.subscriptionId, region);

    return NextResponse.json({
      message: 'Subscription created successfully',
      subscriptionId: subscription.subscriptionId,
      clientSecret: subscription.clientSecret,
      requiresAction: true
    });

  } catch (error) {
    console.error('Error creating subscription:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500 }
    );
  }
} 