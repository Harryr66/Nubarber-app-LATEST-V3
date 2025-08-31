# Custom Domain Setup Guide

## Overview
This guide explains how to set up professional URLs like `benisbarbers.nearcut.com` for your barbershop, similar to how Nearcut provides clean, branded URLs.

## Current URL Structure
- **Before**: `https://download-nfnmzp8np-harrys-projects-4097042e.vercel.app/public/your-business-name`
- **After**: `https://yourbusiness.nearcut.com`

## Step-by-Step Setup

### 1. Purchase a Domain
- Go to a domain registrar (Namecheap, GoDaddy, Google Domains)
- Purchase a domain like `nearcut.com` or `barbershop.com`
- This will be your main domain for all barbershop subdomains

### 2. Configure DNS in Vercel
1. **Add Domain to Vercel**:
   - Go to your Vercel project dashboard
   - Navigate to Settings → Domains
   - Add your purchased domain (e.g., `nearcut.com`)

2. **Configure DNS Records**:
   - Add an A record pointing to Vercel's IP
   - Add CNAME records for subdomains
   - Example DNS configuration:
   ```
   Type: A
   Name: @
   Value: 76.76.19.76
   
   Type: CNAME
   Name: *.barbers
   Value: cname.vercel-dns.com
   ```

### 3. Update Next.js Configuration
The app is already configured with URL rewrites to handle clean URLs:

```typescript
// next.config.ts
async rewrites() {
  return [
    {
      source: '/:businessSlug',
      destination: '/public/:businessSlug',
    },
  ];
}
```

### 4. Set Up Subdomain Routing
Create a middleware to handle subdomain routing:

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  
  // Check if it's a subdomain (e.g., benisbarbers.nearcut.com)
  if (hostname.includes('.nearcut.com')) {
    const subdomain = hostname.split('.')[0];
    
    // Rewrite to the public page with the business slug
    return NextResponse.rewrite(
      new URL(`/public/${subdomain}`, request.url)
    );
  }
  
  return NextResponse.next();
}
```

### 5. Environment Variables
Add to your `.env.local`:
```bash
NEXT_PUBLIC_MAIN_DOMAIN=nearcut.com
NEXT_PUBLIC_ALLOWED_SUBDOMAINS=barbers,salon,clinic
```

## Example Implementation

### For Beni's Barbers:
1. **Business Slug**: `benisbarbers`
2. **Custom Domain**: `benisbarbers.nearcut.com`
3. **URL Structure**: `https://benisbarbers.nearcut.com`

### For Any Barbershop:
1. **Business Slug**: `businessname`
2. **Custom Domain**: `businessname.nearcut.com`
3. **URL Structure**: `https://businessname.nearcut.com`

## Benefits

### Professional Appearance
- Clean, memorable URLs
- Brand consistency
- Trust and credibility

### SEO Benefits
- Better search engine rankings
- Local business optimization
- Brand recognition

### Customer Experience
- Easy to remember URLs
- Professional booking experience
- Mobile-friendly access

## Cost Considerations

### Domain Registration
- **Main Domain**: $10-15/year (e.g., `nearcut.com`)
- **Subdomains**: Free (included with main domain)

### Hosting
- **Vercel**: Free tier available
- **Custom Domains**: Free with Vercel

### Total Cost
- **First Year**: $10-15
- **Annual Renewal**: $10-15

## Troubleshooting

### Common Issues
1. **DNS Propagation**: Can take up to 48 hours
2. **SSL Certificates**: Automatically handled by Vercel
3. **Subdomain Routing**: Ensure middleware is properly configured

### Testing
- Use `nslookup` to verify DNS propagation
- Test subdomain access in incognito mode
- Check Vercel deployment logs for errors

## Next Steps

1. **Purchase your main domain**
2. **Configure DNS in Vercel**
3. **Test subdomain routing**
4. **Update your business settings**
5. **Share your new professional URL**

## Support
For technical support with custom domain setup, refer to:
- [Vercel Domain Documentation](https://vercel.com/docs/concepts/projects/domains)
- [DNS Configuration Guide](https://vercel.com/docs/concepts/projects/domains/configure-dns)
- [Custom Domain Best Practices](https://vercel.com/docs/concepts/projects/domains/custom-domains) 