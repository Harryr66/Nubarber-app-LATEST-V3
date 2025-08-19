import { NextRequest, NextResponse } from 'next/server';

// In production, you would use a proper database and authentication service
// This is a simplified example - replace with your actual auth logic

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

    // Validate input
    if (!email || !password || !shopName) {
      return NextResponse.json(
        { message: 'Email, password, and shop name are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Password validation
    if (password.length < 8) {
      return NextResponse.json(
        { message: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    if (!/[A-Z]/.test(password)) {
      return NextResponse.json(
        { message: 'Password must contain at least one uppercase letter' },
        { status: 400 }
      );
    }

    if (!/[a-z]/.test(password)) {
      return NextResponse.json(
        { message: 'Password must contain at least one lowercase letter' },
        { status: 400 }
      );
    }

    if (!/\d/.test(password)) {
      return NextResponse.json(
        { message: 'Password must contain at least one number' },
        { status: 400 }
      );
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return NextResponse.json(
        { message: 'Password must contain at least one special character' },
        { status: 400 }
      );
    }

    // Shop name validation
    if (shopName.trim().length < 2) {
      return NextResponse.json(
        { message: 'Shop name must be at least 2 characters long' },
        { status: 400 }
      );
    }

    // Business address validation for physical locations
    if (locationType === 'physical' && (!businessAddress || businessAddress.trim().length === 0)) {
      return NextResponse.json(
        { message: 'Business address is required for physical locations' },
        { status: 400 }
      );
    }

    // Staff count validation
    if (staffCount < 1 || staffCount > 50) {
      return NextResponse.json(
        { message: 'Staff count must be between 1 and 50' },
        { status: 400 }
      );
    }

    // In production, you would:
    // 1. Check if email already exists
    // 2. Hash the password using bcrypt or similar
    // 3. Store user data in your database
    // 4. Send verification email
    // 5. Implement rate limiting
    // 6. Add JWT token generation

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock user creation - replace with actual user creation logic
    const mockUser = {
      id: 'user_' + Date.now(),
      email: email,
      shopName: shopName,
      locationType: locationType,
      businessAddress: businessAddress,
      staffCount: staffCount,
      role: 'owner',
      createdAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      user: mockUser,
      message: 'Account created successfully'
    });

  } catch (error) {
    console.error('Sign up error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 