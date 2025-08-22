import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, shopName, locationType, businessAddress, staffCount, country } = body;

    console.log('🧪 Simple signup attempt:', { email, shopName, country });

    // Basic validation
    if (!email || !password || !shopName || !locationType || !staffCount || !country) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Generate user ID
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Try to create user document directly
    const userRef = doc(db, 'users', userId);
    
    const userData = {
      id: userId,
      email: email.toLowerCase(),
      shopName,
      locationType,
      businessAddress: businessAddress || '', // Ensure it's never undefined
      staffCount: Number(staffCount),
      region: country,
      currency: 'USD',
      timezone: 'UTC',
      stripeCurrency: 'usd',
      isActive: true,
      createdAt: serverTimestamp(),
      settings: {
        businessHours: {
          monday: { open: '09:00', close: '17:00', closed: false },
          tuesday: { open: '09:00', close: '17:00', closed: false },
          wednesday: { open: '09:00', close: '17:00', closed: false },
          thursday: { open: '09:00', close: '17:00', closed: false },
          friday: { open: '09:00', close: '17:00', closed: false },
          saturday: { open: '09:00', close: '17:00', closed: false },
          sunday: { open: '09:00', close: '17:00', closed: true }
        },
        notifications: {
          emailNotifications: true,
          smsNotifications: false,
          appointmentReminders: true,
          marketingEmails: false
        },
        branding: {
          primaryColor: '#000000',
          secondaryColor: '#ffffff'
        }
      }
    };

    console.log('🧪 Attempting to create user document...');
    
    // Try to write to Firestore
    await setDoc(userRef, userData);
    
    console.log('✅ User document created successfully!');

    // Try to create password document
    const passwordRef = doc(db, 'passwords', email.toLowerCase());
    await setDoc(passwordRef, {
      passwordHash,
      userId,
      createdAt: serverTimestamp()
    });

    console.log('✅ Password document created successfully!');

    return NextResponse.json({
      message: 'Account created successfully (Simple Method)',
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

  } catch (error) {
    console.error('❌ Simple signup failed:', error);
    
    return NextResponse.json({
      error: `Simple signup failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      details: error instanceof Error ? error.stack : 'No stack trace'
    }, { status: 500 });
  }
} 