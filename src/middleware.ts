import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AuthService } from '@/lib/auth';

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

// Routes that should redirect to dashboard if already authenticated
const authRoutes = [
  '/sign-in',
  '/sign-up'
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if this is a protected route
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
  
  // Get the auth token from cookies
  const token = request.cookies.get('auth-token')?.value;
  
  if (isProtectedRoute) {
    // Protected route - verify token
    if (!token) {
      // No token, redirect to sign-in
      const url = request.nextUrl.clone();
      url.pathname = '/sign-in';
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }
    
    try {
      // Verify the token
      const decoded = AuthService.verifyToken(token);
      
      // Token is valid, allow access
      return NextResponse.next();
    } catch (error) {
      // Invalid token, redirect to sign-in
      const url = request.nextUrl.clone();
      url.pathname = '/sign-in';
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }
  }
  
  if (isAuthRoute && token) {
    // User is already authenticated, redirect to dashboard
    try {
      AuthService.verifyToken(token);
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    } catch (error) {
      // Invalid token, remove it and continue to auth page
      const response = NextResponse.next();
      response.cookies.delete('auth-token');
      return response;
    }
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