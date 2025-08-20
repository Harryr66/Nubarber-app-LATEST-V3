import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Get the auth token from cookies
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { message: 'No authentication token provided' },
        { status: 401 }
      );
    }
    
    try {
      // Verify the token
      const decoded = AuthService.verifyToken(token);
      
      // Get user details
      const user = AuthService.getUserById(decoded.userId);
      
      if (!user) {
        return NextResponse.json(
          { message: 'User not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          shopName: user.shopName,
          role: user.role
        }
      });
      
    } catch (tokenError: any) {
      return NextResponse.json(
        { message: tokenError.message },
        { status: 401 }
      );
    }
    
  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 