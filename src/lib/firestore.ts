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
    region: 'nubarber-uk', // Your UK database
    currency: 'GBP',
    timezone: 'Europe/London',
    stripeCurrency: 'gbp'
  },
  'CA': {
    region: 'nubarber-canada', // Your Canada database
    currency: 'CAD',
    timezone: 'America/Toronto',
    stripeCurrency: 'cad'
  },
  'AU': {
    region: 'nubarber-aus', // Your Australia database
    currency: 'AUD',
    timezone: 'Australia/Sydney',
    stripeCurrency: 'aud'
  },
  'EU': {
    region: 'nubarber-eu', // Your Europe database
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
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  customCss?: string;
}

export interface Service {
  id: string;
  userId: string;
  name: string;
  description: string;
  duration: number; // in minutes
  price: number;
  currency: string;
  stripeCurrency: string;
  stripePriceId?: string;
  category: string;
  isActive: boolean;
  region: RegionCode;
  createdAt: Timestamp;
}

export interface Staff {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  role: 'barber' | 'stylist' | 'assistant' | 'manager';
  specialties: string[];
  workingHours: BusinessHours;
  isActive: boolean;
  avatarUrl?: string;
  region: RegionCode;
  createdAt: Timestamp;
}

export interface Client {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  preferences: {
    preferredServices: string[];
    notes: string;
    marketingConsent: boolean;
  };
  region: RegionCode;
  createdAt: Timestamp;
  lastVisit?: Timestamp;
}

export interface Appointment {
  id: string;
  userId: string;
  clientId: string;
  staffId: string;
  serviceId: string;
  date: Timestamp;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
  price: number;
  currency: string;
  stripeCurrency: string;
  stripePaymentIntentId?: string;
  region: RegionCode;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Subscription plans with regional pricing
export interface SubscriptionPlan {
  id: string;
  name: 'basic' | 'premium' | 'enterprise';
  description: string;
  features: string[];
  prices: {
    US: { amount: number; currency: 'USD'; stripePriceId: string };
    UK: { amount: number; currency: 'GBP'; stripePriceId: string };
    CA: { amount: number; currency: 'CAD'; stripePriceId: string };
    AU: { amount: number; currency: 'AUD'; stripePriceId: string };
    EU: { amount: number; currency: 'EUR'; stripePriceId: string };
  };
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'basic',
    name: 'basic',
    description: 'Perfect for small barbershops',
    features: ['Up to 3 staff members', 'Basic booking system', 'Email support'],
    prices: {
      US: { amount: 29, currency: 'USD', stripePriceId: 'price_basic_usd' },
      UK: { amount: 25, currency: 'GBP', stripePriceId: 'price_basic_gbp' },
      CA: { amount: 39, currency: 'CAD', stripePriceId: 'price_basic_cad' },
      AU: { amount: 44, currency: 'AUD', stripePriceId: 'price_basic_aud' },
      EU: { amount: 27, currency: 'EUR', stripePriceId: 'price_basic_eur' }
    }
  },
  {
    id: 'premium',
    name: 'premium',
    description: 'Ideal for growing businesses',
    features: ['Up to 10 staff members', 'Advanced analytics', 'Priority support', 'Custom branding'],
    prices: {
      US: { amount: 79, currency: 'USD', stripePriceId: 'price_premium_usd' },
      UK: { amount: 69, currency: 'GBP', stripePriceId: 'price_premium_gbp' },
      CA: { amount: 109, currency: 'CAD', stripePriceId: 'price_premium_cad' },
      AU: { amount: 119, currency: 'AUD', stripePriceId: 'price_premium_aud' },
      EU: { amount: 74, currency: 'EUR', stripePriceId: 'price_premium_eur' }
    }
  },
  {
    id: 'enterprise',
    name: 'enterprise',
    description: 'For large barbershop chains',
    features: ['Unlimited staff', 'Multi-location support', 'API access', 'Dedicated support'],
    prices: {
      US: { amount: 199, currency: 'USD', stripePriceId: 'price_enterprise_usd' },
      UK: { amount: 179, currency: 'GBP', stripePriceId: 'price_enterprise_gbp' },
      CA: { amount: 269, currency: 'CAD', stripePriceId: 'price_enterprise_cad' },
      AU: { amount: 299, currency: 'AUD', stripePriceId: 'price_enterprise_aud' },
      EU: { amount: 189, currency: 'EUR', stripePriceId: 'price_enterprise_eur' }
    }
  }
];

// Firestore service class - updated for your existing database structure
export class FirestoreService {
  // Get the appropriate database instance based on region
  private static getDatabaseInstance(region: RegionCode): Firestore {
    // For now, we'll use the default database
    // In the future, you can implement multi-database routing here
    // This would require setting up multiple Firebase app instances
    return db;
  }

  // User management
  static async createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const user: User = {
      ...userData,
      id: userData.email, // Use email as ID for easy lookup
      createdAt: serverTimestamp() as Timestamp,
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

    const dbInstance = this.getDatabaseInstance(userData.region);
    const userRef = doc(dbInstance, 'users', user.email);
    await setDoc(userRef, user);
    
    return user;
  }

  static async getUser(email: string, region: RegionCode = 'default'): Promise<User | null> {
    const dbInstance = this.getDatabaseInstance(region);
    const userRef = doc(dbInstance, 'users', email);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return userSnap.data() as User;
    }
    
