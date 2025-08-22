import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  updateDoc, 
  deleteDoc,
  addDoc,
  serverTimestamp,
  Timestamp,
  writeBatch,
  runTransaction,
  Firestore
} from 'firebase/firestore';
import { db } from '@/firebase';

// Multi-regional database configuration - matching your existing setup
export const REGIONAL_DATABASES = {
  'US': {
    region: 'default', // Your default database
    currency: 'USD',
    timezone: 'America/New_York',
    stripeCurrency: 'usd'
  },
  'UK': {
    region: 'default', // Using default for now
    currency: 'GBP',
    timezone: 'Europe/London',
    stripeCurrency: 'gbp'
  },
  'CA': {
    region: 'default', // Using default for now
    currency: 'CAD',
    timezone: 'America/Toronto',
    stripeCurrency: 'cad'
  },
  'AU': {
    region: 'default', // Using default for now
    currency: 'AUD',
    timezone: 'Australia/Sydney',
    stripeCurrency: 'aud'
  },
  'EU': {
    region: 'default', // Using default for now
    currency: 'EUR',
    timezone: 'Europe/Paris',
    stripeCurrency: 'eur'
  },
  'default': {
    region: 'default',
    currency: 'USD',
    timezone: 'UTC',
    stripeCurrency: 'usd'
  }
} as const;

export type RegionCode = keyof typeof REGIONAL_DATABASES;

// Database collections structure - matching your existing collections
export interface User {
  id: string;
  email: string;
  shopName: string;
  locationType: 'physical' | 'mobile';
  businessAddress?: string;
  staffCount: number;
  region: RegionCode;
  currency: string;
  timezone: string;
  stripeCurrency: string;
  stripeAccountId?: string;
  subscription?: {
    plan: 'basic' | 'premium' | 'enterprise';
    status: 'active' | 'canceled' | 'past_due' | 'unpaid';
    currentPeriodEnd: Timestamp;
    stripeSubscriptionId: string;
  };
  createdAt: Timestamp;
  lastLogin?: Timestamp;
  isActive: boolean;
  settings: {
    businessHours: BusinessHours;
    notifications: NotificationSettings;
    branding: BrandingSettings;
  };
}

export interface BusinessHours {
  monday: { open: string; close: string; closed: boolean };
  tuesday: { open: string; close: string; closed: boolean };
  wednesday: { open: string; close: string; closed: boolean };
  thursday: { open: string; close: string; closed: boolean };
  friday: { open: string; close: string; closed: boolean };
  saturday: { open: string; close: string; closed: boolean };
  sunday: { open: string; close: string; closed: boolean };
}

export interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  appointmentReminders: boolean;
  marketingEmails: boolean;
}

export interface BrandingSettings {
  primaryColor: string;
  secondaryColor: string;
  logoUrl?: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  price: number;
  region: RegionCode;
  stripeCurrency: string;
  stripePriceId?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Staff {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  availability: string;
  region: RegionCode;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  region: RegionCode;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Appointment {
  id: string;
  clientId: string;
  staffId: string;
  serviceId: string;
  date: Timestamp;
  time: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  region: RegionCode;
  stripeCurrency: string;
  stripePaymentIntentId?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  stripePriceId?: string;
}

// Simplified Firestore service that works with your current setup
export class FirestoreService {
  // Get the default database instance
  static getDatabaseInstance(): any {
    return db;
  }

  // Get region from country code
  static getRegionFromCountry(countryCode: string): RegionCode {
    const region = REGIONAL_DATABASES[countryCode as RegionCode];
    if (!region) {
      console.warn(`Unknown country code: ${countryCode}, using default`);
      return 'default';
    }
    return countryCode as RegionCode;
  }

  // Get regional configuration
  static getRegionalConfig(region: RegionCode) {
    return REGIONAL_DATABASES[region] || REGIONAL_DATABASES['default'];
  }

  // Create a new user
  static async createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    try {
      console.log('🔐 Creating user in Firestore:', { email: userData.email, region: userData.region });
      
      // Generate a unique ID
      const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Create user document
      const userRef = doc(db, 'users', userId);
      const user: User = {
        ...userData,
        id: userId,
        createdAt: serverTimestamp() as Timestamp
      };
      
      await setDoc(userRef, user);
      console.log('✅ User created successfully:', userId);
      
      return user;
    } catch (error) {
      console.error('❌ Error creating user:', error);
      throw new Error(`Failed to create user: ${error}`);
    }
  }

  // Get user by email
  static async getUser(email: string, region: RegionCode = 'default'): Promise<User | null> {
    try {
      console.log('🔍 Looking up user:', { email, region });
      
      // Query users collection by email
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', email.toLowerCase()));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        console.log('❌ User not found:', email);
        return null;
      }
      
      const userDoc = querySnapshot.docs[0];
      const user = userDoc.data() as User;
      console.log('✅ User found:', user.id);
      
      return user;
    } catch (error) {
      console.error('❌ Error getting user:', error);
      throw new Error(`Failed to get user: ${error}`);
    }
  }

  // Get user by ID
  static async getUserById(userId: string): Promise<User | null> {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        return null;
      }
      
