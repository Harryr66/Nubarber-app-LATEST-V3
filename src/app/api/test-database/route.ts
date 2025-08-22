import { NextRequest, NextResponse } from 'next/server';
import { FirestoreService } from '@/lib/firestore';

export async function GET() {
  try {
    console.log('🧪 Testing database connection...');
    
    // Test basic database operations
    const testUserData = {
      email: 'test@example.com',
      shopName: 'Test Shop',
      locationType: 'physical' as const,
      businessAddress: '123 Test St',
      staffCount: 1,
      region: 'default' as const,
      currency: 'USD',
      timezone: 'UTC',
      stripeCurrency: 'usd',
      isActive: true,
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

    // Test user creation
    console.log('🧪 Creating test user...');
    const testUser = await FirestoreService.createUser(testUserData);
    console.log('✅ Test user created:', testUser.id);

    // Test user retrieval
    console.log('🧪 Retrieving test user...');
    const retrievedUser = await FirestoreService.getUser('test@example.com', 'default');
    console.log('✅ Test user retrieved:', retrievedUser?.id);

    // Test user deletion (cleanup)
    console.log('🧪 Cleaning up test user...');
    await FirestoreService.deleteUser(testUser.id);
    console.log('✅ Test user deleted');

    return NextResponse.json({
      success: true,
      message: 'Database connection test successful',
      tests: {
        userCreation: '✅ PASSED',
        userRetrieval: '✅ PASSED',
        userDeletion: '✅ PASSED'
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Database test failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Database connection test failed',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 