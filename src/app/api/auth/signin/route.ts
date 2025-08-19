import { NextRequest, NextResponse } from 'next/server';

// In production, you would use a proper database and authentication service
// This is a simplified example - replace with your actual auth logic

interface SignInRequest {
  email: string;
  password: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: SignInRequest = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // In production, you would:
    // 1. Hash the password and compare with stored hash
    // 2. Check against your user database
    // 3. Implement rate limiting
    // 4. Add JWT token generation
    // 5. Log authentication attempts

    // For demo purposes, we'll simulate a successful login
    // Replace this with your actual authentication logic
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock user data - replace with actual user lookup
    const mockUser = {
      id: 'user_123',
      email: email,
      shopName: 'Demo Barbershop',
      role: 'owner'
    };

    return NextResponse.json({
      success: true,
      user: mockUser,
      message: 'Authentication successful'
    });

  } catch (error) {
    console.error('Sign in error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 