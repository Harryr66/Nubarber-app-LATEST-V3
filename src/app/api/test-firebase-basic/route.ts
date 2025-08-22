import { NextResponse } from 'next/server';
import { db } from '@/firebase';
import { collection, addDoc } from 'firebase/firestore';

export async function GET() {
  try {
    console.log('🧪 Testing very basic Firebase write operation...');
    
    // Try to create a simple test document
    const testCollection = collection(db, 'test_basic');
    const testData = {
      message: 'Hello Firebase',
      timestamp: new Date().toISOString(),
      test: true
    };
    
    console.log('📝 Attempting to write to Firebase...');
    const docRef = await addDoc(testCollection, testData);
    
    console.log('✅ Successfully wrote to Firebase! Document ID:', docRef.id);
    
    return NextResponse.json({
      success: true,
      message: 'Basic Firebase write operation successful',
      documentId: docRef.id,
      data: testData
    });
    
  } catch (error) {
    console.error('❌ Basic Firebase test failed:', error);
    
    // Get more detailed error information
    const errorInfo = {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
      code: (error as any)?.code || 'No error code',
      details: JSON.stringify(error, null, 2)
    };
    
    return NextResponse.json({
      success: false,
      error: 'Basic Firebase write operation failed',
      errorInfo,
      suggestion: 'Firebase security rules are blocking ALL write operations'
    }, { status: 500 });
  }
} 