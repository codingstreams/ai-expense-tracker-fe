import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const authCookie = request.cookies.get('auth-storage')?.value;
  let token = null;

  if (authCookie) {
    try {
      const parsed = JSON.parse(authCookie);
      token = parsed?.state?.auth?.accessToken; 
    } catch (e) {
      console.error('Failed to parse auth storage cookie', e);
    }
  }

  if (pathname.startsWith('/dashboard') && !token) {
    return NextResponse.redirect(new URL('/auth?mode=login', request.url));
  }

  if (pathname.startsWith('/auth') && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth'],
};
