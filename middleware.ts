import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const url = request.nextUrl.clone();
  
  console.log('🔍 Middleware triggered for hostname:', hostname, 'pathname:', url.pathname);
  
  // Skip API routes and static files
  if (url.pathname.startsWith('/api') || url.pathname.startsWith('/_next') || url.pathname.startsWith('/favicon.ico')) {
    console.log('⏭️ Skipping API/static route');
    return NextResponse.next();
  }
  
  // Handle dynamic subdomains for barbershops
  if (hostname.includes('.nubarber.com') && !hostname.startsWith('www.')) {
    const subdomain = hostname.split('.')[0];
    console.log('🏪 Subdomain detected:', subdomain);
    
    // Skip reserved subdomains
    if (['www', 'api', 'admin', 'app', 'dashboard', 'auth', 'login', 'signup'].includes(subdomain)) {
      console.log('🚫 Reserved subdomain, skipping');
      return NextResponse.next();
    }
    
    // Check if this is a valid business slug
    if (subdomain && subdomain.length > 2) {
      console.log('✅ Rewriting to:', `/public/${subdomain}`);
      // Rewrite to the public page with the business slug
      url.pathname = `/public/${subdomain}`;
      return NextResponse.rewrite(url);
    }
  }
  
  console.log('➡️ No rewrite needed, continuing');
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
