import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    console.log('🔐 Customer registration attempt:', { email });

    // Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Check if customer already exists
    const customersRef = collection(db, 'customers');
    const q = query(customersRef, where('email', '==', email.toLowerCase()));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return NextResponse.json(
        { error: 'Customer with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create customer data
    const customerData = {
      email: email.toLowerCase(),
      passwordHash,
      createdAt: serverTimestamp(),
      isActive: true,
      preferences: {
        notifications: {
          email: true,
          sms: false
        }
      }
    };

    // Add customer to Firestore
    const customerRef = await addDoc(customersRef, customerData);

    console.log('✅ Customer created successfully:', customerRef.id);

    // Return customer data (without password)
    return NextResponse.json({
      success: true,
      customer: {
        id: customerRef.id,
        email: customerData.email,
        createdAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Customer registration failed:', error);
    
    return NextResponse.json({
      error: 'Customer registration failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 