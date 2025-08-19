# Stripe Integration Setup Guide

## 🚀 Quick Start

### 1. Create a Stripe Account
- Go to [stripe.com](https://stripe.com) and sign up
- Complete your business verification
- Get your API keys from the dashboard

### 2. Set Up Stripe Connect
- In your Stripe dashboard, go to **Developers > Connect**
- Create a new Connect application
- Note your **Client ID** (starts with `ca_`)

### 3. Environment Variables
Create a `.env.local` file in your project root:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_... # Your Stripe secret key
STRIPE_PUBLISHABLE_KEY=pk_test_... # Your Stripe publishable key
STRIPE_CLIENT_ID=ca_... # Your Stripe Connect application ID
STRIPE_REDIRECT_URI=http://localhost:3000/api/stripe/connect/callback

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 4. API Keys Location
- **Secret Key**: Dashboard > Developers > API keys > Secret key
- **Publishable Key**: Dashboard > Developers > API keys > Publishable key
- **Client ID**: Dashboard > Developers > Connect > Your application

## 🔧 Production Setup

### Update Redirect URIs
For production, update your redirect URIs:
- **Development**: `http://localhost:3000/api/stripe/connect/callback`
- **Production**: `https://yourdomain.com/api/stripe/connect/callback`

### Webhook Endpoints
Set up webhooks for real-time updates:
- **URL**: `https://yourdomain.com/api/stripe/webhooks`
- **Events**: `account.updated`, `payment_intent.succeeded`, `payment_intent.payment_failed`

## 📱 How It Works

### 1. Barbers Connect
- Enter business email and country
- Click "Connect with Stripe"
- Redirected to Stripe's onboarding

### 2. Stripe Onboarding
- Complete business verification
- Add bank account details
- Verify identity documents

### 3. Account Activation
- Stripe reviews application
- Account becomes active
- Can start accepting payments

## 🛡️ Security Features

- **OAuth 2.0**: Secure authentication flow
- **PCI Compliance**: Handled by Stripe
- **Fraud Protection**: Built-in security measures
- **Data Encryption**: All data encrypted in transit

## 💳 Payment Flow

1. **Customer books appointment**
2. **Payment intent created**
3. **Customer enters payment details**
4. **Payment processed by Stripe**
5. **Funds transferred to barber's account**

## 📊 Dashboard Features

- **Connection Status**: Real-time connection monitoring
- **Account Details**: View account information
- **Payment History**: Track all transactions
- **Payout Status**: Monitor fund transfers

## 🚨 Troubleshooting

### Common Issues
- **Invalid API Key**: Check your secret key format
- **Redirect URI Mismatch**: Verify callback URL in Stripe dashboard
- **Account Creation Failed**: Check business information validity

### Support
- **Stripe Support**: [support.stripe.com](https://support.stripe.com)
- **Documentation**: [stripe.com/docs](https://stripe.com/docs)
- **Community**: [stripe.com/community](https://stripe.com/community)

## 🔄 Testing

### Test Mode
- Use test API keys for development
- Test with Stripe's test card numbers
- No real charges in test mode

### Test Cards
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **3D Secure**: `4000 0025 0000 3155`

## 📈 Next Steps

After connecting Stripe:
1. **Test payments** with test cards
2. **Customize checkout** appearance
3. **Set up webhooks** for automation
4. **Configure payout schedules**
5. **Monitor transactions** in dashboard

---

**Need Help?** Check the [Stripe documentation](https://stripe.com/docs) or contact support. 