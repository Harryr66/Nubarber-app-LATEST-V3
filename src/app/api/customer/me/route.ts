import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

export async function GET(request: NextRequest) {
  try {
    // Get the customer token from cookies
    const customerToken = request.cookies.get('customer-token')?.value;

    if (!customerToken) {
      return NextResponse.json(
        { error: 'No authentication token' },
        { status: 401 }
      );
    }

    // Verify the JWT token
    let decoded;
    try {
      decoded = jwt.verify(customerToken, JWT_SECRET) as any;
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid authentication token' },
        { status: 401 }
      );
    }

    const { customerId } = decoded;

    // Get customer details from Firestore
    const customerRef = doc(db, 'customers', customerId);
    const customerSnap = await getDoc(customerRef);

    if (!customerSnap.exists()) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    const customerData = customerSnap.data();

    console.log('✅ Customer authenticated:', customerId);

    return NextResponse.json({
      success: true,
      customer: {
        id: customerSnap.id,
        email: customerData.email,
        createdAt: customerData.createdAt
      }
    });

  } catch (error) {
    console.error('❌ Customer authentication check failed:', error);
    
    return NextResponse.json({
      error: 'Authentication check failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 