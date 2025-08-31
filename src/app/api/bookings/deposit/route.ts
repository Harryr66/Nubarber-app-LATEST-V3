import { NextRequest, NextResponse } from 'next/server';
import { DepositPayment, DepositSettings } from '@/lib/types';
import { db } from '@/firebase';
import { doc, getDoc, setDoc, collection, addDoc, query, where, getDocs, updateDoc } from 'firebase/firestore';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      bookingId, 
      customerId, 
      businessId, 
      serviceId, 
      barberId, 
      date, 
      time,
      servicePrice 
    } = body;

    if (!bookingId || !customerId || !businessId || !servicePrice) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get deposit settings for this business
    const depositSettingsRef = doc(db, 'depositSettings', businessId);
    const depositSettingsSnap = await getDoc(depositSettingsRef);

    if (!depositSettingsSnap.exists()) {
      return NextResponse.json(
        { error: 'Deposit settings not found' },
        { status: 404 }
      );
    }

    const depositSettings = depositSettingsSnap.data() as DepositSettings;

    if (!depositSettings.enabled) {
      return NextResponse.json(
        { error: 'Deposits are not enabled for this business' },
        { status: 400 }
      );
    }

    // Calculate deposit amount
    let depositAmount: number;
    if (depositSettings.type === 'percentage') {
      depositAmount = (servicePrice * depositSettings.amount) / 100;
    } else {
      depositAmount = depositSettings.amount;
    }

    // Create Stripe Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(depositAmount * 100), // Convert to cents
      currency: 'usd', // You can make this dynamic based on business location
      metadata: {
        bookingId,
        customerId,
        businessId,
        depositType: 'booking_deposit'
      },
      description: `Deposit for booking on ${date} at ${time}`,
    });

    // Create deposit payment record
    const depositPayment: DepositPayment = {
      id: paymentIntent.id,
      bookingId,
      customerId,
      businessId,
      amount: depositAmount,
      stripePaymentIntentId: paymentIntent.id,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Save to Firestore
    const depositPaymentsRef = collection(db, 'depositPayments');
    await addDoc(depositPaymentsRef, depositPayment);

    return NextResponse.json({
      success: true,
      paymentIntent: {
        clientSecret: paymentIntent.client_secret,
        id: paymentIntent.id
      },
      depositAmount,
      depositSettings: {
        type: depositSettings.type,
        amount: depositSettings.amount,
        customerMessage: depositSettings.customerMessage
      }
    });

  } catch (error) {
    console.error('Error processing deposit payment:', error);
    return NextResponse.json(
      { error: 'Failed to process deposit payment' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { paymentIntentId, status, refundAmount, refundReason } = body;

    if (!paymentIntentId || !status) {
      return NextResponse.json(
        { error: 'Payment Intent ID and status are required' },
        { status: 400 }
      );
    }

    // Update payment status in Firestore
    const depositPaymentsRef = collection(db, 'depositPayments');
    const q = query(depositPaymentsRef, where('stripePaymentIntentId', '==', paymentIntentId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return NextResponse.json(
        { error: 'Deposit payment not found' },
        { status: 404 }
      );
    }

    const docRef = querySnapshot.docs[0].ref;
    const updateData: any = {
      status,
      updatedAt: new Date()
    };

    if (refundAmount) {
      updateData.refundAmount = refundAmount;
    }

    if (refundReason) {
      updateData.refundReason = refundReason;
    }

    await updateDoc(docRef, updateData);

    return NextResponse.json({
      success: true,
      message: 'Deposit payment status updated successfully'
    });

  } catch (error) {
    console.error('Error updating deposit payment status:', error);
    return NextResponse.json(
      { error: 'Failed to update deposit payment status' },
      { status: 500 }
    );
  }
} 