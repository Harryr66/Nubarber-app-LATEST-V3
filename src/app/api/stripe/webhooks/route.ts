import { NextRequest, NextResponse } from 'next/server';
import { StripeService } from '@/lib/stripe';
import { FirestoreService } from '@/lib/firestore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error('STRIPE_WEBHOOK_SECRET not configured');
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      );
    }

    let event;
    try {
      event = StripeService.verifyWebhookSignature(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Handle different event types
    switch (event.type) {
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object);
        break;
      
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;
      
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;
      
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object);
        break;
      
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;
      
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object);
        break;
      
      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

// Handle subscription created
async function handleSubscriptionCreated(subscription: any) {
  try {
    console.log('Subscription created:', subscription.id);
    
    // Update user subscription status in Firestore
    const customerId = subscription.customer;
    const subscriptionId = subscription.id;
    const status = subscription.status;
    const planId = subscription.items.data[0]?.price.id;
    
    // You would typically look up the user by customer ID here
    // For now, we'll log the event
    console.log('New subscription:', {
      customerId,
      subscriptionId,
      status,
      planId
    });
    
  } catch (error) {
    console.error('Error handling subscription created:', error);
  }
}

// Handle subscription updated
async function handleSubscriptionUpdated(subscription: any) {
  try {
    console.log('Subscription updated:', subscription.id);
    
    const customerId = subscription.customer;
    const status = subscription.status;
    
    console.log('Subscription updated:', {
      customerId,
      status
    });
    
  } catch (error) {
    console.error('Error handling subscription updated:', error);
  }
}

// Handle subscription deleted
async function handleSubscriptionDeleted(subscription: any) {
  try {
    console.log('Subscription deleted:', subscription.id);
    
    const customerId = subscription.customer;
    
    console.log('Subscription deleted:', {
      customerId
    });
    
  } catch (error) {
    console.error('Error handling subscription deleted:', error);
  }
}

// Handle payment succeeded
async function handlePaymentSucceeded(invoice: any) {
  try {
    console.log('Payment succeeded for invoice:', invoice.id);
    
    const customerId = invoice.customer;
    const amount = invoice.amount_paid;
    const currency = invoice.currency;
    
    console.log('Payment succeeded:', {
      customerId,
      amount,
      currency
    });
    
  } catch (error) {
    console.error('Error handling payment succeeded:', error);
  }
}

// Handle payment failed
async function handlePaymentFailed(invoice: any) {
  try {
    console.log('Payment failed for invoice:', invoice.id);
    
    const customerId = invoice.customer;
    const amount = invoice.amount_due;
    const currency = invoice.currency;
    
    console.log('Payment failed:', {
      customerId,
      amount,
      currency
    });
    
  } catch (error) {
    console.error('Error handling payment failed:', error);
  }
}

// Handle payment intent succeeded
async function handlePaymentIntentSucceeded(paymentIntent: any) {
  try {
    console.log('Payment intent succeeded:', paymentIntent.id);
    
    const customerId = paymentIntent.customer;
    const amount = paymentIntent.amount;
    const currency = paymentIntent.currency;
    
    console.log('Payment intent succeeded:', {
      customerId,
      amount,
      currency
    });
    
  } catch (error) {
    console.error('Error handling payment intent succeeded:', error);
  }
}

// Handle payment intent failed
async function handlePaymentIntentFailed(paymentIntent: any) {
  try {
    console.log('Payment intent failed:', paymentIntent.id);
    
    const customerId = paymentIntent.customer;
    const amount = paymentIntent.amount;
    const currency = paymentIntent.currency;
    
    console.log('Payment intent failed:', {
      customerId,
      amount,
      currency
    });
    
  } catch (error) {
    console.error('Error handling payment intent failed:', error);
  }
} 