import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { StripeConnectionStatus } from '@/lib/stripe';

export function useStripeConnect() {
  const [connectionStatus, setConnectionStatus] = useState<StripeConnectionStatus>({
    isConnected: false,
    chargesEnabled: false,
    payoutsEnabled: false,
    detailsSubmitted: false,
  });
  
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const searchParams = useSearchParams();

  // Check URL parameters for connection status
  useEffect(() => {
    const accountId = searchParams.get('accountId');
    const chargesEnabled = searchParams.get('chargesEnabled') === 'true';
    const payoutsEnabled = searchParams.get('payoutsEnabled') === 'true';
    const detailsSubmitted = searchParams.get('detailsSubmitted') === 'true';
    const successParam = searchParams.get('success');
    const errorParam = searchParams.get('error');

    if (accountId && successParam === 'true') {
      setConnectionStatus({
        isConnected: true,
        accountId,
        chargesEnabled,
        payoutsEnabled,
        detailsSubmitted,
        country: 'US', // Default, could be enhanced
        defaultCurrency: 'usd', // Default, could be enhanced
        businessType: 'individual', // Default, could be enhanced
      });
      setSuccess('Stripe account connected successfully!');
      setError(null);
    }

    if (errorParam) {
      setError(decodeURIComponent(errorParam));
      setSuccess(null);
    }
  }, [searchParams]);

  // Connect to Stripe
  const connectStripe = async (email: string, country: string = 'US') => {
    setIsConnecting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/stripe/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, country }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to connect to Stripe');
      }

      // Redirect to Stripe onboarding
      if (data.accountLink) {
        window.location.href = data.accountLink;
      }

    } catch (err: any) {
      setError(err.message || 'Failed to connect to Stripe');
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect from Stripe
  const disconnectStripe = async () => {
    try {
      // In production, you would call an API to disconnect
      // For now, we'll just clear the local state
      setConnectionStatus({
        isConnected: false,
        chargesEnabled: false,
        payoutsEnabled: false,
        detailsSubmitted: false,
      });
      setSuccess('Stripe account disconnected successfully');
      setError(null);
    } catch (err: any) {
      setError('Failed to disconnect from Stripe');
    }
  };

  // Refresh connection status
  const refreshStatus = async () => {
    // In production, you would call an API to get current status
    // For now, we'll just clear any messages
    setError(null);
    setSuccess(null);
  };

  return {
    connectionStatus,
    isConnecting,
    error,
    success,
    connectStripe,
    disconnectStripe,
    refreshStatus,
  };
} 