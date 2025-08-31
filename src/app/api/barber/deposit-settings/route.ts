import { NextRequest, NextResponse } from 'next/server';
import { DepositSettings } from '@/lib/types';
import { db } from '@/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId');

    if (!businessId) {
      return NextResponse.json(
        { error: 'Business ID is required' },
        { status: 400 }
      );
    }

    // Get deposit settings from Firestore
    const depositSettingsRef = doc(db, 'depositSettings', businessId);
    const depositSettingsSnap = await getDoc(depositSettingsRef);

    if (depositSettingsSnap.exists()) {
      const settings = depositSettingsSnap.data() as DepositSettings;
      return NextResponse.json({
        success: true,
        settings
      });
    } else {
      // Return default settings if none exist
      const defaultSettings: DepositSettings = {
        enabled: false,
        type: 'percentage',
        amount: 25,
        refundPolicy: '24h',
        customerMessage: 'A deposit is required to secure your booking',
        businessId,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      return NextResponse.json({
        success: true,
        settings: defaultSettings
      });
    }

  } catch (error) {
    console.error('Error fetching deposit settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch deposit settings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { businessId, ...settings } = body;

    if (!businessId) {
      return NextResponse.json(
        { error: 'Business ID is required' },
        { status: 400 }
      );
    }

    // Validate settings
    if (settings.enabled) {
      if (!settings.amount || settings.amount <= 0) {
        return NextResponse.json(
          { error: 'Deposit amount must be greater than 0' },
          { status: 400 }
        );
      }

      if (settings.type === 'percentage' && settings.amount > 100) {
        return NextResponse.json(
          { error: 'Percentage deposit cannot exceed 100%' },
          { status: 400 }
        );
      }
    }

    const depositSettings: DepositSettings = {
      ...settings,
      businessId,
      updatedAt: new Date(),
      createdAt: new Date()
    };

    // Save to Firestore
    const depositSettingsRef = doc(db, 'depositSettings', businessId);
    await setDoc(depositSettingsRef, depositSettings);

    return NextResponse.json({
      success: true,
      message: 'Deposit settings saved successfully',
      settings: depositSettings
    });

  } catch (error) {
    console.error('Error saving deposit settings:', error);
    return NextResponse.json(
      { error: 'Failed to save deposit settings' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { businessId, ...updates } = body;

    if (!businessId) {
      return NextResponse.json(
        { error: 'Business ID is required' },
        { status: 400 }
      );
    }

    // Validate updates
    if (updates.enabled) {
      if (!updates.amount || updates.amount <= 0) {
        return NextResponse.json(
          { error: 'Deposit amount must be greater than 0' },
          { status: 400 }
        );
      }

      if (updates.type === 'percentage' && updates.amount > 100) {
        return NextResponse.json(
          { error: 'Percentage deposit cannot exceed 100%' },
          { status: 400 }
        );
      }
    }

    // Update in Firestore
    const depositSettingsRef = doc(db, 'depositSettings', businessId);
    await updateDoc(depositSettingsRef, {
      ...updates,
      updatedAt: new Date()
    });

    return NextResponse.json({
      success: true,
      message: 'Deposit settings updated successfully'
    });

  } catch (error) {
    console.error('Error updating deposit settings:', error);
    return NextResponse.json(
      { error: 'Failed to update deposit settings' },
      { status: 500 }
    );
  }
} 