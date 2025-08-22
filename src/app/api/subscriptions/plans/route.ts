import { NextRequest, NextResponse } from 'next/server';
import { SUBSCRIPTION_PLANS } from '@/lib/stripe';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const region = searchParams.get('region') || 'US';

    // Validate region
    const validRegions = ['US', 'UK', 'CA', 'AU', 'EU'];
    if (!validRegions.includes(region)) {
      return NextResponse.json(
        { error: 'Invalid region. Must be one of: US, UK, CA, AU, EU' },
        { status: 400 }
      );
    }

    // Get plans with regional pricing
    const plans = SUBSCRIPTION_PLANS.map(plan => ({
      id: plan.id,
      name: plan.name,
      description: plan.description,
      features: plan.features,
      price: plan.prices[region] || plan.prices['US']
    }));

    return NextResponse.json({
      region,
      plans,
      currency: plans[0]?.price.currency || 'USD'
    });

  } catch (error) {
    console.error('Error fetching subscription plans:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscription plans' },
      { status: 500 }
    );
  }
} 