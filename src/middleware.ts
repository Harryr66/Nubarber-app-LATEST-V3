import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/appointments',
  '/clients',
  '/services',
  '/staff',
  '/settings',
  '/public-site'
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Only protect the main app routes, not auth routes
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  
  if (isProtectedRoute) {
    // For now, allow all access to protected routes
    // The auth context will handle redirects on the client side
    // This prevents middleware from interfering with the auth flow
    return NextResponse.next();
  }
  
  // Allow access to all other routes
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
     * - public (public files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}; 