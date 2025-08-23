import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';

export async function GET(request: NextRequest) {
  try {
    console.log('👥 Fetching all customers for barber dashboard');

    // Get all customers from Firestore
    const customersRef = collection(db, 'customers');
    const q = query(customersRef, orderBy('createdAt', 'desc'));
    
    const querySnapshot = await getDocs(q);
    const customers: Array<{
      id: string;
      email: string;
      createdAt: any;
      isActive: boolean;
      lastLogin: any;
    }> = [];

    querySnapshot.forEach((doc) => {
      const customerData = doc.data();
      customers.push({
        id: doc.id,
        email: customerData.email,
        createdAt: customerData.createdAt,
        isActive: customerData.isActive,
        lastLogin: customerData.lastLogin || null
      });
    });

    console.log('✅ Found customers:', customers.length);

    return NextResponse.json({
      success: true,
      customers: customers
    });

  } catch (error) {
    console.error('❌ Failed to fetch customers:', error);
    
    return NextResponse.json({
      error: 'Failed to fetch customers',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 