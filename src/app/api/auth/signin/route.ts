import { NextRequest, NextResponse } from 'next/server';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { db } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
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

    // Authenticate with Firebase
    const auth = getAuth();
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    console.log('✅ Firebase authentication successful for:', firebaseUser.uid);

    // Get user data from Firestore
    const userRef = doc(db, 'users', firebaseUser.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      console.error('❌ User document not found in Firestore');
      return NextResponse.json(
        { error: 'User data not found' },
        { status: 404 }
      );
    }

    const userData = userSnap.data();

    // Create JWT token
    const token = jwt.sign(
      { 
        userId: firebaseUser.uid, 
        email: firebaseUser.email,
        shopName: userData.shopName,
        region: userData.region
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('✅ JWT token created for user:', firebaseUser.uid);

    // Set JWT token in HTTP-only cookie
    const response = NextResponse.json({
      message: 'Sign in successful',
      user: {
        id: firebaseUser.uid,
        email: firebaseUser.email,
        shopName: userData.shopName,
        locationType: userData.locationType,
        businessAddress: userData.businessAddress,
        staffCount: userData.staffCount,
        region: userData.region,
        currency: userData.currency,
        timezone: userData.timezone,
        createdAt: userData.createdAt
      }
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
      if (error.message.includes('user-not-found')) {
        errorMessage = 'No account found with this email address';
      } else if (error.message.includes('wrong-password')) {
        errorMessage = 'Incorrect password';
      } else if (error.message.includes('invalid-email')) {
        errorMessage = 'Invalid email address';
      } else if (error.message.includes('too-many-requests')) {
        errorMessage = 'Too many failed attempts. Please try again later';
      } else {
        errorMessage = `Sign in failed: ${error.message}`;
      }
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 401 }
    );
  }
} 