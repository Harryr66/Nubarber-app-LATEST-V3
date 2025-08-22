import { NextResponse } from 'next/server';
import { db } from '@/firebase';
import { collection, getDocs } from 'firebase/firestore';

export async function GET() {
  try {
    console.log('🧪 Testing Firebase connection...');
    
    // Test basic Firestore connection
    const testCollection = collection(db, 'test');
    console.log('✅ Firestore collection reference created');
    
    // Try to get docs (this will fail if rules are too restrictive)
    const snapshot = await getDocs(testCollection);
    console.log('✅ Firestore query successful');
    
    return NextResponse.json({
      success: true,
      message: 'Firebase connection test successful',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Firebase test failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Firebase connection test failed',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 