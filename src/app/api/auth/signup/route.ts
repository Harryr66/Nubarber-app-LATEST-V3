import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth';

interface SignUpRequest {
  email: string;
  password: string;
  shopName: string;
  locationType: string;
  businessAddress?: string;
  staffCount: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: SignUpRequest = await request.json();
    const { email, password, shopName, locationType, businessAddress, staffCount } = body;

    // Validate required fields
    if (!email || !password || !shopName) {
      return NextResponse.json(
        { message: 'Email, password, and shop name are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { message: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Validate shop name
    if (shopName.trim().length < 2) {
      return NextResponse.json(
        { message: 'Shop name must be at least 2 characters long' },
        { status: 400 }
      );
    }

    // Validate location type and address
    if (locationType === 'physical' && !businessAddress?.trim()) {
      return NextResponse.json(
        { message: 'Business address is required for physical locations' },
        { status: 400 }
      );
    }

    // Validate staff count
    if (staffCount < 1 || staffCount > 100) {
      return NextResponse.json(
        { message: 'Staff count must be between 1 and 100' },
        { status: 400 }
      );
    }

    try {
      // Create user with secure service
      const user = await AuthService.createUser(
        email,
        password,
        shopName,
        locationType,
        businessAddress,
        staffCount
      );

      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          shopName: user.shopName,
          role: user.role,
          createdAt: user.createdAt
        },
        message: 'Account created successfully'
      });

    } catch (authError: any) {
      // Handle specific creation errors
      if (authError.message.includes('already exists')) {
        return NextResponse.json(
          { message: 'An account with this email already exists' },
          { status: 409 }
        );
      } else if (authError.message.includes('Password')) {
        return NextResponse.json(
          { message: authError.message },
          { status: 400 }
        );
      } else {
        return NextResponse.json(
          { message: authError.message },
          { status: 400 }
        );
      }
    }

  } catch (error) {
    console.error('Sign up error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
      );
  }
} 