import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authCookie = request.cookies.get('auth-storage')?.value;

  let token = null;
  let isExpired = false;

  if (authCookie) {
    try {
      const parsed = JSON.parse(authCookie);
      const authData = parsed?.state?.auth;

      token = authData.accessToken;

      // check token expiration
    } catch (e) {
      console.error('Failed to parse auth storage cookie', e);
    }
  }

  if (pathname.startsWith('/dashboard') && (!token || isExpired)) {
    const response = NextResponse.redirect(new URL('/auth', request.url));

    if (isExpired) {
      response.cookies.delete('auth-storage');
    }
    return response;
  }
}