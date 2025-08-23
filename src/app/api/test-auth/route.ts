import { NextResponse } from 'next/server';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { db } from '@/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export async function GET() {
  try {
    console.log('🧪 Testing Firebase Authentication...');
    
    // Test 1: Check if Firebase is initialized
    console.log('📁 Firebase Project ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
    console.log('🔑 Firebase API Key exists:', !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY);
    
    // Test 2: Try to create a test user
    const testEmail = `test_${Date.now()}@example.com`;
    const testPassword = 'TestPassword123!';
    
    console.log('📝 Attempting to create test user:', testEmail);
    
    const auth = getAuth();
    const userCredential = await createUserWithEmailAndPassword(auth, testEmail, testPassword);
    const firebaseUser = userCredential.user;
    
    console.log('✅ Firebase Auth user created successfully:', firebaseUser.uid);
    
    // Test 3: Try to create Firestore document
    console.log('📄 Creating Firestore test document...');
    
    const testUserData = {
      id: firebaseUser.uid,
      email: testEmail,
      shopName: 'Test Shop',
      locationType: 'mobile',
      businessAddress: 'Test Address',
      staffCount: 1,
      region: 'US',
      currency: 'USD',
      timezone: 'UTC',
      stripeCurrency: 'usd',
      isActive: true,
      createdAt: serverTimestamp(),
      test: true
    };
    
    const userRef = doc(db, 'users', firebaseUser.uid);
    await setDoc(userRef, testUserData);
    
    console.log('✅ Firestore document created successfully!');
    
    // Test 4: Clean up test user (delete from Auth)
    console.log('🧹 Cleaning up test user...');
    await firebaseUser.delete();
    
    console.log('✅ Test user cleaned up successfully');
    
    return NextResponse.json({
      success: true,
      message: 'Firebase Authentication test passed successfully',
      tests: [
        { name: 'Firebase initialization', status: '✅ Passed' },
        { name: 'User creation in Auth', status: '✅ Passed', uid: firebaseUser.uid },
        { name: 'Document creation in Firestore', status: '✅ Passed' },
        { name: 'Test cleanup', status: '✅ Passed' }
      ]
    });
    
  } catch (error) {
    console.error('❌ Firebase Authentication test failed:', error);
    
    const errorInfo = {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
      code: (error as any)?.code || 'No error code',
      details: JSON.stringify(error, null, 2)
    };
    
    return NextResponse.json({
      success: false,
      error: 'Firebase Authentication test failed',
      errorInfo,
      suggestion: 'Check Firebase configuration and security rules'
    }, { status: 500 });
  }
} 