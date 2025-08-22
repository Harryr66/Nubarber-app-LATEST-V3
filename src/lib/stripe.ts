import Stripe from 'stripe';

// Initialize Stripe with secret key
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-07-30.basil',
    })
  : null;

// Multi-regional Stripe configuration
export const STRIPE_CONFIG = {
  clientId: process.env.STRIPE_CLIENT_ID || '',
  redirectUri: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/settings?tab=stripe`,
  scopes: ['read_write'],
  // Regional pricing configuration
  regionalPricing: {
    US: { currency: 'usd', defaultPlan: 'price_basic_usd' },
    UK: { currency: 'gbp', defaultPlan: 'price_basic_gbp' },
    CA: { currency: 'cad', defaultPlan: 'price_basic_cad' },
    AU: { currency: 'aud', defaultPlan: 'price_basic_aud' },
    EU: { currency: 'eur', defaultPlan: 'price_basic_eur' }
  }
};

// Stripe account interface
export interface StripeAccount {
  id: string;
  charges_enabled: boolean;
  payouts_enabled: boolean;
  details_submitted: boolean;
  country: string;
  default_currency: string;
  business_type: string;
  capabilities: Record<string, string>;
}

// Stripe connection status
export interface StripeConnectionStatus {
  isConnected: boolean;
  accountId?: string;
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
  country: string;
  currency: string;
}

// Subscription plan interface
export interface StripeSubscriptionPlan {
  id: string;
  name: string;
  description: string;
  features: string[];
  prices: {
    [region: string]: {
      amount: number;
      currency: string;
      stripePriceId: string;
    };
  };
}

// Available subscription plans with regional pricing
export const SUBSCRIPTION_PLANS: StripeSubscriptionPlan[] = [
  {
    id: 'basic',
    name: 'Basic',
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
    name: 'Premium',
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
    name: 'Enterprise',
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

// Stripe service functions
export class StripeService {
  // Create Stripe Connect account
  static async createConnectAccount(country: string, email: string): Promise<{ accountId: string; accountLink: string }> {
    if (!stripe) {
      throw new Error('Stripe not configured. Please set STRIPE_SECRET_KEY environment variable.');
    }

    // Map country to Stripe country code
    const countryMap: Record<string, string> = {
      'US': 'US', 'UK': 'GB', 'CA': 'CA', 'AU': 'AU', 'EU': 'DE'
    };
    
    const stripeCountry = countryMap[country] || 'US';

    // Create Connect account
    const account = await stripe.accounts.create({
      type: 'express',
      country: stripeCountry,
      email: email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_type: 'individual',
    });

    // Create account link for onboarding
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/settings?tab=stripe&error=refresh`,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/settings?tab=stripe&success=connected`,
      type: 'account_onboarding',
    });

    return {
      accountId: account.id,
      accountLink: accountLink.url
    };
  }

  // Get account details
  static async getAccountDetails(accountId: string): Promise<StripeAccount> {
    if (!stripe) {
      throw new Error('Stripe not configured. Please set STRIPE_SECRET_KEY environment variable.');
    }

    const account = await stripe.accounts.retrieve(accountId);
    return {
      id: account.id,
      charges_enabled: account.charges_enabled || false,
      payouts_enabled: account.payouts_enabled || false,
      details_submitted: account.details_submitted || false,
      country: account.country || 'US',
      default_currency: account.default_currency || 'usd',
      business_type: account.business_type || 'individual',
      capabilities: account.capabilities ? Object.fromEntries(
        Object.entries(account.capabilities).map(([key, value]) => [key, value?.status || 'inactive'])
      ) : {}
    };
  }

  // Create subscription
  static async createSubscription(customerId: string, priceId: string, region: string): Promise<{ subscriptionId: string; clientSecret: string }> {
    if (!stripe) {
      throw new Error('Stripe not configured. Please set STRIPE_SECRET_KEY environment variable.');
    }

    // Get the appropriate price for the region
    const plan = SUBSCRIPTION_PLANS.find(p => p.prices[region]);
    if (!plan) {
      throw new Error(`No pricing available for region: ${region}`);
    }

    const price = plan.prices[region];
    
    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: price.stripePriceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
    });

    const invoice = subscription.latest_invoice as Stripe.Invoice;
    const paymentIntent = (invoice as any).payment_intent as Stripe.PaymentIntent;

    return {
      subscriptionId: subscription.id,
      clientSecret: paymentIntent.client_secret || ''
    };
  }

  // Get subscription plans for a specific region
  static getSubscriptionPlans(region: string): StripeSubscriptionPlan[] {
    return SUBSCRIPTION_PLANS.map(plan => ({
      ...plan,
      currentPrice: plan.prices[region] || plan.prices['US']
    }));
  }

  // Create payment intent for one-time payments
  static async createPaymentIntent(amount: number, currency: string, customerId: string): Promise<{ clientSecret: string }> {
    if (!stripe) {
      throw new Error('Stripe not configured. Please set STRIPE_SECRET_KEY environment variable.');
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      customer: customerId,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return {
      clientSecret: paymentIntent.client_secret || ''
    };
  }

  // Verify webhook signature
  static verifyWebhookSignature(payload: string, signature: string, secret: string): Stripe.Event {
    if (!stripe) {
      throw new Error('Stripe not configured. Please set STRIPE_SECRET_KEY environment variable.');
    }

    try {
      return stripe.webhooks.constructEvent(payload, signature, secret);
    } catch (err) {
      throw new Error(`Webhook signature verification failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }
}

// Legacy functions for backward compatibility
export const createAccountLink = StripeService.createConnectAccount;
export const getAccountDetails = StripeService.getAccountDetails;
export const createConnectAccount = StripeService.createConnectAccount; 