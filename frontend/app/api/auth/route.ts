import { NextRequest, NextResponse } from 'next/server';
import {
  generateRandomString,
  buildAuthorizationUrl,
  COOKIE,
} from '@/lib/shopify/customerAccount';

export async function GET(req: NextRequest) {
  const origin = req.nextUrl.origin;
  const appUrl = (origin && !origin.includes('localhost'))
    ? origin
    : (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000');

  const codeVerifier = generateRandomString(64);
  const state        = generateRandomString(32);
  const redirectUri  = `${appUrl}/api/auth/callback`;

  const authUrl = await buildAuthorizationUrl({ codeVerifier, state, redirectUri });

  const res = NextResponse.redirect(authUrl);

  const cookieOpts = {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 600, // 10 minutes — only needed during the OAuth dance
  };

  res.cookies.set(COOKIE.VERIFIER, codeVerifier, cookieOpts);
  res.cookies.set(COOKIE.STATE,    state,         cookieOpts);

  return res;
}
