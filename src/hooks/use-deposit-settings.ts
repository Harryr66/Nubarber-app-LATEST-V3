import { useState, useEffect } from 'react';
import { DepositSettings } from '@/lib/types';

export const useDepositSettings = (businessId: string) => {
  const [depositSettings, setDepositSettings] = useState<DepositSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDepositSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/barber/deposit-settings?businessId=${businessId}`);
      if (response.ok) {
        const data = await response.json();
        setDepositSettings(data.settings);
      } else {
        setError('Failed to load deposit settings');
      }
    } catch (err) {
      setError('Error loading deposit settings');
      console.error('Error loading deposit settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveDepositSettings = async (settings: Partial<DepositSettings>) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/barber/deposit-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          businessId,
          ...settings,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setDepositSettings(data.settings);
        return { success: true, data: data.settings };
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to save deposit settings');
        return { success: false, error: errorData.error };
      }
    } catch (err) {
      setError('Error saving deposit settings');
      console.error('Error saving deposit settings:', err);
      return { success: false, error: 'Error saving deposit settings' };
    } finally {
      setLoading(false);
    }
  };

  const updateDepositSettings = async (updates: Partial<DepositSettings>) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/barber/deposit-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          businessId,
          ...updates,
        }),
      });

      if (response.ok) {
        await loadDepositSettings(); // Reload to get updated data
        return { success: true };
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to update deposit settings');
        return { success: false, error: errorData.error };
      }
    } catch (err) {
      setError('Error updating deposit settings');
      console.error('Error updating deposit settings:', err);
      return { success: false, error: 'Error updating deposit settings' };
    } finally {
      setLoading(false);
    }
  };

  const calculateDepositAmount = (servicePrice: number): number => {
    if (!depositSettings?.enabled) return 0;
    
    if (depositSettings.type === 'percentage') {
      return (servicePrice * depositSettings.amount) / 100;
    } else {
      return depositSettings.amount;
    }
  };

  useEffect(() => {
    if (businessId) {
      loadDepositSettings();
    }
  }, [businessId]);

  return {
    depositSettings,
    loading,
    error,
    loadDepositSettings,
    saveDepositSettings,
    updateDepositSettings,
    calculateDepositAmount,
  };
}; 