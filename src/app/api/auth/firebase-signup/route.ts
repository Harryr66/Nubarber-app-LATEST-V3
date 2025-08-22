import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/firebase';
import { collection, addDoc, serverTimestamp, doc, setDoc } from 'firebase/firestore';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, shopName, locationType, businessAddress, staffCount, country } = body;

    console.log('🔥 Firebase signup attempt:', { email, shopName, country });

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

    // Create user data
    const userData = {
      id: userId,
      email: email.toLowerCase(),
      shopName,
      locationType,
      businessAddress: businessAddress || '',
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

    console.log('🔥 Attempting to create user in Firebase...');

    // Try to create user document directly
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, userData);

    console.log('✅ User created successfully in Firebase!');

    // Store password hash separately
    const passwordRef = doc(db, 'passwords', email.toLowerCase());
    await setDoc(passwordRef, { 
      passwordHash,
      userId: userId,
      createdAt: serverTimestamp()
    });

    console.log('✅ Password hash stored successfully!');

    return NextResponse.json({
      message: 'Account created successfully in Firebase!',
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
        createdAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Firebase signup failed:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error during Firebase signup';
    const errorDetails = error instanceof Error ? error.stack : 'No stack trace available';

    return NextResponse.json({
      error: `Firebase signup failed: ${errorMessage}`,
      details: errorDetails,
      rawError: JSON.stringify(error),
      suggestion: 'Check Firebase security rules - they are too restrictive'
    }, { status: 500 });
  }
} 