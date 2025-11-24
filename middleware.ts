import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  // ============================================
  // 1. HANDLE SESSION CART COOKIE
  // ============================================
  const sessionCartId = request.cookies.get('sessionCartId')?.value;

  if (!sessionCartId) {
    // Create new session cart ID for first-time visitors
    const newSessionCartId = crypto.randomUUID();

    response.cookies.set('sessionCartId', newSessionCartId, {
      httpOnly: true, // Prevents client-side JS access (XSS protection)
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      sameSite: 'lax', // CSRF protection
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/', // Available across entire site
    });
  }

  // ============================================
  // 2. PROTECT CHECKOUT ROUTES
  // ============================================
  const protectedPaths = [/\/checkout/];

  if (protectedPaths.some((path) => path.test(pathname))) {
    // Check for NextAuth session tokens (both secure and non-secure variants)
    const sessionToken =
      request.cookies.get('authjs.session-token')?.value ||
      request.cookies.get('__Secure-authjs.session-token')?.value;

    if (!sessionToken) {
      // Redirect to sign-in with callback URL
      const signInUrl = new URL('/sign-in', request.url);
      signInUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