      return userSnap.data() as User;
    } catch (error) {
      console.error('Error getting user by ID:', error);
      throw new Error(`Failed to get user by ID: ${error}`);
    }
  }

  // Update user
  static async updateUser(userId: string, updates: Partial<User>): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error(`Failed to update user: ${error}`);
    }
  }

  // Delete user
  static async deleteUser(userId: string): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      await deleteDoc(userRef);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw new Error(`Failed to delete user: ${error}`);
    }
  }

  // Create service
  static async createService(serviceData: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>): Promise<Service> {
    try {
      const serviceId = `service_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const serviceRef = doc(db, 'services', serviceId);
      const service: Service = {
        ...serviceData,
        id: serviceId,
        createdAt: serverTimestamp() as Timestamp,
        updatedAt: serverTimestamp() as Timestamp
      };
      
      await setDoc(serviceRef, service);
      return service;
    } catch (error) {
      console.error('Error creating service:', error);
      throw new Error(`Failed to create service: ${error}`);
    }
  }

  // Get services
  static async getServices(region: RegionCode = 'default'): Promise<Service[]> {
    try {
      const servicesRef = collection(db, 'services');
      const q = query(servicesRef, where('region', '==', region));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => doc.data() as Service);
    } catch (error) {
      console.error('Error getting services:', error);
      throw new Error(`Failed to get services: ${error}`);
    }
  }

  // Create staff member
  static async createStaff(staffData: Omit<Staff, 'id' | 'createdAt' | 'updatedAt'>): Promise<Staff> {
    try {
      const staffId = `staff_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const staffRef = doc(db, 'staff', staffId);
      const staff: Staff = {
        ...staffData,
        id: staffId,
        createdAt: serverTimestamp() as Timestamp,
        updatedAt: serverTimestamp() as Timestamp
      };
      
      await setDoc(staffRef, staff);
      return staff;
    } catch (error) {
      console.error('Error creating staff:', error);
      throw new Error(`Failed to create staff: ${error}`);
    }
  }

  // Get staff members
  static async getStaff(region: RegionCode = 'default'): Promise<Staff[]> {
    try {
      const staffRef = collection(db, 'staff');
      const q = query(staffRef, where('region', '==', region));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => doc.data() as Staff);
    } catch (error) {
      console.error('Error getting staff:', error);
      throw new Error(`Failed to get staff: ${error}`);
    }
  }

  // Create client
  static async createClient(clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<Client> {
    try {
      const clientId = `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const clientRef = doc(db, 'clients', clientId);
      const client: Client = {
        ...clientData,
        id: clientId,
        createdAt: serverTimestamp() as Timestamp,
        updatedAt: serverTimestamp() as Timestamp
      };
      
      await setDoc(clientRef, client);
      return client;
    } catch (error) {
      console.error('Error creating client:', error);
      throw new Error(`Failed to create client: ${error}`);
    }
  }

  // Get clients
  static async getClients(region: RegionCode = 'default'): Promise<Client[]> {
    try {
      const clientsRef = collection(db, 'clients');
      const q = query(clientsRef, where('region', '==', region));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => doc.data() as Client);
    } catch (error) {
      console.error('Error getting clients:', error);
      throw new Error(`Failed to get clients: ${error}`);
    }
  }

  // Create appointment
  static async createAppointment(appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Appointment> {
    try {
      const appointmentId = `appointment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const appointmentRef = doc(db, 'appointments', appointmentId);
      const appointment: Appointment = {
        ...appointmentData,
        id: appointmentId,
        createdAt: serverTimestamp() as Timestamp,
        updatedAt: serverTimestamp() as Timestamp
      };
      
      await setDoc(appointmentRef, appointment);
      return appointment;
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw new Error(`Failed to create appointment: ${error}`);
    }
  }

  // Get appointments
  static async getAppointments(region: RegionCode = 'default'): Promise<Appointment[]> {
    try {
      const appointmentsRef = collection(db, 'appointments');
      const q = query(appointmentsRef, where('region', '==', region));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => doc.data() as Appointment);
    } catch (error) {
      console.error('Error getting appointments:', error);
      throw new Error(`Failed to get appointments: ${error}`);
    }
  }

  // Create subscription
  static async createSubscription(userId: string, subscriptionData: any): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        subscription: subscriptionData,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw new Error(`Failed to create subscription: ${error}`);
    }
  }

  // Get subscription plans
  static getSubscriptionPlans(region: RegionCode = 'default'): SubscriptionPlan[] {
    const regionalPricing = {
      'US': { basic: 29, premium: 79, enterprise: 199 },
      'UK': { basic: 25, premium: 69, enterprise: 179 },
      'CA': { basic: 39, premium: 99, enterprise: 249 },
      'AU': { basic: 44, premium: 119, enterprise: 299 },
      'EU': { basic: 27, premium: 74, enterprise: 189 },
      'default': { basic: 29, premium: 79, enterprise: 199 }
    };

    const currentPricing = regionalPricing[region] || regionalPricing['default'];

    return [
      {
        id: 'basic',
        name: 'Basic',
        price: currentPricing.basic,
        currency: REGIONAL_DATABASES[region]?.currency || 'USD',
        interval: 'month',
        features: ['Up to 5 staff members', 'Basic booking system', 'Email support']
      },
      {
        id: 'premium',
        name: 'Premium',
        price: currentPricing.premium,
        currency: REGIONAL_DATABASES[region]?.currency || 'USD',
        interval: 'month',
        features: ['Up to 20 staff members', 'Advanced analytics', 'Priority support', 'Custom branding']
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        price: currentPricing.enterprise,
        currency: REGIONAL_DATABASES[region]?.currency || 'USD',
        interval: 'month',
        features: ['Unlimited staff', 'White-label solution', 'Dedicated support', 'Custom integrations']
      }
    ];
  }
} 