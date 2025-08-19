import Stripe from 'stripe';

// Initialize Stripe with your secret key
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil',
});

// Stripe Connect configuration
export const STRIPE_CONFIG = {
  // Your Stripe Connect application ID
  clientId: process.env.STRIPE_CLIENT_ID!,
  
  // Redirect URLs for OAuth flow
  redirectUri: process.env.STRIPE_REDIRECT_URI || 'http://localhost:3000/api/stripe/connect/callback',
  
  // Scopes for Connect accounts
  scopes: [
    'read_write', // Full access to account
    'express',    // Express onboarding flow
  ],
};

// Types for Stripe Connect
export interface StripeAccount {
  id: string;
  business_type: string;
  charges_enabled: boolean;
  payouts_enabled: boolean;
  details_submitted: boolean;
  country: string;
  default_currency: string;
  capabilities: any;
  created: number;
}

export interface StripeConnectionStatus {
  isConnected: boolean;
  accountId?: string;
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
  detailsSubmitted: boolean;
  country?: string;
  defaultCurrency?: string;
  businessType?: string;
}

// Helper function to create Connect account link
export async function createAccountLink(accountId: string, refreshUrl: string, returnUrl: string) {
  try {
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: refreshUrl,
      return_url: returnUrl,
      type: 'account_onboarding',
    });
    
    return accountLink;
  } catch (error) {
    console.error('Error creating account link:', error);
    throw error;
  }
}

// Helper function to get account details
export async function getAccountDetails(accountId: string): Promise<StripeAccount> {
  try {
    const account = await stripe.accounts.retrieve(accountId);
    return account as unknown as StripeAccount;
  } catch (error) {
    console.error('Error retrieving account:', error);
    throw error;
  }
}

// Helper function to create a Connect account
export async function createConnectAccount(email: string, country: string = 'US') {
  try {
    const account = await stripe.accounts.create({
      type: 'express',
      country: country,
      email: email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_type: 'individual',
    });
    
    return account;
  } catch (error) {
    console.error('Error creating Connect account:', error);
    throw error;
  }
} 