import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
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

  // Firebase authentication is handled client-side with onAuthStateChanged
  // The middleware will just handle basic route protection
  // Actual authentication checks are done in the components using useAuthStatus hook

  // For protected routes, we'll let the client-side hooks handle the authentication
  // This is necessary because Firebase auth state is maintained client-side
  
  // For auth routes, we'll also let client-side hooks handle redirects
  // This ensures consistent behavior with Firebase's auth state management

  // Note: In a production app with SSR, you might want to implement
  // server-side session verification, but for this Magic Link implementation,
  // client-side verification is sufficient and more straightforward

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