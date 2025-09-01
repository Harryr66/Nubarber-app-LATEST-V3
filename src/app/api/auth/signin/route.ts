import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    console.log('🔐 Signin attempt for:', email);

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Simple hardcoded test user - no database access needed
    const testUser = {
      id: 'test-user-123',
      email: 'test@example.com',
      shopName: 'Test Barbershop',
      locationType: 'physical',
      businessAddress: '123 Test Street',
      staffCount: 1,
      region: 'US',
      currency: 'USD',
      timezone: 'UTC',
      isActive: true,
      createdAt: new Date().toISOString()
    };

    // Accept any email/password for testing
    console.log('✅ Test sign-in successful for:', email);

    // Create JWT token
    const token = jwt.sign(
      { 
        userId: testUser.id, 
        email: testUser.email,
        shopName: testUser.shopName,
        region: testUser.region
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('✅ JWT token created for user:', testUser.id);

    // Set JWT token in HTTP-only cookie
    const response = NextResponse.json({
      message: 'Sign in successful',
      user: testUser
    });

    // Set the JWT token in an HTTP-only cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 // 24 hours
    });

    return response;

  } catch (error) {
    console.error('❌ Signin failed:', error);
    
    let errorMessage = 'Sign in failed';
    
    if (error instanceof Error) {
      errorMessage = `Sign in failed: ${error.message}`;
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 401 }
    );
  }
} 