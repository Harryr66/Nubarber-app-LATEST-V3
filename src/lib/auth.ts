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
    try {
      console.log('🔐 AuthService: Creating user:', { email, shopName, countryCode });
      
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

      // Create user data for Firestore
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

      console.log('🔐 AuthService: Creating user in Firestore with data:', userData);

      // Create user in Firestore
      const user = await FirestoreService.createUser(userData);

      // Store password hash separately in a passwords collection
      const passwordRef = doc(db, 'passwords', email.toLowerCase());
      await setDoc(passwordRef, { 
        passwordHash,
        userId: user.id,
        createdAt: serverTimestamp()
      });

      console.log('✅ AuthService: User and password created successfully');

      // Return user without password hash
      return user;
    } catch (error) {
      console.error('❌ AuthService: Error creating user:', error);
      throw error;
    }
  }

  // Authenticate user login
  static async authenticateUser(email: string, password: string, countryCode: string = 'US'): Promise<{ user: User; token: string }> {
    try {
      console.log('🔐 AuthService: Authenticating user:', { email, countryCode });
      
      const region = FirestoreService.getRegionFromCountry(countryCode);
      
      // Get user from Firestore
      const user = await FirestoreService.getUser(email, region);
      if (!user) {
        throw new Error('Invalid credentials');
      }

      // Get password hash from passwords collection
      const passwordRef = doc(db, 'passwords', email.toLowerCase());
      const passwordSnap = await getDoc(passwordRef);
      
      if (!passwordSnap.exists()) {
        throw new Error('Invalid credentials');
      }

      const passwordData = passwordSnap.data();
      const storedHash = passwordData.passwordHash;

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, storedHash);
      if (!isPasswordValid) {
        throw new Error('Invalid credentials');
      }

      // Update last login
      await FirestoreService.updateUser(user.id, { lastLogin: serverTimestamp() as Timestamp });

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: user.id, 
          email: user.email, 
          region: user.region 
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      console.log('✅ AuthService: User authenticated successfully');

      return { user, token };
    } catch (error) {
      console.error('❌ AuthService: Authentication error:', error);
      throw error;
    }
  }

  // Verify JWT token
  static async verifyToken(token: string): Promise<User | null> {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      const user = await FirestoreService.getUserById(decoded.userId);
      return user;
    } catch (error) {
      console.error('❌ AuthService: Token verification error:', error);
      return null;
    }
  }

  // Get user by email
  static async getUserByEmail(email: string, countryCode: string = 'US'): Promise<User | null> {
    try {
      const region = FirestoreService.getRegionFromCountry(countryCode);
      return await FirestoreService.getUser(email, region);
    } catch (error) {
      console.error('❌ AuthService: Error getting user by email:', error);
      return null;
    }
  }

  // Get user by ID
  static async getUserById(userId: string): Promise<User | null> {
    try {
      return await FirestoreService.getUserById(userId);
    } catch (error) {
      console.error('❌ AuthService: Error getting user by ID:', error);
      return null;
    }
  }

  // Change password
  static async changePassword(email: string, currentPassword: string, newPassword: string, countryCode: string = 'US'): Promise<void> {
    try {
      // First authenticate the user
      await this.authenticateUser(email, currentPassword, countryCode);

      // Hash new password
      const saltRounds = 12;
      const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

      // Update password hash
      const passwordRef = doc(db, 'passwords', email.toLowerCase());
      await updateDoc(passwordRef, { 
        passwordHash: newPasswordHash,
        updatedAt: serverTimestamp()
      });

      console.log('✅ AuthService: Password changed successfully');
    } catch (error) {
      console.error('❌ AuthService: Error changing password:', error);
      throw error;
    }
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