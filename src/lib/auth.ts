import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// In production, this would be a proper database
// For now, we'll use an in-memory store that resets on server restart
interface User {
  id: string;
  email: string;
  passwordHash: string;
  shopName: string;
  role: 'owner' | 'staff';
  createdAt: Date;
  lastLogin?: Date;
  failedAttempts: number;
  lockedUntil?: Date;
}

// In-memory user store (replace with database in production)
const users: Map<string, User> = new Map();

// JWT secret - in production, use a strong secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_EXPIRES_IN = '24h';

// Rate limiting for failed attempts
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

export class AuthService {
  // Create a new user account
  static async createUser(email: string, password: string, shopName: string, locationType: string, businessAddress?: string, staffCount: number = 1): Promise<Omit<User, 'passwordHash'>> {
    // Check if user already exists
    if (users.has(email.toLowerCase())) {
      throw new Error('User with this email already exists');
    }

    // Validate password strength
    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }

    // Hash password with bcrypt
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user: User = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email: email.toLowerCase(),
      passwordHash,
      shopName,
      role: 'owner',
      createdAt: new Date(),
      failedAttempts: 0
    };

    users.set(email.toLowerCase(), user);

    // Return user without password hash
    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // Authenticate user login
  static async authenticateUser(email: string, password: string): Promise<{ user: Omit<User, 'passwordHash'>; token: string }> {
    const user = users.get(email.toLowerCase());
    
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Check if account is locked
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      const remainingTime = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 1000 / 60);
      throw new Error(`Account is locked. Please try again in ${remainingTime} minutes`);
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    
    if (!isPasswordValid) {
      // Increment failed attempts
      user.failedAttempts++;
      
      // Lock account if too many failed attempts
      if (user.failedAttempts >= MAX_FAILED_ATTEMPTS) {
        user.lockedUntil = new Date(Date.now() + LOCKOUT_DURATION);
        users.set(email.toLowerCase(), user);
        throw new Error('Too many failed attempts. Account locked for 15 minutes');
      }
      
      users.set(email.toLowerCase(), user);
      throw new Error('Invalid credentials');
    }

    // Reset failed attempts on successful login
    user.failedAttempts = 0;
    user.lastLogin = new Date();
    users.set(email.toLowerCase(), user);

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role,
        shopName: user.shopName 
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Return user without password hash and token
    const { passwordHash: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  // Verify JWT token
  static verifyToken(token: string): { userId: string; email: string; role: string; shopName: string } {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      return {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
        shopName: decoded.shopName
      };
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  // Get user by email (without password)
  static getUserByEmail(email: string): Omit<User, 'passwordHash'> | null {
    const user = users.get(email.toLowerCase());
    if (!user) return null;
    
    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // Get user by ID (without password)
  static getUserById(id: string): Omit<User, 'passwordHash'> | null {
    for (const user of users.values()) {
      if (user.id === id) {
        const { passwordHash: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
      }
    }
    return null;
  }

  // Change password
  static async changePassword(email: string, currentPassword: string, newPassword: string): Promise<boolean> {
    const user = users.get(email.toLowerCase());
    if (!user) {
      throw new Error('User not found');
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isCurrentPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    // Validate new password
    if (newPassword.length < 8) {
      throw new Error('New password must be at least 8 characters long');
    }

    // Hash new password
    const saltRounds = 12;
    user.passwordHash = await bcrypt.hash(newPassword, saltRounds);
    users.set(email.toLowerCase(), user);

    return true;
  }

  // Reset failed attempts (for admin use)
  static resetFailedAttempts(email: string): boolean {
    const user = users.get(email.toLowerCase());
    if (!user) return false;
    
    user.failedAttempts = 0;
    user.lockedUntil = undefined;
    users.set(email.toLowerCase(), user);
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
      2
    );
    console.log('Demo user created successfully');
  } catch (error) {
    // User might already exist
    console.log('Demo user setup:', error instanceof Error ? error.message : 'Unknown error');
  }
}; 