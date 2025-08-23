import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/firebase';
import { collection, addDoc, serverTimestamp, doc, setDoc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
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

    // Hash password for Firestore storage
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Generate user ID
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create user data for Firestore
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

    console.log('🔥 Creating Firebase Authentication user...');
    
    // Create Firebase Authentication user
    const auth = getAuth();
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    
    console.log('✅ Firebase Auth user created:', firebaseUser.uid);

    console.log('🔥 Creating Firestore user document...');

    // Create user document in Firestore
    const userRef = doc(db, 'users', firebaseUser.uid); // Use Firebase Auth UID
    await setDoc(userRef, {
      ...userData,
      id: firebaseUser.uid, // Use Firebase Auth UID as the user ID
      firebaseAuthUid: firebaseUser.uid // Store the Firebase Auth UID
    });

    console.log('✅ Firestore user document created!');

    // Store password hash separately
    const passwordRef = doc(db, 'passwords', firebaseUser.uid);
    await setDoc(passwordRef, { 
      passwordHash,
      userId: firebaseUser.uid,
      createdAt: serverTimestamp()
    });

    console.log('✅ Password hash stored successfully!');

    return NextResponse.json({
      message: 'Account created successfully in Firebase Auth & Firestore!',
      user: {
        id: firebaseUser.uid,
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
      suggestion: 'Check Firebase security rules and authentication setup'
    }, { status: 500 });
  }
} 