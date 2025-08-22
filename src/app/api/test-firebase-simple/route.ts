import { NextResponse } from 'next/server';
import { db } from '@/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';

export async function GET() {
  try {
    console.log('🧪 Testing basic Firebase operations...');
    
    // Test 1: Try to create a test document
    console.log('📝 Test 1: Creating test document...');
    const testCollection = collection(db, 'test');
    const testDoc = await addDoc(testCollection, {
      message: 'Test document',
      timestamp: new Date().toISOString(),
      test: true
    });
    console.log('✅ Test document created:', testDoc.id);
    
    // Test 2: Try to read the test document
    console.log('📖 Test 2: Reading test document...');
    const querySnapshot = await getDocs(testCollection);
    const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log('✅ Test documents read:', docs.length);
    
    // Test 3: Clean up test document
    console.log('🗑️ Test 3: Cleaning up test document...');
    await deleteDoc(doc(db, 'test', testDoc.id));
    console.log('✅ Test document deleted');
    
    return NextResponse.json({
      success: true,
      message: 'Firebase basic operations test passed',
      tests: [
        { name: 'Create document', status: '✅ Passed', id: testDoc.id },
        { name: 'Read documents', status: '✅ Passed', count: docs.length },
        { name: 'Delete document', status: '✅ Passed' }
      ]
    });
    
  } catch (error) {
    console.error('❌ Firebase test failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error instanceof Error ? error.stack : 'No stack trace',
      suggestion: 'Check Firebase security rules and environment variables'
    }, { status: 500 });
  }
} 