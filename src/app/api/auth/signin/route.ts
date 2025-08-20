import { NextRequest, NextResponse } from 'next/server';
import { AuthService, initializeDemoUser } from '@/lib/auth';

interface SignInRequest {
  email: string;
  password: string;
}

export async function POST(request: NextRequest) {
  try {
    // Initialize demo user on first request (remove in production)
    await initializeDemoUser();

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

    // Validate password presence
    if (password.trim().length === 0) {
      return NextResponse.json(
        { message: 'Password is required' },
        { status: 400 }
      );
    }

    try {
      // Authenticate user with secure service
      const { user, token } = await AuthService.authenticateUser(email, password);

      // Set HTTP-only cookie with JWT token
      const response = NextResponse.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          shopName: user.shopName,
          role: user.role
        },
        message: 'Authentication successful'
      });

      // Set secure HTTP-only cookie
      response.cookies.set('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60, // 24 hours
        path: '/'
      });

      return response;

    } catch (authError: any) {
      // Handle specific authentication errors
      if (authError.message.includes('Invalid credentials')) {
        return NextResponse.json(
          { message: 'Invalid email or password' },
          { status: 401 }
        );
      } else if (authError.message.includes('locked')) {
        return NextResponse.json(
          { message: authError.message },
          { status: 423 } // Locked
        );
      } else {
        return NextResponse.json(
          { message: authError.message },
          { status: 401 }
        );
      }
    }

  } catch (error) {
    console.error('Sign in error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 