import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '@/firebase';
import { FirestoreService, User } from './firestore';

// JWT secret - in production, use a strong secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_EXPIRES_IN = '24h';

// Rate limiting for failed attempts
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

export class AuthService {
  // Create a new user account
  static async createUser(email: string, password: string, shopName: string, locationType: string, businessAddress?: string, staffCount: number = 1, countryCode: string = 'US'): Promise<User> {
    // Check if user already exists
    const region = FirestoreService.getRegionFromCountry(countryCode);
    const existingUser = await FirestoreService.getUser(email, region);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Validate password strength
    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }

    // Hash password with bcrypt
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Determine region and currency based on country
    const regionalConfig = FirestoreService.getRegionalConfig(region);

    // Create user in Firestore
    const userData = {
      email: email.toLowerCase(),
      shopName,
      locationType: locationType as 'physical' | 'mobile',
      businessAddress,
      staffCount,
      region,
      currency: regionalConfig.currency,
      timezone: regionalConfig.timezone,
      stripeCurrency: regionalConfig.stripeCurrency,
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

    const user = await FirestoreService.createUser(userData);

    // Store password hash separately (you might want to use Firebase Auth instead)
    // For now, we'll store it in a separate collection or use Firebase Auth
    const passwordRef = doc(db, `${regionalConfig.region}/passwords`, email);
    await setDoc(passwordRef, { passwordHash });

    // Return user without password hash
    return user;
  }

  // Authenticate user login
  static async authenticateUser(email: string, password: string, countryCode: string = 'US'): Promise<{ user: any; token: string }> {
    const region = FirestoreService.getRegionFromCountry(countryCode);
    
    // Get user from Firestore
    const user = await FirestoreService.getUser(email, region);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Get password hash from Firestore
    const passwordRef = doc(db, `${region}/passwords`, email);
    const passwordSnap = await getDoc(passwordRef);
    
    if (!passwordSnap.exists()) {
      throw new Error('Invalid credentials');
    }

    const { passwordHash } = passwordSnap.data();

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, passwordHash);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // Update last login
    await FirestoreService.updateUser(email, { lastLogin: serverTimestamp() as Timestamp }, region);

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: 'owner',
        shopName: user.shopName,
        region: user.region
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Return user without password hash and token
    return { user, token };
  }

  // Verify JWT token
  static verifyToken(token: string): { userId: string; email: string; role: string; shopName: string; region: string } {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      return {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
        shopName: decoded.shopName,
        region: decoded.region
      };
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  // Get user by email (without password)
  static async getUserByEmail(email: string, region: string = 'default'): Promise<any | null> {
    return await FirestoreService.getUser(email, region as any);
  }

  // Get user by ID (without password)
  static async getUserById(id: string, region: string = 'default'): Promise<any | null> {
    // In Firestore, we use email as ID, so this is the same as getUserByEmail
    return await FirestoreService.getUser(id, region as any);
  }

  // Change password
  static async changePassword(email: string, currentPassword: string, newPassword: string, region: string = 'default'): Promise<boolean> {
    const user = await FirestoreService.getUser(email, region as any);
    if (!user) {
      throw new Error('User not found');
    }

    // Get current password hash
    const passwordRef = doc(db, `${region}/passwords`, email);
    const passwordSnap = await getDoc(passwordRef);
    
    if (!passwordSnap.exists()) {
      throw new Error('Password not found');
    }

    // Verify current password
    const { passwordHash: currentHash } = passwordSnap.data();

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, currentHash);
    if (!isCurrentPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    // Validate new password
    if (newPassword.length < 8) {
      throw new Error('New password must be at least 8 characters long');
    }

    // Hash new password
    const saltRounds = 12;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

    // Update password hash
    await updateDoc(passwordRef, { passwordHash: newPasswordHash });

    return true;
  }
}

// Initialize with a demo user for testing (remove in production)
export const initializeDemoUser = async () => {
  try {
    await AuthService.createUser(
      'demo@nubarber.com',
      'DemoPass123!',
      'Demo Barbershop',
      'physical',
      '123 Demo Street, Demo City',
      2,
      'US'
    );
    console.log('Demo user created successfully');
  } catch (error) {
    // User might already exist
    console.log('Demo user setup:', error instanceof Error ? error.message : 'Unknown error');
  }
}; 