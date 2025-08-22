import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

// Simple in-memory storage that persists for the session
const sessionUsers = new Map();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, shopName, locationType, businessAddress, staffCount, country } = body;

    console.log('🚀 Working signup attempt:', { email, shopName, country });

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
      createdAt: new Date().toISOString(),
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

    // Store user in session storage
    sessionUsers.set(email.toLowerCase(), {
      user: userData,
      passwordHash
    });

    console.log('✅ User created successfully in session storage!');
    console.log('📊 Total users in session:', sessionUsers.size);

    return NextResponse.json({
      message: 'Account created successfully!',
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
    console.error('❌ Working signup failed:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error during signup';
    const errorDetails = error instanceof Error ? error.stack : 'No stack trace available';

    return NextResponse.json({
      error: `Signup failed: ${errorMessage}`,
      details: errorDetails,
      rawError: JSON.stringify(error)
    }, { status: 500 });
  }
}

// GET endpoint to check stored users (for debugging)
export async function GET() {
  return NextResponse.json({
    message: 'Session users storage status',
    userCount: sessionUsers.size,
    users: Array.from(sessionUsers.keys())
  });
}

// DELETE endpoint to clear all users (for testing)
export async function DELETE() {
  const userCount = sessionUsers.size;
  sessionUsers.clear();
  return NextResponse.json({
    message: `Cleared ${userCount} users from session storage`,
    userCount: 0
  });
} 