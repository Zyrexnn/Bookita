import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key-here');

export async function middleware(request: NextRequest) {
  // Get the auth token from cookies
  const authToken = request.cookies.get('auth-token')?.value;
  
  // Protected routes
  const protectedPaths = ['/dashboard', '/profile', '/settings'];
  const isProtectedPath = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );

  // Auth routes (redirect if already logged in)
  const authPaths = ['/auth', '/login', '/register'];
  const isAuthPath = authPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );

  // If accessing protected route without token, redirect to auth
  if (isProtectedPath && !authToken) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  // If accessing auth route with valid token, redirect to dashboard
  if (isAuthPath && authToken) {
    try {
      await jwtVerify(authToken, JWT_SECRET);
      return NextResponse.redirect(new URL('/dashboard', request.url));
    } catch (error) {
      // Token is invalid, continue to auth page
      console.log('Invalid token, continuing to auth page');
    }
  }

  // If accessing protected route with token, verify it
  if (isProtectedPath && authToken) {
    try {
      const { payload } = await jwtVerify(authToken, JWT_SECRET);
      
      // Add user info to request headers for API routes
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('user-id', payload.userId as string);
      requestHeaders.set('user-email', payload.email as string);

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (error) {
      // Token is invalid, clear cookies and redirect to auth
      const response = NextResponse.redirect(new URL('/auth', request.url));
      response.cookies.delete('session-token');
      response.cookies.delete('auth-token');
      return response;
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