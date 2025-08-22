import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

// Temporary in-memory storage (will be lost on server restart)
const tempUsers = new Map();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, shopName, locationType, businessAddress, staffCount, country, forceCreate } = body;

    console.log('🧪 Local signup attempt:', { email, shopName, country, forceCreate });

    // Basic validation
    if (!email || !password || !shopName || !locationType || !staffCount || !country) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user already exists
    if (tempUsers.has(email.toLowerCase())) {
      console.log('⚠️ User already exists:', email.toLowerCase());
      
      // If forceCreate is true, remove the existing user and create a new one
      if (forceCreate) {
        console.log('🔄 Force creating new account, removing existing user');
        tempUsers.delete(email.toLowerCase());
      } else {
        return NextResponse.json(
          { 
            error: 'An account with this email already exists',
            suggestion: 'Use forceCreate: true to overwrite existing account'
          },
          { status: 409 }
        );
      }
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

    // Store user in temporary memory
    tempUsers.set(email.toLowerCase(), {
      user: userData,
      passwordHash
    });

    console.log('✅ User created successfully in local storage!');
    console.log('📊 Total users in memory:', tempUsers.size);

    return NextResponse.json({
      message: 'Account created successfully (Local Storage)',
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
    console.error('❌ Local signup failed:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error during local signup';
    const errorDetails = error instanceof Error ? error.stack : 'No stack trace available';

    return NextResponse.json({
      error: `Local signup failed: ${errorMessage}`,
      details: errorDetails,
      rawError: JSON.stringify(error) // Added for more context
    }, { status: 500 });
  }
}

// GET endpoint to check stored users (for debugging)
export async function GET() {
  return NextResponse.json({
    message: 'Local users storage status',
    userCount: tempUsers.size,
    users: Array.from(tempUsers.keys())
  });
}

// DELETE endpoint to clear all users (for testing)
export async function DELETE() {
  const userCount = tempUsers.size;
  tempUsers.clear();
  return NextResponse.json({
    message: `Cleared ${userCount} users from local storage`,
    userCount: 0
  });
} 