    return null;
  }

  static async updateUser(email: string, updates: Partial<User>, region: RegionCode = 'default'): Promise<void> {
    const dbInstance = this.getDatabaseInstance(region);
    const userRef = doc(dbInstance, 'users', email);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  }

  // Service management
  static async createService(serviceData: Omit<Service, 'id' | 'createdAt'>): Promise<Service> {
    const service: Service = {
      ...serviceData,
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: serverTimestamp() as Timestamp
    };

    const dbInstance = this.getDatabaseInstance(serviceData.region);
    const serviceRef = doc(dbInstance, 'services', service.id);
    await setDoc(serviceRef, service);
    
    return service;
  }

  static async getServices(userId: string, region: RegionCode = 'default'): Promise<Service[]> {
    const dbInstance = this.getDatabaseInstance(region);
    const servicesRef = collection(dbInstance, 'services');
    const q = query(
      servicesRef,
      where('userId', '==', userId),
      where('isActive', '==', true),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as Service);
  }

  // Staff management
  static async createStaff(staffData: Omit<Staff, 'id' | 'createdAt'>): Promise<Staff> {
    const staff: Staff = {
      ...staffData,
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: serverTimestamp() as Timestamp
    };

    const dbInstance = this.getDatabaseInstance(staffData.region);
    const staffRef = doc(dbInstance, 'staff', staff.id);
    await setDoc(staffRef, staff);
    
    return staff;
  }

  static async getStaff(userId: string, region: RegionCode = 'default'): Promise<Staff[]> {
    const dbInstance = this.getDatabaseInstance(region);
    const staffRef = collection(dbInstance, 'staff');
    const q = query(
      staffRef,
      where('userId', '==', userId),
      where('isActive', '==', true),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as Staff);
  }

  // Client management
  static async createClient(clientData: Omit<Client, 'id' | 'createdAt'>): Promise<Client> {
    const client: Client = {
      ...clientData,
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: serverTimestamp() as Timestamp
    };

    const dbInstance = this.getDatabaseInstance(clientData.region);
    const clientRef = doc(dbInstance, 'clients', client.id);
    await setDoc(clientRef, client);
    
    return client;
  }

  static async getClients(userId: string, region: RegionCode = 'default'): Promise<Client[]> {
    const dbInstance = this.getDatabaseInstance(region);
    const clientsRef = collection(dbInstance, 'clients');
    const q = query(
      clientsRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as Client);
  }

  // Appointment management
  static async createAppointment(appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Appointment> {
    const appointment: Appointment = {
      ...appointmentData,
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: serverTimestamp() as Timestamp,
      updatedAt: serverTimestamp() as Timestamp
    };

    const dbInstance = this.getDatabaseInstance(appointmentData.region);
    const appointmentRef = doc(dbInstance, 'appointments', appointment.id);
    await setDoc(appointmentRef, appointment);
    
    return appointment;
  }

  static async getAppointments(userId: string, region: RegionCode = 'default', limitCount: number = 50): Promise<Appointment[]> {
    const dbInstance = this.getDatabaseInstance(region);
    const appointmentsRef = collection(dbInstance, 'appointments');
    const q = query(
      appointmentsRef,
      where('userId', '==', userId),
      orderBy('date', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as Appointment);
  }

  static async updateAppointmentStatus(appointmentId: string, status: Appointment['status'], region: RegionCode = 'default'): Promise<void> {
    const dbInstance = this.getDatabaseInstance(region);
    const appointmentRef = doc(dbInstance, 'appointments', appointmentId);
    await updateDoc(appointmentRef, {
      status,
      updatedAt: serverTimestamp()
    });
  }

  // Subscription management
  static async createSubscription(userId: string, planId: string, stripeSubscriptionId: string, region: RegionCode = 'default'): Promise<void> {
    const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId);
    if (!plan) throw new Error('Invalid subscription plan');

    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      subscription: {
        plan: plan.name,
        status: 'active',
        currentPeriodEnd: serverTimestamp() as Timestamp,
        stripeSubscriptionId
      }
    });
  }

  static async getSubscriptionPlans(region: RegionCode = 'default'): Promise<SubscriptionPlan[]> {
    return SUBSCRIPTION_PLANS.map(plan => ({
      ...plan,
      currentPrice: plan.prices[region === 'default' ? 'US' : region] || plan.prices['US']
    }));
  }

  // Utility functions
  static getRegionFromCountry(countryCode: string): RegionCode {
    const countryMap: Record<string, RegionCode> = {
      'US': 'US',
      'GB': 'UK',
      'CA': 'CA',
      'AU': 'AU',
      'DE': 'EU',
      'FR': 'EU',
      'IT': 'EU',
      'ES': 'EU',
      'NL': 'EU',
      'BE': 'EU',
      'AT': 'EU',
      'CH': 'EU',
      'IE': 'EU',
      'SE': 'EU',
      'NO': 'EU',
      'DK': 'EU',
      'FI': 'EU'
    };

    return countryMap[countryCode.toUpperCase()] || 'default';
  }

  static getRegionalConfig(region: RegionCode = 'default') {
    return REGIONAL_DATABASES[region];
  }

  // Batch operations for better performance
  static async batchCreate(operations: Array<{ type: 'create'; collection: string; data: any; region: RegionCode }>): Promise<void> {
    const batch = writeBatch(db);
    
    operations.forEach(({ type, collection, data, region }) => {
      if (type === 'create') {
        const docRef = doc(db, collection);
        batch.set(docRef, data);
      }
    });
    
    await batch.commit();
  }
} 