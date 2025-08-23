import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    console.log('🔐 Customer login attempt:', { email });

    // Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find customer by email
    const customersRef = collection(db, 'customers');
    const q = query(customersRef, where('email', '==', email.toLowerCase()));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const customerDoc = querySnapshot.docs[0];
    const customerData = customerDoc.data();

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, customerData.passwordHash);
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check if customer is active
    if (!customerData.isActive) {
      return NextResponse.json(
        { error: 'Account is deactivated' },
        { status: 403 }
      );
    }

    // Create JWT token
    const token = jwt.sign(
      { 
        customerId: customerDoc.id, 
        email: customerData.email,
        name: customerData.name
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('✅ Customer login successful:', customerDoc.id);

    // Return customer data and token
    const response = NextResponse.json({
      success: true,
      customer: {
        id: customerDoc.id,
        name: customerData.name,
        email: customerData.email,
        phone: customerData.phone,
        createdAt: customerData.createdAt
      }
    });

    // Set JWT token in HTTP-only cookie
    response.cookies.set('customer-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    return response;

  } catch (error) {
    console.error('❌ Customer login failed:', error);
    
    return NextResponse.json({
      error: 'Customer login failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 