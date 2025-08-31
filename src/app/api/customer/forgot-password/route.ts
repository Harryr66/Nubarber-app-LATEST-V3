import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/firebase';
import { collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { EmailService } from '@/lib/email';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Find customer by email
    const customersRef = collection(db, 'customers');
    const q = query(customersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      // Don't reveal if email exists or not for security
      return NextResponse.json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.'
      });
    }

    const customerDoc = querySnapshot.docs[0];
    const customerData = customerDoc.data();

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Store reset token in customer document
    await updateDoc(customerDoc.ref, {
      resetToken,
      resetTokenExpiry,
      updatedAt: new Date()
    });

    // Create reset URL
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/customer/reset-password?token=${resetToken}`;

    // Send password reset email
    const emailService = new EmailService();
    const emailSent = await emailService.sendPasswordReset({
      email: customerData.email,
      resetToken,
      resetUrl,
      businessName: 'Your Barber', // Generic business name for customers
      userName: customerData.email.split('@')[0] // Use email prefix as username
    });

    if (emailSent) {
      return NextResponse.json({
        success: true,
        message: 'Password reset link has been sent to your email.'
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to send password reset email. Please try again.' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error processing customer forgot password request:', error);
    return NextResponse.json(
      { error: 'An error occurred. Please try again.' },
      { status: 500 }
    );
  }
} 