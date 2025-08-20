# Security Setup Guide

## 🔐 **CRITICAL: Production Security Requirements**

### **JWT Secret Configuration**
You **MUST** set a strong JWT secret in production:

```bash
# In your .env.local file or production environment:
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

**⚠️ WARNING:** Never use the default JWT secret in production!

### **Environment Variables Required**
```bash
# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Stripe (if using)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_CONNECT_CLIENT_ID=ca_...

# Database (for production)
DATABASE_URL=postgresql://username:password@localhost:5432/nubarber

# Next.js
NODE_ENV=production
```

## 🛡️ **Security Features Implemented**

### **1. Password Security**
- ✅ **bcrypt hashing** with 12 salt rounds
- ✅ **Minimum 8 characters** required
- ✅ **Password validation** on both client and server
- ✅ **Secure password comparison** (timing attack resistant)

### **2. Authentication System**
- ✅ **JWT tokens** with 24-hour expiration
- ✅ **HTTP-only cookies** (XSS protection)
- ✅ **Secure cookie settings** (sameSite: strict)
- ✅ **Token verification** on every protected route

### **3. Rate Limiting & Brute Force Protection**
- ✅ **Maximum 5 failed attempts** before account lockout
- ✅ **15-minute lockout period** after failed attempts
- ✅ **Failed attempt tracking** per user
- ✅ **Automatic unlock** after lockout period

### **4. Route Protection**
- ✅ **Middleware protection** for all app routes
- ✅ **Automatic redirects** to sign-in for unauthenticated users
- ✅ **Token validation** on every request
- ✅ **Secure logout** with cookie clearing

### **5. Input Validation**
- ✅ **Email format validation** (client + server)
- ✅ **Password strength requirements** (client + server)
- ✅ **Input sanitization** and validation
- ✅ **SQL injection protection** (no direct DB queries)

## 🚀 **Production Deployment Checklist**

### **Before Going Live:**
1. ✅ Set strong `JWT_SECRET` environment variable
2. ✅ Change `NODE_ENV` to `production`
3. ✅ Set up proper database (replace in-memory store)
4. ✅ Configure HTTPS and secure cookies
5. ✅ Set up monitoring and logging
6. ✅ Remove demo user creation code

### **Database Migration (Required for Production):**
The current system uses in-memory storage that resets on server restart. For production, you need:

1. **PostgreSQL/MySQL database**
2. **User table** with proper indexes
3. **Session management** table
4. **Audit logging** table

### **Security Headers (Recommended):**
```typescript
// Add to next.config.js
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  }
];
```

## 🧪 **Testing the Security System**

### **Demo Account (Remove in Production):**
- **Email:** `demo@nubarber.com`
- **Password:** `DemoPass123!`

### **Security Tests:**
1. ✅ Try wrong password → Should fail
2. ✅ Try wrong email → Should fail
3. ✅ Try 5 wrong passwords → Account should lock
4. ✅ Try to access `/dashboard` without login → Should redirect
5. ✅ Try to use expired/invalid token → Should fail
6. ✅ Try SQL injection in inputs → Should be sanitized

## 🔒 **Additional Security Recommendations**

### **For Production:**
1. **Enable HTTPS only** (redirect HTTP to HTTPS)
2. **Set up rate limiting** at the server level
3. **Implement audit logging** for all auth attempts
4. **Set up monitoring** for failed login attempts
5. **Regular security audits** and updates
6. **Backup and recovery** procedures
7. **Incident response** plan

### **Monitoring:**
- Failed login attempts
- Account lockouts
- Token usage patterns
- Unusual access patterns

## 📞 **Support & Security Issues**

If you discover any security vulnerabilities:
1. **Immediately** disable the affected feature
2. **Document** the vulnerability
3. **Implement** a fix
4. **Test** thoroughly
5. **Deploy** securely
6. **Monitor** for similar issues

---

**Remember:** Security is an ongoing process, not a one-time setup! 