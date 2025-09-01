import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/firebase';
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

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

    // Find user by email in Firestore
    console.log('🔍 Searching for user with email:', email);
    
    // Get all users and find by email (temporary approach)
    const usersRef = collection(db, 'users');
    const usersSnapshot = await getDocs(usersRef);
    
    let userData: any = null;
    let userId: string | null = null;
    
    usersSnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.email && data.email.toLowerCase() === email.toLowerCase()) {
        userData = data;
        userId = doc.id;
        console.log('✅ Found user:', userId);
      }
    });
    
    if (!userData || !userId) {
      console.log('❌ User not found with email:', email);
      return NextResponse.json(
        { error: 'No account found with this email address' },
        { status: 401 }
      );
    }

    // Get password hash from passwords collection
    const passwordRef = doc(db, 'passwords', userId);
    const passwordSnap = await getDoc(passwordRef);
    
    if (!passwordSnap.exists()) {
      console.log('❌ Password hash not found for user:', userId);
      return NextResponse.json(
        { error: 'Account setup incomplete' },
        { status: 401 }
      );
    }
    
    const passwordData = passwordSnap.data();
    const storedHash = passwordData.passwordHash;
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, storedHash);
    
    if (!isPasswordValid) {
      console.log('❌ Invalid password for user:', userId);
      return NextResponse.json(
        { error: 'Incorrect password' },
        { status: 401 }
      );
    }
    
    console.log('✅ Password verified for user:', userId);

    // Create JWT token
    const token = jwt.sign(
      { 
        userId: userId, 
        email: userData.email,
        shopName: userData.shopName,
        region: userData.region
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('✅ JWT token created for user:', userId);

    // Set JWT token in HTTP-only cookie
    const response = NextResponse.json({
      message: 'Sign in successful',
      user: {
        id: userId,
        email: userData.email,
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
      errorMessage = `Sign in failed: ${error.message}`;
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 401 }
    );
  }
} 