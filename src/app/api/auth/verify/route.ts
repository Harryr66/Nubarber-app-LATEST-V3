import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { db } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

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
      // Verify the JWT token
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      
      // Get user details from Firestore
      const userRef = doc(db, 'users', decoded.userId);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        return NextResponse.json(
          { message: 'User not found' },
          { status: 404 }
        );
      }
      
      const userData = userSnap.data();
      
      return NextResponse.json({
        success: true,
        user: {
          id: decoded.userId,
          email: userData.email,
          shopName: userData.shopName,
          role: 'admin' // Default role for barbershop owners
        }
      });
      
    } catch (tokenError: any) {
      console.error('Token verification failed:', tokenError);
      return NextResponse.json(
        { message: 'Invalid or expired token' },
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