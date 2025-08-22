import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, shopName, locationType, businessAddress, staffCount, country } = body;

    // Validate required fields
    if (!email || !password || !shopName || !locationType || !staffCount || !country) {
      return NextResponse.json(
        { error: 'Missing required fields: email, password, shopName, locationType, staffCount, country' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Validate location type
    if (!['physical', 'mobile'].includes(locationType)) {
      return NextResponse.json(
        { error: 'Invalid location type. Must be "physical" or "mobile"' },
        { status: 400 }
      );
    }

    // Validate business address for physical locations
    if (locationType === 'physical' && (!businessAddress || businessAddress.trim().length === 0)) {
      return NextResponse.json(
        { error: 'Business address is required for physical locations' },
        { status: 400 }
      );
    }

    // Validate staff count
    if (typeof staffCount !== 'number' || staffCount < 1 || staffCount > 100) {
      return NextResponse.json(
        { error: 'Staff count must be a number between 1 and 100' },
        { status: 400 }
      );
    }

    // Validate country
    const validCountries = ['US', 'UK', 'CA', 'AU', 'EU'];
    if (!validCountries.includes(country)) {
      return NextResponse.json(
        { error: 'Invalid country code' },
        { status: 400 }
      );
    }

    console.log('Signup request body:', { email, shopName, locationType, businessAddress, staffCount, country });

    // Create user account
    const user = await AuthService.createUser(
      email,
      password,
      shopName,
      locationType,
      businessAddress,
      staffCount,
      country
    );

    console.log('Signup response status: 200, success:', { userId: user.id, email: user.email, region: user.region });

    return NextResponse.json({
      message: 'Account created successfully',
      user: {
        id: user.id,
        email: user.email,
        shopName: user.shopName,
        locationType: user.locationType,
        businessAddress: user.businessAddress,
        staffCount: user.staffCount,
        region: user.region,
        currency: user.currency,
        timezone: user.timezone,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('already exists')) {
        return NextResponse.json(
          { error: 'An account with this email already exists' },
          { status: 409 }
        );
      }
      
      if (error.message.includes('Password must be')) {
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to create account. Please try again.' },
      { status: 500 }
    );
  }
} 