import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const url = request.nextUrl.clone();
  
  // Skip API routes and static files
  if (url.pathname.startsWith('/api') || url.pathname.startsWith('/_next')) {
    return NextResponse.next();
  }
  
  // Handle dynamic subdomains for barbershops
  // This will catch ANY subdomain like: benisbarbers.nubarber.com, johnsbarber.nubarber.com, etc.
  if (hostname.includes('.nubarber.com')) {
    const subdomain = hostname.split('.')[0];
    
    // Skip reserved subdomains
    if (['www', 'api', 'admin', 'app', 'dashboard', 'auth'].includes(subdomain)) {
      return NextResponse.next();
    }
    
    // Check if this is a valid business slug (you can add validation here)
    if (subdomain && subdomain.length > 2) {
      // Rewrite to the public page with the business slug
      url.pathname = `/public/${subdomain}`;
      return NextResponse.rewrite(url);
    }
  }
  
  // Handle other potential domains (for future expansion)
  if (hostname.includes('.com') || hostname.includes('.co.uk') || hostname.includes('.com.au')) {
    const parts = hostname.split('.');
    if (parts.length >= 3) {
      const subdomain = parts[0];
      
      // Skip common subdomains
      if (['www', 'api', 'admin', 'app', 'dashboard', 'auth'].includes(subdomain)) {
        return NextResponse.next();
      }
      
      // Only handle if it's a barbershop-related domain
      if (hostname.includes('barber') || hostname.includes('salon') || hostname.includes('hair')) {
        url.pathname = `/public/${subdomain}`;
        return NextResponse.rewrite(url);
      }
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 